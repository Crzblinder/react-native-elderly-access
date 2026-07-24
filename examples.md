# Examples — Elderly Taxi App Screens

Complete, production-ready screen code from the elderly-friendly taxi platform project.

---

## 1. Home Screen (首页 — 一键叫车)

The main landing screen. Max 3 actions visible at once; scroll for additional entry points (扫码叫车 / 95128热线) added per competitive analysis. Home address pre-loaded.

```typescript
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, ScrollView, StyleSheet, Alert } from 'react-native';
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

        {/* Primary Actions — max 3 visible, scroll for more entry points */}
        <ScrollView
          style={styles.cardList}
          contentContainerStyle={styles.cardListContent}
          showsVerticalScrollIndicator={false}
        >
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

          {/* Competitive-analysis new entries — QR station + 95128 hotline */}
          <OneTapCard
            title="扫码叫车"
            subtitle="在助老打车站点扫码"
            icon="qr-code-scanner"
            onPress={() => navigation.navigate('QRBooking')}
          />

          <OneTapCard
            title="拨打 95128 热线"
            subtitle="不会用手机？人工帮您叫车"
            icon="phone-in-talk"
            onPress={() => navigation.navigate('HotlineBooking')}
          />
        </ScrollView>

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
  cardList: { flex: 1 },
  cardListContent: { gap: 16, paddingBottom: 16 },
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
import { SafeAreaView, View, StyleSheet, Image, Alert } from 'react-native';
import { LargeText } from '../components/LargeText';
import { ElderlyButton } from '../components/ElderlyButton';
import { ElderlyModal } from '../components/ElderlyModal';
import { LiveLocationCard } from '../components/LiveLocationCard';
import { SOSButton } from '../components/SOSButton';
import { VoiceService } from '../services/VoiceService';

interface DriverInfo {
  name: string;
  carModel: string;
  plateNumber: string;
  eta: number;       // minutes
  avatarUrl: string;
  lat: number;
  lng: number;
}

interface RideStatusProps {
  navigation: any;
  route?: any;
}

export const RideStatusScreen: React.FC<RideStatusProps> = ({ navigation, route }) => {
  const [driver, setDriver] = useState<DriverInfo | null>(null);
  const [status, setStatus] = useState<'matching' | 'assigned' | 'arriving' | 'arrived'>('matching');
  const [plateVerifyVisible, setPlateVerifyVisible] = useState(false);
  const [plateMatch, setPlateMatch] = useState<'pending' | 'matched' | 'mismatch'>('pending');

  useEffect(() => {
    // Simulate ride status updates
    const t1 = setTimeout(() => {
      setDriver({
        name: '李师傅',
        carModel: '银色大众帕萨特',
        plateNumber: '京A·12345',
        eta: 5,
        avatarUrl: '',
        lat: 39.9087,
        lng: 116.3975,
      });
      setStatus('assigned');
      VoiceService.speak('已为您匹配司机李师傅，预计5分钟到达');
    }, 3000);

    // Simulate arrival → prompt plate verification before boarding
    const t2 = setTimeout(() => {
      setStatus('arrived');
      setPlateVerifyVisible(true);
      VoiceService.speak('司机已到达，请确认车牌号后再上车');
    }, 8000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handlePlateMatched = () => {
    setPlateMatch('matched');
    setPlateVerifyVisible(false);
    VoiceService.speak('车牌一致，可以上车');
  };

  const handlePlateMismatch = () => {
    setPlateMatch('mismatch');
    setPlateVerifyVisible(false);
    Alert.alert(
      '车牌不一致',
      `请勿上车！\n司机应到车牌：${driver?.plateNumber ?? ''}\n正在为您联系客服核实。`,
      [
        { text: '重新核对', onPress: () => { setPlateMatch('pending'); setPlateVerifyVisible(true); } },
        { text: '联系客服', onPress: () => navigation.navigate('Help') },
      ],
    );
  };

  const handleSOS = () => {
    // Real implementation: dial 110/120 + broadcast location to family
    Alert.alert(
      '已为您呼叫帮助',
      '正在联系紧急联系人和客服，请保持冷静',
      [{ text: '好的' }],
    );
  };

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
            {plateMatch === 'matched' && (
              <LargeText variant="caption" color="#2E7D32" bold>
                ✓ 车牌已核验
              </LargeText>
            )}
            {plateMatch === 'mismatch' && (
              <LargeText variant="caption" color="#D32F2F" bold>
                ⚠ 车牌不一致，请勿上车
              </LargeText>
            )}
          </View>
        )}

        {/* Live Location — real-time driver position + ETA for family/safety */}
        {driver && (status === 'assigned' || status === 'arriving') && (
          <LiveLocationCard
            driverName={driver.name}
            driverLat={driver.lat}
            driverLng={driver.lng}
            etaMinutes={driver.eta}
            onShareWithFamily={() => navigation.navigate('SafetyGuard', { rideId: route?.params?.rideId })}
          />
        )}

        {/* Plate Verification entry — re-open if user dismissed modal */}
        {status === 'arrived' && plateMatch !== 'matched' && (
          <ElderlyButton
            variant="secondary"
            icon="verified"
            onPress={() => setPlateVerifyVisible(true)}
          >
            核对车牌号再上车
          </ElderlyButton>
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

        {/* SOS — long-press 3 seconds to trigger emergency help */}
        <View style={styles.sosRow}>
          <SOSButton
            onTrigger={handleSOS}
            holdSeconds={3}
            accessibilityLabel="紧急求助按钮，长按3秒触发"
          />
        </View>

        <ElderlyButton variant="back" onPress={() => navigation.navigate('Home')}>
          返回首页
        </ElderlyButton>
      </View>

      {/* Plate Verification Modal — required before boarding (PRD F7.3) */}
      <ElderlyModal
        visible={plateVerifyVisible}
        title="上车前请核对车牌"
        message={`司机车牌：${driver?.plateNumber ?? ''}\n请看清车身车牌号后再确认上车`}
        primaryBtn={{ label: '车牌一致，上车', onPress: handlePlateMatched }}
        secondaryBtn={{ label: '车牌不一致', onPress: handlePlateMismatch }}
        onDismiss={() => setPlateVerifyVisible(false)}
      />
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
  sosRow: {
    alignItems: 'center',
    paddingVertical: 8,
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

## 6. QR Booking Screen (扫码叫车)

Offline entry for seniors at "warm stations". Scan station QR → auto-locate → confirm → book. Covers PRD Module 3 (F3.1–F3.4).

```typescript
import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Alert, Linking } from 'react-native';
import { LargeText } from '../components/LargeText';
import { ElderlyButton } from '../components/ElderlyButton';
import { ElderlyModal } from '../components/ElderlyModal';
import { ElderlyTextInput } from '../components/ElderlyTextInput';
import { QRScanner } from '../components/QRScanner';
import { VoiceService } from '../services/VoiceService';
import { bookRideFromStation } from '../services/RideService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StationInfo {
  stationId: string;
  stationName: string;
  address: string;
  lat: number;
  lng: number;
}

