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
| **滴滴长辈版** | In-app elderly mode | 2.65 billion rides served (355 cities, 624万+ elderly users); medical priority dispatch (202k+); 3000+ physical stations; cash payment | No trip safety guard; no SOS emergency; no family real-time tracking |
| **高德助老打车** | App + offline "暖心车站" | QR-code station booking (multi-city, 30+ communities); "无目的地叫车" feature; 1.5x YoY user growth; 43% booking frequency increase | Weak family monitoring; no medical priority; no SOS; no voice-first design |
| **95128热线** | Phone hotline | Serves non-smartphone seniors via human agent; nationwide coverage mandate | No real-time tracking; no digital safety features; no payment integration; high wait times |
| **本项目** | React Native Skill / component library | Voice-first + 3-tap design + family payment + safety guard + multi-entry (app/QR/hotline) + 10模块全覆盖 | Needs backend integration with real dispatch platforms |

### 3.2 Quantitative Feature Comparison Matrix

| Feature | 滴滴长辈版 | 高德助老打车 | 95128热线 | 本项目 |
|---------|-----------|-------------|----------|--------|
| 大字模式 | 基础(仅首页) | 部分页面 | — | **全页面 1.0-2.0x 无级缩放** |
| 语音叫车 | 不支持 | 不支持 | 人工 | **语音识别+TTS反馈+置信度候选** |
| 一键叫车 | 支持 | 支持 | — | 支持(预填地址+最近目的地) |
| 扫码叫车 | 3000+站点 | **暖心车站(多城市)** | — | 支持 |
| 95128热线 | — | — | **核心功能** | 一键拨号+订单同步 |
| 就医优先派单 | **202k+次** | 不支持 | — | 支持(POI识别+权重提升) |
| 现金支付 | **支持** | 部分支持 | 现金 | 支持(司机端确认) |
| 亲友代付 | 不支持 | 不支持 | — | **SMS链接+一键确认** |
| 行程安全守护 | 不支持 | 不支持 | — | **实时位置共享+车牌校验** |
| SOS紧急求助 | 不支持 | 不支持 | — | **长按3秒+110/120+录音** |
| 亲友实时追踪 | 不支持 | 不支持 | — | **H5实时位置+一键拨打司机** |
| 车牌校验 | 不支持 | 不支持 | — | **上车前校验+不匹配警告** |
| 行程录音 | 不支持 | 不支持 | — | 支持(SOS触发/可选) |
| 服务覆盖 | **355城市** | 多城市 | 全国 | 取决于后端集成 |
| 累计服务量 | **2.65亿次** | 未公开 | 未公开 | 待上线 |

### 3.3 Market Positioning Map

```
                    高 ← 安全守护能力 → 低
                    ┌─────────────────────────┐
              高    │  ★ 本项目              │  滴滴长辈版
                    │  (安全+SOS+追踪)       │  (基础服务)
            安      │                        │
            全      │─────────────────────────│
            守      │                        │
            护      │  高德助老打车          │  95128热线
            能      │  (仅扫码,无安全)      │  (无数字安全)
            力      │                        │
              低    │                        │
                    └─────────────────────────┘
                    高 ← 多入口覆盖 → 低
```

> **本项目定位**: 左上象限——高安全守护 + 高多入口覆盖，是唯一同时覆盖"数字安全"和"全场景入口"的解决方案。

### 3.4 Competitive Differentiation

1. **Multi-entry booking**: Unlike single-channel competitors, we combine APP voice booking, QR station scanning, and 95128 hotline to cover all senior segments (online + offline).
2. **Trip safety guard**: Real-time family location sharing + plate verification + SOS, addressing the top safety anxiety that ALL competitors ignore.
3. **Medical priority dispatch**: When destination is hospital, boost nearby driver matching weight (validated by Didi 202k+ dispatches).
4. **Cash + digital payment**: Supports both online self-pay and cash pay, matching the ~20% cash-only elderly population.
5. **Voice-first design**: Unlike competitors that rely on visual/manual interaction, we prioritize voice input with TTS feedback, serving the 68% who struggle with text input.

### 3.5 New & Stubborn Pain Points from Competitive Benchmarking

| ID | Pain Point | Evidence | Impact | Our Response |
|----|-----------|----------|--------|--------------|
| P1 | **Getting in the wrong car** | News reports of seniors entering wrong vehicles; 52% fear | Safety incident risk | Plate-number verification before boarding |
| P2 | **Trip safety anxiety** | 71-year-old died alone in taxi; general fear of solo travel | Life-threatening | Family live-location + SOS + trip recording |
| P3 | **Cash-only users excluded** | ~20% of elderly only use cash; Didi verified this need | Service exclusion | Cash payment with driver confirmation |
| P4 | **Medical trips hard to book** | Didi: 202k+ medical priority dispatches; hospital trips are most common | Health risk (missed appointments) | Hospital-destination priority dispatch |
| P5 | **No smartphone access** | 34% of target users cannot use smartphones | Complete exclusion | QR station + 95128 hotline entry |
| P6 | **No ride for long time** | Seniors abandon after 3 min without match; 55% anxiety | Service abandonment | Auto-expand matching radius + TTS announcement |
| P7 | **Voice recognition ambiguity** | Seniors use vague terms ("my son's place", "that hospital") | Booking errors | Low-confidence candidate list + saved-address alias |
| P8 | **Payment anxiety** | 61% find payment "too troublesome"; unfamiliar with digital pay | Abandonment at payment | 3 payment methods + large-text receipt |
| P9 | **Cannot read small text** | 85% complain text too small; 78% find operation too complex | App abandonment | 18sp+ default, 1.0-2.0x scale, max 3 actions/screen |
| P10 | **Don't know driver location** | 55% anxiety about not knowing where car is | Anxiety during wait | Large-text status + TTS voice announce + map |

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

### 8.1 Core Diagrams
- [01-use-case.puml](uml-output/01-use-case.puml) — use case diagram (15 use cases, 3 actors)
- [02-business-flow-enhanced.puml](uml-output/02-business-flow-enhanced.puml) — enhanced business flow activity diagram
- [04-class-diagram.puml](uml-output/04-class-diagram.puml) — class diagram (9 services, 11 screens, 14 components, 9 entities)
- [05-component-architecture.puml](uml-output/05-component-architecture.puml) — deep component architecture (3 layers, 35+ components)

### 8.2 Sequence Diagrams
- [03-sequence-voice-booking.puml](uml-output/03-sequence-voice-booking.puml) — voice booking complete sequence (7 phases)
- [09-sequence-qr-booking.puml](uml-output/09-sequence-qr-booking.puml) — QR scan station booking sequence
- [10-sequence-sos-emergency.puml](uml-output/10-sequence-sos-emergency.puml) — SOS emergency complete sequence
- [11-sequence-payment-flow.puml](uml-output/11-sequence-payment-flow.puml) — multi-payment methods sequence
- [14-sequence-one-tap-booking.puml](uml-output/14-sequence-one-tap-booking.puml) — one-tap booking (login, address, plate verify)
- [15-sequence-hotline-booking.puml](uml-output/15-sequence-hotline-booking.puml) — 95128 hotline booking (IVR, operator, SMS)
- [16-sequence-medical-priority.puml](uml-output/16-sequence-medical-priority.puml) — medical priority dispatch (POI, weight formula, stats)
- [17-sequence-family-tracking.puml](uml-output/17-sequence-family-tracking.puml) — family tracking & payment (real-time, anomaly, SOS)

