# System Architecture — Elderly Taxi Platform

## Use Case Diagram

```
                    ┌─────────────────────────────┐
                    │     适老化打车平台            │
                    │   (Elderly Taxi Platform)    │
                    └──────────────┬──────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
    ┌────┴────┐              ┌─────┴────┐             ┌─────┴────┐
    │ 老年用户 │              │  司机端   │             │ 亲友用户  │
    │ (Elderly)│              │ (Driver) │             │ (Family) │
    └────┬────┘              └─────┬────┘             └─────┬────┘
         │                         │                        │
    ┌────┴─────────────────────────┐  ┌──────────────────────┴─────┐
    │ UC1: 一键叫车                 │  │ UC12: 接单                  │
    │ UC2: 语音叫车                 │  │ UC13: 导航                  │
    │ UC3: 扫码叫车（新增）          │  └────────────────────────────┘
    │ UC4: 电话叫车（新增）          │
    │ UC5: 查看行程状态             │
    │ UC6: 设置大字模式             │  ┌─────────────────────────────┐
    │ UC7: 亲友代付                 │  │ UC9: 行程安全守护（新增）    │
    │ UC8: 现金支付（新增）          │  │ UC14: 代付确认              │
    │ UC10: 紧急求助（新增）         │  │ UC15: 行程查看/管理         │
    │ UC11: 就医优先派单（新增）     │  └─────────────────────────────┘
    └───────────────────────────────┘
```

## Business Flow Diagram (业务流程图)

```
    ┌──────────┐
    │ 用户打开APP │
    └─────┬────┘
          │
          ▼
    ┌──────────┐     ┌─────────────┐     ┌─────────────┐
    │ 首页展示  │────▶│ 一键打车回家 │     │ 扫码叫车     │
    │(大字模式) │     │ (预填地址)   │     │ (暖心车站)   │
    └─────┬────┘     └─────┬───────┘     └─────┬───────┘
          │                 │                  │
          ▼                 ▼                  ▼
    ┌──────────┐     ┌─────────────┐     ┌─────────────┐
    │ 语音叫车  │     │ 电话叫车     │     │ 95128热线   │
    │ (麦克风)  │     │ (客服代叫)   │     │             │
    └─────┬────┘     └─────┬───────┘     └─────────────┘
          │
          ▼
    ┌───────────────────┐
    │ 语音识别 + 置信度判断 │
    │ 高置信度→自动填充    │
    │ 低置信度→候选列表    │
    └─────────┬─────────┘
              │
              ▼
    ┌───────────────────┐
    │ 确认目的地         │
    │ (大字弹窗+预估费用) │
    └─────────┬─────────┘
              │
              ▼
    ┌───────────────────┐
    │ 就医优先派单(医院)  │
    │ 普通地点标准派单    │
    └─────────┬─────────┘
              │
              ▼
    ┌───────────────────┐
    │ 匹配司机           │
    │ 3分钟无接单自动扩范围│
    └─────────┬─────────┘
              │
              ▼
    ┌───────────────────┐
    │ 等待接驾+语音播报  │
    │ 亲友实时位置共享   │
    └─────────┬─────────┘
              │
              ▼
    ┌───────────────────┐
    │ 车牌号校验         │
    │ 不匹配→大字警告+通知亲友 │
    └─────────┬─────────┘
              │
              ▼
    ┌───────────────────┐
    │ 行程中（SOS守护）  │
    │ 长按SOS→110/120+位置共享 │
    └─────────┬─────────┘
              │
              ▼
    ┌───────────────────┐
    │ 行程结束 选择支付方式│
    │ 线上/现金/亲友代付  │
    └─────────┬─────────┘
              │
              ▼
    ┌───────────────────┐
    │ 行后关怀           │
    │ 医院到达通知+行程记录│
    └───────────────────┘
```

## Sequence Diagram — Voice Booking (语音叫车时序图)

