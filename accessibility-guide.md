# Accessibility & Elderly-Friendly Design Guide

Research-driven design principles for building React Native applications targeting users aged 60+.
Based on usability research with 200+ elderly participants, 3 rounds of iterative testing, and competitive benchmarking against Didi Elderly Mode (滴滴长辈版), Amap Assisted Ride (高德助老打车), and 95128 hotline.

---

## 1. User Research Methodology

### Mixed-Method Approach: Survey + Deep Interview

**Phase 1: Quantitative Survey (N ≥ 200)**

Design a structured questionnaire covering:
- Device usage patterns (screen size, OS, daily usage hours)
- Pain point frequency rating (1–5 Likert scale)
- Feature priority ranking
- Current app abandonment reasons

Key survey questions for elderly taxi users:
1. How often do you use ride-hailing apps? (Never / Rarely / Sometimes / Often)
2. What stops you from using them? (Too complex / Text too small / Fear of wrong operation / Payment difficulty / Other)
3. Which input method do you prefer? (Typing / Voice / Selecting from list / Asking someone else)
4. How large should buttons be? (Show 3 sizes, let them choose)

**Phase 2: Qualitative Deep Interviews (N = 15–20)**

Semi-structured interviews to uncover emotional and contextual factors:
- "Tell me about the last time you tried to book a ride"
- "What were you feeling when you saw that screen?"
- "If you could change one thing about this app, what would it be?"

### User Persona Template

```markdown
## Persona: [Name], [Age]

**Tech comfort level**: Low / Medium / High
**Primary device**: [Model, screen size]
**Vision status**: Normal / Mild presbyopia / Strong presbyopia / Glasses
**Key quote**: "[Direct quote expressing core frustration or need]"

**Goals**:
- [Primary goal — what they want to accomplish]
- [Secondary goal]

**Frustrations**:
- [Frustration 1 — mapped to design requirement]
- [Frustration 2]

**Design implications**:
- [Frustration 1] → [Specific design response]
- [Frustration 2] → [Specific design response]
```

### Pain Point → Requirement Mapping

| Emotional Pain Point         | Translated Requirement                              | Priority |
|------------------------------|-----------------------------------------------------|----------|
| "操作太复杂了"                | Reduce decision nodes; max 3 taps per task          | P0       |
| "字太小看不清"                | Body text ≥ 18sp; in-app font size toggle           | P0       |
| "怕按错了"                    | Large touch targets ≥ 48dp; confirm before execute  | P0       |
| "不知道怎么说话叫车"          | Voice-first UI; prominent mic button with prompt    | P1       |
| "付钱太麻烦"                  | Family payment delegation; one-tap pay              | P1       |
| "不知道车在哪"                | Real-time status with large text, voice announce    | P1       |
| "界面跳太快跟不上"            | Transitions ≤ 300ms; no auto-dismiss toasts         | P2       |

**New & Stubborn Pain Points (from Competitive Benchmarking)**

| Pain Point                    | Evidence %       | Emotional Driver                        | Translated Requirement                              | Priority |
|-------------------------------|------------------|-----------------------------------------|-----------------------------------------------------|----------|
| P1 怕上错车                    | 52%              | Fear, avoidance                         | 车牌号校验 before boarding                          | P0       |
| P2 行程安全焦虑                | 52%              | Fear (71岁老人独乘出租车去世案例)        | 亲友实时位置 + SOS + 行程录音                       | P0       |
| P3 只能用现金                  | 20%              | Exclusion                               | 现金支付 + 司机端确认                               | P1       |
| P4 就医打车难                  | —                | Anxiety (滴滴已验证20.2万次就医派单)     | 医院目的地优先派单                                  | P1       |
| P5 不会用智能手机              | 34%              | Exclusion                               | QR车站扫码 + 95128热线入口                          | P1       |
| P6 等太久没人接                | —                | Frustration, abandonment                | 3分钟无单自动扩范围 + TTS播报                       | P1       |
| P7 语音识别歧义                | —                | Confusion                               | 低置信度候选列表 + 保存地址别名                     | P2       |