### 8.3 State Machines
- [06-order-state-machine.puml](uml-output/06-order-state-machine.puml) — order lifecycle (14 states, 18 transitions)
- [07-sos-state-machine.puml](uml-output/07-sos-state-machine.puml) — SOS emergency state machine

### 8.4 Infrastructure & Data
- [08-deployment-architecture.puml](uml-output/08-deployment-architecture.puml) — deployment architecture (K8s, PostgreSQL, Redis, S3)
- [12-er-diagram.puml](uml-output/12-er-diagram.puml) — database ER entity relationship diagram
- [13-data-flow-diagram.puml](uml-output/13-data-flow-diagram.puml) — data flow diagram (Level 0 & 1)

### 8.5 Activity Diagrams
- [18-activity-onboarding.puml](uml-output/18-activity-onboarding.puml) — onboarding & settings activity flow (3-step guide)

Component implementation examples are in [examples.md](examples.md).

---
## 9. Edge Cases & Error Handling

### 9.1 Per-Module Edge Cases

| Module | Edge Case | Severity | Handling Strategy |
|--------|-----------|----------|-------------------|
| M1 一键叫车 | 家庭地址未设置 | Medium | 禁用按钮 + 大字提示"请先设置家庭地址" → 跳转设置页 |
| M1 一键叫车 | 家庭地址已失效(拆迁/改名) | Low | 提示"地址可能已变更，请确认" → 引导重新设置 |
| M2 语音叫车 | 语音权限被拒绝 | High | 降级为手动输入模式 + 提示"请在设置中开启麦克风权限" |
| M2 语音叫车 | 网络不可用(STT服务不可达) | High | 降级为手动输入模式 + 提示"语音服务暂不可用" |
| M2 语音叫车 | 识别结果为空(噪音/静默) | Medium | 提示"没有听清，请再说一次" + 3次失败后引导手动输入 |
| M2 语音叫车 | 方言/口音识别准确率低 | Medium | 识别置信度 < 0.7 时展示候选列表，支持手动纠正 |
| M3 扫码叫车 | 二维码无效/过期 | High | 提示"二维码无效，请扫描正确的助老打车点二维码" |
| M3 扫码叫车 | 摄像头权限被拒绝 | High | 提示"请在设置中开启相机权限" + 备选"拨打95128" |
| M3 扫码叫车 | 站点GPS解析失败 | Medium | 降级为手动输入上车点 |
| M4 电话叫车 | 设备不支持电话功能(平板) | Medium | 显示95128号码大字 + 提示"请用手机拨打" |
| M4 电话叫车 | 95128热线占线 | Medium | 提示"热线繁忙，请稍后重试或使用APP叫车" |
| M5 大字模式 | 极端字体缩放(2.0x)导致布局溢出 | High | ScrollView包裹所有内容 + 文字自动换行，不断行 |
| M5 大字模式 | 系统字体缩放与APP内缩放叠加 | Medium | 取max(systemScale, appScale)，上限2.0x |
| M6 亲友代付 | 联系人权限被拒绝 | Medium | 手动输入手机号 + 提示"请输入家人手机号" |
| M6 亲友代付 | 支付链接24小时过期 | Medium | 提示"支付链接已过期，请重新发送" + 一键重发 |
| M6 亲友代付 | 亲友拒绝支付 | Low | 提示"家人暂未支付，您也可以自己支付" |
| M7 安全守护 | 位置权限被拒绝 | High | 提示"位置共享需要定位权限" + 降级为仅通知无位置 |
| M7 安全守护 | 亲友未安装APP | Medium | 通过短信发送H5链接(无需安装) |
| M7 安全守护 | 车牌校验请求超时 | Medium | 提示"车牌校验服务暂不可用，请仔细核对后上车" |
| M8 SOS求助 | 误触SOS(3分钟内取消) | High | 弹窗确认"是否误触发？" → 记录日志 + 通知平台 |
| M8 SOS求助 | 110/120拨号失败(无信号) | Critical | 离线缓存SOS请求 + 信号恢复后自动重试 + 预载紧急短信 |
| M8 SOS求助 | 亲友紧急联系人未设置 | High | SOS仍触发，仅通知平台客服 + 提示"建议设置紧急联系人" |
| M9 支付 | 现金支付司机未确认 | Medium | 超时30分钟自动转为线上支付 + 推送提醒 |
| M9 支付 | 线上支付网络超时 | Medium | 支付结果轮询(最多3次，间隔5秒) + 手动"查询支付结果" |
| M10 就医派单 | 医院POI识别错误(非医院) | Medium | 用户可手动关闭"就医优先"标识 |
| M10 就医派单 | 扩大范围后仍无司机 | High | 提示"附近暂无可用车辆，建议拨打95128" |

### 9.2 Global Error Handling Strategy

```
┌─────────────────────────────────────────────────────┐
│                   Error Severity                     │
├──────────┬──────────┬──────────┬────────────────────┤
│ Critical │  High    │ Medium   │  Low               │
│ 阻塞主流程│ 功能降级  │ 可恢复   │  不影响体验         │
├──────────┼──────────┼──────────┼────────────────────┤
│ Full-page│ Modal +  │ Toast +  │ 静默降级            │
│ error    │ 降级方案  │ 自动重试  │  + 日志上报         │
│ + 人工   │          │          │                    │
│ 客服入口 │          │          │                    │
└──────────┴──────────┴──────────┴────────────────────┘
```

**Error Display Principles for Elderly Users**:
- Never show raw error codes (e.g., "ERR_CONN_REFUSED") → translate to plain language
- Always provide a clear next action: "请点击重试" / "请拨打95128" / "请返回首页"
- Use large text (≥ 18sp) with high contrast colors
- Every error screen must have a visible "返回首页" escape hatch
- TTS announcement for critical errors: "网络连接失败，正在重试"

### 9.3 Network Resilience Patterns

| Pattern | Implementation | Trigger |
|---------|---------------|---------|
| Offline Degradation | Show cached data (saved addresses, recent trips) | Network unavailable |
| Automatic Retry | Exponential backoff: 1s → 2s → 4s → 8s, max 3 retries | Transient failures (5xx, timeout) |
| Stale-While-Revalidate | Show cached data, refresh in background | GET requests with cache |
| Request Queue | Queue non-critical writes, flush on reconnect | Offline mutations |
| Graceful Degradation | Voice → Manual input; QR → 95128 hotline | Feature-specific failures |

---
## 10. API Contract Definitions

### 10.1 Ride Service

```
POST /api/v1/rides
```
**Request**:
```json
{
  "userId": "string (required)",
  "pickup": { "lat": "float", "lng": "float", "address": "string" },
  "destination": { "lat": "float", "lng": "float", "address": "string" },
  "priorityType": "normal | hospital",
  "entryType": "one_tap | voice | qr_station | hotline",
  "stationId": "string (optional, for QR entry)"
}
```
**Response (201)**:
```json
{
  "orderId": "string",
  "status": "matching",
  "estimatedFare": { "amount": "number", "currency": "CNY" },
  "estimatedETA": "number (seconds)",
  "matchRadius": "number (meters)",
  "createdAt": "ISO8601"
}
```

```
GET /api/v1/rides/{orderId}/status
```
**Response (200)**:
```json
{
  "orderId": "string",
  "status": "matching | assigned | arriving | arrived | in_trip | completed | cancelled",
  "driver": {
    "name": "string",
    "phone": "string (masked)",
    "plateNumber": "string",
    "carModel": "string",
    "carColor": "string",
    "rating": "float (0-5)",
    "location": { "lat": "float", "lng": "float" },
    "eta": "number (seconds)"
  },
  "safetyGuard": {
    "plateVerified": "boolean",
    "familyNotified": "boolean",
    "recording": "boolean"
  },
  "updatedAt": "ISO8601"
}
```