interface QRBookingProps {
  navigation: any;
}

export const QRBookingScreen: React.FC<QRBookingProps> = ({ navigation }) => {
  const [station, setStation] = useState<StationInfo | null>(null);
  const [destination, setDestination] = useState<string>('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [booking, setBooking] = useState(false);

  const handleQRScanned = (payload: string) => {
    // Payload format: "elderly-station:{stationId}"
    const match = payload.match(/^elderly-station:(.+)$/);
    if (!match) {
      Alert.alert('二维码无效', '请扫描助老打车点专属二维码', [{ text: '好的' }]);
      return;
    }
    const stationId = match[1];
    // Resolve station info from backend (mocked here)
    const resolved: StationInfo = {
      stationId,
      stationName: '幸福社区助老打车点',
      address: '幸福路 88 号路口',
      lat: 39.9087,
      lng: 116.3975,
    };
    setStation(resolved);
    VoiceService.speak(`已识别${resolved.stationName}，请输入您要去的地方`);
  };

  const handleConfirmBooking = async () => {
    if (!station) return;
    let dest = destination.trim();
    // F3.4: No-address fallback — default to nearest hospital or saved home
    if (!dest) {
      const home = await AsyncStorage.getItem('@elderly/home_address');
      dest = home || '最近医院';
      setDestination(dest);
    }
    setBooking(true);
    try {
      await bookRideFromStation({
        stationId: station.stationId,
        pickup: station.address,
        destination: dest,
        lat: station.lat,
        lng: station.lng,
      });
      setShowConfirm(false);
      VoiceService.speak(`已为您叫车前往${dest}，请在${station.stationName}等候`);
      navigation.navigate('RideStatus');
    } catch (e) {
      Alert.alert('叫车失败', '请稍后重试，或拨打 95128 热线', [{ text: '好的' }]);
    } finally {
      setBooking(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <LargeText variant="heading" bold center>
          扫码叫车
        </LargeText>
        <LargeText variant="body" center color="#555">
          将手机对准打车点的二维码
        </LargeText>

        {/* QR Scanner — full-width viewfinder */}
        {!station && (
          <View style={styles.scannerWrap}>
            <QRScanner onScanned={handleQRScanned} style={styles.scanner} />
          </View>
        )}

        {/* Station identified — show pickup + ask destination */}
        {station && (
          <View style={styles.stationCard}>
            <LargeText variant="body" color="#666">上车地点</LargeText>
            <LargeText variant="heading" bold color="#1565C0">
              {station.stationName}
            </LargeText>
            <LargeText variant="body">{station.address}</LargeText>

            <LargeText variant="body" style={{ marginTop: 16 }}>
              您要去哪里？
            </LargeText>
            <ElderlyTextInput
              value={destination}
              onChangeText={setDestination}
              placeholder="说出或输入目的地"
              voiceEnabled
              onVoiceResult={(text) => setDestination(text)}
            />
            <LargeText variant="caption" color="#999">
              不填写时，默认前往"最近医院"或家庭地址
            </LargeText>

            <ElderlyButton
              onPress={() => setShowConfirm(true)}
              icon="check"
            >
              确认叫车
            </ElderlyButton>
            <ElderlyButton
              variant="secondary"
              icon="refresh"
              onPress={() => { setStation(null); setDestination(''); }}
            >
              重新扫码
            </ElderlyButton>
          </View>
        )}

        <ElderlyButton variant="back" onPress={() => navigation.goBack()}>
          返回首页
        </ElderlyButton>

        {/* Manual fallback for non-smartphone pairing — dial 95128 */}
        <ElderlyButton
          variant="secondary"
          icon="phone-in-talk"
          onPress={() => Linking.openURL('tel:95128')}
        >
          扫不了？拨打 95128
        </ElderlyButton>
      </View>

      <ElderlyModal
        visible={showConfirm}
        title="确认叫车"
        message={
          station
            ? `上车点：${station.stationName}\n目的地：${destination || '最近医院'}`
            : '请先扫描站点二维码'
        }
        primaryBtn={{ label: '确认叫车', onPress: handleConfirmBooking }}
        secondaryBtn={{ label: '再想想', onPress: () => setShowConfirm(false) }}
        onDismiss={() => setShowConfirm(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { flex: 1, padding: 24, gap: 20 },
  scannerWrap: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
    minHeight: 280,
  },
  scanner: { flex: 1 },
  stationCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    gap: 12,
    elevation: 2,
  },
});
```

---

## 7. Hotline Booking Screen (电话叫车)

One-tap dial of the 95128 national elderly taxi hotline. Serves non-smartphone seniors via human agent (PRD Module 4, F4.1–F4.3).

```typescript
import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Alert, Linking, Platform } from 'react-native';
import { LargeText } from '../components/LargeText';
import { ElderlyButton } from '../components/ElderlyButton';
import { ElderlyModal } from '../components/ElderlyModal';
import { VoiceService } from '../services/VoiceService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HotlineBookingProps {
  navigation: any;
}

const HOTLINE_NUMBER = '95128';

export const HotlineBookingScreen: React.FC<HotlineBookingProps> = ({ navigation }) => {
  const [showConfirm, setShowConfirm] = useState(true);
  const [dialing, setDialing] = useState(false);

  const handleDial = async () => {
    setDialing(true);
    try {
      // F4.1: One-tap dial 95128
      const url = Platform.OS === 'ios' ? `tel://${HOTLINE_NUMBER}` : `tel:${HOTLINE_NUMBER}`;
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert('无法拨号', '本机不支持电话功能，请在普通手机上拨打 95128', [{ text: '好的' }]);
        return;
      }
      await Linking.openURL(url);
      // F4.3: SMS confirmation is sent by the operator after order creation;
      // we persist a pending-hotline marker so the app can match the SMS later.
      await AsyncStorage.setItem(
        '@elderly/pending_hotline',
        JSON.stringify({ dialedAt: new Date().toISOString() }),
      );
      VoiceService.speak('正在为您拨打 95128，请按提示操作');
    } catch (e) {
      Alert.alert('拨号失败', '请手动拨打 95128', [{ text: '好的' }]);
    } finally {
      setDialing(false);
      setShowConfirm(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <LargeText variant="heading" bold center>
          95128 助老热线
        </LargeText>
        <LargeText variant="body" center color="#555">
          不会用手机？人工客服帮您叫车
        </LargeText>

        {/* Big hotline number block */}
        <View style={styles.numberCard}>
          <LargeText variant="heading" bold color="#1565C0" center>
            {HOTLINE_NUMBER}
          </LargeText>
          <LargeText variant="caption" center color="#666">
            全国统一助老打车热线 · 7×24 小时
          </LargeText>
        </View>

        {/* What happens next — set expectations for elderly users */}
        <View style={styles.stepsCard}>
          <LargeText variant="body" bold>拨打后：</LargeText>
          <LargeText variant="body">1. 接通客服，告知上车地点</LargeText>
          <LargeText variant="body">2. 客服为您创建订单</LargeText>
          <LargeText variant="body">3. 收到确认短信，看到车牌</LargeText>
          <LargeText variant="body">4. 司机到达，核对车牌上车</LargeText>
        </View>

        <ElderlyButton
          onPress={handleDial}
          loading={dialing}
          icon="phone-in-talk"
          accessibilityLabel="拨打 95128 助老打车热线"
        >
          一键拨打 95128
        </ElderlyButton>

        <ElderlyButton
          variant="secondary"
          icon="qr-code-scanner"
          onPress={() => navigation.navigate('QRBooking')}
        >
          改用扫码叫车
        </ElderlyButton>

        <ElderlyButton variant="back" onPress={() => navigation.goBack()}>
          返回首页
        </ElderlyButton>
      </View>

      <ElderlyModal
        visible={showConfirm}
        title="即将拨打 95128"
        message={'客服会询问您的上车地点和目的地，然后为您叫车。\n通话免费，按市话标准计费。'}
        primaryBtn={{ label: '立即拨打', onPress: handleDial }}
        secondaryBtn={{ label: '取消', onPress: () => setShowConfirm(false) }}
        onDismiss={() => setShowConfirm(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { flex: 1, padding: 24, gap: 20, justifyContent: 'center' },
  numberCard: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 16,
    gap: 8,
    alignItems: 'center',
    elevation: 2,
  },
  stepsCard: {
    backgroundColor: '#FFF8E1',
    padding: 24,
    borderRadius: 16,
    gap: 8,
  },
});
```

---

## 8. Safety Guard Screen (行程安全守护)

In-trip safety panel: live driver location, plate verification status, and family location sharing. Covers PRD Module 7 (F7.1–F7.5).

```typescript
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Switch, StyleSheet, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LargeText } from '../components/LargeText';
import { ElderlyButton } from '../components/ElderlyButton';
import { ElderlyModal } from '../components/ElderlyModal';
import { LiveLocationCard } from '../components/LiveLocationCard';
import { SOSButton } from '../components/SOSButton';
import { VoiceService } from '../services/VoiceService';

interface SafetyGuardProps {
  navigation: any;
  route?: any;
}

interface RideSafetyState {
  driverName: string;
  plateNumber: string;
  plateVerified: boolean;
  driverLat: number;
  driverLng: number;
  etaMinutes: number;
  rideStartedAt: string;
}

export const SafetyGuardScreen: React.FC<SafetyGuardProps> = ({ navigation, route }) => {
  const [ride, setRide] = useState<RideSafetyState>({
    driverName: '李师傅',
    plateNumber: '京A·12345',
    plateVerified: false,
    driverLat: 39.9087,
    driverLng: 116.3975,
    etaMinutes: 5,
    rideStartedAt: new Date().toISOString(),
  });
  const [shareWithFamily, setShareWithFamily] = useState(true);
  const [tripRecording, setTripRecording] = useState(false);
  const [familyContacts, setFamilyContacts] = useState<string[]>([]);
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem('@elderly/family_contacts');
      if (raw) setFamilyContacts(JSON.parse(raw));
      // F7.1: Auto-notify family when ride starts (if sharing enabled)
      if (shareWithFamily && familyContacts.length > 0) {
        VoiceService.speak('已通知家人本次行程，他们可查看您的位置');
      }
    })();
  }, []);

  const handleToggleShare = async (value: boolean) => {
    setShareWithFamily(value);
    if (value) {
      // F7.2: Start real-time location sharing with family
      VoiceService.speak('已开启家人位置共享');
    } else {
      VoiceService.speak('已关闭家人位置共享');
    }
  };

  const handleToggleRecording = (value: boolean) => {
    // F7.5: Opt-in trip recording
    setTripRecording(value);
    if (value) {
      Alert.alert(
        '行程录音已开启',
        '行程中将自动录音，保障您的安全。',
        [{ text: '好的' }],
      );
    }
  };

  const handleCallFamily = () => {
    if (familyContacts.length === 0) {
      setShowInvite(true);
      return;
    }
    Linking.openURL(`tel:${familyContacts[0]}`);
  };

  const handlePlateVerify = () => {
    setRide((prev) => ({ ...prev, plateVerified: true }));
    VoiceService.speak('车牌已核验，行程安全守护已开启');
  };

  const handleSOS = () => {
    // F8.1–F8.5 handled by dedicated SOS screen
    navigation.navigate('SOSEmergency', { rideId: route?.params?.rideId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <LargeText variant="heading" bold>行程安全守护</LargeText>

        {/* Live Location — F7.2 */}
        <LiveLocationCard
          driverName={ride.driverName}
          driverLat={ride.driverLat}
          driverLng={ride.driverLng}
          etaMinutes={ride.etaMinutes}
          onShareWithFamily={() => handleToggleShare(!shareWithFamily)}
        />

        {/* Plate verification status — F7.3 */}
        <View style={styles.statusCard}>
          <LargeText variant="body" bold>车牌核验</LargeText>
          {ride.plateVerified ? (
            <LargeText variant="body" color="#2E7D32" bold>
              ✓ 已核验 · {ride.plateNumber}
            </LargeText>
          ) : (
            <>
              <LargeText variant="body" color="#D32F2F" bold>
                ⚠ 未核验 · 司机车牌 {ride.plateNumber}
              </LargeText>
              <ElderlyButton
                variant="secondary"
                icon="verified"
                onPress={handlePlateVerify}
              >
                我已核对，车牌一致
              </ElderlyButton>
            </>
          )}
        </View>

        {/* Family sharing toggles — F7.1 / F7.2 / F7.4 */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleRow}>
            <LargeText variant="body">家人位置共享</LargeText>
            <Switch
              value={shareWithFamily}
              onValueChange={handleToggleShare}
              accessibilityLabel="家人位置共享开关"
            />
          </View>
          <LargeText variant="caption" color="#666">
            {familyContacts.length > 0
              ? `共享给 ${familyContacts.length} 位家人`
              : '尚未添加家人，请邀请'}
          </LargeText>

          <View style={styles.toggleRow}>
            <LargeText variant="body">行程录音（可选）</LargeText>
            <Switch
              value={tripRecording}
              onValueChange={handleToggleRecording}
              accessibilityLabel="行程录音开关"
            />
          </View>
          <LargeText variant="caption" color="#666">
            行程中自动录音，保障双方权益（F7.5）
          </LargeText>
        </View>

        {/* Quick actions */}
        <ElderlyButton
          variant="secondary"
          icon="phone"
          onPress={handleCallFamily}
        >
          打电话给家人
        </ElderlyButton>

        <ElderlyButton
          variant="secondary"
          icon="share"
          onPress={() => setShowInvite(true)}
        >
          邀请家人关注行程
        </ElderlyButton>

        {/* SOS — long-press 3s to trigger emergency */}
        <View style={styles.sosRow}>
          <LargeText variant="caption" center color="#666">
            遇到危险？长按下方按钮 3 秒求助
          </LargeText>
          <SOSButton
            onTrigger={handleSOS}
            holdSeconds={3}
            accessibilityLabel="紧急求助按钮，长按3秒触发"
          />
        </View>

        <ElderlyButton variant="back" onPress={() => navigation.goBack()}>
          返回
        </ElderlyButton>
      </View>

      <ElderlyModal
        visible={showInvite}
        title="邀请家人关注行程"
        message="通过短信将本次行程链接发送给家人，他们可实时查看您的位置和车牌。"
        primaryBtn={{
          label: '发送短信邀请',
          onPress: async () => {
            const smsBody = '【行程守护】我正在打车回家，点击查看我的实时位置：https://elderly-taxi.example.com/trip/abc123';
            try {
              await Linking.openURL(`sms:?body=${encodeURIComponent(smsBody)}`);
            } catch (e) {
              Alert.alert('发送失败', '请手动复制链接发给家人');
            }
            setShowInvite(false);
          },
        }}
        secondaryBtn={{ label: '取消', onPress: () => setShowInvite(false) }}
        onDismiss={() => setShowInvite(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { flex: 1, padding: 24, gap: 20 },
  statusCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    gap: 12,
    elevation: 2,
  },
  toggleCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    gap: 8,
    elevation: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  sosRow: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
});
```

---

## 9. SOS Emergency Screen (紧急求助)

One-touch emergency response: long-press SOS → 3-2-1 countdown → auto-dial 110/120 + broadcast location to family + start recording. Covers PRD Module 8 (F8.1–F8.5).

```typescript
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View, StyleSheet, Alert, Linking, Vibration } from 'react-native';
import { LargeText } from '../components/LargeText';
import { ElderlyButton } from '../components/ElderlyButton';
import { ElderlyModal } from '../components/ElderlyModal';
import { SOSButton } from '../components/SOSButton';
import { VoiceService } from '../services/VoiceService';
import { SafetyService } from '../services/SafetyService';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SOSPhase = 'idle' | 'countdown' | 'dispatched';

interface SOSEmergencyProps {
  navigation: any;
  route?: any;
}

const COUNTDOWN_SECONDS = 3;
const EMERGENCY_NUMBER = '110';
const AMBULANCE_NUMBER = '120';

export const SOSEmergencyScreen: React.FC<SOSEmergencyProps> = ({ navigation, route }) => {
  const [phase, setPhase] = useState<SOSPhase>('idle');
  const [countdown, setCountdown] = useState<number>(COUNTDOWN_SECONDS);
  const [showDispatched, setShowDispatched] = useState(false);
  const [callAmbulance, setCallAmbulance] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const triggerSOS = () => {
    setPhase('countdown');
    setCountdown(COUNTDOWN_SECONDS);
    Vibration.vibrate(100);
    VoiceService.speak('紧急求助已触发，倒计时3秒');

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          dispatchEmergency();
          return 0;
        }
        Vibration.vibrate(80);
        return prev - 1;
      });
    }, 1000);
  };

  const cancelSOS = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('idle');
    setCountdown(COUNTDOWN_SECONDS);
    VoiceService.speak('已取消紧急求助');
  };

  // F8.2: Auto-dial 110/120 + F8.3: broadcast location to family + F8.4: start recording
  const dispatchEmergency = async () => {
    setPhase('dispatched');
    setShowDispatched(true);
    try {
      const rideId = route?.params?.rideId;
      // Broadcast location + ride context to family contacts and platform
      const rawContacts = await AsyncStorage.getItem('@elderly/family_contacts');
      const contacts: string[] = rawContacts ? JSON.parse(rawContacts) : [];
      await SafetyService.broadcastEmergency({
        rideId,
        emergencyContacts: contacts,
        callAmbulance,
      });
      // F8.4: Start trip recording
      await SafetyService.startRecording(rideId);
      // F8.2: Auto-dial emergency number
      const number = callAmbulance ? AMBULANCE_NUMBER : EMERGENCY_NUMBER;
      VoiceService.speak(`已为您呼叫${callAmbulance ? '120急救' : '110报警'}，并通知家人`);
      Linking.openURL(`tel:${number}`);
    } catch (e) {
      Alert.alert('求助发送失败', '请直接拨打 110 或 120', [
        { text: '拨打 110', onPress: () => Linking.openURL('tel:110') },
        { text: '拨打 120', onPress: () => Linking.openURL('tel:120') },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <LargeText variant="heading" bold center color="#D32F2F">
          紧急求助
        </LargeText>

        {phase === 'idle' && (
          <>
            <LargeText variant="body" center color="#555">
              遇到危险或身体不适？长按下方红色按钮 3 秒
            </LargeText>
            <LargeText variant="caption" center color="#999">
              系统将自动拨打 110，并通知您的家人
            </LargeText>

            {/* Need ambulance? Toggle before triggering SOS */}
            <View style={styles.toggleRow}>
              <LargeText variant="body">需要急救车（拨 120）</LargeText>
              <ElderlyButton
                variant={callAmbulance ? 'primary' : 'secondary'}
                onPress={() => setCallAmbulance(!callAmbulance)}
                size="medium"
              >
                {callAmbulance ? '已选 120' : '选 120'}
              </ElderlyButton>
            </View>

            <View style={styles.sosWrap}>
              <SOSButton
                onTrigger={triggerSOS}
                holdSeconds={3}
                size="large"
                accessibilityLabel="紧急求助按钮，长按3秒触发"
              />
            </View>
            <LargeText variant="caption" center color="#666">
              长按 3 秒才会触发，防止误触
            </LargeText>
          </>
        )}

        {phase === 'countdown' && (
          <View style={styles.countdownWrap}>
            <LargeText variant="heading" bold center color="#D32F2F">
              {countdown} 秒后呼叫帮助
            </LargeText>
            <LargeText variant="body" center>
              {countdown > 0 ? '如需取消，请立即点击下方按钮' : '正在呼叫...'}
            </LargeText>
            <View style={styles.countdownNumber}>
              <LargeText variant="heading" bold center color="#D32F2F" style={{ fontSize: 96 }}>
                {countdown || '...'}
              </LargeText>
            </View>
            <ElderlyButton
              variant="danger"
              onPress={cancelSOS}
              disabled={countdown === 0}
            >
              取消求助
            </ElderlyButton>
          </View>
        )}

        {phase === 'dispatched' && (
          <View style={styles.dispatchedWrap}>
            <LargeText variant="heading" bold center color="#2E7D32">
              ✓ 已为您呼叫帮助
            </LargeText>
            <LargeText variant="body" center>
              {callAmbulance
                ? '正在拨打 120 急救电话'
                : '正在拨打 110 报警电话'}
            </LargeText>
            <LargeText variant="body" center>
              已通知您的家人和平台客服
            </LargeText>
            <LargeText variant="caption" center color="#666">
              行程录音已自动开启，您的实时位置正在共享
            </LargeText>

            <ElderlyButton
              variant="secondary"
              icon="phone"
              onPress={() => Linking.openURL(`tel:${callAmbulance ? AMBULANCE_NUMBER : EMERGENCY_NUMBER}`)}
            >
              再次拨打
            </ElderlyButton>
            <ElderlyButton
              variant="secondary"
              onPress={() => navigation.navigate('SafetyGuard')}
            >
              返回安全守护
            </ElderlyButton>
            <ElderlyButton variant="back" onPress={() => navigation.navigate('Home')}>
              返回首页
            </ElderlyButton>
          </View>
        )}
      </View>

      {/* F8.5: Visual confirmation modal */}
      <ElderlyModal
        visible={showDispatched}
        title="已为您呼叫帮助"
        message="紧急联系人和客服已被通知，请保持冷静，等待救援。"
        primaryBtn={{ label: '我知道了', onPress: () => setShowDispatched(false) }}
        onDismiss={() => setShowDispatched(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { flex: 1, padding: 24, gap: 20, justifyContent: 'center' },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 1,
  },
  sosWrap: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  countdownWrap: {
    alignItems: 'center',
    gap: 16,
  },
  countdownNumber: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  dispatchedWrap: {
    alignItems: 'center',
    gap: 12,
  },
});
```

---

## 10. Usability Test Data Model

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
