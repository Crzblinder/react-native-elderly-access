# API Reference — react-native-elderly-access

## ElderlyThemeProvider

Global theme context provider. Must wrap all elderly-friendly screens.

```typescript
interface ElderlyThemeConfig {
  largeTextMode: boolean;        // Default: false
  fontScale: number;             // 1.0–2.0, persisted to AsyncStorage
  highContrast: boolean;         // Boosts contrast to ≥ 7:1
  reducedMotion: boolean;        // Disables non-essential animations
  spacing: number;               // Base spacing unit in dp (default: 16)
  primaryColor: string;          // Default: '#1565C0'
  backgroundColor: string;       // Default: '#FAFAFA'
}

// Usage
<ElderlyThemeProvider largeTextMode={true} highContrast={false}>
  <App />
</ElderlyThemeProvider>
```

### useElderlyTheme() Hook

Returns the current theme context:

```typescript
const { fontScale, largeTextMode, spacing, toggleLargeText, setFontScale } = useElderlyTheme();
```

---

## ElderlyButton

Primary interactive element. Replaces `Button` and `TouchableOpacity` for all actions.

| Prop             | Type                              | Default    | Description                          |
|------------------|-----------------------------------|------------|--------------------------------------|
| `onPress`        | `() => void`                      | required   | Tap handler                          |
| `variant`        | `'primary' \| 'secondary' \| 'danger' \| 'back'` | `'primary'` | Visual style |
| `size`           | `'large' \| 'medium'`             | `'large'`  | Height: large=56dp, medium=48dp      |
| `icon`           | `string` (icon name)              | —          | Leading icon from Material Icons     |
| `disabled`       | `boolean`                         | `false`    | Dims to 40% opacity                  |
| `loading`        | `boolean`                         | `false`    | Shows spinner, disables press        |
| `haptic`         | `boolean`                         | `true`     | Vibrate on press (50ms)              |
| `accessibilityLabel` | `string`                      | —          | Screen reader label                  |
| `children`       | `ReactNode`                       | —          | Button text (rendered as LargeText)  |

```typescript
<ElderlyButton variant="primary" onPress={handleBook}>
  立即叫车
</ElderlyButton>

<ElderlyButton variant="back" onPress={() => nav.goBack()}>
  返回
</ElderlyButton>

<ElderlyButton loading={isSubmitting} disabled={!destination}>
  确认目的地
</ElderlyButton>
```

---

## ElderlyTextInput

Enhanced text input with voice slot and clear button.

| Prop            | Type                    | Default | Description                              |
|-----------------|-------------------------|---------|------------------------------------------|
| `value`         | `string`                | —       | Controlled value                         |
| `onChangeText`  | `(text: string) => void`| —       | Change handler                           |
| `placeholder`   | `string`                | —       | Placeholder (rendered at 18sp)           |
| `voiceEnabled`  | `boolean`               | `true`  | Show microphone icon for voice input     |
| `onVoiceResult` | `(text: string) => void`| —       | Called when voice recognition returns    |
| `clearable`     | `boolean`               | `true`  | Show X button to clear                   |
| `fontSize`      | `number`                | `22`    | Input text size in sp                    |
| `error`         | `string`                | —       | Error message (shown below in red, 16sp) |

```typescript
<ElderlyTextInput
  value={destination}
  onChangeText={setDestination}
  placeholder="您要去哪里？"
  voiceEnabled
  onVoiceResult={(text) => setDestination(text)}
  error={error || undefined}
/>
```

---

## LargeText

Text component that auto-scales with system accessibility and in-app font settings.

| Prop      | Type                              | Default  | Description                    |
|-----------|-----------------------------------|----------|--------------------------------|
| `variant` | `'heading' \| 'body' \| 'caption'`| `'body'` | Base size: 28/20/16 sp        |
| `color`   | `string`                          | `'#1A1A1A'` | Text color                 |
| `bold`    | `boolean`                         | `false`  | Bold weight                    |
| `center`  | `boolean`                         | `false`  | Center align                   |

```typescript
<LargeText variant="heading" bold>打车回家</LargeText>
<LargeText variant="body">预计费用：¥25</LargeText>
<LargeText variant="caption" color="#666">约15分钟到达</LargeText>
```

---

## OneTapCard

Single-action card for primary tasks (e.g., "一键打车回家").

| Prop       | Type          | Default | Description                           |
|------------|---------------|---------|---------------------------------------|
| `title`    | `string`      | required| Primary label (rendered at 24sp bold) |
| `subtitle` | `string`      | —       | Secondary info (16sp)                 |
| `icon`     | `string`      | —       | Material Icon name                    |
| `onPress`  | `() => void`  | required| Single tap action                     |
| `disabled` | `boolean`     | `false` | Greyed out state                      |
| `badge`    | `string`      | —       | Top-right notification badge text     |

