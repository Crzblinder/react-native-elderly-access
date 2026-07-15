# Examples — Elderly Taxi App Screens

Complete, production-ready screen code from the elderly-friendly taxi platform project.

---

## 1. Home Screen (首页 — 一键叫车)

The main landing screen. Maximum 3 actions visible. Home address pre-loaded.

```typescript
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LargeText } from '../components/LargeText';
import { OneTapCard } from '../components/OneTapCard';
import { ElderlyButton } from '../components/ElderlyButton';
import { ElderlyBottomNav } from '../components/ElderlyBottomNav';
import { useElderlyTheme } from '../theme/ElderlyThemeProvider';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { spacing } = useElderlyTheme();
  const [homeAddress, setHomeAddress] = useState<string>('');
  const [recentDest, setRecentDest] = useState<string>('');

  useEffect(() => {
    (async () => {
      const home = await AsyncStorage.getItem('@elderly/home_address');
      const recent = await AsyncStorage.getItem('@elderly/last_destination');
      if (home) setHomeAddress(home);
      if (recent) setRecentDest(recent);
    })();
  }, []);

  const handleOneTapHome = () => {
    if (!homeAddress) {
      Alert.alert('提示', '请先在"我的"页面设置家庭地址', [{ text: '好的' }]);
      return;
    }
    navigation.navigate('Booking', { destination: homeAddress, label: '回家' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { padding: spacing }]}>
        {/* Greeting */}
        <LargeText variant="heading" bold>
          您好，张大爷
        </LargeText>
        <LargeText variant="body" color="#555" style={{ marginBottom: 16 }}>
          今天想去哪里？
        </LargeText>

        {/* Primary Actions — max 3 */}
        <View style={styles.cardList}>
          <OneTapCard
            title="一键打车回家"
            subtitle={homeAddress || '请先设置地址'}
            icon="home"
            onPress={handleOneTapHome}
            disabled={!homeAddress}
          />

          {recentDest && (
            <OneTapCard
              title="去上次的地方"
              subtitle={recentDest}
              icon="history"
              onPress={() => navigation.navigate('Booking', { destination: recentDest })}
            />
          )}

          <OneTapCard
            title="语音叫车"
            subtitle="说出您要去的地方"
            icon="mic"
            onPress={() => navigation.navigate('VoiceBooking')}
          />
        </View>

        {/* Emergency / Help */}
        <ElderlyButton
          variant="secondary"
          onPress={() => navigation.navigate('Help')}
          icon="help"
        >
          需要帮助？
        </ElderlyButton>
      </View>

      <ElderlyBottomNav active={0} items={[
        { icon: 'home', label: '首页', onPress: () => {} },
        { icon: 'directions-car', label: '叫车', onPress: () => navigation.navigate('VoiceBooking') },
        { icon: 'history', label: '行程', onPress: () => navigation.navigate('History') },
        { icon: 'person', label: '我的', onPress: () => navigation.navigate('Profile') },
      ]} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { flex: 1, gap: 20 },
  cardList: { gap: 16, flex: 1 },
});
```

---

## 2. Voice Booking Screen (语音叫车)

Voice-first booking flow. User speaks destination, confirms, books.

```typescript
import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { LargeText } from '../components/LargeText';
import { ElderlyButton } from '../components/ElderlyButton';
import { ElderlyVoiceInput } from '../components/ElderlyVoiceInput';
import { ElderlyModal } from '../components/ElderlyModal';
import { parseVoiceIntent } from '../utils/voiceIntents';
import { bookRide } from '../services/RideService';

export const VoiceBookingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [destination, setDestination] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const handleVoiceResult = (text: string) => {
    const intent = parseVoiceIntent(text);
    if (intent.action === 'RIDE_TO' && intent.destination) {
      setDestination(intent.destination);
      setShowConfirm(true);
    } else if (intent.action === 'RIDE_HOME') {
      setDestination('家');
      setShowConfirm(true);
    } else {
      setDestination(text);
      setShowConfirm(true);
    }
  };

  const handleConfirmBooking = async () => {
    setIsBooking(true);
    try {
      await bookRide({ destination });
      navigation.navigate('RideStatus');
    } catch (error) {
      Alert.alert('叫车失败', '请稍后重试，或拨打客服电话', [{ text: '好的' }]);
    } finally {
      setIsBooking(false);
      setShowConfirm(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <LargeText variant="heading" bold center>
          语音叫车
        </LargeText>

        <LargeText variant="body" center color="#555">
          点击下方按钮，说出您要去的地方
        </LargeText>

        <ElderlyVoiceInput
          onResult={handleVoiceResult}
          placeholder="点击开始说话"
        />

        {/* Manual fallback */}
        <LargeText variant="caption" center color="#999" style={{ marginTop: 32 }}>
          不方便说话？
        </LargeText>
        <ElderlyButton
          variant="secondary"
          onPress={() => navigation.navigate('ManualBooking')}
        >
          手动输入地址
        </ElderlyButton>

        <ElderlyButton variant="back" onPress={() => navigation.goBack()}>
          返回首页
        </ElderlyButton>
      </View>

      <ElderlyModal
        visible={showConfirm}
        title="确认目的地"
        message={`即将为您叫车前往：${destination}`}
        primaryBtn={{ label: '确认叫车', onPress: handleConfirmBooking }}
        secondaryBtn={{ label: '重新说', onPress: () => { setShowConfirm(false); setDestination(''); } }}
        onDismiss={() => setShowConfirm(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { flex: 1, padding: 24, gap: 24, justifyContent: 'center' },
});
```

