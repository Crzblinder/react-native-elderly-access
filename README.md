# react-native-elderly-access

> A Qoder Agent Skill for building accessible, elderly-friendly React Native applications — derived from real-world usability research with **200+ senior users** on an elderly-friendly taxi-hailing platform.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-React%20Native-61dafb)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-339933)
![Dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

---

## Table of Contents

- [What Is This?](#what-is-this)
- [Tech Stack](#tech-stack)
- [Architecture & Implementation](#architecture--implementation)
- [Business Logic — Core Modules](#business-logic--core-modules)
- [Design System & Tuning](#design-system--tuning)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Tools Guide](#tools-guide)
- [Usability Testing & Data](#usability-testing--data)
- [Background: The Taxi Platform Story](#background-the-taxi-platform-story)
- [Contributing](#contributing)
- [License](#license)

---

## What Is This?

This project is a **Qoder Agent Skill** — a structured knowledge package that teaches AI coding agents how to generate accessible, elderly-optimized React Native code. It is **not** a runtime library you install via `npm install`; instead, it provides:

| Deliverable | What It Does |
|-------------|-------------|
| **SKILL.md** (368 lines) | Core instructions the agent reads — design constraints, component patterns, screen templates |
| **prd.md** (375+ lines) | Complete PRD with competitive analysis, 10 modules, non-functional requirements, usability data |
| **reference.md** (272 lines) | Component API reference (7 components with full prop tables) |
| **examples.md** (573 lines) | 6 production-ready screen implementations + usability test data model |
| **accessibility-guide.md** (250 lines) | User research methodology, design specs, usability testing protocol |
| **assets/architecture-diagram.md** | UML diagrams: use case, sequence, class, business flow, component architecture |
| **uml-output/** | PlantUML sources + rendered PNGs for all 5 UML diagram types |
| **scripts/check-a11y.js** (364 lines) | CLI tool that scans your RN project for 7 categories of accessibility violations |
| **scripts/gen-component.js** (662 lines) | CLI tool that scaffolds 7 types of elderly-friendly components |

**Zero external dependencies.** Both scripts are pure Node.js — they run on any machine with Node >= 14.

---

## Tech Stack

### Skill Layer (This Project)

| Technology | Role | Version |
|-----------|------|---------|
| **Node.js** | Runtime for CLI tools (check-a11y.js, gen-component.js) | >= 14.0 |
| **Qoder Agent Skill** | Skill format (SKILL.md + supporting docs) | Current |
| **Markdown + YAML** | Skill frontmatter and document format | — |
| **Git** | Version control and distribution | — |

### Target Application Layer (Code This Skill Generates)

| Technology | Role | Notes |
|-----------|------|-------|
| **React Native** | Cross-platform mobile framework | TypeScript template |
| **TypeScript** | Type-safe component development | Strict mode |
| **@react-native-voice/voice** | Speech recognition (STT) | Chinese (zh-CN) language |
| **@react-native-async-storage/async-storage** | Persistent user preferences | Font scale, addresses |
| **React Native Core APIs** | Vibration, Linking, Modal, etc. | Platform-native |

### Development Tools

| Tool | Purpose |
|------|---------|
| **check-a11y.js** | Static analysis for accessibility (7 rules) |
| **gen-component.js** | Component scaffold generator (7 templates) |
| **Qoder IDE** | AI-powered development environment |

---

## Architecture & Implementation

### System Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                      Application Layer                         │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐ │
│  │HomeScr  │ │VoiceBook │ │QRBooking│ │Hotline  │ │RideStat│ │
│  │(One-Tap)│ │(Voice)   │ │(Scan)   │ │(95128)  │ │+SOS    │ │
│  └────┬────┘ └────┬─────┘ └────┬────┘ └────┬────┘ └───┬────┘ │
│       │           │            │           │           │      │
│  ┌────┴───────────┴────────────┴───────────┴───────────┴────┐│
│  │            Elderly UI Component Library                   ││
│  │ ElderlyButton│OneTapCard│LargeText│ElderlyModal           ││
│  │ VoiceInput   │BottomNav │SOSButton│LiveLocationCard      ││
│  └────────────────────────┬──────────────────────────────────┘│
│                           │                                    │
│  ┌────────────────────────┴──────────────────────────────────┐│
│  │                   Service Layer                            ││
│  │ VoiceService(STT/TTS)│RideService│PaymentService          ││
│  │ SafetyService(NEW)    │  - Medical Priority Dispatch       ││
│  │                       │  - Auto-Expand Match Range        ││
│  └────────────────────────┬──────────────────────────────────┘│
│                           │                                    │
│  ┌────────────────────────┴──────────────────────────────────┐│
│  │              Theme & State Management                      ││
│  │ ElderlyThemeProvider (React Context) │ AsyncStorage         ││
│  └───────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
         │              │              │
   ┌─────┴─────┐  ┌──────┴──────┐ ┌────┴──────────┐
   │Speech API │  │ Ride Backend│ │ Emergency API  │
   │TTS API    │  │ Payment GW  │ │ (110/120)      │
   │QR Scanner │  │ SMS Service │ │ Hotline 95128  │
   └───────────┘  └─────────────┘ └───────────────┘
```

### Implementation Patterns

**1. Theme-Driven Design**
All components consume design tokens from `ElderlyThemeProvider` via React Context. This ensures consistent font scaling, color, and spacing across the entire app.

```typescript
const { fontScale, largeTextMode, spacing } = useElderlyTheme();
```

**2. Voice-First Interaction**
Every text input screen includes a voice input slot. The `VoiceService` singleton handles STT (speech-to-text) and TTS (text-to-speech), with a built-in intent parser for Chinese natural language commands.

**3. Progressive Disclosure**
Screens show maximum 3 interactive elements. Secondary actions are hidden behind a "more" button or accessible via voice commands.

**4. Fail-Safe Confirmation**
Every irreversible action (booking a ride, canceling, paying) passes through a large-text confirmation modal with exactly 2 buttons: confirm + cancel.

**5. Haptic Feedback Loop**
All primary action buttons trigger `Vibration.vibrate(50)` on press, giving elderly users physical confirmation that their tap registered.

### How the Skill Works (Qoder Integration)

```
User asks Qoder: "Create an elderly-friendly home screen"
        │
        ▼
Qoder reads SKILL.md → loads design constraints
        │
        ▼
Qoder reads examples.md → loads screen templates
        │
        ▼
Qoder generates code → enforces touch targets, font sizes, accessibility props
        │
        ▼
User runs: node scripts/check-a11y.js ./src → validates output
```

---

## Business Logic — Core Modules

The skill encodes the complete business logic for an elderly-friendly taxi platform, designed from real user research and competitive benchmarking against Didi Elderly Mode, Amap Assisted Ride, and the 95128 hotline.

### Competitive Differentiation

| Competitor | Core Strength | Key Gap We Fill |
|------------|---------------|-----------------|
| **滴滴长辈版** | Medical priority dispatch (202k+ verified); cash payment | No trip safety guard; no SOS emergency |
| **高德助老打车** | QR-code station booking; multi-city coverage | Weak family monitoring; no medical priority |
| **95128热线** | Serves non-smartphone seniors via human agent | No real-time tracking; no digital safety features |
| **本项目** | Voice-first + 3-tap + multi-entry + safety guard + cash + family pay | Needs backend integration with real dispatch platforms |

### Module 1: One-Tap Ride (一键叫车)

**Problem**: 78% of elderly users found existing apps "too complex".
**Solution**: Pre-configured destinations, single-tap booking.

```
User Flow: [Open App] → [Tap "一键打车回家"] → [Confirm] → [Ride Booked]
Total: 2 taps
```

| Feature | Spec |
|---------|------|
| Pre-saved home address | Stored in AsyncStorage, shown on home screen |
| Recent destinations | Second card shows last visited place |
| Haptic feedback | 50ms vibration on tap |
| Fallback | If no address saved, prompt user to set one |

**Component**: `<OneTapCard>` — large card (min 120dp height), full-card tappable, with icon + title + subtitle.

### Module 2: Voice Command Ride (语音指令叫车)

**Problem**: 68% couldn't type addresses on small screens.
**Solution**: Voice-first UI with Mandarin Chinese NLP intent mapping + confidence scoring.

```
User Flow: [Tap Mic] → [Speak "打车去北京站"] → [See transcript + confidence] → [Confirm] → [Booked]
Total: 2 taps + 1 voice command
```

**Voice Intent Mapping** (built into the skill):

| Chinese Input Pattern | Intent ID | System Action |
|----------------------|-----------|--------------|
| "我要打车回家" / "回家" | `RIDE_HOME` | Book to saved home address |
| "打车去[地点]" / "去[地点]" | `RIDE_TO` | Set destination to [地点] |
| "帮我叫车" / "叫个车" | `REQUEST_RIDE` | Open booking flow |
| "取消叫车" / "不要了" | `CANCEL_RIDE` | Cancel current order |
| "车到哪了" / "还要多久" | `CHECK_STATUS` | Show driver location |

**Confidence-aware fallback**: When recognition confidence < 0.8, show candidate list as large-text cards instead of auto-filling.

**Components**: `<ElderlyVoiceInput>` + `VoiceService` (singleton) + `parseVoiceIntent()` + `recognizeWithConfidence()`.

### Module 3: QR Code Station Booking (扫码叫车)

**Problem**: 34% of target users cannot use smartphones (inspired by 高德暖心车站).
**Solution**: Offline QR-code station entry — scan, auto-locate, confirm.

```
User Flow: [At warm station] → [Scan QR code] → [Auto-locate station] → [Confirm] → [Ride Booked]
Total: 1 scan + 1 confirm
```

**Components**: `QRBookingScreen` + `QR Code Scanner` (camera integration).

### Module 4: Hotline 95128 Booking (电话叫车)

**Problem**: Non-smartphone seniors excluded from ride-hailing.
**Solution**: One-tap dial 95128 hotline; agent creates order on behalf of senior.

**Components**: `HotlineBookingScreen` + `Hotline 95128` (tel: link).

### Module 5: Large Text Mode (大字模式)

**Problem**: 85% reported "text too small to read".
**Solution**: In-app font scale toggle (1.0x – 2.0x), persisted preference.

| Element | Normal | 1.5x | 2.0x |
|---------|--------|------|------|
| Heading | 28sp | 42sp | 56sp |
| Body | 20sp | 30sp | 40sp |
| Button | 20sp | 30sp | 40sp |

**Component**: `<LargeText>` — auto-scales based on `fontScale` from `ElderlyThemeProvider`, respects system Dynamic Type / Android font scale.

### Module 6: Family Payment (亲友代付)

**Problem**: 61% found mobile payment confusing or anxiety-inducing.
**Solution**: SMS-based payment delegation to family members.

```
Flow: [Trip ends] → [Tap "发给家人代付"] → [Pick contact] → [SMS sent]
      → [Family opens link] → [One-tap confirm payment]
```

**Components**: `FamilyPayButton` (contact picker + SMS), `PaymentStatusCard` (real-time tracking), `PaymentConfirmScreen` (family member view).

### Module 7: Trip Safety Guard (行程安全守护)

**Problem**: 52% fear getting in wrong car; news of seniors entering wrong vehicles.
**Solution**: Real-time family location sharing + plate-number verification before boarding.

| Feature | Spec |
|---------|------|
| Family trip notification | Auto-notify family when ride starts, with live location link |
| Real-time location sharing | Family views driver location and ETA during trip |
| Plate verification | Before boarding, user confirms plate; mismatch triggers warning + family alert |
| Family call driver | One-tap call driver from family link |
| Trip recording | Auto-start audio recording during SOS or opt-in |

**Components**: `SafetyService` + `<LiveLocationCard>` + `<SOSButton>` + `verifyPlateNumber()`.

### Module 8: Emergency SOS (紧急求助)

**Problem**: 71-year-old died alone in taxi; seniors fear traveling alone.
**Solution**: Long-press SOS → auto-dial 110/120 + location broadcast to family + recording start.

```
Flow: [Long-press SOS 3s] → [Auto-dial 110/120] → [Location shared with family] → [Recording starts]
      → [Large-text confirmation: "已为您呼叫帮助"]
```

**Components**: `<SOSButton>` (countdown + confirm) + `SafetyService.triggerSOS()`.

### Module 9: Payment Methods (支付方式)

**Problem**: ~20% of elderly only use cash (validated by Didi data).
**Solution**: Three payment options — online self-pay / cash / family delegation.

| Method | Flow |
|--------|------|
| Online self-pay | One-tap WeChat/Alipay |
| Cash payment | User selects "现金支付"; driver confirms receipt |
| Family payment | Generate link → SMS to family → one-tap confirm |

### Module 10: Medical Priority Dispatch (就医优先派单)

**Problem**: Medical trips hard to book; Didi verified 202k medical priority dispatches.
**Solution**: Hospital-destination detection triggers priority driver matching.

| Feature | Spec |
|---------|------|
| Hospital detection | Detect hospital keyword or POI category |
| Priority matching | Boost nearby driver weight; reduce wait time |
| Arrival notification | Notify family when senior arrives at hospital |
| Auto-expand range | If no driver in 3 min, expand radius + TTS announcement |

---

## Design System & Tuning

### Built-In Design Constraints

Every component and screen this skill generates **automatically enforces** these rules:

| Constraint | Rule | Rationale |
|-----------|------|-----------|
| Touch target | ≥ 48×48dp (recommended 56dp) | Elderly users have reduced motor precision |
| Font size | Body ≥ 18sp, headings ≥ 24sp | Presbyopia affects 85% of users 60+ |
| Color contrast | WCAG AA ≥ 4.5:1 | Aging eyes need more contrast |
| Interaction depth | Max 3 taps to any primary task | Cognitive load reduction |
| Animation | No flashing > 3Hz, transitions ≤ 300ms | Prevent disorientation |
| Spacing | Padding ≥ 16dp, button gap ≥ 12dp | Prevent accidental taps |
| Error recovery | Always show visible "Back" button | Reduce anxiety about mistakes |
| Haptic feedback | 50ms vibration on primary actions | Physical confirmation of tap |

### Color Palette (WCAG AA Verified)

| Token | Hex | Contrast on White | Usage |
|-------|-----|-------------------|-------|
| Primary | `#1565C0` | 5.74:1 | Buttons, links, active states |
| Success | `#2E7D32` | 5.87:1 | Confirmations, driver arrived |
| Error | `#D32F2F` | 5.57:1 | Error messages, cancel actions |
| Text Primary | `#1A1A1A` | 16.75:1 | All body text |
| Text Secondary | `#666666` | 5.74:1 | Captions, subtitles |
| Background | `#FAFAFA` | — | Screen background |

### Accessibility Audit Rules (check-a11y.js)

The built-in scanner checks 7 rules:

| Rule ID | Check | Severity |
|---------|-------|----------|
| A11Y-001 | Missing `accessibilityLabel` on interactive components | Error |
| A11Y-002 | Missing `accessibilityRole` on touchables | Warning |
| A11Y-003 | Touch target < 48dp (height/width) | Error |
| A11Y-004 | Font size < 18sp for body text | Warning |
| A11Y-005 | Hardcoded color (should use theme) | Info |
| A11Y-006 | Color contrast ratio < 4.5:1 | Error |
| A11Y-007 | Missing `hitSlop` on icon buttons | Info |

**Tuning tip**: Run `node scripts/check-a11y.js --json ./src` for machine-readable output you can integrate into CI/CD pipelines.

---

## Project Structure

```
react-native-elderly-access/
│
├── SKILL.md                        # [Entry Point] Core skill instructions
│                                   #   Design constraints, 4 module patterns,
│                                   #   component templates, validation checklist
│
├── prd.md                          # [Product] Complete PRD
│                                   #   User research findings, functional requirements
│                                   #   for all 10 modules, non-functional requirements,
│                                   #   3-round usability test data
│
├── reference.md                    # [API] Component reference
│                                   #   ElderlyThemeProvider, ElderlyButton,
│                                   #   ElderlyTextInput, LargeText, OneTapCard,
│                                   #   ElderlyModal, ElderlyBottomNav, VoiceService
│
├── examples.md                     # [Code] 6 complete screen implementations
│                                   #   Home, VoiceBooking, RideStatus,
│                                   #   FamilyPay, Settings + test data model
│
├── accessibility-guide.md          # [Research] Design & methodology guide
│                                   #   Survey/interview templates, persona template,
│                                   #   journey map, visual specs, testing protocol,
│                                   #   three-dimensional evaluation model
│
├── assets/
│   └── architecture-diagram.md     # [Architecture] UML diagrams (ASCII)
│                                   #   Use case, business flow, sequence,
│                                   #   class, component architecture
│
├── uml-output/                     # [UML] PlantUML source + rendered PNG
│   ├── 01-use-case.puml            #   Use case diagram (15 UCs, 3 actors)
│   ├── 01-use-case.png             #   Rendered PNG
│   ├── 02-business-flow.puml       #   Original activity diagram
│   ├── 02-business-flow-enhanced.puml #  Enhanced: safety guard, SOS, cash, medical
│   ├── 02-business-flow-enhanced.png  #  Rendered PNG
│   ├── 03-sequence-voice-booking.puml #  Sequence diagram (7 phases, 6 participants)
│   ├── 03-sequence-voice-booking.png  #  Rendered PNG
│   ├── 04-class-diagram.puml       #   Class diagram (20+ classes)
│   ├── 04-class-diagram.png        #   Rendered PNG
│   ├── 05-component-architecture.puml # Component diagram
│   ├── 05-component-architecture.png  # Rendered PNG
│   └── render-png.ps1              #   Batch render script (PowerShell)
│
├── scripts/
│   ├── check-a11y.js               # [Tool] Accessibility audit (7 rules)
│   └── gen-component.js            # [Tool] Component scaffold (7 types)
│
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug-report.md           # Bug report template
│   │   └── feature-request.md      # Feature request template
│   └── pull_request_template.md    # PR template with a11y checklist
│
├── package.json                    # npm scripts: check-a11y, gen-component, test
├── README.md                       # This file
├── CONTRIBUTING.md                 # Contribution guidelines
├── LICENSE                         # MIT License
└── .gitignore                      # Git ignore rules
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 14.0 (for running scripts)
- **Qoder IDE** (for using this as an Agent Skill)
- **Git** (for cloning the repository)

### Option A: Use as a Qoder Skill (Recommended)

This is the primary use case — teach Qoder how to generate elderly-friendly RN code.

```bash
# 1. Navigate to your React Native project
cd your-rn-project

# 2. Create the skills directory
mkdir -p .qoder/skills

# 3. Clone this skill into it
git clone https://github.com/YOUR_USERNAME/react-native-elderly-access.git .qoder/skills/react-native-elderly-access
```

Once installed, Qoder will automatically load this skill. Try asking:

- *"Create an elderly-friendly home screen with one-tap ride home"*
- *"Generate a voice booking component for Mandarin Chinese"*
- *"Build a settings screen with font size toggle and live preview"*
- *"Run an accessibility audit on my src directory"*

### Option B: Use the CLI Tools Directly

You don't need Qoder to use the tools — they work standalone.

#### Accessibility Audit

Scan any React Native project for accessibility issues:

```bash
# Scan a directory (default: ./src)
node scripts/check-a11y.js ./src

# Scan a single file
node scripts/check-a11y.js src/screens/HomeScreen.tsx

# JSON output (for CI/CD integration)
node scripts/check-a11y.js --json ./src > a11y-report.json
```

**Sample output:**
```
╔══════════════════════════════════════════════════════════╗
║    Elderly Accessibility Audit Report (适老化无障碍报告) ║
╚══════════════════════════════════════════════════════════╝

📄 src/screens/HomeScreen.tsx
────────────────────────────────────────────────────────────
  ❌ [A11Y-003] Line 42: height 36dp < 48dp minimum
     💡 Increase height to at least 48dp
  ⚠️ [A11Y-002] Line 58: <TouchableOpacity> missing accessibilityRole
     💡 Add accessibilityRole="button"

📊 Summary: Errors: 1, Warnings: 1, Info: 0
```

#### Component Generator

Scaffold elderly-friendly components with accessibility baked in:

```bash
# Generate a button component
node scripts/gen-component.js MyButton

# Generate a voice input component
node scripts/gen-component.js VoiceSearch --type input

# Generate a one-tap card
node scripts/gen-component.js HomeRideCard --type card

# Generate a confirmation modal
node scripts/gen-component.js BookingConfirm --type modal

# Generate a large text component
node scripts/gen-component.js PriceText --type text

# Generate a bottom navigation
node scripts/gen-component.js MainNav --type nav

# Generate a full screen template
node scripts/gen-component.js ProfileScreen --type screen

# Generate ALL components at once
node scripts/gen-component.js all --type all

# Specify output directory
node scripts/gen-component.js MyButton --type button --out ./src/components
```

#### Run the Test Suite

Verify that generated components pass accessibility checks:

```bash
# Using npm (if available)
npm test

# Or manually
node scripts/gen-component.js all --type all --out ./test-output
node scripts/check-a11y.js test-output
# Expected: 0 errors, 0 warnings
```

---

## Tools Guide

### check-a11y.js — Accessibility Audit

| Feature | Detail |
|---------|--------|
| Input | Directory path, single file, or `--json` flag |
| Scans | `.tsx`, `.ts`, `.jsx`, `.js` files |
| Skips | `node_modules`, `.git`, `android`, `ios` directories |
| Rules | 7 rules covering touch targets, fonts, contrast, a11y props, colors |
| Output | Human-readable report or JSON |
| Exit code | 0 = no errors, 1 = errors found (for CI integration) |

### gen-component.js — Component Scaffold

| Feature | Detail |
|---------|--------|
| Templates | 7 types: button, input, card, modal, text, nav, screen |
| Output | TypeScript (`.tsx`) files with full type interfaces |
| Accessibility | All generated components include `accessibilityLabel`, `accessibilityRole`, `hitSlop`, haptic feedback |
| Customization | `--out` flag to specify output directory |
| Dependencies | Zero — pure Node.js, no npm install needed |

---

## Usability Testing & Data

### Research Foundation

This skill's design constraints are not arbitrary — they come from rigorous research:

| Phase | Method | Sample Size | Outcome |
|-------|--------|-------------|---------|
| Quantitative Survey | Structured questionnaire | N=213 | Pain point frequency ranking |
| Deep Interview | Semi-structured, 30-45min | N=18 | Emotional context & journey maps |
| Contextual Observation | Task-based observation | N=8 | Behavioral patterns |

### Three-Dimensional Evaluation Model

```
Score = 0.4 × CompletionRate + 0.3 × TimeScore + 0.3 × SatisfactionScore
```

Weights reflect elderly user priorities: **task completion matters most** (0.4), followed by speed as cognitive load proxy (0.3), then subjective comfort (0.3).

### 3-Round Iteration Results

| Metric | Round 1 | Round 2 | Round 3 | Delta |
|--------|---------|---------|---------|-------|
| Task Completion | 72% | 88% | **95%** | +23pp |
| Avg Booking Time | 180s | 120s | **90s** | **-90s** |
| Satisfaction | 64% | 82% | **92%** | +28pp |
| Error Rate | 34% | 15% | **6%** | -28pp |
| Assistance Needed | 40% | 18% | **8%** | -32pp |

### Key Iteration Insights

**Round 1 → 2** (biggest gains):
- Button size 44dp → 56dp (addressed "怕按错了")
- Added voice input (addressed "不知道怎么输入")
- Home screen: 6 actions → 3 (addressed "操作太复杂")

**Round 2 → 3** (refinement):
- Added haptic feedback on all buttons (increased tap confidence)
- Added TTS ride status announcements (addressed "不知道车在哪")
- Refined modal layout (reduced accidental cancellations)

Full testing protocol and templates: see [accessibility-guide.md](accessibility-guide.md).

---

## Background: The Taxi Platform Story

This skill was born from a real product design project:

> **Elderly-Friendly Taxi Platform** (2025.09 — 2026.01)
> **Role**: Product Design & System Modeling Lead
>
> 1. **User Research**: Designed a mixed-method survey + deep interview study covering 200+ elderly users. Used persona modeling and journey mapping to translate emotional pain points ("too complex", "text too small") into quantifiable engineering requirements ("reduce decision nodes", "enlarge touch targets").
>
> 2. **Competitive Analysis**: Benchmarked against Didi Elderly Mode, Amap Assisted Ride, and 95128 hotline. Identified 7 new/stubborn pain points (wrong car, safety anxiety, cash exclusion, medical trips, no smartphone, long wait, voice ambiguity) and designed corresponding solutions (plate verification, SOS guard, cash payment, medical priority, QR/hotline entry, auto-expand range, confidence-aware voice).
>
> 3. **Vibe Coding Prototype**: Using Qoder + Claude Code, independently built a high-fidelity interactive prototype of the elderly taxi app (voice booking, one-tap ride, large text mode) in 48 hours. Used directly for user testing and team reviews, compressing prototype iteration from 2 weeks to 3 days.
>
> 4. **System Modeling**: Completed full UML stack modeling — use case (15 UCs, 3 actors), business flow (enhanced with safety guard, SOS, cash, medical priority), sequence (7 phases, 6 participants), class (20+ classes including SafetyService), component architecture. All PlantUML sources and rendered PNGs included in `uml-output/`.
>
> 5. **Validation**: Organized usability testing with 10 target users. Established a three-dimensional evaluation model (completion rate × task time × satisfaction). Through 3 rounds of iteration, reduced average ride-hailing time by over 1 minute and achieved 92% user satisfaction.

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

**Quick rules:**
- All components must pass `check-a11y.js` with 0 errors
- Include `accessibilityLabel` and `accessibilityRole` on every interactive element
- Keep SKILL.md under 500 lines; put detailed content in reference files
- Test scripts with `node scripts/gen-component.js all --type all --out ./test-output`

**Areas we need help with:**
- More component types (date picker, map view, contact list, ride history)
- Localization beyond Chinese (English, Japanese, Korean voice intents)
- Integration with additional voice recognition providers
- iOS VoiceOver and Android TalkBack platform-specific testing
- Additional usability testing templates and scoring models

---

## License

[MIT](LICENSE) — free to use in personal and commercial projects.

---

## Acknowledgments

- The 200+ elderly users who participated in our research
- The React Native accessibility community
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) by W3C
- [Qoder](https://qoder.ai) for the Agent Skill platform
