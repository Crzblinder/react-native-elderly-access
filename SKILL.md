---
name: react-native-elderly-access
description: >
  Build accessible, elderly-friendly React Native applications with large text mode,
  voice interaction, one-tap operations, multi-entry booking (app/QR/95128 hotline),
  trip safety guard, emergency SOS, family/cash payment, and medical priority dispatch.
  Use when developing React Native apps targeting elderly users, implementing accessibility
  features, creating voice-first interfaces, or when the user mentions 适老化, 无障碍,
  elderly-friendly, accessibility, large text, voice commands, one-tap actions, 安全守护,
  SOS, 扫码叫车, 95128, or senior UX design.
---

# React Native Elderly Access Skill

Build React Native applications optimized for elderly users. This skill provides components,
patterns, and best practices derived from real-world usability research with 200+ senior users.

## Competitive Landscape

This skill is informed by benchmarking against existing elderly ride-hailing solutions in China.
Each module below closes a gap left by the current market.

| Competitor | Strength | Key Gap We Address |
|------------|----------|---------------------|
| **滴滴长辈版** | Medical priority dispatch (202k+ verified dispatches); cash payment | No trip safety guard; no SOS emergency |
| **高德助老打车** | QR-code station booking; multi-city offline "warm stations" | Weak family monitoring; no medical priority |
| **95128热线** | Serves non-smartphone seniors via human agent | No real-time tracking; no digital safety features |

**Our differentiation**: multi-entry booking (APP voice + QR station + 95128 hotline), trip safety
guard (family live location + plate verification + SOS), and cash + digital payment — covering the
~20% cash-only elderly population that competitors under-serve. See [prd.md](prd.md) §3 for the
full competitive analysis and pain-point evidence.

## Core Design Constraints

Every component and screen you generate MUST satisfy ALL of the following:

| Constraint        | Minimum Requirement                          |
|-------------------|----------------------------------------------|
| Touch target size | 48×48 dp (recommended 56×56 dp)              |
| Font size         | Body text ≥ 18sp, headings ≥ 24sp            |
| Color contrast    | WCAG AA ≥ 4.5:1 (text), ≥ 3:1 (large text)  |
| Spacing           | Padding ≥ 16dp, gap between buttons ≥ 12dp   |
| Animation         | No flashing > 3Hz, transitions ≤ 300ms       |
| Interaction depth | Max 3 taps to complete any primary task       |
| Error recovery    | Always provide a visible, large "Back/Undo" button |

## Quick Start

When starting a new elderly-friendly RN project:

```
Task Progress:
- [ ] Step 1: Initialize RN project with accessibility config
- [ ] Step 2: Set up the ElderlyTheme provider
- [ ] Step 3: Build core screens using elderly components
- [ ] Step 4: Integrate voice interaction (if needed)
- [ ] Step 5: Run accessibility audit script
- [ ] Step 6: Conduct usability validation
```

### Step 1: Project Initialization

```bash
npx react-native@latest init ElderlyApp --template react-native-template-typescript
cd ElderlyApp
npm install react-native-voice @react-native-async-storage/async-storage
```

### Step 2: Theme Provider Setup

Wrap your app with the ElderlyTheme provider:

```typescript
import { ElderlyThemeProvider } from './src/theme/ElderlyThemeProvider';

export default function App() {
  return (
    <ElderlyThemeProvider largeTextMode={true}>
      <MainNavigator />
    </ElderlyThemeProvider>
  );
}
```

### Step 3: Use Elderly Components

Always prefer these over standard RN components:

| Standard Component | Elderly Replacement       | Key Difference                          |
|--------------------|---------------------------|------------------------------------------|
| `Button`           | `<ElderlyButton>`         | 56dp height, 20sp text, haptic feedback  |
| `TextInput`        | `<ElderlyTextInput>`      | 24sp text, clear icon, voice input slot  |
| `Text`             | `<LargeText>`             | Auto-scales with accessibility settings  |
| `TouchableOpacity` | `<OneTapCard>`            | Single-tap action, large hit area        |
| `Modal`            | `<ElderlyModal>`          | Simplified actions, no nested scrolling  |

**Specialized components** for the extended modules (see each module section for usage):