```typescript
<OneTapCard
  title="一键打车回家"
  subtitle="幸福小区 3号楼 · 约12km"
  icon="home"
  onPress={handleOneTapRide}
/>
```

---

## ElderlyModal

Simplified modal with max 2 action buttons, no nested scroll.

| Prop          | Type                     | Default | Description                     |
|---------------|--------------------------|---------|---------------------------------|
| `visible`     | `boolean`                | —       | Show/hide                       |
| `title`       | `string`                 | —       | Modal heading (28sp)            |
| `message`     | `string`                 | —       | Body text (20sp)                |
| `primaryBtn`  | `{ label: string; onPress: () => void }` | — | Main action button |
| `secondaryBtn`| `{ label: string; onPress: () => void }` | — | Cancel/secondary    |
| `onDismiss`   | `() => void`             | —       | Backdrop/back button press      |

```typescript
<ElderlyModal
  visible={showConfirm}
  title="确认叫车？"
  message="从当前位置到幸福小区，预计费用 ¥25"
  primaryBtn={{ label: '确认叫车', onPress: confirmRide }}
  secondaryBtn={{ label: '取消', onPress: () => setShowConfirm(false) }}
  onDismiss={() => setShowConfirm(false)}
/>
```

---

## ElderlyBottomNav

Fixed bottom navigation with max 4 items, large icons + labels.

| Prop     | Type                                      | Default | Description           |
|----------|-------------------------------------------|---------|-----------------------|
| `items`  | `Array<{ icon: string; label: string; onPress: () => void }>` | required | Max 4 items |
| `active` | `number`                                  | `0`     | Active item index     |

```typescript
<ElderlyBottomNav
  active={activeTab}
  items={[
    { icon: 'home', label: '首页', onPress: () => setActiveTab(0) },
    { icon: 'directions-car', label: '叫车', onPress: () => setActiveTab(1) },
    { icon: 'history', label: '行程', onPress: () => setActiveTab(2) },
    { icon: 'person', label: '我的', onPress: () => setActiveTab(3) },
  ]}
/>
```

---

## VoiceService

Singleton service for voice recognition and TTS.

```typescript
import { VoiceService } from '../services/VoiceService';

// Initialize
await VoiceService.init({ language: 'zh-CN', continuous: false });

// Start listening
VoiceService.onResult((text: string) => {
  console.log('Recognized:', text);
});
VoiceService.start();

// Stop
VoiceService.stop();

// Text-to-speech feedback
VoiceService.speak('正在为您叫车，请稍候');
```

### Intent Mapping Utility

```typescript
import { parseVoiceIntent } from '../utils/voiceIntents';

const intent = parseVoiceIntent('我要打车去北京站');
// { action: 'RIDE_TO', destination: '北京站', confidence: 0.95 }
```

Supported intents:

| Intent ID       | Trigger Patterns (Chinese)                 | Payload                         |
|-----------------|--------------------------------------------|---------------------------------|
| `RIDE_HOME`     | "打车回家", "我要回家", "回家"             | `{ destination: 'home' }`       |
| `RIDE_TO`       | "打车去[地点]", "去[地点]", "叫车去..."    | `{ destination: string }`       |
| `REQUEST_RIDE`  | "帮我叫车", "叫个车", "我要打车"           | `{}`                            |
| `CANCEL_RIDE`   | "取消叫车", "不要了", "算了"               | `{}`                            |
| `CHECK_STATUS`  | "车到哪了", "司机在哪", "还要多久"         | `{}`                            |
| `CALL_FAMILY`   | "打电话给[名字]", "联系家人"               | `{ contact: string }`           |

---

## React Native Accessibility Props Quick Reference

Always set these on every interactive component:

```typescript
// Required for screen readers
accessibilityLabel="叫车按钮"          // What the element is
accessibilityRole="button"             // Element type
accessibilityHint="点击后开始叫车"     // What happens on interaction
accessibilityState={{ selected: false, disabled: false }}

// Important for elderly users
importantForAccessibility="yes"        // Prioritize in screen reader order
accessible={true}                      // Group as single accessibility element
```

### Platform-Specific

```typescript
// Android
accessibilityLiveRegion="polite"       // Announce dynamic changes

// iOS
accessibilityTraits="button"           // Legacy iOS trait
accessibilityViewIsModal={true}        // Trap focus in modal
```

---

## AsyncStorage Keys

Standard keys used across the app for persisting user preferences:

| Key                      | Type      | Description                       |
|--------------------------|-----------|-----------------------------------|
| `@elderly/font_scale`    | `number`  | User's font size multiplier       |
| `@elderly/large_text`    | `boolean` | Large text mode on/off            |
| `@elderly/high_contrast` | `boolean` | High contrast mode                |
| `@elderly/home_address`  | `string`  | Saved home address                |
| `@elderly/family_contacts` | `string[]` | Family member phone numbers    |
| `@elderly/voice_enabled` | `boolean` | Voice input preference            |
