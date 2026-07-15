---
name: react-native-elderly-access
description: >
  Build accessible, elderly-friendly React Native applications with large text mode,
  voice interaction, one-tap operations, and simplified navigation. Use when developing
  React Native apps targeting elderly users, implementing accessibility features,
  creating voice-first interfaces, or when the user mentions 适老化, 无障碍, elderly-friendly,
  accessibility, large text, voice commands, one-tap actions, or senior UX design.
---

# React Native Elderly Access Skill

Build React Native applications optimized for elderly users. This skill provides components,
patterns, and best practices derived from real-world usability research with 200+ senior users.

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

## Module 1: Large Text Mode (大字模式)

Generate components that respect the user's font size preference and provide an in-app toggle.

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

## Module 2: Voice Interaction (语音叫车)

Voice is the **primary** interaction mode for elderly users. Always design voice-first.

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

## Module 3: One-Tap Operation (一键叫车)

Minimize decision nodes. Primary actions should complete in a single tap.

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

## Module 4: Family Payment (亲友代付)

Allow family members to pay remotely via a simple link/SMS flow.

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