- `QRBookingScreen` — QR station scan → station resolve → confirm (Module 3)
- `HotlineBookingScreen` — one-tap 95128 dial + SMS confirmation display (Module 4)
- `SafetyService` — orchestrates family notifications, live location sharing, plate verification (Module 7)
- `LiveLocationCard` — family-facing real-time driver location + ETA (Module 7)
- `SOSButton` — long-press 3s gesture, large red target, haptic + visual confirmation (Module 8)
- `FamilyPayButton` / `PaymentStatusCard` / `PaymentConfirmScreen` — family delegation flow (Module 6)

## Module 1: One-Tap Ride (一键叫车)

**Problem**: Multi-step booking causes 78% of seniors to abandon. **Solution**: Pre-save the home
address, then book with a single tap + confirmation. Total: 2 taps (with pre-configured home).
**Key constraint**: If no home address is set, block the button with a "先设置家庭地址" prompt.

### OneTapCard Component

```typescript
import React from 'react';
import { TouchableOpacity, View, StyleSheet, Vibration } from 'react-native';
import { LargeText } from './LargeText';
import { Icon } from './Icon';

interface OneTapCardProps {
  title: string;
  subtitle?: string;
  icon?: string;
  onPress: () => void;
  disabled?: boolean;
}

export const OneTapCard: React.FC<OneTapCardProps> = ({
  title, subtitle, icon, onPress, disabled = false,
}) => {
  const handlePress = () => {
    Vibration.vibrate(50); // Haptic confirmation
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.card, disabled && styles.disabled]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${title}${subtitle ? `, ${subtitle}` : ''}`}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {icon && <Icon name={icon} size={40} color="#1565C0" />}
      <LargeText variant="heading" style={styles.title}>{title}</LargeText>
      {subtitle && <LargeText variant="caption">{subtitle}</LargeText>}
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
  },
  disabled: { opacity: 0.4, backgroundColor: '#E0E0E0' },
  title: { textAlign: 'center', fontWeight: '700' },
});
```

### One-Tap Ride Home Screen

```typescript
// Pre-configured: user's home address is stored, one tap books ride
<OneTapCard
  title="一键打车回家"
  subtitle="幸福小区 3号楼"
  icon="home"
  onPress={() => bookRide({ destination: savedAddresses.home })}
/>
```

## Module 2: Voice Command Ride (语音指令叫车)

**Problem**: 68% of seniors cannot type addresses. **Solution**: Voice is the **primary**
interaction mode. Map natural language to intents; when confidence < 0.8, show a candidate list.
**Key constraint**: Always show a "不方便说话？手动输入" manual fallback.

### Voice Command Flow

```
[User taps microphone] → [Listening indicator + haptic]
    → [Speech-to-text] → [Intent extraction]
    → [Confirmation dialog (large text)] → [Execute action]
```

### ElderlyVoiceInput Component

```typescript
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ElderlyButton } from './ElderlyButton';
import { LargeText } from './LargeText';

// Voice recognition setup - platform specific
import Voice from '@react-native-voice/voice';

interface VoiceInputProps {
  onResult: (text: string) => void;
  placeholder?: string;
}