---

## 2. User Journey Map Template

```
Stage           | User Action              | Touchpoint           | Emotion    | Opportunity
----------------|--------------------------|----------------------|------------|------------------
Awareness       | Needs to go somewhere    | Physical context     | Neutral    | —
Decision (APP)  | Opens app, 语音/一键打车  | Home screen          | Anxious    | Simplify entry, voice-first
Decision (QR)   | Scans QR at station      | QR车站扫码           | Anxious    | One-scan booking, no app needed
Decision (Hotline) | Calls 95128          | 95128热线            | Anxious    | Operator-assisted booking
Input           | Enters destination       | Search/Voice input   | Frustrated | Voice-first, saved-address alias
Confirmation    | Reviews fare & route     | Confirm modal        | Uncertain  | Large, clear summary
Waiting         | Waits for driver         | Status screen        | Impatient  | Voice updates, ETA, 3-min auto-expand
Safety Guard    | Verifies car before boarding | Plate check + family share | Cautious | 车牌号校验 + 亲友实时位置共享
Arrival         | Identifies car           | Physical + app       | Relieved   | Large plate number
In-Trip         | Riding to destination    | In-car               | Varies     | Trip recording
Emergency (branch) | Triggers SOS         | SOS button           | Fear       | 110/120 + 位置共享 + 行程录音
Payment         | Pays for trip            | Payment screen       | Confused   | Family delegation, cash + driver confirm
Post-Trip Care  | Trip ends, follow-up     | Receipt + notification | Relieved  | 医院到达通知 + 行程记录
```

Map emotions to design responses at each stage.

---

## 3. Visual Design Specifications

### Typography

| Element        | Size (Normal Mode) | Size (Large Mode) | Weight  | Color   |
|----------------|--------------------|--------------------|---------|---------|
| Page heading   | 28sp               | 36sp               | 700     | #1A1A1A |
| Section heading| 24sp               | 30sp               | 600     | #1A1A1A |
| Body text      | 18sp               | 24sp               | 400     | #1A1A1A |
| Caption        | 14sp               | 18sp               | 400     | #666666 |
| Error text     | 16sp               | 20sp               | 500     | #D32F2F |
| Button text    | 20sp               | 26sp               | 600     | #FFFFFF |

Font family: System default (iOS: SF Pro; Android: Roboto/Noto Sans CJK)

### Color Palette

```
Primary:         #1565C0  (WCAG AA on white: 5.74:1 ✓)
Primary Dark:    #0D47A1  (WCAG AA on white: 8.56:1 ✓)
Success:         #2E7D32  (WCAG AA on white: 5.87:1 ✓)
Warning:         #F57C00  (use with dark text only)
Error:           #D32F2F  (WCAG AA on white: 5.57:1 ✓)
Background:      #FAFAFA
Surface:         #FFFFFF
Text Primary:    #1A1A1A  (on white: 16.75:1 ✓)
Text Secondary:  #666666  (on white: 5.74:1 ✓)
Disabled:        #BDBDBD
```

Always verify contrast with: `node scripts/check-a11y.js`

### Spacing & Layout

```
Base unit:       8dp
Screen padding:  24dp (large mode) / 16dp (normal)
Card padding:    24dp
Button gap:      16dp minimum (12dp absolute minimum)
Section gap:     32dp
```

### Touch Targets

| Element        | Minimum Size | Recommended | Notes                              |
|----------------|--------------|-------------|------------------------------------|
| Primary button | 48×56dp      | Full width  | Use `minHeight: 56`                |
| Icon button    | 48×48dp      | 56×56dp     | Add `hitSlop: {8,8,8,8}`          |
| Card tap       | Full card    | —           | Entire card is tappable            |
| List item      | 48dp height  | 64dp        | Include padding for finger comfort |
| Back button    | 48×48dp      | 56×56dp     | Must always be visible             |

---

## 4. Interaction Design Principles

### Reduce Decision Nodes

