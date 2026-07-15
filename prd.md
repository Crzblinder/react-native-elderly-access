# Product Requirements Document (PRD)
# 适老化打车平台 — 产品需求文档

> Version: 1.0 | Last Updated: 2026-01
> Author: Product Design & System Modeling Lead

---

## 1. Product Overview

### 1.1 Background

China has 280+ million citizens aged 60+, yet mainstream ride-hailing apps suffer from low adoption among this demographic. Our mixed-method research (N=200+) identified critical usability barriers and informed a targeted solution.

### 1.2 Product Vision

A ride-hailing application where elderly users can book a ride in **under 60 seconds** with **no more than 3 taps**, using voice as the primary interaction mode.

### 1.3 Target Users

| Persona | Age Range | Tech Comfort | Key Need |
|---------|-----------|--------------|----------|
| Active Senior (张大爷) | 60-70 | Medium | Independence, quick booking |
| Assisted Senior (李奶奶) | 70-80 | Low | Family support, voice-only |
| Family Helper (女儿小王) | 30-50 | High | Remote payment, trip monitoring |

---

## 2. User Research Findings

### 2.1 Research Methodology

- **Quantitative Survey**: N=213, structured questionnaire covering usage patterns, pain points, feature priorities
- **Qualitative Deep Interview**: N=18, semi-structured, 30-45 min sessions
- **Contextual Observation**: N=8, observed users attempting tasks on existing apps

### 2.2 Key Findings