export const ElderlyVoiceInput: React.FC<VoiceInputProps> = ({ onResult, placeholder }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = async () => {
    try {
      await Voice.start('zh-CN');
      setIsListening(true);
    } catch (e) {
      console.error('Voice start error:', e);
    }
  };

  Voice.onSpeechResults = (e) => {
    if (e.value?.[0]) {
      setTranscript(e.value[0]);
      onResult(e.value[0]);
    }
    setIsListening(false);
    Voice.stop();
  };

  return (
    <View style={styles.container}>
      <ElderlyButton
        onPress={startListening}
        variant={isListening ? 'danger' : 'primary'}
        icon={isListening ? 'mic-off' : 'mic'}
        accessibilityLabel={isListening ? '停止语音输入' : '开始语音输入'}
      >
        {isListening ? '正在听...' : placeholder || '点击说话'}
      </ElderlyButton>
      {transcript ? <LargeText style={styles.transcript}>"{transcript}"</LargeText> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 16 },
  transcript: { fontStyle: 'italic', color: '#555', marginTop: 8 },
});
```

### Voice Command Intent Mapping

Map natural language to actions:

| User Says (Chinese)         | Intent              | Action                     |
|-----------------------------|---------------------|----------------------------|
| "我要打车回家"              | `RIDE_HOME`         | Pre-fill destination=home  |
| "叫车去[地点]"              | `RIDE_TO`           | Set destination=[地点]     |
| "帮我叫个车"                | `REQUEST_RIDE`      | Open ride booking          |
| "取消叫车"                  | `CANCEL_RIDE`       | Cancel current booking     |
| "我的车到哪了"              | `CHECK_STATUS`      | Show driver location       |

## Module 3: QR Code Station Booking (扫码叫车)

**Problem**: 34% of target users cannot use smartphone apps. **Solution**: At offline "warm
stations", scan a QR code to auto-locate the station, then confirm with one tap. Total: 1 scan + 1
confirm.
**Key components**: `QRBookingScreen` (camera scan → station GPS resolve → large-text confirm).
**Key constraint**: If destination is unclear, default to "最近医院" or saved home.
**Details**: see [prd.md](prd.md) Module 3.

## Module 4: Hotline 95128 Booking (电话叫车)

**Problem**: Non-smartphone seniors have no digital entry. **Solution**: One-tap dial 95128 from
the app; the operator creates the order on the senior's behalf. Also reachable from any phone.
**Key components**: `HotlineBookingScreen` (one-tap dial button + SMS confirmation display).
**Key constraint**: Booking confirmation SMS must be in large, plain text (no deep links the
senior cannot open).
**Details**: see [prd.md](prd.md) Module 4.

## Module 5: Large Text Mode (大字模式)

**Problem**: 85% of seniors report text too small. **Solution**: Default body ≥ 18sp, headings
≥ 24sp; in-app font scale slider 1.0x–2.0x with live preview. Never truncate text with "...".
**Key constraint**: Honor Android/iOS system font scale; persist preference to AsyncStorage.

### LargeText Component

```typescript
import React from 'react';
import { Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useElderlyTheme } from '../theme/ElderlyThemeProvider';

interface LargeTextProps {
  variant?: 'heading' | 'body' | 'caption';
  children: React.ReactNode;
  style?: object;
}

export const LargeText: React.FC<LargeTextProps> = ({ variant = 'body', children, style }) => {
  const { fontScale, largeTextMode } = useElderlyTheme();
  const { width } = useWindowDimensions();

  const baseSize = { heading: 28, body: 20, caption: 16 }[variant];
  const fontSize = largeTextMode ? baseSize * fontScale : baseSize;

  return (
    <Text
      style={[styles.text, { fontSize, lineHeight: fontSize * 1.5 }, style]}
      accessibilityRole={variant === 'heading' ? 'header' : 'text'}
      maxFontSizeMultiplier={2.0}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: { color: '#1A1A1A', fontWeight: '500' },
});
```

### Font Size Toggle Screen

Provide a settings screen with a slider:
- Range: 16sp – 32sp
- Preview text shown below slider in real time
- Persist preference with `@react-native-async-storage/async-storage`

## Module 6: Family Payment (亲友代付)

**Problem**: 61% of seniors find payment too complex. **Solution**: After a trip, send an SMS/deep
link to a family member who confirms payment in one tap. The link expires after 24 hours.
**Key constraint**: A "自己支付" self-pay fallback must always be visible alongside the delegate option.

### Payment Flow

```
[Rider completes trip] → [Select "亲友代付"]
    → [Choose contact from phone] → [Send SMS/deep link]
    → [Family member opens link] → [One-tap confirm payment]
