package com.whatsappclone

import android.content.Intent
import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {
    
    companion object {
        private const val TAG = "MainActivity"
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Create notification channel
        NotificationModule.createNotificationChannel(this)
        
        // Handle deep link from notification
        handleIntent(intent)
    }
    
    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handleIntent(intent)
    }
    
    private fun handleIntent(intent: Intent?) {
        intent?.let {
            val screen = it.getStringExtra("screen")
            val data = it.extras?.let { bundle ->
                bundle.keySet().associateWith { key ->
                    bundle.getString(key) ?: ""
                }
            }
            
            if (screen != null) {
                Log.d(TAG, "Deep link to screen: $screen with data: $data")
                // Send event to React Native
                sendEventToReactNative("DeepLink", mapOf(
                    "screen" to screen,
                    "data" to (data ?: emptyMap())
                ))
            }
        }
    }
    
    private fun sendEventToReactNative(eventName: String, data: Map<String, Any>) {
        // This would typically be done through React Native's event emitter
        // For now, we'll just log it
        Log.d(TAG, "Sending event to React Native: $eventName with data: $data")
    }
    
    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "WhatsAppClone"
    
    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flag [fabricEnabled]
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
} 