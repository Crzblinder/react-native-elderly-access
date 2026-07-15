#!/usr/bin/env node

/**
 * check-a11y.js — Accessibility Audit Tool for React Native Projects
 *
 * Scans .tsx/.ts/.jsx/.js files for common accessibility violations
 * in elderly-friendly applications.
 *
 * Usage:
 *   node check-a11y.js [path]          # Scan a directory (default: ./src)
 *   node check-a11y.js file.tsx        # Scan a single file
 *   node check-a11y.js --json [path]   # Output as JSON
 *
 * Checks performed:
 *   - Touch target size (< 48dp)
 *   - Font size (< 18sp for body text)
 *   - Color contrast violations (WCAG AA)
 *   - Missing accessibilityLabel on interactive components
 *   - Missing accessibilityRole on touchable components
 *   - Hardcoded colors without theme usage
 *   - Missing hitSlop on icon buttons
 */

const fs = require('fs');
const path = require('path');

// ────────────────────────────────────────────────────────────────────────────
// Configuration
// ────────────────────────────────────────────────────────────────────────────

const CONFIG = {
  minTouchTarget: 48,       // dp
  minFontSize: {
    body: 18,
    heading: 24,
    caption: 14,
    button: 18,
  },
  minContrast: 4.5,         // WCAG AA for normal text
  interactiveComponents: [
    'TouchableOpacity',
    'TouchableHighlight',
    'TouchableWithoutFeedback',
    'Pressable',
    'Button',
    'TextInput',
    'Switch',
    'Slider',
  ],
  textComponents: ['Text', 'TextInput'],
};

// ────────────────────────────────────────────────────────────────────────────
// Color Contrast Utilities
// ────────────────────────────────────────────────────────────────────────────

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return { r, g, b };
}

function relativeLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ────────────────────────────────────────────────────────────────────────────
// Rule Definitions
// ────────────────────────────────────────────────────────────────────────────