```

### Key Components

- `FamilyPayButton`: triggers contact picker + SMS
- `PaymentStatusCard`: shows real-time payment status (large text, clear states)
- `PaymentConfirmScreen`: family member view — amount, trip summary, single "确认支付" button

## Module 7: Trip Safety Guard (行程安全守护)

**Problem**: 52% of seniors fear getting in the wrong car or traveling unsafely. **Solution**:
Auto-notify family when a ride starts with a live location link; require plate-number verification
before boarding; a mismatch triggers a warning.
**Key components**: `SafetyService` (orchestrates family notifications + real-time location sharing
+ plate verification), `LiveLocationCard` (family-facing driver location + ETA view).
**Key constraint**: Location sharing requires explicit family consent; encrypt location data in transit.
**Details**: see [prd.md](prd.md) Module 7.

## Module 8: Emergency SOS (紧急求助)

**Problem**: Seniors may need urgent help mid-trip with no easy way to call. **Solution**: A
long-press SOS button (3 seconds) auto-dials 110/120 or an emergency contact, broadcasts live
location to family, and optionally starts trip recording.
**Key components**: `SOSButton` (long-press gesture, large red 56dp+ target, haptic + large-text
visual confirmation "已为您呼叫帮助").
**Key constraint**: SOS trigger must be accidental-proof (long-press, not single tap) yet
discoverable; always show confirmation after firing.
**Details**: see [prd.md](prd.md) Module 8.

## Module 9: Payment Methods (支付方式)

**Problem**: ~20% of elderly only use cash; others prefer online or family pay. **Solution**:
Offer three paths — online self-pay (WeChat/Alipay one-tap), cash (driver confirms receipt on
their side), and family payment (see Module 6). Generate a large-text receipt for all methods.
**Key constraint**: Never store card data on device; the cash flow requires a driver-side
confirmation UI and reconciliation step.
**Details**: see [prd.md](prd.md) Module 9.

## Module 10: Medical Priority Dispatch (就医优先派单)

**Problem**: Medical trips are hard to book; seniors abandon after 3 minutes without a match.
**Solution**: Detect hospital destinations (keyword/POI category) and boost nearby driver matching
weight to reduce wait time. Notify family when the senior arrives at the hospital.
**Key constraint**: Trigger priority only for genuine medical POIs; if no driver matches within 3
minutes, auto-expand the matching radius with a TTS announcement.
**Details**: see [prd.md](prd.md) Module 10.

## Validation Checklist

Before finalizing any screen, verify:

- [ ] All buttons are ≥ 48dp (target 56dp)
- [ ] Body text is ≥ 18sp, headings ≥ 24sp
- [ ] Touch targets have ≥ 12dp spacing between them
- [ ] Color contrast passes WCAG AA (run `node scripts/check-a11y.js`)
- [ ] Every screen has a visible, labeled back button
- [ ] Voice commands are mapped for all primary actions
- [ ] Error states show clear, large-text recovery instructions
- [ ] No nested scrolling on any screen
- [ ] Primary action completable in ≤ 3 taps
- [ ] Haptic feedback on all primary action buttons

## Generating a New Screen

When asked to create a new elderly-friendly screen, follow this template:

```typescript
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { LargeText } from '../components/LargeText';
import { ElderlyButton } from '../components/ElderlyButton';
import { useElderlyTheme } from '../theme/ElderlyThemeProvider';

