# Contributing to react-native-elderly-access

Thank you for your interest in contributing! This project aims to make mobile apps more accessible for elderly users, and every contribution helps.

## How to Contribute

### Reporting Bugs

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug-report.md) and include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### Suggesting Features

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature-request.md) and include:
- Use case description
- How it helps elderly users specifically
- Any implementation ideas

### Submitting Code

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-new-component`
3. Make your changes
4. Run the accessibility audit on any new components: `node scripts/check-a11y.js`
5. Commit with a clear message: `git commit -m "feat: add ElderlyDatePicker component"`
6. Push and open a Pull Request

### Code Standards

- All components must satisfy the design constraints in SKILL.md (touch targets, font sizes, contrast)
- Include `accessibilityLabel` and `accessibilityRole` on all interactive elements
- Include `hitSlop` on icon/small buttons
- Add JSDoc comments to new components
- Keep SKILL.md under 500 lines; put detailed content in reference files

### Adding a New Component Type

1. Add a template function in `scripts/gen-component.js`
2. Add API documentation in `reference.md`
3. Add a usage example in `examples.md`
4. Verify the component passes `scripts/check-a11y.js`

### Writing Documentation

- Use clear, concise language
- Include code examples for every API
- Keep Chinese translations for user-facing strings
- Document platform-specific differences when relevant

## Development Setup

```bash
git clone https://github.com/YOUR_USERNAME/react-native-elderly-access.git
cd react-native-elderly-access
```

No build step required — this is a documentation + scripts project.

### Testing Scripts

```bash
# Test accessibility audit (on its own scripts)
node scripts/check-a11y.js scripts/gen-component.js

# Test component generator
node scripts/gen-component.js TestButton --type button --out ./test-output
node scripts/gen-component.js TestInput --type input --out ./test-output
node scripts/gen-component.js all --type all --out ./test-output
```

## Project Philosophy

- **Elderly-first**: Every decision should be evaluated through the lens of elderly users
- **Research-driven**: Base design choices on user research, not assumptions
- **Minimal dependencies**: Keep scripts dependency-free (pure Node.js)
- **Accessible by default**: Generated code should pass accessibility checks out of the box

## Code of Conduct

Be respectful and constructive. This project serves a vulnerable user population, and our community should reflect that same care and consideration.