```
  用户          APP前端          语音服务         后端API          司机端        亲友端
   │               │               │               │               │             │
   │──点击麦克风──▶│               │               │               │             │
   │               │──开始录音────▶│               │               │             │
   │──说话────────▶│               │               │               │             │
   │               │◀─返回文本+置信度│               │               │             │
   │               │──低置信度候选列表──────────────▶│               │             │
   │◀─候选列表/确认弹窗────────────────│               │               │             │
   │──确认叫车────▶│               │               │               │             │
   │               │──创建订单(就医优先?)───────────▶│               │             │
   │               │               │               │──推送订单────▶│             │
   │               │               │               │◀─司机接单─────│             │
   │               │◀─司机信息──────────────────────│               │             │
   │◀─语音播报+大字车牌号────────────│               │               │             │
   │               │               │               │────行程开始通知──────────────▶│
   │               │               │               │◀────查看实时轨迹─────────────│
   │               │               │               │               │             │
   │──长按SOS─────▶│               │               │               │             │
   │               │──紧急求助(110/120+位置共享)────▶│               │             │
   │               │               │               │────位置共享+录音启动─────────▶│
   │◀─已为您呼叫帮助───────────────│               │               │             │
   │               │               │               │               │             │
   │               │               │               │◀─结束行程─────│             │
   │◀─支付界面(线上/现金/代付)─────│               │               │             │
   │               │               │               │────支付链接─────────────────▶│
   │               │               │               │◀────确认代付─────────────────│
   │◀─支付完成+行后关怀────────────│               │               │             │
```

## Class Diagram (核心类图)

```
  ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
  │  ElderlyTheme    │      │  VoiceService     │      │  SafetyService   │
  │  Provider        │      │  (Singleton)      │      │  (NEW)           │
  ├──────────────────┤      ├──────────────────┤      ├──────────────────┤
  │ fontScale        │      │ language          │      │ shareLocation()  │
  │ largeTextMode    │      │ isListening       │      │ triggerSOS()     │
  │ highContrast     │      ├──────────────────┤      │ verifyPlate()    │
  │ spacing          │      │ init()            │      │ notifyFamily()   │
  ├──────────────────┤      │ start()           │      │ startRecording() │
  │ toggleLargeText()│      │ stop()            │      └────────┬─────────┘
  │ setFontScale()   │      │ onResult(cb)      │               │
  └────────┬─────────┘      │ speak(text)       │               │
           │                │ recognizeWithConfidence()         │
           │                └────────┬─────────┘               │
           │                         │                         │
    ┌──────┴─────────────────────────┴─────────────────────────┴──────┐
    │                         App (Root)                              │
    └─────────────────────────────┬───────────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
  ┌─────┴──────┐  ┌──────────────┴──────────────┐  ┌──────┴───────┐
  │ HomeScreen  │  │ VoiceBookingScreen          │  │ RideStatus   │
  │ OneTapCard[]│  │ VoiceInput + CandidateList  │  │ Screen       │
  │ voiceInput  │  │ confirm modal               │  │ LiveLocation │
  │ recentDest  │  │                             │  │ SOSButton    │
  └─────────────┘  └─────────────────────────────┘  │ plateVerify  │
                                                    └──────────────┘

  ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
  │  RideService      │      │  PaymentService   │      │  QRBooking     │
  ├──────────────────┤      ├──────────────────┤      │  HotlineBooking│
  │ createOrder()    │      │ selfPay()          │      └──────────────────┘
  │ cancelOrder()    │      │ cashPay() (NEW)    │
  │ getStatus()      │      │ familyPay()        │
  │ getDriverInfo()  │      │ getStatus()        │
  │ expandMatchRange()│     │ sendPayLink()      │
  │ setPriorityDispatch()   └──────────────────┘
  └──────────────────┘
```

## Component Architecture