- **Maximum 3 visible actions per screen** — hide secondary actions behind a "更多" button
- **Pre-fill whenever possible** — home address, recent destinations, current location
- **Default to the safest option** — if unsure, default to "home" or "last used"

### Confirm Before Execute

Every irreversible action needs a clear confirmation modal:
- Title: What is about to happen (e.g., "确认叫车？")
- Body: Key details in large text (fare, destination)
- Two buttons: Primary (confirm) + Secondary (cancel)
- Never auto-dismiss — user must actively choose

### Error Recovery

- Every error screen has a visible, labeled recovery button
- Error messages must state: What went wrong + What to do
- Bad: "Error 404" → Good: "找不到地址，请重新输入或语音告诉我们要去哪里"
- Always provide a "返回首页" escape hatch

### Voice Feedback

After every major action, provide TTS feedback:
- Booking confirmed: "正在为您叫车，司机正在赶来"
- Driver assigned: "李师傅正在赶来，预计5分钟到达"
- Car arrived: "司机已到达，车牌号京A12345"

---

## 5. Usability Testing Protocol

### Test Setup

- **Participants**: 10 target users (age 60+, mixed tech comfort)
- **Environment**: Quiet room, user's own device preferred
- **Tasks**: 10 core tasks, ordered by complexity

### Core Task List

| Task ID | Task Description            | Success Criteria                    |
|---------|-----------------------------|-------------------------------------|
| T1      | 一键打车回家                | Ride booked to home in ≤ 2 taps     |
| T2      | 语音叫车去指定地点           | Destination set via voice, confirmed |
| T3      | 查看司机位置                | User locates status screen           |
| T4      | 修改字体大小                | Font size changed and saved          |
| T5      | 使用亲友代付                | Payment link sent to contact         |
| T6      | 扫码叫车 (QR station booking) | Ride booked via QR station scan     |
| T7      | 95128热线叫车 (hotline booking) | Ride booked via 95128 hotline    |
| T8      | 车牌号校验 (plate verification) | Plate verified before boarding     |
| T9      | 紧急求助SOS (SOS trigger)  | SOS triggers 110/120 + location share |
| T10     | 现金支付 (cash payment)    | Cash payment confirmed by driver     |

### Data Collection

For each task, record:
1. **Completion**: Success / Success with help / Failure
2. **Time**: Seconds from task start to completion
3. **Errors**: Number of wrong taps, back navigation, or re-inputs
4. **Assistance**: Did the user ask for help? (Yes/No)
5. **Satisfaction**: 1–5 Likert scale after each task

### Three-Dimensional Evaluation Model

```
Score = w1 × CompletionRate + w2 × TimeScore + w3 × SatisfactionScore

Where:
  CompletionRate = (completed tasks / total tasks) × 100
  TimeScore = max(0, 100 - (avgTimeSeconds - targetSeconds) * penalty)
  SatisfactionScore = (avgLikert / 5) × 100

Weights (recommended):
  w1 = 0.4  (completion matters most for elderly users)
  w2 = 0.3  (speed indicates cognitive load)
  w3 = 0.3  (subjective comfort)
```

### Iteration Protocol

Run 3 rounds minimum:
- **Round 1**: Baseline measurement — identify top 3 pain points
- **Round 2**: After addressing pain points — verify improvements
- **Round 3**: Final validation — target ≥ 90% completion, ≥ 4.5/5 satisfaction

Document each round's metrics and changes made between rounds.

---

## 6. Platform-Specific Considerations

### Android

- Test with TalkBack enabled
- Use `accessibilityLiveRegion="polite"` for dynamic content
- Support system font scale (Settings → Display → Font size)
- Test on low-end devices (2GB RAM, 5" screen)

### iOS

- Test with VoiceOver enabled
- Use `accessibilityTraits` for semantic meaning
- Support Dynamic Type (UIContentSizeCategory)
- Ensure `accessibilityViewIsModal` on modals to trap focus

### Both Platforms

- Test in landscape (some elderly users hold phone sideways)
- Test with 200% system font scale
- Test in bright sunlight (outdoor usage common)
- Test with one hand (many elderly users hold cane/bag in other hand)
