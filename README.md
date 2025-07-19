# WhatsApp Clone with Push Notifications

A React Native mobile application that demonstrates real-time push notifications similar to WhatsApp, including voice and video call notifications. This project is designed for Android 15 compatibility and includes native Android modules for notification handling.

## 🚀 Features

### Core Functionality
- **Real-time Push Notifications**: Receive notifications even when the app is in background or killed
- **WhatsApp-like UI**: Modern, clean interface with chat list, messaging, and call screens
- **Native Android Module**: Custom Kotlin implementation for notification handling
- **Firebase Cloud Messaging (FCM)**: Integration for reliable push notifications
- **Deep Linking**: Click notifications to navigate to specific screens
- **Badge Counts**: Unread message indicators like WhatsApp
- **Local Notification Storage**: Persistent notification history

### Notification Types
- **Call Notifications**: Incoming voice/video call alerts
- **Message Notifications**: New message alerts with sender information
- **System Notifications**: App updates and system messages
- **Background Notifications**: Work even when app is not active

### Advanced Features
- **Notification Settings**: Toggle sound, vibration, and badge counts
- **Call Interface**: Full-screen call UI with answer/reject options
- **Chat Interface**: Real-time messaging with message bubbles
- **Notification History**: View and manage past notifications
- **Test Notifications**: Built-in testing tools for all notification types

## 🛠️ Technology Stack

- **React Native**: Cross-platform mobile development
- **TypeScript**: Type-safe JavaScript
- **Expo**: Development platform and tools
- **Firebase Cloud Messaging**: Push notification service
- **Kotlin**: Native Android development
- **React Navigation**: Screen navigation
- **Expo Notifications**: Notification handling

## 📱 Screenshots

The app includes the following screens:
- **Home Screen**: Chat list with unread badges
- **Chat Screen**: WhatsApp-style messaging interface
- **Call Screen**: Voice/video call interface
- **Notifications Screen**: Notification history and settings

## 🏗️ Project Structure

```
WhatsAppClone/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx          # Main chat list
│   │   ├── ChatScreen.tsx          # Messaging interface
│   │   ├── CallScreen.tsx          # Call interface
│   │   └── NotificationScreen.tsx  # Notification management
│   ├── services/
│   │   └── NotificationService.ts  # Notification service
│   └── types/                      # TypeScript definitions
├── android/
│   └── app/src/main/java/com/whatsappclone/
│       ├── NotificationModule.kt   # Native notification handler
│       ├── MainActivity.kt         # Main activity with deep linking
│       ├── BootReceiver.kt         # Boot completion handler
│       └── NotificationReceiver.kt # Local notification receiver
├── App.tsx                         # Main app component
└── package.json                    # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Android Studio (for Android development)
- Physical Android device (for push notification testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WhatsAppClone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Expo CLI globally**
   ```bash
   npm install -g @expo/cli
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on Android device**
   ```bash
   npm run android
   ```

### Firebase Setup (Optional)

For production push notifications:

1. Create a Firebase project
2. Download `google-services.json` to `android/app/`
3. Configure Firebase Cloud Messaging
4. Update the notification service with your FCM credentials

## 🔧 Configuration

### Android Permissions

The app requires the following permissions:
- `INTERNET`: For network communication
- `WAKE_LOCK`: For background notification processing
- `VIBRATE`: For notification vibration
- `POST_NOTIFICATIONS`: For Android 13+ notification permission
- Badge count permissions for various device manufacturers

### Notification Channels

The app creates a notification channel with:
- High importance priority
- Sound and vibration enabled
- Badge count support
- LED light notifications

## 📋 Usage

### Testing Notifications

1. **Test Call Notification**: Tap "Test Call Notification" button
2. **Test Chat Notification**: Tap "Test Chat Notification" button
3. **Test System Notification**: Use the notification settings screen

### Deep Linking

The app supports deep linking with the scheme `whatsappclone://`:
- `whatsappclone://chat?id=123` - Open specific chat
- `whatsappclone://call?id=456` - Open call screen
- `whatsappclone://notifications` - Open notifications screen

### Notification Settings

Access notification settings from the notifications screen:
- Toggle push notifications
- Enable/disable sound
- Configure vibration
- Manage badge counts

## 🔍 Key Features Explained

### Native Android Module

The `NotificationModule.kt` provides:
- **FCM Integration**: Handles Firebase Cloud Messaging
- **Notification Channels**: Android 8+ notification channels
- **Deep Linking**: Handles notification taps
- **Badge Management**: App icon badge counts
- **Background Processing**: Works when app is killed

### React Native Integration

The app uses Expo Notifications for:
- **Permission Handling**: Request notification permissions
- **Token Management**: Get and store FCM tokens
- **Local Notifications**: Schedule immediate notifications
- **Notification Listeners**: Handle notification events

### Background Notifications

The app handles notifications in all states:
- **Foreground**: App is open and active
- **Background**: App is minimized
- **Killed**: App is completely closed

## 🧪 Testing

### Manual Testing

1. **Install the app on a physical device**
2. **Grant notification permissions**
3. **Test each notification type**:
   - Call notifications
   - Message notifications
   - System notifications
4. **Test background behavior**:
   - Minimize app and send notification
   - Kill app and send notification
5. **Test deep linking**:
   - Tap notifications to navigate

### Automated Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📦 Building for Production

### Android APK

```bash
# Build APK
expo build:android

# Or use EAS Build
eas build --platform android
```

### Release Configuration

1. Update `app.json` with your app details
2. Configure signing keys for Android
3. Set up Firebase project for production
4. Test on multiple Android devices

## 🔒 Security Considerations

- **Token Security**: FCM tokens should be stored securely
- **Permission Handling**: Request permissions appropriately
- **Data Privacy**: Handle user data according to privacy laws
- **Backend Security**: Implement proper authentication for notification sending

## 🐛 Troubleshooting

### Common Issues

1. **Notifications not showing**:
   - Check notification permissions
   - Verify notification channel creation
   - Test on physical device (not emulator)

2. **Deep linking not working**:
   - Verify intent filters in AndroidManifest.xml
   - Check navigation setup in React Native

3. **Background notifications failing**:
   - Ensure proper service registration
   - Check battery optimization settings
   - Verify FCM configuration

### Debug Mode

Enable debug logging:
```typescript
// In NotificationService.ts
console.log('Debug: Notification sent', notification);
```

## 📚 Additional Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Notifications Guide](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Android Notification Best Practices](https://developer.android.com/guide/topics/ui/notifiers/notifications)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React Native community
- Expo team for excellent tooling
- Firebase team for reliable messaging service
- WhatsApp for UI inspiration

---

**Note**: This is a demonstration project for learning purposes. For production use, ensure proper security measures and compliance with platform guidelines. 