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
- Keep SKILL.md focused; put detailed module specs in prd.md and component APIs in reference.md

### Contribution Scope & Priority Areas

Contributions should align with the 10-module scope defined in prd.md. Priority areas include: trip safety guard, emergency SOS, multi-entry booking (QR/hotline), medical priority dispatch, and cash payment support — these address competitive gaps identified in our analysis of Didi Elderly Mode, Amap Assisted Ride, and 95128 hotline.

### Adding a New Component Type

1. Add a template function in `scripts/gen-component.js`
2. Add API documentation in `reference.md`
3. Add a usage example in `examples.md`
4. Verify the component passes `scripts/check-a11y.js`

#### Pending Components to Complete

The following components are not yet implemented and need contributor help to fill in. They map to the 10-module scope and the competitive gaps noted above:

- `SafetyService` — trip safety service (real-time route monitoring, abnormal-stop detection, auto-shared trip status with family)
- `SOSButton` — emergency help button (one-tap dial to 110/120/family, with location push)
- `LiveLocationCard` — live location card (real-time driver/vehicle location and ETA display for family members)
- `QRBookingScreen` — QR code booking screen (scan-to-hail at stations, hospitals, community gates)
- `HotlineBookingScreen` — 95128 hotline booking screen (operator-assisted order placement, dual-tone fallback)
- `PaymentService.cashPay()` — cash payment method (offline cash settlement, driver-side confirmation, receipt printing)

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
