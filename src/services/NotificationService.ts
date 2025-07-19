import * as Notifications from 'expo-notifications';

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
  sound?: boolean;
  priority?: Notifications.AndroidNotificationPriority;
}

export class NotificationService {
  private static instance: NotificationService;
  private pushToken: string | null = null;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public setPushToken(token: string) {
    this.pushToken = token;
    console.log('Push token set:', token);
  }

  public getPushToken(): string | null {
    return this.pushToken;
  }

  // Simulate backend API call to send notification
  public async sendNotification(notification: NotificationData): Promise<boolean> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Send local notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: notification.sound ?? true,
          priority: notification.priority ?? Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Send immediately
      });

      console.log('Notification sent successfully:', notification);
      return true;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }

  // Send call notification
  public async sendCallNotification(callerName: string, isVideoCall: boolean = false): Promise<boolean> {
    return this.sendNotification({
      title: `${isVideoCall ? 'Video' : 'Voice'} Call`,
      body: `${callerName} is calling you...`,
      data: {
        screen: 'Call',
        callerName,
        isVideoCall,
        isIncoming: true,
      },
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    });
  }

  // Send message notification
  public async sendMessageNotification(senderName: string, message: string): Promise<boolean> {
    return this.sendNotification({
      title: `New message from ${senderName}`,
      body: message,
      data: {
        screen: 'Chat',
        senderName,
        message,
      },
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    });
  }

  // Send system notification
  public async sendSystemNotification(title: string, body: string): Promise<boolean> {
    return this.sendNotification({
      title,
      body,
      data: {
        screen: 'Notifications',
        type: 'system',
      },
      sound: false,
      priority: Notifications.AndroidNotificationPriority.DEFAULT,
    });
  }

  // Simulate incoming call with delay
  public async simulateIncomingCall(callerName: string, delay: number = 3000): Promise<void> {
    setTimeout(async () => {
      await this.sendCallNotification(callerName);
    }, delay);
  }

  // Simulate message notification with delay
  public async simulateMessageNotification(senderName: string, message: string, delay: number = 2000): Promise<void> {
    setTimeout(async () => {
      await this.sendMessageNotification(senderName, message);
    }, delay);
  }

  // Get notification history (simulated)
  public getNotificationHistory(): Array<{
    id: string;
    title: string;
    body: string;
    timestamp: string;
    type: 'call' | 'message' | 'system';
  }> {
    return [
      {
        id: '1',
        title: 'Incoming Call',
        body: 'John Doe is calling you...',
        timestamp: '2 minutes ago',
        type: 'call',
      },
      {
        id: '2',
        title: 'New message from Jane Smith',
        body: 'Can we meet tomorrow?',
        timestamp: '5 minutes ago',
        type: 'message',
      },
      {
        id: '3',
        title: 'System Update',
        body: 'WhatsApp Clone has been updated',
        timestamp: '1 hour ago',
        type: 'system',
      },
    ];
  }

  // Clear all notifications
  public async clearAllNotifications(): Promise<void> {
    try {
      await Notifications.dismissAllNotificationsAsync();
      console.log('All notifications cleared');
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }

  // Get notification badge count
  public async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('Failed to get badge count:', error);
      return 0;
    }
  }

  // Set notification badge count
  public async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Failed to set badge count:', error);
    }
  }
}

export default NotificationService; 