---

## 3. Ride Status Screen (等待接驾)

Real-time driver tracking with large, clear status updates.

```typescript
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, StyleSheet, Image } from 'react-native';
import { LargeText } from '../components/LargeText';
import { ElderlyButton } from '../components/ElderlyButton';
import { VoiceService } from '../services/VoiceService';

interface DriverInfo {
  name: string;
  carModel: string;
  plateNumber: string;
  eta: number;       // minutes
  avatarUrl: string;
}

export const RideStatusScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [driver, setDriver] = useState<DriverInfo | null>(null);
  const [status, setStatus] = useState<'matching' | 'assigned' | 'arriving' | 'arrived'>('matching');

  useEffect(() => {
    // Simulate ride status updates
    const t1 = setTimeout(() => {
      setDriver({
        name: '李师傅',
        carModel: '银色大众帕萨特',
        plateNumber: '京A·12345',
        eta: 5,
        avatarUrl: '',
      });
      setStatus('assigned');
      VoiceService.speak('已为您匹配司机李师傅，预计5分钟到达');
    }, 3000);

    return () => clearTimeout(t1);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Status Banner */}
        <View style={[styles.banner, styles[`banner_${status}`]]}>
          <LargeText variant="heading" bold center>
            {status === 'matching' && '正在为您匹配司机...'}
            {status === 'assigned' && `司机正在赶来`}
            {status === 'arriving' && '司机即将到达'}
            {status === 'arrived' && '司机已到达，请上车'}
          </LargeText>
          {driver && (
            <LargeText variant="body" center color="#fff">
              预计 {driver.eta} 分钟到达
            </LargeText>
          )}
        </View>

        {/* Driver Card */}
        {driver && (
          <View style={styles.driverCard}>
            <LargeText variant="body" bold>{driver.name}</LargeText>
            <LargeText variant="body">{driver.carModel}</LargeText>
            <LargeText variant="heading" bold color="#1565C0">
              {driver.plateNumber}
            </LargeText>
          </View>
        )}

        {/* Actions */}
        <ElderlyButton
          variant="secondary"
          icon="phone"
          onPress={() => {/* call driver */}}
          disabled={!driver}
        >
          给司机打电话
        </ElderlyButton>

        <ElderlyButton
          variant="danger"
          onPress={() => {/* cancel ride */}}
        >
          取消叫车
        </ElderlyButton>

        <ElderlyButton variant="back" onPress={() => navigation.navigate('Home')}>
          返回首页
        </ElderlyButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { flex: 1, padding: 24, gap: 20 },
  banner: {
    padding: 24,
    borderRadius: 16,
    gap: 8,
  },
  banner_matching: { backgroundColor: '#FFA726' },
  banner_assigned: { backgroundColor: '#1565C0' },
  banner_arriving: { backgroundColor: '#2E7D32' },
  banner_arrived: { backgroundColor: '#2E7D32' },
  driverCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    gap: 8,
    elevation: 2,
  },
});
```

---

## 4. Family Payment Screen (亲友代付)

Post-trip payment delegation to family members.