| Pain Point Category | Frequency | Emotional Impact | Design Response |
|---------------------|-----------|-----------------|-----------------|
| "操作太复杂" (Too complex) | 78% | Frustration, abandonment | Reduce decision nodes to max 3 taps |
| "字太小看不清" (Text too small) | 85% | Anxiety, eye strain | Body >= 18sp, in-app font toggle |
| "怕按错了" (Fear of wrong tap) | 72% | Helplessness, distrust | 48dp+ targets, confirm before execute |
| "不知道怎么输入地址" (Can't input address) | 68% | Embarrassment | Voice-first input, saved addresses |
| "付钱太麻烦" (Payment too complex) | 61% | Avoidance | Family delegation, one-tap pay |
| "不知道车在哪" (Don't know where car is) | 55% | Anxiety, impatience | Large-text status + voice announce |

### 2.3 Translated Quantifiable Requirements

From emotional pain points to engineering specifications:

```
"减少决策节点"    → Max 3 visible actions per screen; max 3 taps to primary task
"放大触控热区"    → Touch targets >= 48x48dp (recommended 56dp); hitSlop on all buttons
"放大字体"        → Body text >= 18sp; headings >= 24sp; in-app font scale 1.0-2.0x
"语音优先"        → Voice input available on all text entry screens; TTS feedback on actions
"一键操作"        → Pre-configured destinations (home, frequent); single-tap booking
"安全确认"        → All irreversible actions require large-text confirmation modal
"亲友协助"        → SMS-based payment delegation; family trip monitoring
```

---

## 3. Core Module Design (四大模块)

### Module 1: One-Tap Ride (一键叫车)

**Purpose**: Minimize booking steps for returning home or visiting frequent destinations.

**User Flow**:
```
[Open App] → [Tap "一键打车回家"] → [Confirm] → [Ride Booked]
  Total: 2 taps (with pre-configured home address)
```

**Functional Requirements**:
| ID | Requirement | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| F1.1 | Pre-save home address | P0 | User can set home address in Profile, persisted to local storage |
| F1.2 | One-tap home button | P0 | Home screen shows large card "一键打车回家" with saved address |
| F1.3 | Recent destinations | P1 | Second card shows last visited destination |
| F1.4 | Haptic feedback | P1 | 50ms vibration on button press |
| F1.5 | Address not set handling | P0 | If no home address, show prompt to set address first |

### Module 2: Voice Command Ride (语音指令叫车)

**Purpose**: Enable ride booking through natural language, eliminating typing.

**User Flow**:
```
[Tap microphone] → [Speak destination] → [View transcript + confirm] → [Ride Booked]
  Total: 2 taps + 1 voice command
```

**Functional Requirements**:
| ID | Requirement | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| F2.1 | Voice recognition | P0 | Support Mandarin Chinese (zh-CN); accuracy >= 90% for common destinations |
| F2.2 | Intent parsing | P0 | Map natural language to structured actions (RIDE_HOME, RIDE_TO, etc.) |
| F2.3 | Visual feedback | P0 | Show "正在听..." state with pulsing animation during recording |
| F2.4 | Transcript display | P0 | Show recognized text in large font for user verification |
| F2.5 | Confirmation dialog | P0 | Modal with destination + "确认叫车" / "重新说" buttons |
| F2.6 | TTS feedback | P1 | Speak back: "正在为您叫车去[目的地]" after confirmation |
| F2.7 | Manual fallback | P1 | "不方便说话？手动输入" option always visible |

**Voice Intent Mapping**:
| Pattern | Intent | Action |
|---------|--------|--------|
| "我要打车回家" / "回家" / "打车回家" | RIDE_HOME | Book ride to saved home |
| "打车去[地点]" / "去[地点]" / "叫车去..." | RIDE_TO | Book ride to [地点] |
| "帮我叫车" / "叫个车" / "我要打车" | REQUEST_RIDE | Open booking flow |
| "取消叫车" / "不要了" / "算了" | CANCEL_RIDE | Cancel current order |
| "车到哪了" / "司机在哪" / "还要多久" | CHECK_STATUS | Show driver location |

### Module 3: Large Text Mode (大字模式)

**Purpose**: Ensure all text is readable without glasses or squinting.

**Functional Requirements**:
| ID | Requirement | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| F3.1 | Default large font | P0 | Body text >= 18sp, headings >= 24sp in default mode |
| F3.2 | In-app font toggle | P0 | Settings screen with font scale slider (1.0x - 2.0x) |
| F3.3 | Live preview | P1 | Preview text updates in real-time as slider moves |
| F3.4 | Persist preference | P0 | Font scale saved to AsyncStorage, applied on app restart |
| F3.5 | System font respect | P1 | Honor Android/iOS system font scale settings |
| F3.6 | High contrast mode | P2 | Optional mode boosting contrast to >= 7:1 |
| F3.7 | No text truncation | P0 | All text wraps or scrolls; never truncated with "..." |

**Typography Scale**:
| Element | Normal | Large (1.5x) | Extra Large (2.0x) |
|---------|--------|--------------|---------------------|
| Heading | 28sp | 42sp | 56sp |
| Body | 20sp | 30sp | 40sp |
| Caption | 16sp | 24sp | 32sp |
| Button | 20sp | 30sp | 40sp |

### Module 4: Family Payment (亲友代付)

**Purpose**: Allow family members to pay for rides remotely, reducing payment anxiety.

**User Flow**:
```
[Trip ends] → [Select "发给家人代付"] → [Choose contact] → [SMS sent with payment link]
    → [Family opens link] → [One-tap confirm payment]
```

**Functional Requirements**:
| ID | Requirement | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| F4.1 | Trip summary display | P0 | Show from/to, duration, amount in large text |
| F4.2 | Contact picker | P0 | Open phone contacts for family selection |
| F4.3 | SMS generation | P0 | Auto-generate payment link with trip details |
| F4.4 | Payment status tracking | P1 | Real-time status: Pending → Paid / Expired |
| F4.5 | Self-pay fallback | P0 | "自己支付" option always available |
| F4.6 | Link expiry | P1 | Payment link expires after 24 hours |

---

## 4. Non-Functional Requirements

| Category | Requirement | Specification |
|----------|------------|---------------|
| Performance | App launch time | < 2 seconds on mid-range devices |
| Performance | Voice recognition latency | < 3 seconds end-to-end |
| Accessibility | WCAG compliance | Level AA minimum |
| Accessibility | Touch targets | >= 48x48dp all interactive elements |
| Compatibility | Android version | >= Android 8.0 (API 26) |
| Compatibility | iOS version | >= iOS 14.0 |
| Compatibility | Screen sizes | 4.7" - 6.8" (optimize for 5.5"-6.1") |
| Reliability | Offline degradation | Show saved addresses when offline |
| Security | Payment data | No card data stored on device |

---

## 5. Usability Testing Results (验证迭代数据)

### 5.1 Test Protocol

- **Participants**: 10 target users (age 62-78, M=69.2)
- **Tasks**: 5 core tasks (one-tap ride, voice booking, check status, change font, family pay)
- **Rounds**: 3 iterative rounds with design improvements between rounds

### 5.2 Three-Dimensional Evaluation Model

```
Score = 0.4 × CompletionRate + 0.3 × TimeScore + 0.3 × SatisfactionScore

Where:
  CompletionRate = (completed / total tasks) × 100
  TimeScore = max(0, 100 - (avgSeconds - 60) × 0.5)
  SatisfactionScore = (avgLikert / 5) × 100
```

### 5.3 Iteration Results

| Metric | Round 1 (Baseline) | Round 2 | Round 3 (Final) | Improvement |
|--------|-------------------|---------|-----------------|-------------|
| Task Completion Rate | 72% | 88% | **95%** | +23pp |
| Avg Booking Time | 180s (3min) | 120s (2min) | **90s (1.5min)** | **-90s (>1min)** |
| Avg Satisfaction (1-5) | 3.2 | 4.1 | **4.6** | +1.4 |
| Satisfaction (%) | 64% | 82% | **92%** | +28pp |
| Error Rate | 34% | 15% | **6%** | -28pp |
| Assistance Needed | 40% | 18% | **8%** | -32pp |

### 5.4 Key Improvements Between Rounds

**Round 1 → Round 2**:
- Increased button size from 44dp to 56dp (addressed "怕按错了")
- Added voice input option on booking screen (addressed "不知道怎么输入")
- Simplified home screen from 6 actions to 3 (addressed "操作太复杂")

**Round 2 → Round 3**:
- Added haptic feedback on all primary buttons (increased confidence)
- Added TTS announcements for ride status (addressed "不知道车在哪")
- Refined confirmation modal layout (reduced accidental cancellations)

---

## 6. System Architecture Reference

Full UML modeling (use case, sequence, class, activity diagrams) is documented in [assets/architecture-diagram.md](assets/architecture-diagram.md).

Component implementation examples are in [examples.md](examples.md).