### 10.2 Payment Service

```
POST /api/v1/payments/{orderId}/pay
```
**Request**:
```json
{
  "method": "online | cash | family",
  "familyContact": { "name": "string", "phone": "string" }
}
```
**Response (200)**:
```json
{
  "paymentId": "string",
  "status": "pending | paid | expired | refunded",
  "method": "online | cash | family",
  "amount": { "total": "number", "currency": "CNY" },
  "receipt": {
    "from": "string",
    "to": "string",
    "duration": "string",
    "driverName": "string",
    "paidAt": "ISO8601"
  }
}
```

### 10.3 Safety Service

```
POST /api/v1/safety/sos
```
**Request**:
```json
{
  "orderId": "string",
  "location": { "lat": "float", "lng": "float" },
  "callAmbulance": "boolean",
  "triggeredAt": "ISO8601"
}
```
**Response (200)**:
```json
{
  "sosId": "string",
  "dispatched": "boolean",
  "services": ["110", "120"],
  "familyNotified": "boolean",
  "recordingStarted": "boolean",
  "platformNotified": "boolean"
}
```

```
POST /api/v1/safety/plate-verify
```
**Request**:
```json
{
  "orderId": "string",
  "expectedPlate": "string",
  "actualPlate": "string"
}
```
**Response (200)**:
```json
{
  "match": "boolean",
  "warningLevel": "none | mismatch | unknown",
  "action": "board | recheck | cancel",
  "familyNotified": "boolean"
}
```

---
## 11. Database Schema Design

### 11.1 Core Tables

```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(11) UNIQUE NOT NULL,
  name VARCHAR(50),
  age INT,
  home_address TEXT,
  home_lat DOUBLE PRECISION,
  home_lng DOUBLE PRECISION,
  font_scale NUMERIC(3,2) DEFAULT 1.0,
  large_text_mode BOOLEAN DEFAULT TRUE,
  high_contrast BOOLEAN DEFAULT FALSE,
  payment_preference VARCHAR(10) DEFAULT 'online' CHECK (payment_preference IN ('online','cash','family')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 亲友联系人表
CREATE TABLE family_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(11) NOT NULL,
  relation VARCHAR(20), -- 'son', 'daughter', 'spouse', 'other'
  is_emergency_contact BOOLEAN DEFAULT FALSE,
  notify_on_trip BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 订单表
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  pickup_address TEXT NOT NULL,
  pickup_lat DOUBLE PRECISION NOT NULL,
  pickup_lng DOUBLE PRECISION NOT NULL,
  dest_address TEXT NOT NULL,
  dest_lat DOUBLE PRECISION,
  dest_lng DOUBLE PRECISION,
  status VARCHAR(20) NOT NULL DEFAULT 'matching'
    CHECK (status IN ('matching','matching_expanded','assigned','arriving','arrived','in_trip','completed','cancelled')),
  priority_type VARCHAR(10) DEFAULT 'normal' CHECK (priority_type IN ('normal','hospital')),
  entry_type VARCHAR(15) NOT NULL CHECK (entry_type IN ('one_tap','voice','qr_station','hotline')),
  station_id VARCHAR(50),
  fare_estimate NUMERIC(10,2),
  driver_id UUID REFERENCES drivers(id),
  match_radius INT DEFAULT 2000, -- meters
  expanded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 司机表
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(11) UNIQUE NOT NULL,
  name VARCHAR(50) NOT NULL,
  plate_number VARCHAR(10) NOT NULL,
  car_model VARCHAR(50),
  car_color VARCHAR(20),
  rating NUMERIC(2,1) DEFAULT 5.0,
  status VARCHAR(15) DEFAULT 'offline' CHECK (status IN ('online','busy','offline')),
  current_lat DOUBLE PRECISION,
  current_lng DOUBLE PRECISION,
  last_location_update TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 支付表
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  amount NUMERIC(10,2) NOT NULL,
  method VARCHAR(10) NOT NULL CHECK (method IN ('online','cash','family')),
  status VARCHAR(15) DEFAULT 'pending' CHECK (status IN ('pending','paid','expired','refunded')),
  family_contact_id UUID REFERENCES family_contacts(id),
  pay_link VARCHAR(255),
  pay_link_expires_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SOS事件表
CREATE TABLE sos_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  user_id UUID REFERENCES users(id),
  triggered_at TIMESTAMPTZ NOT NULL,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  call_ambulance BOOLEAN DEFAULT FALSE,
  services_dispatched JSONB, -- ["110", "120"]
  family_notified BOOLEAN DEFAULT FALSE,
  recording_started BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  is_false_alarm BOOLEAN DEFAULT FALSE,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 行程录音表
CREATE TABLE trip_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  recording_url TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  duration_seconds INT,
  triggered_by VARCHAR(10) CHECK (triggered_by IN ('sos','opt_in','auto')),
  storage_bucket VARCHAR(100),
  storage_key VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 车牌校验记录表
CREATE TABLE plate_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  expected_plate VARCHAR(10) NOT NULL,
  actual_plate VARCHAR(10),
  matched BOOLEAN,
  user_action VARCHAR(15) CHECK (user_action IN ('boarded','recheck','cancelled')),
  family_notified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_drivers_location ON drivers(current_lat, current_lng);
CREATE INDEX idx_sos_events_order ON sos_events(order_id);
CREATE INDEX idx_payments_order ON payments(order_id);
```

### 11.2 Redis Cache Schema

| Key Pattern | Type | TTL | Description |
|-------------|------|-----|-------------|
| `driver:loc:{driverId}` | Geo | 30s | Driver real-time location |
| `driver:nearby:{lat}:{lng}` | Sorted Set | 60s | Nearby drivers by distance |
| `session:{userId}` | Hash | 24h | User session data |
| `rate_limit:{userId}:{action}` | String | 60s | Rate limiting counter |
| `order:{orderId}:status` | String | 30min | Order status cache |
| `sos:{sosId}:state` | Hash | No expiry | Active SOS state |
| `voice:session:{sessionId}` | Hash | 5min | Voice recognition session |

---
## 12. Error Code Definitions

### 12.1 Error Code Ranges

| Range | Category | Examples |
|-------|----------|----------|
| 1xxx | Authentication & Authorization | Token expired, permission denied |
| 2xxx | User & Profile | User not found, invalid phone |
| 3xxx | Ride & Order | Order not found, invalid status transition |
| 4xxx | Payment | Insufficient balance, payment expired |
| 5xxx | Safety & SOS | SOS already active, recording failed |
| 6xxx | Voice & Recognition | STT timeout, low confidence |
| 7xxx | External Services | SMS gateway down, 95128 unavailable |
| 9xxx | System | Internal error, database unavailable |

### 12.2 Detailed Error Codes

