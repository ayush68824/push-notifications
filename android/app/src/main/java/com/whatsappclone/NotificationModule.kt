package com.whatsappclone

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.os.Build
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import android.util.Log

class NotificationModule : FirebaseMessagingService() {
    
    companion object {
        private const val TAG = "NotificationModule"
        private const val CHANNEL_ID = "whatsapp_clone_channel"
        private const val CHANNEL_NAME = "WhatsApp Clone Notifications"
        private const val CHANNEL_DESCRIPTION = "Notifications for WhatsApp Clone app"
        
        fun createNotificationChannel(context: Context) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val channel = NotificationChannel(
                    CHANNEL_ID,
                    CHANNEL_NAME,
                    NotificationManager.IMPORTANCE_HIGH
                ).apply {
                    description = CHANNEL_DESCRIPTION
                    enableLights(true)
                    enableVibration(true)
                    setShowBadge(true)
                }
                
                val notificationManager = context.getSystemService(NotificationManager::class.java)
                notificationManager.createNotificationChannel(channel)
            }
        }
        
        fun showNotification(
            context: Context,
            title: String,
            body: String,
            data: Map<String, String>? = null
        ) {
            val intent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                data?.forEach { (key, value) ->
                    putExtra(key, value)
                }
            }
            
            val pendingIntent = PendingIntent.getActivity(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            
            val defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
            
            val notificationBuilder = NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_notification)
                .setContentTitle(title)
                .setContentText(body)
                .setAutoCancel(true)
                .setSound(defaultSoundUri)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setContentIntent(pendingIntent)
                .setVibrate(longArrayOf(0, 250, 250, 250))
                .setLights(0xFF231F7C, 1000, 1000)
            
            // Add badge count
            data?.get("badge")?.toIntOrNull()?.let { badge ->
                notificationBuilder.setNumber(badge)
            }
            
            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.notify(System.currentTimeMillis().toInt(), notificationBuilder.build())
        }
    }
    
    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d(TAG, "New FCM token: $token")
        // Send token to your server
        sendTokenToServer(token)
    }
    
    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        Log.d(TAG, "Message received from: ${remoteMessage.from}")
        
        // Handle data payload
        remoteMessage.data.isNotEmpty().let {
            Log.d(TAG, "Message data payload: ${remoteMessage.data}")
            
            val title = remoteMessage.data["title"] ?: "New Notification"
            val body = remoteMessage.data["body"] ?: "You have a new notification"
            
            // Show notification
            showNotification(this, title, body, remoteMessage.data)
        }
        
        // Handle notification payload
        remoteMessage.notification?.let { notification ->
            Log.d(TAG, "Message notification payload: ${notification.title}")
            
            val title = notification.title ?: "New Notification"
            val body = notification.body ?: "You have a new notification"
            
            // Show notification
            showNotification(this, title, body, remoteMessage.data)
        }
    }
    
    private fun sendTokenToServer(token: String) {
        // TODO: Implement token sending to your backend server
        Log.d(TAG, "Sending token to server: $token")
    }
}

// Extension function for handling deep links
fun handleDeepLink(context: Context, data: Map<String, String>) {
    val screen = data["screen"]
    val intent = Intent(context, MainActivity::class.java).apply {
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        putExtra("screen", screen)
        data.forEach { (key, value) ->
            putExtra(key, value)
        }
    }
    context.startActivity(intent)
}

// Notification badge manager
object BadgeManager {
    fun updateBadgeCount(context: Context, count: Int) {
        // For Samsung devices
        try {
            val intent = Intent("android.intent.action.BADGE_COUNT_UPDATE")
            intent.putExtra("badge_count", count)
            intent.putExtra("badge_count_package_name", context.packageName)
            intent.putExtra("badge_count_class_name", "com.whatsappclone.MainActivity")
            context.sendBroadcast(intent)
        } catch (e: Exception) {
            Log.e("BadgeManager", "Failed to update badge count", e)
        }
        
        // For other devices, you might need to use ShortcutBadger library
        // ShortcutBadger.applyCount(context, count)
    }
    
    fun clearBadge(context: Context) {
        updateBadgeCount(context, 0)
    }
}

// Local notification manager
object LocalNotificationManager {
    fun scheduleNotification(
        context: Context,
        title: String,
        body: String,
        delay: Long = 0,
        data: Map<String, String>? = null
    ) {
        val intent = Intent(context, NotificationModule::class.java).apply {
            action = "SHOW_NOTIFICATION"
            putExtra("title", title)
            putExtra("body", body)
            data?.forEach { (key, value) ->
                putExtra(key, value)
            }
        }
        
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            System.currentTimeMillis().toInt(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        
        // Schedule notification using AlarmManager
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as android.app.AlarmManager
        val triggerTime = System.currentTimeMillis() + delay
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setExactAndAllowWhileIdle(
                android.app.AlarmManager.RTC_WAKEUP,
                triggerTime,
                pendingIntent
            )
        } else {
            alarmManager.setExact(
                android.app.AlarmManager.RTC_WAKEUP,
                triggerTime,
                pendingIntent
            )
        }
    }
} 