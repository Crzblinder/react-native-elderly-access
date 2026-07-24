# Product Requirements Document (PRD)
# 适老化打车平台 — 产品需求文档

> Version: 1.1 | Last Updated: 2026-07
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
| Offline Senior (王爷爷) | 70+ | None | Hotline 95128 or QR station booking |

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
| "付钱太麻烦" (Payment too complex) | 61% | Avoidance | Family delegation, one-tap pay, cash support |
| "不知道车在哪" (Don't know where car is) | 55% | Anxiety, impatience | Large-text status + voice announce |
| "怕上错车/不安全" (Safety anxiety) | 52% | Fear, avoidance | Plate verification + family live location + SOS |
| "不会用智能手机" (No smartphone skill) | 34% | Exclusion | QR station booking + 95128 hotline |

### 2.3 Translated Quantifiable Requirements

From emotional pain points to engineering specifications:

```
"减少决策节点"    → Max 3 visible actions per screen; max 3 taps to primary task
"放大触控热区"    → Touch targets >= 48x48dp (recommended 56dp); hitSlop on all buttons
"放大字体"        → Body text >= 18sp; headings >= 24sp; in-app font scale 1.0-2.0x
"语音优先"        → Voice input available on all text entry screens; TTS feedback on actions
"一键操作"        → Pre-configured destinations (home, frequent); single-tap booking
"安全确认"        → All irreversible actions require large-text confirmation modal
"亲友协助"        → SMS-based payment delegation; family trip monitoring; live location
"现金友好"        → Support cash payment for ~20% elderly users who only use cash
"全场景覆盖"      → App + QR station + 95128 hotline to serve both online and offline seniors
```

---

## 3. Competitive Analysis

### 3.1 Market Landscape

| Competitor | Product Form | Core Strength | Key Gap |
|------------|--------------|---------------|---------|
| **滴滴长辈版** | In-app elderly mode | 2.65 billion services; medical priority dispatch (202k+ verified dispatches); cash payment | No trip safety guard; no SOS emergency |
| **高德助老打车** | App + offline "warm stations" | QR-code station booking; multi-city coverage | Weak family monitoring; no medical priority |
| **95128热线** | Phone hotline | Serves non-smartphone seniors via human agent | No real-time tracking; no digital safety features |
| **本项目** | React Native Skill / component library | Voice-first + 3-tap design + family payment + safety guard + multi-entry (app/QR/hotline) | Needs backend integration with real dispatch platforms |

### 3.2 Competitive Differentiation

1. **Multi-entry booking**: Unlike single-channel competitors, we combine APP voice booking, QR station scanning, and 95128 hotline to cover all senior segments.
2. **Trip safety guard**: Real-time family location sharing + plate verification + SOS, addressing the top safety anxiety that competitors ignore.
3. **Medical priority dispatch**: When destination is hospital, boost nearby driver matching weight (validated by Didi data).
4. **Cash + digital payment**: Supports both online self-pay and cash pay, matching the ~20% cash-only elderly population.

### 3.3 New & Stubborn Pain Points from Competitive Benchmarking

| ID | Pain Point | Evidence | Our Response |
|----|-----------|----------|--------------|
| P1 | **Getting in the wrong car** | News reports of seniors entering wrong vehicles | Plate-number verification before boarding |
| P2 | **Trip safety anxiety** | 71-year-old died alone in taxi; seniors fear traveling alone | Family live-location + SOS + trip recording |
| P3 | **Cash-only users excluded** | ~20% of elderly only use cash | Cash payment with driver confirmation |
| P4 | **Medical trips hard to book** | Didi verified 202k medical priority dispatches | Hospital-destination priority dispatch |
| P5 | **No smartphone access** | 34% of target users cannot use smartphones | QR station + 95128 hotline entry |
| P6 | **No ride for long time** | Seniors abandon after 3 min without match | Auto-expand matching radius + TTS announcement |
| P7 | **Voice recognition ambiguity** | Seniors say "my son's place" or "that hospital" | Low-confidence candidate list + saved-address alias |

---

## 4. Core Module Design

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
| F2.3 | Confidence scoring | P0 | Return confidence score; show candidate list when confidence < 0.8 |
| F2.4 | Visual feedback | P0 | Show "正在听..." state with pulsing animation during recording |
| F2.5 | Transcript display | P0 | Show recognized text in large font for user verification |
| F2.6 | Confirmation dialog | P0 | Modal with destination + "确认叫车" / "重新说" buttons |
| F2.7 | TTS feedback | P1 | Speak back: "正在为您叫车去[目的地]" after confirmation |
| F2.8 | Manual fallback | P1 | "不方便说话？手动输入" option always visible |

**Voice Intent Mapping**:
| Pattern | Intent | Action |
|---------|--------|--------|
| "我要打车回家" / "回家" / "打车回家" | RIDE_HOME | Book ride to saved home |
| "打车去[地点]" / "去[地点]" / "叫车去..." | RIDE_TO | Book ride to [地点] |
| "帮我叫车" / "叫个车" / "我要打车" | REQUEST_RIDE | Open booking flow |
| "取消叫车" / "不要了" / "算了" | CANCEL_RIDE | Cancel current order |
| "车到哪了" / "司机在哪" / "还要多久" | CHECK_STATUS | Show driver location |

### Module 3: QR Code Station Booking (扫码叫车)

**Purpose**: Provide offline entry for seniors who cannot or prefer not to use smartphone apps.

**User Flow**:
```
[At warm station] → [Scan QR code] → [Auto-locate station] → [Confirm] → [Ride Booked]
  Total: 1 scan + 1 confirm
```

**Functional Requirements**:
| ID | Requirement | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| F3.1 | QR code scanning | P0 | Open camera, scan station QR code, parse stationId |
| F3.2 | Station auto-location | P0 | Resolve station GPS coordinates from backend |
| F3.3 | Large-text confirmation | P0 | Show pickup location and destination before booking |
| F3.4 | No-address fallback | P1 | If destination unclear, default to "最近医院" or saved home |

### Module 4: Hotline 95128 Booking (电话叫车)

**Purpose**: Serve non-smartphone seniors through voice call.

**Functional Requirements**:
| ID | Requirement | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| F4.1 | Hotline dial | P0 | One-tap dial 95128 from app; also callable from any phone |
| F4.2 | Agent order entry | P0 | Operator creates order on behalf of senior |
| F4.3 | SMS confirmation | P1 | Senior receives booking confirmation SMS |

### Module 5: Large Text Mode (大字模式)

**Purpose**: Ensure all text is readable without glasses or squinting.

**Functional Requirements**:
| ID | Requirement | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| F5.1 | Default large font | P0 | Body text >= 18sp, headings >= 24sp in default mode |
| F5.2 | In-app font toggle | P0 | Settings screen with font scale slider (1.0x - 2.0x) |
| F5.3 | Live preview | P1 | Preview text updates in real-time as slider moves |
| F5.4 | Persist preference | P0 | Font scale saved to AsyncStorage, applied on app restart |
| F5.5 | System font respect | P1 | Honor Android/iOS system font scale settings |
| F5.6 | High contrast mode | P2 | Optional mode boosting contrast to >= 7:1 |
| F5.7 | No text truncation | P0 | All text wraps or scrolls; never truncated with "..." |

**Typography Scale**:
| Element | Normal | Large (1.5x) | Extra Large (2.0x) |
|---------|--------|--------------|---------------------|
| Heading | 28sp | 42sp | 56sp |
| Body | 20sp | 30sp | 40sp |
| Caption | 16sp | 24sp | 32sp |
| Button | 20sp | 30sp | 40sp |

### Module 6: Family Payment (亲友代付)

**Purpose**: Allow family members to pay for rides remotely, reducing payment anxiety.

**User Flow**:
```
[Trip ends] → [Select "发给家人代付"] → [Choose contact] → [SMS sent with payment link]
    → [Family opens link] → [One-tap confirm payment]
```

**Functional Requirements**:
| ID | Requirement | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| F6.1 | Trip summary display | P0 | Show from/to, duration, amount in large text |
| F6.2 | Contact picker | P0 | Open phone contacts for family selection |
| F6.3 | SMS generation | P0 | Auto-generate payment link with trip details |
| F6.4 | Payment status tracking | P1 | Real-time status: Pending → Paid / Expired |
| F6.5 | Self-pay fallback | P0 | "自己支付" option always available |
| F6.6 | Link expiry | P1 | Payment link expires after 24 hours |

### Module 7: Trip Safety Guard (行程安全守护)

**Purpose**: Reduce safety anxiety for seniors and their families.

**Functional Requirements**:
| ID | Requirement | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| F7.1 | Family trip notification | P0 | Auto-notify family when ride starts, with live location link |
| F7.2 | Real-time location sharing | P0 | Family can view driver location and ETA during trip |
| F7.3 | Plate verification | P0 | Before boarding, user confirms plate number; mismatch triggers warning |
| F7.4 | Family call driver | P1 | One-tap call driver from family link |
| F7.5 | Trip recording | P2 | Auto-start audio recording during SOS or opt-in |

### Module 8: Emergency SOS (紧急求助)

**Purpose**: Provide one-touch emergency response during trips.

**Functional Requirements**:
| ID | Requirement | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| F8.1 | SOS trigger | P0 | Long-press SOS button for 3 seconds to trigger |
| F8.2 | Emergency call | P0 | Auto-dial 110/120 or emergency contact |
| F8.3 | Location broadcast | P0 | Share real-time location with emergency contact and family |
| F8.4 | Recording start | P1 | Start trip recording when SOS triggered |
| F8.5 | Visual confirmation | P0 | Large-text confirmation: "已为您呼叫帮助" |

### Module 9: Payment Methods (支付方式)

**Purpose**: Support both digital and cash payment preferences.

**Functional Requirements**:
| ID | Requirement | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| F9.1 | Online self-pay | P0 | One-tap payment via WeChat/Alipay |
| F9.2 | Cash payment | P0 | User selects "现金支付"; driver confirms receipt |
| F9.3 | Family payment | P0 | Generate link and send to family |
| F9.4 | Payment receipt | P1 | Generate large-text receipt for all payment methods |

### Module 10: Medical Priority Dispatch (就医优先派单)

**Purpose**: Improve ride availability for medical trips.

**Functional Requirements**:
| ID | Requirement | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| F10.1 | Hospital destination detection | P0 | Detect hospital keyword or POI category |
| F10.2 | Priority matching | P0 | Boost nearby driver weight; reduce wait time |
| F10.3 | Arrival notification | P1 | Notify family when senior arrives at hospital |

---

## 5. Non-Functional Requirements

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
| Security | Location data | Encrypt location data in transit; family consent required |

---

## 6. Business Flow (业务流程)

The complete business flow, including original modules and competitive-inspired enhancements, is documented in:
- [uml-output/02-business-flow.puml](uml-output/02-business-flow.puml) — original flow
- [uml-output/02-business-flow-enhanced.puml](uml-output/02-business-flow-enhanced.puml) — enhanced flow with safety guard, SOS, cash payment, medical priority, and multi-entry booking

### Key Flow Enhancements
1. **Multi-entry booking**: App (one-tap/voice) → QR station → 95128 hotline
2. **Confidence-aware voice**: High confidence auto-fill; low confidence shows candidate list
3. **Medical priority**: Hospital destinations trigger priority dispatch
4. **Auto-expand matching**: If no driver in 3 minutes, radius expands with TTS announcement
5. **Safety guard**: Family live location + plate verification + SOS
6. **Payment diversity**: Online / cash / family payment
7. **Post-trip care**: Hospital arrival notification + trip record

---

## 7. Usability Testing Results

### 7.1 Test Protocol

- **Participants**: 10 target users (age 62-78, M=69.2)
- **Tasks**: 5 core tasks (one-tap ride, voice booking, check status, change font, family pay)
- **Rounds**: 3 iterative rounds with design improvements between rounds

### 7.2 Three-Dimensional Evaluation Model

```
Score = 0.4 × CompletionRate + 0.3 × TimeScore + 0.3 × SatisfactionScore

Where:
  CompletionRate = (completed / total tasks) × 100
  TimeScore = max(0, 100 - (avgSeconds - 60) × 0.5)
  SatisfactionScore = (avgLikert / 5) × 100
```

### 7.3 Iteration Results

| Metric | Round 1 (Baseline) | Round 2 | Round 3 (Final) | Improvement |
|--------|-------------------|---------|-----------------|-------------|
| Task Completion Rate | 72% | 88% | **95%** | +23pp |
| Avg Booking Time | 180s (3min) | 120s (2min) | **90s (1.5min)** | **-90s (>1min)** |
| Avg Satisfaction (1-5) | 3.2 | 4.1 | **4.6** | +1.4 |
| Satisfaction (%) | 64% | 82% | **92%** | +28pp |
| Error Rate | 34% | 15% | **6%** | -28pp |
| Assistance Needed | 40% | 18% | **8%** | -32pp |

### 7.4 Key Improvements Between Rounds

**Round 1 → Round 2**:
- Increased button size from 44dp to 56dp (addressed "怕按错了")
- Added voice input option on booking screen (addressed "不知道怎么输入")
- Simplified home screen from 6 actions to 3 (addressed "操作太复杂")

**Round 2 → Round 3**:
- Added haptic feedback on all primary buttons (increased confidence)
- Added TTS announcements for ride status (addressed "不知道车在哪")
- Refined confirmation modal layout (reduced accidental cancellations)

### 7.5 Future Test Directions

To validate competitive-inspired features:
- Safety guard flow (plate verification, family live location, SOS)
- Cash payment flow
- QR station booking with real seniors
- Medical priority dispatch wait-time reduction

---

## 8. System Architecture Reference

Full UML modeling is documented in `uml-output/`:
- [01-use-case.puml](uml-output/01-use-case.puml) — use case diagram
- [02-business-flow-enhanced.puml](uml-output/02-business-flow-enhanced.puml) — enhanced business flow
- [03-sequence-voice-booking.puml](uml-output/03-sequence-voice-booking.puml) — voice booking sequence
- [04-class-diagram.puml](uml-output/04-class-diagram.puml) — class diagram
- [05-component-architecture.puml](uml-output/05-component-architecture.puml) — component architecture

Component implementation examples are in [examples.md](examples.md).

---

## 9. Open Questions & Next Steps

1. **Backend integration**: Which ride platform API to integrate with (Didi, Amap, or mock)?
2. **95128 hotline**: Is real operator integration needed, or simulate with voice bot?
3. **Medical priority dispatch**: How to define hospital POI and priority weight?
4. **Emergency SOS**: Direct 110/120 dial vs. platform-mediated emergency service?
5. **Cash payment**: Driver-side confirmation UI design and reconciliation flow.