| Code | HTTP | Message (EN) | Message (ZH) | User-Visible |
|------|------|-------------|-------------|-------------|
| 1001 | 401 | Token expired | 登录已过期，请重新登录 | "登录已过期" |
| 1002 | 403 | Permission denied | 权限不足 | 静默(不展示) |
| 2001 | 404 | User not found | 用户不存在 | "请先注册" |
| 2002 | 400 | Invalid phone number | 手机号格式不正确 | "请输入正确的手机号" |
| 3001 | 404 | Order not found | 订单不存在 | "订单不存在" |
| 3002 | 400 | Invalid status transition | 订单状态不允许此操作 | "当前状态不可操作" |
| 3003 | 400 | No driver available | 附近暂无可用车辆 | "附近暂无可用车辆，建议拨打95128" |
| 3004 | 400 | Address not set | 未设置地址 | "请先设置家庭地址" |
| 4001 | 400 | Payment already processed | 订单已支付 | "该订单已支付" |
| 4002 | 400 | Payment link expired | 支付链接已过期 | "支付链接已过期，请重新发送" |
| 4003 | 400 | Cash payment not confirmed | 现金支付未确认 | "等待司机确认收款" |
| 5001 | 400 | SOS already active | 已有进行中的求助 | "已有进行中的求助" |
| 5002 | 400 | No emergency contacts | 未设置紧急联系人 | "建议设置紧急联系人" |
| 5003 | 500 | Recording failed | 录音启动失败 | 静默重试 |
| 6001 | 400 | Voice recognition timeout | 语音识别超时 | "没有听清，请再说一次" |
| 6002 | 400 | Low confidence recognition | 识别置信度低 | "请确认是否是以下地点" |
| 6003 | 400 | Microphone permission denied | 麦克风权限未开启 | "请在设置中开启麦克风" |
| 7001 | 502 | SMS gateway unavailable | 短信服务暂不可用 | "短信发送失败，请稍后重试" |
| 7002 | 502 | 95128 hotline unavailable | 热线服务暂不可用 | "热线繁忙，请稍后重试" |
| 9001 | 500 | Internal server error | 服务器内部错误 | "系统繁忙，请稍后重试" |
| 9002 | 503 | Database unavailable | 数据库不可用 | 静默(自动重试) |

### 12.3 Error Response Envelope

```json
{
  "error": {
    "code": "3003",
    "message": "附近暂无可用车辆",
    "detail": "No driver available within 5km radius",
    "action": "retry | fallback | contact_support",
    "fallbackUrl": "tel:95128",
    "retryAfter": 30
  }
}
```

---
## 13. Testing Strategy

### 13.1 Test Pyramid

```
        ┌─────────┐
        │  E2E    │  10% — Critical user journeys (SOS, booking, payment)
        │   Tests │
       ┌─┴─────────┴─┐
       │ Integration │  30% — Service interactions, API contracts, DB
       │    Tests    │
      ┌─┴─────────────┴─┐
      │   Unit Tests     │  60% — Components, hooks, services, utils
      │                  │
      └──────────────────┘
```

### 13.2 Unit Test Coverage Targets

| Layer | Target | Key Areas |
|-------|--------|-----------|
| Components | 90% | ElderlyButton, ElderlyModal, OneTapCard, SOSButton, LargeText |
| Hooks | 85% | useElderlyTheme, useVoiceInput, useFontScale |
| Services | 90% | VoiceService, RideService, SafetyService, PaymentService |
| Utils | 95% | parseVoiceIntent, formatCurrency, maskPhoneNumber, validatePlate |
| Theme | 100% | ElderlyThemeProvider, font scaling, contrast calculation |

### 13.3 Critical Test Scenarios

**Safety-Critical (must pass before any release)**:
1. SOS button triggers after exactly 3-second hold → 110/120 dialed, location broadcast, family notified
2. SOS button release before 3 seconds → SOS cancelled, no emergency services contacted
3. Plate mismatch → warning modal shown, family notified, ride NOT started
4. Plate match → ride starts normally
5. Payment link expires after 24 hours → cannot be used

**Accessibility-Critical**:
1. All interactive elements have `accessibilityLabel` and `accessibilityRole`
2. Font scale at 2.0x does not truncate or overflow any text
3. Touch targets are ≥ 48dp on all screens at all font scales
4. Color contrast passes WCAG AA at all font scales

**Integration-Critical**:
1. Voice → Intent → Ride creation → Driver assignment → Status update → Payment
2. QR scan → Station resolve → Ride creation with station coordinates
3. Family payment link → SMS received → Payment confirmed → Status updated

### 13.4 Usability Testing Protocol

| Round | Participants | Tasks | Success Criteria | Iteration Goal |
|-------|-------------|-------|-----------------|----------------|
| R1 | 10 seniors (60-78) | 10 core tasks | Completion ≥ 70% | Baseline + identify top 3 pain points |
| R2 | 10 seniors (60-78) | 10 core tasks | Completion ≥ 85% | Verify improvements from R1 |
| R3 | 10 seniors (60-78) | 10 core tasks | Completion ≥ 90%, Satisfaction ≥ 4.5/5 | Final validation |

---
## 14. Performance SLAs

| Metric | Target | Measurement | Alert Threshold |
|--------|--------|-------------|-----------------|
| App cold start | < 2s | Firebase Performance | > 3s |
| Voice recognition (STT) | < 3s end-to-end | Custom metric | > 5s |
| Ride matching (normal) | < 10s p95 | Server-side | > 30s |
| Ride matching (hospital) | < 5s p95 | Server-side | > 15s |
| SOS dispatch | < 2s from trigger | Server-side | > 5s |
| Payment confirmation | < 3s | Payment gateway | > 10s |
| Location update frequency | 5s interval | Driver GPS | > 15s gap |
| API response time | < 200ms p95 | API Gateway | > 500ms |
| Screen render time | < 16ms (60fps) | React Profiler | > 32ms |
| Memory usage | < 150MB (foreground) | OS monitor | > 250MB |
| Crash-free rate | > 99.5% | Crashlytics | < 99% |

---
## 15. Security Design

### 15.1 Data Classification

| Data Type | Classification | Storage | Transmission | Retention |
|-----------|---------------|---------|-------------|-----------|
| Phone number | PII | Encrypted (AES-256) | TLS 1.3 | Until account deletion |
| Home address | PII | Encrypted | TLS 1.3 | Until account deletion |
| Real-time location | Sensitive | Redis (30s TTL) | TLS 1.3 | Not persisted (stream only) |
| Trip recordings | Sensitive | S3 (encrypted at rest) | TLS 1.3 | 30 days (SOS: 90 days) |
| Payment data | PCI | Tokenized (no raw card) | TLS 1.3 | 90 days |
| SOS event data | Critical | Encrypted + audit log | TLS 1.3 | 1 year |

### 15.2 Security Controls

| Control | Implementation |
|---------|---------------|
| Authentication | Phone OTP (SMS verification code) |
| Session Management | JWT (access 15min + refresh 7d), Redis-backed |
| API Authorization | Role-based (user / driver / family / admin) |
| Rate Limiting | 100 req/min per user; 10 req/min for SOS endpoint |
| Data Encryption | AES-256 at rest; TLS 1.3 in transit |
| Location Privacy | Share only during active trip; family consent required |
| Audit Logging | All SOS events, payment transactions, login attempts |
| Penetration Testing | Quarterly; focus on SOS and payment flows |

---
## 16. User Journey Maps

### 16.1 Persona 1: 张大爷 (Active Senior, 60-70)