```
  ┌─────────────────────────────────────────────────────────────┐
  │                        App Layer                              │
  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐│
  │  │ Home     │ │ Voice    │ │ QR       │ │ RideStatus       ││
  │  │ Screen   │ │ Booking  │ │ Booking  │ │ Screen           ││
  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────────────┘│
  │       │            │            │            │              │
  │  ┌────┴────────────┴────────────┴────────────┴──────────┐   │
  │  │        Elderly UI Components                          │   │
  │  │  ElderlyButton | OneTapCard | LargeText | SOSButton   │   │
  │  │  ElderlyModal  | VoiceInput | BottomNav | LiveLocation│   │
  │  └─────────────────────┬────────────────────────────────┘   │
  │                        │                                      │
  │  ┌─────────────────────┴─────────────────────┐               │
  │  │        Service Layer                        │               │
  │  │  VoiceService | RideService | PayService    │               │
  │  │  SafetyService (NEW)                        │               │
  │  └─────────────────────┬─────────────────────┘               │
  │                        │                                      │
  │  ┌─────────────────────┴─────────────────────┐               │
  │  │        Theme & State                        │               │
  │  │  ElderlyThemeProvider | AsyncStorage        │               │
  │  └───────────────────────────────────────────┘               │
  └─────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
  ┌─────┴──────┐        ┌──────┴──────┐        ┌──────┴──────┐
  │ External   │        │ External    │        │ External    │
  │ Speech API │        │ Ride API    │        │ Emergency   │
  │ TTS API    │        │ Payment API │        │ Service API │
  │ QR Scanner │        │ SMS Service │        │ 95128       │
  └────────────┘        └─────────────┘        └─────────────┘
```

## Module Dependency Map

```
  SKILL.md (Entry Point)
    ├── reference.md (Component API Reference)
    ├── examples.md (Screen Implementation Examples)
    ├── accessibility-guide.md (Design & Research Guide)
    ├── prd.md (Product Requirements Document)
    └── assets/architecture-diagram.md (This File)

  uml-output/
    ├── 01-use-case.puml                  (用例图: 15 use cases, 3 actors)
    ├── 02-business-flow.puml             (原始业务流程图)
    ├── 02-business-flow-enhanced.puml    (扩充业务流程图: 安全守护/SOS/现金/就医)
    ├── 03-sequence-voice-booking.puml    (语音叫车时序图: 7阶段)
    ├── 04-class-diagram.puml             (核心类图: 9 services, 11 screens, 14 components, 9 entities)
    ├── 05-component-architecture.puml    (深度组件架构: 3层, 35+组件)
    ├── 06-order-state-machine.puml       (订单生命周期状态机: 14 states, 18 transitions)
    ├── 07-sos-state-machine.puml         (SOS紧急状态机)
    ├── 08-deployment-architecture.puml   (部署架构: K8s, PostgreSQL, Redis, S3)
    ├── 09-sequence-qr-booking.puml       (扫码叫车时序图)
    ├── 10-sequence-sos-emergency.puml    (SOS紧急求助时序图)
    ├── 11-sequence-payment-flow.puml     (多支付方式时序图)
    ├── 12-er-diagram.puml                (ER实体关系图: 7 tables)
    ├── 13-data-flow-diagram.puml         (数据流图: Level 0 & 1)
    ├── 14-sequence-one-tap-booking.puml  (一键叫车时序图: 含登录/地址/车牌校验)
    ├── 15-sequence-hotline-booking.puml  (95128热线叫车时序图: IVR/客服/短信)
    ├── 16-sequence-medical-priority.puml (就医优先派单时序图: POI/权重/统计)
    ├── 17-sequence-family-tracking.puml  (亲友追踪与代付时序图: 异常检测/SOS)
    └── 18-activity-onboarding.puml       (引导与设置流程: 3步引导)

  scripts/
    ├── check-a11y.js (Accessibility Audit)
    └── gen-component.js (Component Scaffolding)
```
