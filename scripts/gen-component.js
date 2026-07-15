#!/usr/bin/env node

/**
 * gen-component.js — Elderly-Friendly Component Scaffold Generator
 *
 * Generates accessible React Native component files with elderly-friendly
 * defaults baked in.
 *
 * Usage:
 *   node gen-component.js <ComponentName> [--type <type>]
 *
 * Types:
 *   button     - Large accessible button (default)
 *   input      - Text input with voice slot
 *   card       - One-tap action card
 *   modal      - Simplified confirmation modal
 *   text       - Auto-scaling large text
 *   nav        - Bottom navigation bar
 *   screen     - Full screen template
 *   all        - Generate all component types
 *
 * Examples:
 *   node gen-component.js MyButton                    # Generate button component
 *   node gen-component.js VoiceInput --type input     # Generate voice input
 *   node gen-component.js HomeScreen --type screen    # Generate screen template
 *   node gen-component.js all --type all              # Generate all components
 */

const fs = require('fs');
const path = require('path');

// ────────────────────────────────────────────────────────────────────────────
// Templates
// ────────────────────────────────────────────────────────────────────────────

const TEMPLATES = {
  button: (name) => `import React from 'react';
import { TouchableOpacity, View, StyleSheet, Vibration } from 'react-native';
import { LargeText } from './LargeText';

interface ${name}Props {
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'back';
  size?: 'large' | 'medium';
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  haptic?: boolean;
  children: React.ReactNode;
  accessibilityLabel?: string;
}

const variantStyles = {
  primary: { backgroundColor: '#1565C0', textColor: '#FFFFFF' },
  secondary: { backgroundColor: '#E3F2FD', textColor: '#1565C0' },
  danger: { backgroundColor: '#D32F2F', textColor: '#FFFFFF' },
  back: { backgroundColor: 'transparent', textColor: '#1565C0' },
};

export const ${name}: React.FC<${name}Props> = ({
  onPress,
  variant = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  haptic = true,
  children,
  accessibilityLabel,
}) => {
  const handlePress = () => {
    if (haptic) Vibration.vibrate(50);
    onPress();
  };

  const { backgroundColor, textColor } = variantStyles[variant];
  const height = size === 'large' ? 56 : 48;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, height },
        disabled && styles.disabled,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || String(children)}
      accessibilityState={{ disabled: disabled || loading }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <LargeText variant="body" bold style={{ color: textColor }}>
        {loading ? '处理中...' : children}
      </LargeText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    minWidth: 120,
  },
  disabled: {
    opacity: 0.4,
  },
});
`,

  input: (name) => `import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { LargeText } from './LargeText';

interface ${name}Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  voiceEnabled?: boolean;
  onVoiceResult?: (text: string) => void;
  clearable?: boolean;
  error?: string;
  fontSize?: number;
  accessibilityLabel?: string;
}

export const ${name}: React.FC<${name}Props> = ({
  value,
  onChangeText,
  placeholder = '',
  voiceEnabled = true,
  onVoiceResult,
  clearable = true,
  error,
  fontSize = 22,
  accessibilityLabel,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, isFocused && styles.focused, error && styles.errorBorder]}>
        <TextInput
          style={[styles.input, { fontSize }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999999"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessibilityLabel={accessibilityLabel || placeholder}
          maxFontSizeMultiplier={2.0}
        />
        {clearable && value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChangeText('')}
            style={styles.clearBtn}
            accessibilityLabel="清除输入"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <LargeText variant="caption" color="#999">✕</LargeText>
          </TouchableOpacity>
        )}
        {voiceEnabled && onVoiceResult && (
          <TouchableOpacity
            onPress={() => onVoiceResult('')}
            style={styles.voiceBtn}
            accessibilityLabel="语音输入"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <LargeText variant="caption" color="#1565C0">🎤</LargeText>
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <LargeText variant="caption" color="#D32F2F" style={styles.errorText}>
          {error}
        </LargeText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { width: '100%', gap: 8 },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 56,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  focused: { borderColor: '#1565C0' },
  errorBorder: { borderColor: '#D32F2F' },
  input: { flex: 1, padding: 0, color: '#1A1A1A' },
  clearBtn: { padding: 4 },
  voiceBtn: { padding: 8 },
  errorText: { marginLeft: 4 },
});
`,

  card: (name) => `import React from 'react';
import { TouchableOpacity, View, StyleSheet, Vibration } from 'react-native';
import { LargeText } from './LargeText';

interface ${name}Props {
  title: string;
  subtitle?: string;
  icon?: string;
  onPress: () => void;
  disabled?: boolean;
  badge?: string;
}

export const ${name}: React.FC<${name}Props> = ({
  title,
  subtitle,
  icon,
  onPress,
  disabled = false,
  badge,
}) => {
  const handlePress = () => {
    Vibration.vibrate(50);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.card, disabled && styles.disabled]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={\`\${title}\${subtitle ? ', ' + subtitle : ''}\`}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {badge && (
        <View style={styles.badge}>
          <LargeText variant="caption" color="#fff">{badge}</LargeText>
        </View>
      )}
      <LargeText variant="heading" bold center>{title}</LargeText>
      {subtitle && <LargeText variant="caption" center>{subtitle}</LargeText>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    position: 'relative',
  },
  disabled: { opacity: 0.4, backgroundColor: '#E0E0E0' },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#D32F2F',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
});
`,

  modal: (name) => `import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import { LargeText } from './LargeText';
import { ${TEMPLATES.button ? 'ElderlyButton' : 'TouchableOpacity'} } from './ElderlyButton';

interface ${name}Props {
  visible: boolean;
  title?: string;
  message: string;
  primaryBtn?: { label: string; onPress: () => void };
  secondaryBtn?: { label: string; onPress: () => void };
  onDismiss?: () => void;
}

export const ${name}: React.FC<${name}Props> = ({
  visible,
  title,
  message,
  primaryBtn,
  secondaryBtn,
  onDismiss,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      accessibilityViewIsModal={true}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {title && <LargeText variant="heading" bold center>{title}</LargeText>}
          <LargeText variant="body" center>{message}</LargeText>
          <View style={styles.actions}>
            {secondaryBtn && (
              <TouchableOpacity
                style={[styles.btn, styles.secondaryBtn]}
                onPress={secondaryBtn.onPress}
                accessibilityRole="button"
                accessibilityLabel={secondaryBtn.label}
              >
                <LargeText variant="body" color="#1565C0">{secondaryBtn.label}</LargeText>
              </TouchableOpacity>
            )}
            {primaryBtn && (
              <TouchableOpacity
                style={[styles.btn, styles.primaryBtn]}
                onPress={primaryBtn.onPress}
                accessibilityRole="button"
                accessibilityLabel={primaryBtn.label}
              >
                <LargeText variant="body" color="#fff" bold>{primaryBtn.label}</LargeText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    gap: 24,
    elevation: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  btn: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: { backgroundColor: '#1565C0' },
  secondaryBtn: { backgroundColor: '#E3F2FD' },
});
`,

  text: (name) => `import React from 'react';
import { Text, StyleSheet, useWindowDimensions } from 'react-native';

interface ${name}Props {
  variant?: 'heading' | 'body' | 'caption';
  color?: string;
  bold?: boolean;
  center?: boolean;
  children: React.ReactNode;
  style?: object;
  fontScale?: number;
  largeTextMode?: boolean;
}

export const ${name}: React.FC<${name}Props> = ({
  variant = 'body',
  color = '#1A1A1A',
  bold = false,
  center = false,
  children,
  style,
  fontScale = 1.0,
  largeTextMode = false,
}) => {
  const baseSize = { heading: 28, body: 20, caption: 16 }[variant];
  const fontSize = largeTextMode ? baseSize * fontScale : baseSize;

  return (
    <Text
      style={[
        styles.text,
        { fontSize, lineHeight: fontSize * 1.5, color },
        bold && styles.bold,
        center && styles.center,
        style,
      ]}
      accessibilityRole={variant === 'heading' ? 'header' : 'text'}
      maxFontSizeMultiplier={2.0}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: { fontWeight: '400' },
  bold: { fontWeight: '700' },
  center: { textAlign: 'center' },
});
`,

  nav: (name) => `import React from 'react';
import { View, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { LargeText } from './LargeText';

interface NavItem {
  icon: string;
  label: string;
  onPress: () => void;
}

interface ${name}Props {
  items: NavItem[];
  active?: number;
}

export const ${name}: React.FC<${name}Props> = ({ items, active = 0 }) => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.nav}>
        {items.slice(0, 4).map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.item}
            onPress={item.onPress}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: index === active }}
          >
            <LargeText variant="caption" color={index === active ? '#1565C0' : '#666'}>
              {item.icon}
            </LargeText>
            <LargeText
              variant="caption"
              color={index === active ? '#1565C0' : '#666'}
              bold={index === active}
            >
              {item.label}
            </LargeText>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: { backgroundColor: '#FFFFFF' },
  nav: {
    flexDirection: 'row',
    height: 64,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
});
`,

  screen: (name) => `import React from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet } from 'react-native';
import { LargeText } from '../components/LargeText';
import { ElderlyButton } from '../components/ElderlyButton';

interface ${name}Props {
  navigation: any;
}

export const ${name}: React.FC<${name}Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title */}
        <LargeText variant="heading" bold>
          页面标题
        </LargeText>

        {/* Main Content Area — max 3 visible interactive elements */}
        <View style={styles.section}>
          {/* Add your content here */}
        </View>

        {/* Primary Action */}
        <ElderlyButton onPress={() => {}}>
          主要操作
        </ElderlyButton>

        {/* Back Navigation */}
        <ElderlyButton variant="back" onPress={() => navigation.goBack()}>
          返回
        </ElderlyButton>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    padding: 24,
    gap: 24,
    paddingBottom: 40,
  },
  section: {
    gap: 16,
  },
});
`,
};