| Stage | Action | Touchpoint | Emotion | Pain Point | Opportunity |
|-------|--------|-----------|---------|------------|-------------|
| 需求产生 | 想去医院复查 | 家中 | 焦虑 | 担心叫不到车 | 就医优先派单 |
| 打开APP | 点击APP图标 | 手机桌面 | 略紧张 | 怕点错按钮 | 大字首页，最多3个按钮 |
| 选择入口 | 点击"一键打车回家" | 首页 | 稍安 | 地址记不清 | 预填家庭地址 |
| 确认叫车 | 查看费用，点确认 | 确认弹窗 | 犹豫 | 怕费用太贵 | 大字显示预估费用 |
| 等待接驾 | 看司机位置 | 状态页 | 焦急 | 不知道要等多久 | ETA大字显示 + TTS播报 |
| 车辆到达 | 核对车牌号 | 状态页 | 警惕 | 52%担心上错车 | 车牌校验弹窗 |
| 行程中 | 坐车去医院 | 车内 | 平稳 | — | 亲友实时位置共享 |
| 紧急情况 | 身体不适 | 车内 | 恐惧 | 不知道怎么办 | 长按SOS按钮 |
| 支付 | 选择支付方式 | 支付页 | 困惑 | 不会手机支付 | 现金支付选项 |
| 行程结束 | 查看支付结果 | 结果页 | 放心 | — | 大字确认 + 医院到达通知 |

### 16.2 Persona 2: 李奶奶 (Assisted Senior, 70-80)

| Stage | Action | Touchpoint | Emotion | Pain Point | Opportunity |
|-------|--------|-----------|---------|------------|-------------|
| 需求产生 | 女儿打电话说帮她叫车 | 电话 | 依赖 | 自己不会用APP | 亲友代叫 |
| 扫码叫车 | 去社区暖心车站扫码 | 车站QR码 | 忐忑 | 不知道扫了会发生什么 | 扫码后大字提示"正在为您叫车" |
| 语音输入 | 对着手机说"去女儿家" | 语音界面 | 笨拙 | 方言口音重 | 低置信度候选列表 |
| 确认叫车 | 看屏幕确认 | 确认弹窗 | 不确定 | 看不清字 | 2.0x字体缩放 |
| 等待接驾 | 听语音播报 | 语音反馈 | 稍安 | 屏幕看不懂 | TTS全程播报 |
| 支付 | 选现金支付 | 支付页 | 安心 | 不会用线上支付 | 直接给司机现金 |
| 行程结束 | 女儿确认到达 | 亲友通知 | 放心 | — | 女儿收到到达通知 |

### 16.3 Persona 3: 小王 (Family Helper, 30-50)

| Stage | Action | Touchpoint | Emotion | Pain Point | Opportunity |
|-------|--------|-----------|---------|------------|-------------|
| 收到通知 | 收到父亲行程开始通知 | 短信/微信 | 关注 | 不知道父亲是否安全 | 实时位置链接 |
| 查看行程 | 打开位置链接 | H5页面 | 放心 | 想联系司机 | 一键拨打司机电话 |
| 代付请求 | 收到代付短信 | 短信 | 积极 | 担心链接是诈骗 | 明确显示行程详情 |
| 确认支付 | 查看详情后支付 | 支付页 | 满意 | — | 一键确认支付 |
| 紧急告警 | 收到SOS通知 | 紧急推送 | 极度焦虑 | 不知道父亲情况 | 实时位置+录音+联系客服 |

### 16.4 Persona 4: 王爷爷 (Offline Senior, 70+)

| Stage | Action | Touchpoint | Emotion | Pain Point | Opportunity |
|-------|--------|-----------|---------|------------|-------------|
| 需求产生 | 要去买菜 | 家中 | 茫然 | 没有智能手机 | 用座机拨打95128 |
| 拨打热线 | 拨打95128 | 电话 | 期待 | 怕说不清楚地址 | 客服耐心引导 |
| 等待叫车 | 客服帮忙下单 | 电话 | 等待 | 不知道车什么时候来 | 短信确认通知 |
| 上车 | 核对车牌上车 | 短信 | 安心 | 看不清车牌 | 短信大字显示车牌 |
| 支付 | 支付现金 | 现金 | 习惯 | — | 现金支付 |
| 行程结束 | 到达菜市场 | 目的地 | 满意 | — | — |

---
## 17. Risk Assessment Matrix

### 17.1 Risk Identification

| Risk ID | Risk Description | Category | Likelihood | Impact | Risk Level | Mitigation Strategy |
|---------|-----------------|----------|------------|--------|------------|---------------------|
| R1 | SOS按钮误触发导致虚假报警 | 产品安全 | High | Critical | **Critical** | 长按3秒防误触 + 3分钟内可取消 + 误触发标记日志 |
| R2 | SOS离线场景无法接通110/120 | 技术韧性 | Medium | Critical | **Critical** | 离线缓存SOS + 预载紧急短信 + 网络恢复自动重试 |
| R3 | 语音识别错误导致叫错目的地 | 用户体验 | High | High | **High** | 置信度<0.7展示候选列表 + 确认弹窗 + TTS播报确认 |
| R4 | 车牌校验失败但用户仍上车 | 安全风险 | Medium | Critical | **High** | 不匹配弹窗警告 + 自动通知亲友 + 平台客服介入 |
| R5 | 支付链接被恶意利用(钓鱼) | 安全风险 | Low | Critical | **High** | 支付链接24h过期 + 仅显示行程详情 + 域名白名单 |
| R6 | 位置数据泄露(隐私) | 数据安全 | Medium | High | **High** | 仅行程中共享 + 亲友授权 + TLS加密 + 不持久化原始位置 |
| R7 | 现金支付司机未确认(逃单) | 业务风险 | Medium | Medium | **Medium** | 30分钟超时自动转线上支付 + 司机端催收提醒 |
| R8 | 就医优先派单误判非医院POI | 业务逻辑 | Medium | Medium | **Medium** | 用户可手动关闭就医优先 + POI分类二次校验 |
| R9 | 字体缩放2.0x布局崩溃 | 技术兼容 | Medium | Medium | **Medium** | ScrollView包裹 + 文字自动换行 + 固定高度改为minHeight |
| R10 | 95128热线占线/不可用 | 服务可用性 | Medium | Medium | **Medium** | 提示"热线繁忙，请稍后重试" + 备选APP叫车 |
| R11 | 第三方STT/TTS服务不可用 | 服务依赖 | Medium | High | **High** | 降级为手动输入模式 + 显示"语音服务暂不可用" |
| R12 | 并发SOS事件导致系统过载 | 系统容量 | Low | Critical | **Medium** | SOS独立扩缩容 + 限流(10 req/min) + 消息队列削峰 |

### 17.2 Risk Response Matrix

```
Impact
  ↑
Critical │ R2  R1          │
         │ R4  R5          │
         │                 │
High     │ R3  R11         │
         │ R6              │
         │                 │
Medium   │ R7  R8  R9      │
         │ R10             │
         │                 │
Low      │                 │
         └─────────────────→ Likelihood
         Low    Medium   High
```

### 17.3 Contingency Plans

| Risk ID | Trigger Event | Contingency Action | Owner | Response Time |
|---------|--------------|-------------------|-------|---------------|
| R1 | SOS误触发率 > 10% | 增加倒计时至5秒 + 增加二次确认 | PM | 24h |
| R2 | 离线SOS队列积压 > 5条 | 自动切SMS通道 + 人工电话确认 | On-call | 5min |
| R3 | 语音识别错误率 > 15% | 强制展示候选列表(不管置信度) | PM | 1 sprint |
| R4 | 车牌不匹配投诉 > 3起/月 | 强制车牌校验(不可跳过) | PM | 1 sprint |
| R5 | 支付链接被举报 | 立即下线代付链接 + 强制短信验证码 | Security | 1h |
| R6 | 位置数据泄露事件 | 立即停止位置共享 + 通知用户 + 安全审计 | Security | 30min |
| R11 | STT服务中断 > 30min | 全站切换手动输入模式 + 推送通知 | DevOps | 10min |