export const YourScreen: React.FC = () => {
  const { spacing } = useElderlyTheme();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.content, { padding: spacing }]}>
        <LargeText variant="heading">屏幕标题</LargeText>

        {/* Main content — max 3 interactive elements visible */}

        <ElderlyButton onPress={handlePrimaryAction}>
          主要操作
        </ElderlyButton>

        <ElderlyButton variant="back" onPress={() => navigation.goBack()}>
          返回
        </ElderlyButton>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { gap: 24, paddingBottom: 40 },
});
```

## Additional Resources

- Product requirements & module design: see [prd.md](prd.md)
- Component API details and voice integration: see [reference.md](reference.md)
- Complete taxi app screen examples: see [examples.md](examples.md)
- Research methodology and usability testing: see [accessibility-guide.md](accessibility-guide.md)
- UML and system architecture: see [assets/architecture-diagram.md](assets/architecture-diagram.md)
- Accessibility audit tool: `node scripts/check-a11y.js <project-path>`
- Component generator: `node scripts/gen-component.js <ComponentName>`

## Troubleshooting Guide

### Common Build & Runtime Errors

| Symptom | Likely Cause | Solution |
|---------|-------------|----------|
| `Voice is not defined` | `react-native-voice` not linked | Run `npx react-native link react-native-voice`; check native module autolinking |
| Font scale not applying | `ElderlyThemeProvider` not wrapping screens | Ensure `<ElderlyThemeProvider>` wraps the entire app or navigation container |
| Touch targets pass but feel small on device | `hitSlop` incorrectly set | Use `hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}` on all interactive elements |
| Text truncated at 2.0x scale | Fixed height container | Replace fixed heights with `minHeight`; wrap content in `ScrollView` |
| Voice recognition returns empty | Permission denied or silent input | Check microphone permission in Settings; show "没有听清，请再说一次" after 3 empty results |
| TTS not speaking on Android | TTS engine not installed | Prompt user to install Google TTS from Play Store; fallback to visual-only feedback |
| Payment link not opening | Deep link not configured | Verify `AndroidManifest.xml` intent filters and `Info.plist` URL schemes |
| SOS button not triggering | Registration missing in native module | Verify `SOSButton` native module is linked; check `onSOS` callback binding |
| QR scanner black screen | Camera permission denied | Request `CAMERA` permission at runtime; show fallback: "扫不了？拨打 95128" |
| Cash payment stuck "pending" | Driver-side confirmation missing | After 30 minutes, auto-switch to online payment; notify user via push |

### Performance Issues

| Symptom | Diagnosis | Fix |
|---------|-----------|-----|
| Home screen slow to load | Too many AsyncStorage reads on mount | Batch reads with `multiGet`; use `React.memo` on card components |
| Voice recognition slow (> 5s) | Network latency to STT API | Set 5s timeout; show "正在识别..." with loading animation; fallback to manual input |
| Driver location map laggy | GPS polling too frequent | Throttle to 5s intervals; use `react-native-maps` with `shouldRasterizeIOS` |
| Memory growing during long trips | Location or recording state not cleaned up | Clear intervals on `useEffect` cleanup; stop recording on trip end |
| Re-renders on every font scale change | All components subscribe to `useElderlyTheme` | Memoize theme values; use `React.memo` + `useMemo` for expensive calculations |
| App crash on low-end devices | Too many simultaneous animations | Disable non-essential animations with `reducedMotion`; use `LayoutAnimation` sparingly |

### Accessibility Audit Failures

| Audit Failure | Why It Matters | Fix |
|---------------|---------------|-----|
| `accessibilityLabel` missing | Screen reader users can't navigate | Add descriptive labels: "一键打车回家，幸福小区 3 号楼" |
| Contrast < 4.5:1 | Low-vision users can't read | Use the color palette from `accessibility-guide.md` §3; run `check-a11y.js` |
| Touch target < 48dp | Users with tremors can't tap accurately | Increase to 56dp minimum; add `hitSlop` padding |
| Nested scrolling detected | Screen reader gets trapped | Remove nested `ScrollView`; use flat lists with `getItemLayout` |
| No back button visible | Elderly users can't escape error states | Always render a "返回" button at the bottom of every screen |

### Common Error Patterns & Recovery

**Network unavailable**:
```typescript
// Pattern: always check network before critical operations
import NetInfo from '@react-native-community/netinfo';

const netState = await NetInfo.fetch();
if (!netState.isConnected) {
  // Show offline UI with cached data
  // Queue writes for later sync
  // Offer fallback: "拨打 95128 热线叫车"
}
```

**Voice permission denied**:
```typescript
// Pattern: graceful degradation to manual input
try {
  await Voice.start('zh-CN');
} catch (e) {
  if (e.code === 'PERMISSION_DENIED') {
    // Show manual input UI
    // Guide user to Settings > Privacy > Microphone
    setShowManualInput(true);
  }
}
```

**SOS offline fallback**:
```typescript
// Pattern: SOS must never fail silently
// 1. Try API call
// 2. If offline, queue locally + send emergency SMS directly
// 3. On app restart, flush pending SOS queue
// 4. Always show visual confirmation "已为您呼叫帮助"
```

**Payment timeout recovery**:
```typescript
// Pattern: poll with timeout, then offer manual check
// 1. Poll payment status every 3s for 30s
// 2. If still pending, show "正在查询支付结果..."
// 3. Offer manual "查询支付结果" button
// 4. Never block the user from taking other actions
```

**Low-confidence voice recognition**:
```typescript
// Pattern: show candidate list, don't error
// 1. If confidence < 0.7, show top 3 candidates as large card buttons
// 2. Always include "都不是，重新说" option
// 3. Always include "手动输入" fallback
// 4. Save user's alias for future recognition (e.g., "我儿子家" → saved address)
```