// ────────────────────────────────────────────────────────────────────────────
// Generator
// ────────────────────────────────────────────────────────────────────────────

function generateComponent(name, type, outputDir) {
  const template = TEMPLATES[type];
  if (!template) {
    console.error(`Unknown component type: ${type}`);
    console.log(`Available types: ${Object.keys(TEMPLATES).join(', ')}`);
    process.exit(1);
  }

  const content = template(name);
  const fileName = `${name}.tsx`;
  const filePath = path.join(outputDir, fileName);

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Warn if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`⚠️  File already exists: ${filePath}`);
    console.log(`   Overwriting...`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Generated: ${filePath}`);
  return filePath;
}

function generateAll(outputDir) {
  const components = [
    { name: 'ElderlyButton', type: 'button' },
    { name: 'ElderlyTextInput', type: 'input' },
    { name: 'OneTapCard', type: 'card' },
    { name: 'ElderlyModal', type: 'modal' },
    { name: 'LargeText', type: 'text' },
    { name: 'ElderlyBottomNav', type: 'nav' },
  ];

  console.log(`\n🏗️  Generating all elderly-friendly components...\n`);
  components.forEach(({ name, type }) => generateComponent(name, type, outputDir));
  console.log(`\n🎉 All components generated! Import them in your app.\n`);
}

// ────────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║   Elderly Component Generator (适老化组件生成器)         ║
╚══════════════════════════════════════════════════════════╝

Usage:
  node gen-component.js <ComponentName> [--type <type>] [--out <dir>]

Types:
  button     Large accessible button (default)
  input      Text input with voice slot
  card       One-tap action card
  modal      Simplified confirmation modal
  text       Auto-scaling large text
  nav        Bottom navigation bar
  screen     Full screen template
  all        Generate all component types

Examples:
  node gen-component.js MyButton                    # Button component
  node gen-component.js VoiceInput --type input     # Voice text input
  node gen-component.js HomeCard --type card        # One-tap card
  node gen-component.js ConfirmDialog --type modal   # Confirmation modal
  node gen-component.js BigText --type text          # Large text component
  node gen-component.js MainNav --type nav           # Bottom navigation
  node gen-component.js HomeScreen --type screen     # Screen template
  node gen-component.js all --type all               # All components
    `);
    return;
  }

  const name = args[0];
  const typeIdx = args.indexOf('--type');
  const type = typeIdx !== -1 ? args[typeIdx + 1] : 'button';
  const outIdx = args.indexOf('--out');
  const outputDir = outIdx !== -1 ? args[outIdx + 1] : path.join(process.cwd(), 'src', 'components');

  if (name === 'all' && type === 'all') {
    generateAll(outputDir);
    return;
  }

  if (type === 'all') {
    generateAll(outputDir);
    return;
  }

  console.log(`\n🏗️  Generating ${type} component: ${name}\n`);
  generateComponent(name, type, outputDir);
  console.log(`\n🎉 Done! Remember to add accessibility props when customizing.\n`);
}

main();