---
## 18. Monitoring & Alerting Strategy

### 18.1 Key Metrics Dashboard

| Category | Metric | Target | Warning Threshold | Critical Threshold |
|----------|--------|--------|-------------------|-------------------|
| **Availability** | API uptime | 99.9% | < 99.5% | < 99.0% |
| **Availability** | SOS endpoint uptime | 99.99% | < 99.9% | < 99.5% |
| **Performance** | Ride matching p95 | < 10s | > 20s | > 30s |
| **Performance** | SOS dispatch latency | < 2s | > 3s | > 5s |
| **Performance** | Voice recognition p95 | < 3s | > 5s | > 8s |
| **Performance** | Payment confirmation p95 | < 3s | > 5s | > 10s |
| **Business** | Order completion rate | > 90% | < 85% | < 80% |
| **Business** | SOS false alarm rate | < 5% | > 10% | > 20% |
| **Business** | Payment success rate | > 98% | < 95% | < 90% |
| **Business** | Voice recognition success rate | > 90% | < 80% | < 70% |
| **Error** | API error rate (5xx) | < 0.1% | > 0.5% | > 1% |
| **Error** | Crash-free rate | > 99.5% | < 99.0% | < 98.5% |
| **Resource** | DB connection pool usage | < 70% | > 80% | > 90% |
| **Resource** | Redis memory usage | < 70% | > 80% | > 90% |
| **Resource** | S3 storage growth rate | < 10GB/day | > 20GB/day | > 50GB/day |

### 18.2 Alert Routing

| Severity | Alert Examples | Channel | Response SLA |
|----------|---------------|---------|-------------|
| **P0 - Critical** | SOS endpoint down, DB unavailable, 110/120 integration failure | Phone + SMS + PagerDuty | 5 min |
| **P1 - High** | Ride matching > 30s p95, Payment gateway down, STT/TTS service down | Phone + Slack | 15 min |
| **P2 - Medium** | Voice recognition error rate > 10%, Crash rate > 1%, Order completion < 85% | Slack + Email | 1 hour |
| **P3 - Low** | Font scale rendering issue, Minor UI bugs, Cache miss rate increase | Email | Next business day |

### 18.3 Health Check Endpoints

| Endpoint | Checks | Interval |
|----------|--------|----------|
| `GET /health` | API server alive, basic DB connectivity | 10s (load balancer) |
| `GET /health/ready` | DB writable, Redis reachable, S3 accessible, Payment GW reachable, STT service reachable | 30s (K8s readiness probe) |
| `GET /health/sos` | SOS dispatch pipeline (mock 110/120 test), SMS gateway reachable, Recording storage writable | 60s (dedicated monitoring) |

### 18.4 Logging Standards

| Log Level | Usage | Retention |
|-----------|-------|-----------|
| **ERROR** | SOS dispatch failure, payment failure, DB connection loss, 110/120 dial failure | 90 days |
| **WARN** | Rate limit hit, retry exhausted, degraded mode active, voice low confidence | 30 days |
| **INFO** | Order created/completed, payment confirmed, SOS triggered/resolved, user login | 30 days |
| **DEBUG** | API request/response (sanitized), cache hit/miss, feature flag evaluation | 7 days |

### 18.5 Dashboard Panels

```
┌─────────────────────────────────────────────────────────────┐
│  Real-Time Operations Dashboard                              │
├──────────────────┬──────────────────┬────────────────────────┤
│  Active Orders   │  Active SOS      │  Payment Success Rate   │
│  ┌────────────┐  │  ┌────────────┐  │  ┌────────────────┐    │
│  │    127     │  │  │     0      │  │  │    98.5%       │    │
│  └────────────┘  │  └────────────┘  │  └────────────────┘    │
├──────────────────┼──────────────────┼────────────────────────┤
│  Ride Matching   │  Voice Recog.    │  Crash-Free Rate        │
│  p95: 8.2s       │  p95: 2.1s       │  99.7%                  │
├──────────────────┴──────────────────┴────────────────────────┤
│  API Response Time (p95)         │  Error Rate (5xx)          │
│  ████████████░░░░ 180ms          │  ██░░░░░░░░░░░░ 0.08%      │
├──────────────────────────────────────────────────────────────┤
│  Recent Alerts (Last 24h)                                     │
│  [P2] 14:32 Voice recognition error rate: 12.3% (threshold: 10%) │
│  [P3] 09:15 Cache miss rate increased to 35%                  │
└──────────────────────────────────────────────────────────────┘
```

---
## 19. Open Questions & Next Steps

1. **Backend integration**: Which ride platform API to integrate with (Didi, Amap, or mock)?
2. **95128 hotline**: Is real operator integration needed, or simulate with voice bot?
3. **Medical priority dispatch**: How to define hospital POI and priority weight?
4. **Emergency SOS**: Direct 110/120 dial vs. platform-mediated emergency service?
5. **Cash payment**: Driver-side confirmation UI design and reconciliation flow.
6. **Phased rollout**: MVP scope (Modules 1-5) vs. full launch (all 10 modules)?
7. **Compliance**: GDPR/data privacy regulations for location and recording data?
8. **Accessibility certification**: Target WCAG 2.2 AA compliance audit timeline?

---
## 20. UI Screen Specifications

### 20.1 Home Screen (首页)

```
┌──────────────────────────────────┐
│  ☰ 您好，张大爷！         ☀️ 26°C │  ← 顶部栏(问候+天气)
├──────────────────────────────────┤
│                                  │
│  ┌────────────────────────────┐  │
│  │  🏠  一键打车回家          │  │  ← 主操作卡片(56dp高)
│  │      幸福小区3号楼         │  │     预填地址显示
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │  🎤  语音叫车              │  │  ← 语音入口卡片
│  │      说出您想去的地方       │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │  📍  最近去过：人民医院     │  │  ← 最近目的地(可选)
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │  📞  拨打95128叫车         │  │  ← 热线入口(离线用户)
│  └────────────────────────────┘  │
│                                  │
├──────────────────────────────────┤
│  🏠 首页  📋 行程  📞 求助  ⚙️ 设置 │  ← 底部导航(4项)
└──────────────────────────────────┘
```

**Key Design Rules**:
- Max 3 primary action cards visible above fold
- All touch targets ≥ 56×56dp
- Body text 20sp, headings 28sp (default scale)
- High contrast: text #1A1A1A on #FFFFFF background
- Button: #1565C0 (primary blue), #E53935 (danger red)

### 20.2 Voice Booking Screen (语音叫车)

```
┌──────────────────────────────────┐
│  ← 返回    语音叫车              │
├──────────────────────────────────┤
│                                  │
│         🎤                      │
│     "正在听..."                  │  ← 录音状态(脉冲动画)
│    ┌──────────────┐             │
│    │ 我要去人民    │             │  ← 实时转录(28sp)
│    │ 医院          │             │
│    └──────────────┘             │
│                                  │
│  ┌────────────────────────────┐  │
│  │  确认目的地：人民医院       │  │  ← 确认弹窗(高置信度)
│  │  预估费用：¥25.00          │  │
│  │  ┌──────────┐ ┌──────────┐│  │
│  │  │ 确认叫车  │ │ 重新说   ││  │  ← 双按钮(56dp高)
│  │  └──────────┘ └──────────┘│  │
│  └────────────────────────────┘  │
│                                  │
│  不方便说话？手动输入 →          │  ← 手动降级入口
└──────────────────────────────────┘
```

