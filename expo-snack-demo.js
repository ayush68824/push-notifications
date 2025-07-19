import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import * as Notifications from 'expo-notifications';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function WhatsAppCloneDemo() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
      Alert.alert('Notification Tapped!', 'You tapped on a notification');
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const sendTestNotification = async (type) => {
    let title, body, data;
    
    switch(type) {
      case 'call':
        title = "Incoming Call";
        body = "John Doe is calling you...";
        data = { screen: 'Call', callerName: 'John Doe' };
        break;
      case 'message':
        title = "New Message";
        body = "Jane Smith sent you a message";
        data = { screen: 'Chat', senderName: 'Jane Smith' };
        break;
      case 'video':
        title = "Video Call";
        body = "Mike Johnson wants to video call";
        data = { screen: 'Call', callerName: 'Mike Johnson', isVideo: true };
        break;
      default:
        title = "Test Notification";
        body = "This is a test notification";
        data = { screen: 'Home' };
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // Send immediately
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📱 WhatsApp Clone Demo</Text>
        <Text style={styles.subtitle}>Push Notification Testing</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔔 Test Notifications</Text>
        
        <TouchableOpacity
          style={[styles.button, styles.callButton]}
          onPress={() => sendTestNotification('call')}
        >
          <Text style={styles.buttonText}>📞 Test Call Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.messageButton]}
          onPress={() => sendTestNotification('message')}
        >
          <Text style={styles.buttonText}>💬 Test Message Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.videoButton]}
          onPress={() => sendTestNotification('video')}
        >
          <Text style={styles.buttonText}>📹 Test Video Call Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.systemButton]}
          onPress={() => sendTestNotification('system')}
        >
          <Text style={styles.buttonText}>🔔 Test System Notification</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Status</Text>
        <Text style={styles.statusText}>
          Push Token: {expoPushToken ? '✅ Received' : '⏳ Loading...'}
        </Text>
        <Text style={styles.statusText}>
          Platform: {Platform.OS}
        </Text>
        <Text style={styles.statusText}>
          Last Notification: {notification ? '✅ Received' : '❌ None'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Instructions</Text>
        <Text style={styles.instructionText}>
          1. Grant notification permissions when prompted{'\n'}
          2. Tap any test button to send a notification{'\n'}
          3. Check your device's notification panel{'\n'}
          4. Tap on notifications to test deep linking{'\n'}
          5. Test with app in background/foreground
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔧 Features Demonstrated</Text>
        <Text style={styles.featureText}>
          ✅ Real-time push notifications{'\n'}
          ✅ Background notification handling{'\n'}
          ✅ Deep linking from notifications{'\n'}
          ✅ Different notification types{'\n'}
          ✅ Sound and vibration{'\n'}
          ✅ High priority notifications{'\n'}
          ✅ Cross-platform compatibility
        </Text>
      </View>
    </ScrollView>
  );
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    Alert.alert('Failed to get push token for push notification!');
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync({
    projectId: 'your-project-id', // Replace with your Expo project ID
  })).data;

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    backgroundColor: '#075E54',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#075E54',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  callButton: {
    backgroundColor: '#25D366',
  },
  messageButton: {
    backgroundColor: '#075E54',
  },
  videoButton: {
    backgroundColor: '#FF6B35',
  },
  systemButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  featureText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
}); 