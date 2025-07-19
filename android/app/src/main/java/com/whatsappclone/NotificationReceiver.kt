package com.whatsappclone

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class NotificationReceiver : BroadcastReceiver() {
    
    companion object {
        private const val TAG = "NotificationReceiver"
    }
    
    override fun onReceive(context: Context, intent: Intent) {
        when (intent.action) {
            "SHOW_NOTIFICATION" -> {
                val title = intent.getStringExtra("title") ?: "Notification"
                val body = intent.getStringExtra("body") ?: "You have a new notification"
                
                // Extract additional data
                val data = intent.extras?.let { bundle ->
                    bundle.keySet().associateWith { key ->
                        bundle.getString(key) ?: ""
                    }
                }
                
                Log.d(TAG, "Showing notification: $title - $body")
                
                // Show the notification
                NotificationModule.showNotification(context, title, body, data)
            }
        }
    }
} 