**Low Confidence Variant**:
```
│  ┌────────────────────────────┐  │
│  │  请选择您要去的地方：       │  │  ← 候选列表(置信度<0.7)
│  │  ┌────────────────────┐   │  │
│  │  │ 人民医院 (90%)     │   │  │  ← 置信度标注
│  │  └────────────────────┘   │  │
│  │  ┌────────────────────┐   │  │
│  │  │ 人民公园 (60%)     │   │  │
│  │  └────────────────────┘   │  │
│  │  ┌────────────────────┐   │  │
│  │  │ 仁和医院 (40%)     │   │  │
│  │  └────────────────────┘   │  │
│  └────────────────────────────┘  │
```

### 20.3 Ride Status Screen (行程状态)

```
┌──────────────────────────────────┐
│  行程中                          │
├──────────────────────────────────┤
│  ┌────────────────────────────┐  │
│  │  司机：王师傅              │  │
│  │  车牌：京A·12345           │  │  ← 大字车牌(32sp)
│  │  车型：白色丰田卡罗拉       │  │
│  │  ┌────────────────────┐   │  │
│  │  │  ☎️ 联系司机        │   │  │  ← 一键拨打
│  │  └────────────────────┘   │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │        📍 实时地图          │  │  ← 司机位置+路线
│  │     (MapView Component)    │  │
│  │  预计到达: 5分钟            │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │  🔒 行程安全守护已开启      │  │  ← 安全状态指示
│  │  已通知 2 位亲友            │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │       🆘 紧急求助          │  │  ← SOS按钮(红色,72dp)
│  │       长按3秒触发          │  │     底部固定
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

### 20.4 SOS Emergency Screen (紧急求助)

```
┌──────────────────────────────────┐
│  ⚠️ 紧急求助                     │
├──────────────────────────────────┤
│                                  │
│         🆘                      │
│    正在为您呼叫帮助...           │  ← 大字确认(32sp)
│                                  │
│  ┌────────────────────────────┐  │
│  │  ✅ 已拨打110/120          │  │
│  │  ✅ 已通知紧急联系人        │  │
│  │  ✅ 已共享实时位置          │  │
│  │  ✅ 已启动行程录音          │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │  紧急联系人：女儿小王       │  │
│  │  📞 138****5678            │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌──────────┐ ┌──────────────┐  │
│  │ 拨打110  │ │ 确认安全     │  │  ← 误触取消
│  └──────────┘ └──────────────┘  │
└──────────────────────────────────┘
```

### 20.5 Payment Selection Screen (支付选择)

```
┌──────────────────────────────────┐
│  支付方式                        │
├──────────────────────────────────┤
│  ┌────────────────────────────┐  │
│  │  行程详情：                 │  │
│  │  幸福小区 → 人民医院        │  │
│  │  行程时长：15分钟           │  │
│  │  费用：¥25.00              │  │  ← 费用大字(36sp)
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │  💳  自己支付 (微信/支付宝) │  │  ← 线上支付
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │  💵  现金支付              │  │  ← 现金支付
│  │      请向司机支付现金       │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │  👨‍👩‍👧  亲友代付              │  │  ← 亲友代付
│  │      发送支付链接给家人      │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

### 20.6 Settings Screen (设置)

```
┌──────────────────────────────────┐
│  ← 返回    设置                  │
├──────────────────────────────────┤
│  字体大小                        │
│  ┌────────────────────────────┐  │
│  │  A  ──●──────────  A      │  │  ← 字体缩放滑块
│  │  小           大            │  │     实时预览
│  └────────────────────────────┘  │
│  预览：                          │
│  ┌────────────────────────────┐  │
│  │  这是标题文字              │  │  ← 实时预览区
│  │  这是正文文字，用于预览     │  │
│  │  字体大小效果              │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │  ☐ 高对比度模式            │  │  ← 开关
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │  ☐ 减少动画效果            │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │  家庭地址：幸福小区3号楼    │  │  ← 可编辑
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │  紧急联系人：2人           │  │  ← 可管理
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │  📋 查看历史行程            │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │  📖 使用帮助               │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

### 20.7 Family Tracking H5 Page (亲友追踪H5)

```
┌──────────────────────────────────┐
│  父亲的行程                       │
├──────────────────────────────────┤
│  ┌────────────────────────────┐  │
│  │        📍 实时地图          │  │
│  │     (父亲位置+路线)         │  │
│  │  预计到达: 8分钟            │  │
│  └────────────────────────────┘  │
│                                  │
│  司机：李师傅                    │
│  车牌：京B·67890                 │
│  ┌────────────────────────────┐  │
│  │  ☎️ 拨打司机电话           │  │
│  └────────────────────────────┘  │
│                                  │
│  起点：幸福小区                  │
│  终点：人民医院                  │
│  已行驶：12分钟                  │
│                                  │
│  ┌────────────────────────────┐  │
│  │  ⚠️ 如遇紧急情况           │  │
│  │  请拨打110/120             │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

### 20.8 Onboarding Flow (首次引导)