```typescript
import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Alert, Linking } from 'react-native';
import { LargeText } from '../components/LargeText';
import { ElderlyButton } from '../components/ElderlyButton';

interface TripSummary {
  from: string;
  to: string;
  amount: number;
  duration: string;
  driverName: string;
}

export const FamilyPayScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const trip: TripSummary = route.params?.trip || {
    from: '当前位置',
    to: '幸福小区',
    amount: 25,
    duration: '15分钟',
    driverName: '李师傅',
  };
  const [sending, setSending] = useState(false);

  const handleFamilyPay = async () => {
    setSending(true);
    try {
      // Open contact picker (simplified — in production use react-native-contacts)
      const smsBody = `【打车代付】${trip.from} → ${trip.to}，费用 ¥${trip.amount}。点击链接支付：https://pay.example.com/trip/abc123`;
      const smsUrl = `sms:?body=${encodeURIComponent(smsBody)}`;
      await Linking.openURL(smsUrl);
    } catch (e) {
      Alert.alert('发送失败', '请手动将支付链接发送给家人', [{ text: '好的' }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <LargeText variant="heading" bold center>行程结束</LargeText>

        {/* Trip Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.row}>
            <LargeText variant="body" color="#666">起点</LargeText>
            <LargeText variant="body" bold>{trip.from}</LargeText>
          </View>
          <View style={styles.row}>
            <LargeText variant="body" color="#666">终点</LargeText>
            <LargeText variant="body" bold>{trip.to}</LargeText>
          </View>
          <View style={styles.row}>
            <LargeText variant="body" color="#666">时长</LargeText>
            <LargeText variant="body">{trip.duration}</LargeText>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <LargeText variant="heading" color="#666">费用</LargeText>
            <LargeText variant="heading" bold color="#D32F2F">¥{trip.amount}</LargeText>
          </View>
        </View>

        {/* Payment Options */}
        <ElderlyButton onPress={handleFamilyPay} loading={sending} icon="send">
          发给家人代付
        </ElderlyButton>

        <ElderlyButton variant="secondary" onPress={() => { /* self pay */ }}>
          自己支付
        </ElderlyButton>

        <ElderlyButton variant="back" onPress={() => navigation.navigate('Home')}>
          返回首页
        </ElderlyButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { flex: 1, padding: 24, gap: 20, justifyContent: 'center' },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    gap: 16,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 2,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
});
```

---

## 5. Settings Screen (大字模式切换)

Font size and accessibility settings with live preview.

```typescript
import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LargeText } from '../components/LargeText';
import { ElderlyButton } from '../components/ElderlyButton';
import { useElderlyTheme } from '../theme/ElderlyThemeProvider';

export const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { fontScale, setFontScale, largeTextMode, toggleLargeText, highContrast, toggleHighContrast } = useElderlyTheme();
  const [previewScale, setPreviewScale] = useState(fontScale);

  const handleSave = async () => {
    await AsyncStorage.setItem('@elderly/font_scale', JSON.stringify(previewScale));
    await AsyncStorage.setItem('@elderly/large_text', JSON.stringify(largeTextMode));
    setFontScale(previewScale);
    Alert.alert('保存成功', '设置已生效');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <LargeText variant="heading" bold>显示设置</LargeText>

        {/* Large Text Toggle */}
        <View style={styles.settingRow}>
          <LargeText variant="body">大字模式</LargeText>
          <Switch
            value={largeTextMode}
            onValueChange={toggleLargeText}
            accessibilityLabel="大字模式开关"
          />
        </View>

        {/* Font Size Slider */}
        <LargeText variant="body">字体大小</LargeText>
        <Slider
          style={styles.slider}
          minimumValue={1.0}
          maximumValue={2.0}
          step={0.1}
          value={previewScale}
          onValueChange={setPreviewScale}
          minimumTrackTintColor="#1565C0"
          accessibilityLabel="调整字体大小"
        />
        <LargeText variant="body" style={{ fontSize: 20 * previewScale, textAlign: 'center' }}>
          预览文字大小 ({Math.round(previewScale * 100)}%)
        </LargeText>

        {/* High Contrast */}
        <View style={styles.settingRow}>
          <LargeText variant="body">高对比度模式</LargeText>
          <Switch
            value={highContrast}
            onValueChange={toggleHighContrast}
            accessibilityLabel="高对比度模式开关"
          />
        </View>

        <ElderlyButton onPress={handleSave}>保存设置</ElderlyButton>
        <ElderlyButton variant="back" onPress={() => navigation.goBack()}>返回</ElderlyButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { padding: 24, gap: 24 },
  slider: { width: '100%', height: 48 },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
});
```

---

## 6. Usability Test Data Model

```typescript
interface UsabilityTestSession {
  userId: string;
  userAge: number;
  date: string;
  tasks: UsabilityTask[];
  overallSatisfaction: number; // 1-5 Likert scale
  notes: string;
}

interface UsabilityTask {
  taskId: string;
  taskName: string;           // e.g., "语音叫车"
  completed: boolean;
  timeSeconds: number;
  errorCount: number;
  assistanceNeeded: boolean;
  satisfaction: number;       // 1-5
}

// Three-dimensional evaluation model
interface UsabilityReport {
  sessions: UsabilityTestSession[];
  metrics: {
    avgCompletionRate: number;   // % of tasks completed
    avgTaskTime: number;         // seconds per task
    avgSatisfaction: number;     // 1-5 → converted to %
    iteration: number;           // which test round (1/2/3)
  };
}

// Example: 3 rounds of testing results
const testResults: UsabilityReport[] = [
  {
    sessions: [],
    metrics: { avgCompletionRate: 72, avgTaskTime: 180, avgSatisfaction: 3.2, iteration: 1 },
  },
  {
    sessions: [],
    metrics: { avgCompletionRate: 88, avgTaskTime: 120, avgSatisfaction: 4.1, iteration: 2 },
  },
  {
    sessions: [],
    metrics: { avgCompletionRate: 95, avgTaskTime: 90, avgSatisfaction: 4.6, iteration: 3 },
  },
];
// Round 3 results: 95% completion, 90s avg task time, 92% satisfaction (4.6/5.0)
```
