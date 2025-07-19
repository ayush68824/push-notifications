# 🚀 Quick Start Guide

Get the WhatsApp Clone with push notifications running in 5 minutes!

## Prerequisites

- Node.js (v16 or higher)
- Android device or emulator
- Expo Go app (for testing)

## Step 1: Install Dependencies

```bash
cd WhatsAppClone
npm install
```

## Step 2: Start the App

```bash
npm start
```

This will open the Expo development server. You'll see a QR code.

## Step 3: Run on Device

### Option A: Using Expo Go (Easiest)
1. Install Expo Go from Google Play Store
2. Scan the QR code with Expo Go
3. The app will load on your device

### Option B: Using Android Studio
1. Press 'a' in the terminal to open Android emulator
2. Or connect your Android device via USB

## Step 4: Test Notifications

Once the app is running:

1. **Grant notification permissions** when prompted
2. **Tap "Test Call Notification"** to see a call notification
3. **Tap "Test Chat Notification"** to see a message notification
4. **Navigate to Notifications screen** to see notification history

## Step 5: Test Backend (Optional)

To test with the backend simulation:

```bash
# Install backend dependencies
npm install express firebase-admin cors axios

# Start backend server
node backend-simulation.js

# In another terminal, run tests
node test-notifications.js
```

## Features to Test

### ✅ Core Features
- [ ] Push notifications work in background
- [ ] Call notifications with answer/reject
- [ ] Message notifications with chat navigation
- [ ] Notification settings and history
- [ ] Deep linking from notifications

### ✅ Advanced Features
- [ ] Badge counts on app icon
- [ ] Notification sound and vibration
- [ ] Notification persistence
- [ ] Background notification handling

## Troubleshooting

### Notifications not showing?
- Check notification permissions in device settings
- Test on physical device (not emulator)
- Ensure app is not in battery optimization

### App crashes?
- Clear Expo cache: `expo r -c`
- Restart development server
- Check console for error messages

### Backend not working?
- Ensure Node.js is installed
- Check if port 3000 is available
- Install dependencies: `npm install`

## Next Steps

1. **Customize the UI**: Modify colors, fonts, and layout
2. **Add Firebase**: Set up real FCM for production
3. **Implement backend**: Connect to your own server
4. **Add features**: Voice/video calling, file sharing, etc.

## Support

- Check the main README.md for detailed documentation
- Review the code comments for implementation details
- Test each feature systematically

---

**Happy coding! 🎉** 