```
Step 1: Welcome          Step 2: Font Size       Step 3: Home Address
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│                  │  │                  │  │                  │
│  欢迎使用         │  │  调整字体大小     │  │  设置家庭地址     │
│  适老化打车       │  │                  │  │                  │
│                  │  │  A ──●──── A    │  │  ┌────────────┐  │
│  🚕              │  │                  │  │  │ 输入地址   │  │
│                  │  │  预览文字效果     │  │  └────────────┘  │
│  "让出行更简单"   │  │                  │  │                  │
│                  │  │                  │  │  或使用语音输入   │
│                  │  │                  │  │  🎤              │
│  ┌────────────┐  │  │  ┌────────────┐  │  │                  │
│  │  开始使用   │  │  │  │  下一步    │  │  │  ┌────────────┐  │
│  └────────────┘  │  │  └────────────┘  │  │  │  完成设置   │  │
│                  │  │                  │  │  └────────────┘  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

**Onboarding Rules**:
- Max 3 steps (Welcome → Font Size → Home Address)
- Skip allowed on all steps
- Font size slider with live preview
- Home address supports voice input
- Each step has exactly one primary CTA
- Progress indicator: "1/3" dots at top

---
## 21. Compliance & Regulatory

### 21.1 Applicable Regulations

| Regulation | Scope | Requirements | Our Compliance |
|------------|-------|--------------|----------------|
| **《个人信息保护法》(PIPL)** | 中国 | 用户数据收集需明确告知+同意; 敏感信息(位置/录音)需单独同意 | 首次使用弹窗告知 + 位置/录音权限单独授权 |
| **《数据安全法》(DSL)** | 中国 | 数据分类分级保护; 重要数据境内存储 | 位置数据仅行程中共享; 录音存储30天自动删除 |
| **《网络安全法》** | 中国 | 实名认证; 日志留存6个月 | 手机号验证码登录; 操作日志保留180天 |
| **《互联网适老化及无障碍标准》** | 中国 | 字体≥18sp; 触控≥48dp; 语音辅助 | 默认20sp; 触控56dp; 全程TTS支持 |
| **WCAG 2.2 Level AA** | 国际 | 对比度≥4.5:1; 键盘可操作; 屏幕阅读器兼容 | 对比度≥7:1; 所有功能可触控; accessibilityLabel全量 |
| **GDPR (if EU users)** | 欧盟 | 数据可携带; 被遗忘权; DPO任命 | 预留数据导出API; 账号删除接口; 数据保护影响评估 |

### 21.2 Consent Management

| Data Type | Consent Required | Consent Method | Withdrawal |
|-----------|-----------------|----------------|------------|
| Phone number | 登录时 | OTP验证码(隐含同意) | 注销账号 |
| Home address | 设置时 | 大字弹窗 + "保存"按钮 | 编辑/清空 |
| Real-time location | 行程中 | 首次使用弹窗(系统权限) | 系统设置关闭 |
| Trip recording | SOS触发/手动开启 | 开始前弹窗确认 | 行程结束后停止 |
| Family contact | 设置时 | 手动添加(隐含同意) | 删除联系人 |
| Location sharing | 行程中 | 首次弹窗确认 + 亲友端授权 | 关闭分享开关 |

### 21.3 Data Retention & Deletion Policy

| Data Type | Retention Period | Deletion Trigger | Deletion Method |
|-----------|-----------------|-----------------|-----------------|
| User profile | Until account deletion | 用户注销 | 硬删除(30天缓冲期) |
| Order history | 1 year | 年限到期 | 自动归档→90天后删除 |
| Payment records | 90 days | 年限到期 | 自动删除 |
| Trip recordings | 30 days (SOS: 90 days) | 年限到期 | 自动删除S3文件 |
| Location history | Not persisted | 行程结束 | 实时清除(仅Redis TTL) |
| SOS events | 1 year | 年限到期 | 归档→审计保留3年 |
| Audit logs | 180 days | 年限到期 | 自动归档→1年后删除 |

### 21.4 Accessibility Compliance Checklist

| WCAG 2.2 Criterion | Level | Requirement | Implementation |
|--------------------|-------|-------------|----------------|
| 1.4.3 Contrast (Minimum) | AA | 4.5:1 for text | 7:1 minimum (high contrast mode) |
| 1.4.4 Resize Text | AA | 200% without loss | 1.0-2.0x font scale, ScrollView wrapper |
| 1.4.11 Non-Text Contrast | AA | 3:1 for UI components | Button borders, icon contrast verified |
| 2.5.5 Target Size | AAA | 44×44px minimum | 56×56dp all interactive elements |
| 2.5.8 Target Spacing | AA | 24px between targets | 16dp minimum spacing |
| 3.3.2 Labels or Instructions | A | Clear labels for all inputs | Large-text labels + placeholder hints |
| 3.3.4 Error Prevention | AA | Confirmation for critical actions | Modal confirmation for booking/SOS/payment |
| 4.1.3 Status Messages | AA | Status announced without focus | TTS auto-announce all status changes |

---
## 22. Disaster Recovery & Business Continuity

### 22.1 Recovery Objectives

| Metric | Target | Rationale |
|--------|--------|-----------|
| **RPO (Recovery Point Objective)** | < 5 minutes | Max data loss: 5 min of ride data |
| **RTO (Recovery Time Objective)** | < 15 minutes | Full service restoration |
| **SOS RTO** | < 2 minutes | SOS service is life-critical |
| **Payment RTO** | < 10 minutes | Payment can be retried |

### 22.2 Failure Scenarios & Recovery

| Scenario | Impact | Detection | Recovery | RTO |
|----------|--------|-----------|----------|-----|
| **Primary DB failure** | All services read-only | Health check / DB connection timeout | Auto-failover to read replica → promote to primary | 5 min |
| **Redis cluster failure** | Location cache, session, rate limit lost | Connection refused / timeout | Sentinel auto-failover; sessions re-authenticate | 3 min |
| **API Gateway failure** | All external requests blocked | Load balancer health check | K8s auto-restart pod; secondary gateway standby | 2 min |
| **SOS Service failure** | Emergency dispatch blocked | Dedicated health check every 60s | Auto-restart + SMS fallback channel | 1 min |
| **Payment Gateway failure** | Payments cannot process | Payment timeout / error rate spike | Queue payments; retry on recovery; cash fallback | 10 min |
| **STT/TTS Service failure** | Voice features unavailable | Timeout / error rate > 10% | All screens switch to manual input mode | 30 sec |
| **S3/Object Storage failure** | Recordings cannot be stored | Write error | Buffer to local disk; upload on recovery | 5 min |
| **Full region outage** | All services unavailable | All health checks fail | Cross-region failover (DNS switch) | 15 min |

### 22.3 Backup Strategy

| Data Store | Backup Type | Frequency | Retention |
|------------|------------|-----------|-----------|
| PostgreSQL (Primary) | Continuous WAL archiving + daily full | Real-time + Daily 02:00 | 30 days |
| PostgreSQL (SOS DB) | Continuous WAL + hourly full | Real-time + Hourly | 90 days |
| Redis | RDB snapshot | Every 15 minutes | 24 hours |
| S3 Recordings | Cross-region replication | Real-time | 30 days (SOS: 90 days) |
| Configuration (K8s) | GitOps (Infrastructure as Code) | On every change | Permanent |

### 22.4 Business Continuity Playbook

```
┌─────────────────────────────────────────────────────┐
│  Incident Severity Levels                             │
├──────────┬──────────────────────────────────────────┤
│  L1      │  SOS service degraded → SMS fallback      │
│  L2      │  Payment service down → Queue + retry     │
│  L3      │  Single service down → Auto-restart       │
│  L4      │  Region outage → Cross-region failover     │
├──────────┴──────────────────────────────────────────┤
│  Escalation Path:                                     │
│  L1/L2: On-call engineer → 5 min → Team lead         │
│  L3:    On-call engineer → 15 min → DevOps manager    │
│  L4:    All hands → CTO notified immediately          │
└─────────────────────────────────────────────────────┘
```

---
## 23. API Versioning Strategy

### 23.1 Versioning Scheme

```
URL Path: /api/v{major}/...

Example:
  /api/v1/rides           → Current stable
  /api/v2/rides           → Next major (breaking changes)
  /api/v1/rides?preview=v2 → Preview next version behavior
```

### 23.2 Version Lifecycle

| Phase | Duration | Status | Support |
|-------|----------|--------|---------|
| **Preview** | 2 weeks | Beta | Opt-in via header `X-API-Preview: v2` |
| **Active** | Indefinite | Current | Full support |
| **Deprecated** | 3 months | Warning | `Deprecation` header + email notification |
| **Sunset** | — | Removed | 410 Gone response |

### 23.3 Breaking Change Policy

| Change Type | Version Bump | Example |
|-------------|-------------|---------|
| New endpoint | Minor (no bump) | `POST /api/v1/rides/bulk` |
| New optional field | Minor (no bump) | Adding `notes` field to response |
| New required field | **Major (v1→v2)** | `priorityType` becomes required |
| Field removed | **Major (v1→v2)** | Removing `legacyField` |
| Field type changed | **Major (v1→v2)** | `amount` from string to number |
| Endpoint removed | **Major (v1→v2)** | Removing deprecated endpoint |
| Auth method changed | **Major (v1→v2)** | JWT → OAuth2 |

### 23.4 Client Compatibility

```typescript
// ApiClient supports version negotiation
class ApiClient {
  private baseUrl = '/api/v1';    // Default to latest stable
  private previewVersion?: string; // Opt-in preview

  async request<T>(url: string, options: RequestInit): Promise<T> {
    const headers: HeadersInit = {
      ...options.headers,
      'X-Client-Version': APP_VERSION,
      'X-Min-API-Version': '1.0',
    };
    if (this.previewVersion) {
      headers['X-API-Preview'] = this.previewVersion;
    }
    // ... handle Deprecation header, version mismatch errors
  }
}
```