const RULES = [
  {
    id: 'A11Y-001',
    name: 'Missing accessibilityLabel',
    severity: 'error',
    description: 'Interactive components must have accessibilityLabel for screen readers',
    test: (line, lineNumber) => {
      const issues = [];
      CONFIG.interactiveComponents.forEach((comp) => {
        const regex = new RegExp(`<${comp}[\\s>]`, 'g');
        if (regex.test(line) && !line.includes('accessibilityLabel')) {
          issues.push({
            line: lineNumber,
            message: `<${comp}> missing accessibilityLabel`,
            suggestion: `Add accessibilityLabel="描述性文字"`,
          });
        }
      });
      return issues;
    },
  },
  {
    id: 'A11Y-002',
    name: 'Missing accessibilityRole',
    severity: 'warning',
    description: 'Interactive components should declare accessibilityRole',
    test: (line, lineNumber) => {
      const issues = [];
      CONFIG.interactiveComponents.forEach((comp) => {
        const regex = new RegExp(`<${comp}[\\s>]`, 'g');
        if (regex.test(line) && !line.includes('accessibilityRole')) {
          issues.push({
            line: lineNumber,
            message: `<${comp}> missing accessibilityRole`,
            suggestion: `Add accessibilityRole="button" (or appropriate role)`,
          });
        }
      });
      return issues;
    },
  },
  {
    id: 'A11Y-003',
    name: 'Small touch target',
    severity: 'error',
    description: `Touch targets must be ≥ ${CONFIG.minTouchTarget}dp`,
    test: (line, lineNumber) => {
      const issues = [];
      const heightMatch = line.match(/height:\s*(\d+)/);
      const widthMatch = line.match(/width:\s*(\d+)/);
      if (heightMatch && parseInt(heightMatch[1]) < CONFIG.minTouchTarget) {
        issues.push({
          line: lineNumber,
          message: `height ${heightMatch[1]}dp < ${CONFIG.minTouchTarget}dp minimum`,
          suggestion: `Increase height to at least ${CONFIG.minTouchTarget}dp`,
        });
      }
      if (widthMatch && parseInt(widthMatch[1]) < CONFIG.minTouchTarget) {
        issues.push({
          line: lineNumber,
          message: `width ${widthMatch[1]}dp < ${CONFIG.minTouchTarget}dp minimum`,
          suggestion: `Increase width to at least ${CONFIG.minTouchTarget}dp`,
        });
      }
      return issues;
    },
  },
  {
    id: 'A11Y-004',
    name: 'Small font size',
    severity: 'warning',
    description: `Body text must be ≥ ${CONFIG.minFontSize.body}sp`,
    test: (line, lineNumber) => {
      const issues = [];
      const fontSizeMatch = line.match(/fontSize:\s*(\d+)/);
      if (fontSizeMatch) {
        const size = parseInt(fontSizeMatch[1]);
        if (size < CONFIG.minFontSize.body) {
          issues.push({
            line: lineNumber,
            message: `fontSize ${size}sp < ${CONFIG.minFontSize.body}sp minimum for body text`,
            suggestion: `Increase fontSize to at least ${CONFIG.minFontSize.body}sp, or use <LargeText> component`,
          });
        }
      }
      return issues;
    },
  },
  {
    id: 'A11Y-005',
    name: 'Hardcoded color',
    severity: 'info',
    description: 'Consider using theme colors for consistency and high-contrast mode support',
    test: (line, lineNumber) => {
      const issues = [];
      const colorMatch = line.match(/color:\s*['"]?(#[0-9A-Fa-f]{6})['"]?/);
      if (colorMatch && !line.includes('useElderlyTheme')) {
        issues.push({
          line: lineNumber,
          message: `Hardcoded color ${colorMatch[1]}`,
          suggestion: `Use theme colors via useElderlyTheme() for high-contrast mode support`,
        });
      }
      return issues;
    },
  },
  {
    id: 'A11Y-006',
    name: 'Low color contrast',
    severity: 'error',
    description: `Text/background contrast must be ≥ ${CONFIG.minContrast}:1 (WCAG AA)`,
    test: (line, lineNumber, fileContent) => {
      const issues = [];
      const colors = [...line.matchAll(/['"]?(#[0-9A-Fa-f]{6})['"]?/g)].map((m) => m[1]);
      if (colors.length >= 2) {
        const ratio = contrastRatio(colors[0], colors[1]);
        if (ratio < CONFIG.minContrast) {
          issues.push({
            line: lineNumber,
            message: `Contrast ratio ${ratio.toFixed(2)}:1 between ${colors[0]} and ${colors[1]} < ${CONFIG.minContrast}:1`,
            suggestion: `Use darker text or lighter background to achieve ≥ ${CONFIG.minContrast}:1`,
          });
        }
      }
      return issues;
    },
  },
  {
    id: 'A11Y-007',
    name: 'Missing hitSlop',
    severity: 'info',
    description: 'Icon buttons and small touchables should have hitSlop for easier tapping',
    test: (line, lineNumber, fileContent) => {
      const issues = [];
      if (
        /<(TouchableOpacity|Pressable)/.test(line) &&
        /icon|Icon|iconButton/.test(line) &&
        !line.includes('hitSlop')
      ) {
        issues.push({
          line: lineNumber,
          message: 'Icon button missing hitSlop',
          suggestion: `Add hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}`,
        });
      }
      return issues;
    },
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Scanner
// ────────────────────────────────────────────────────────────────────────────

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];

  lines.forEach((line, index) => {
    RULES.forEach((rule) => {
      const ruleIssues = rule.test(line, index + 1, content);
      ruleIssues.forEach((issue) => {
        issues.push({ file: filePath, rule: rule.id, ruleName: rule.name, severity: rule.severity, ...issue });
      });
    });
  });

  return issues;
}

function scanDirectory(dirPath) {
  const extensions = ['.tsx', '.ts', '.jsx', '.js'];
  const allIssues = [];

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && !['node_modules', '.git', 'android', 'ios'].includes(entry.name)) {
        walk(fullPath);
      } else if (entry.isFile() && extensions.includes(path.extname(entry.name))) {
        allIssues.push(...scanFile(fullPath));
      }
    });
  }

  walk(dirPath);
  return allIssues;
}

// ────────────────────────────────────────────────────────────────────────────
// Reporter
// ────────────────────────────────────────────────────────────────────────────

function printReport(issues, asJson = false) {
  if (asJson) {
    console.log(JSON.stringify(issues, null, 2));
    return;
  }

  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const infos = issues.filter((i) => i.severity === 'info');

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║    Elderly Accessibility Audit Report (适老化无障碍报告) ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  if (issues.length === 0) {
    console.log('✅ No accessibility issues found! Your project looks elderly-friendly.\n');
    return;
  }

  // Group by file
  const byFile = {};
  issues.forEach((issue) => {
    if (!byFile[issue.file]) byFile[issue.file] = [];
    byFile[issue.file].push(issue);
  });

  Object.entries(byFile).forEach(([file, fileIssues]) => {
    console.log(`\n📄 ${file}`);
    console.log('─'.repeat(60));
    fileIssues.forEach((issue) => {
      const icon = { error: '❌', warning: '⚠️', info: 'ℹ️' }[issue.severity];
      console.log(`  ${icon} [${issue.rule}] Line ${issue.line}: ${issue.message}`);
      console.log(`     💡 ${issue.suggestion}`);
    });
  });

  console.log('\n' + '═'.repeat(60));
  console.log(`\n📊 Summary:`);
  console.log(`   Errors:   ${errors.length}`);
  console.log(`   Warnings: ${warnings.length}`);
  console.log(`   Info:     ${infos.length}`);
  console.log(`   Total:    ${issues.length}\n`);

  if (errors.length > 0) {
    console.log('🔴 Fix all errors before releasing to elderly users.\n');
    process.exitCode = 1;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const asJson = args.includes('--json');
  const targetArg = args.find((a) => !a.startsWith('--'));
  const target = targetArg || path.join(process.cwd(), 'src');

  let issues;

  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    console.log(`\n🔍 Scanning directory: ${target}\n`);
    issues = scanDirectory(target);
  } else if (fs.existsSync(target) && fs.statSync(target).isFile()) {
    console.log(`\n🔍 Scanning file: ${target}\n`);
    issues = scanFile(target);
  } else {
    console.error(`\n❌ Path not found: ${target}`);
    console.log(`\nUsage:`);
    console.log(`  node check-a11y.js [path]          Scan a directory (default: ./src)`);
    console.log(`  node check-a11y.js file.tsx        Scan a single file`);
    console.log(`  node check-a11y.js --json [path]   Output as JSON\n`);
    process.exit(1);
  }

  printReport(issues, asJson);
}

main();
