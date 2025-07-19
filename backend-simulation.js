const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
// Note: In production, you would need to download your service account key
// from Firebase Console and use it here
let serviceAccount;
try {
  serviceAccount = require('./firebase-service-account.json');
} catch (error) {
  console.log('Firebase service account not found. Using mock implementation.');
  serviceAccount = null;
}

let firebaseApp;
if (serviceAccount) {
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  console.log('Running in mock mode - notifications will be logged only');
}

// Store registered tokens (in production, use a database)
const registeredTokens = new Set();

// Routes
app.post('/register-token', (req, res) => {
  const { token } = req.body;
  if (token) {
    registeredTokens.add(token);
    console.log('Token registered:', token);
    res.json({ success: true, message: 'Token registered successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Token is required' });
  }
});

app.post('/send-notification', async (req, res) => {
  const { title, body, data, token } = req.body;
  
  if (!title || !body) {
    return res.status(400).json({ 
      success: false, 
      message: 'Title and body are required' 
    });
  }

  const message = {
    notification: {
      title,
      body,
    },
    data: data || {},
    android: {
      notification: {
        channelId: 'whatsapp_clone_channel',
        priority: 'high',
        sound: 'default',
        vibrateTimingsMillis: [0, 250, 250, 250],
        lightSettings: {
          color: '#FF231F7C',
          lightOnDurationMillis: 1000,
          lightOffDurationMillis: 1000,
        },
      },
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1,
        },
      },
    },
  };

  try {
    if (firebaseApp && token) {
      // Send to specific token
      const response = await admin.messaging().send({
        ...message,
        token,
      });
      console.log('Notification sent successfully:', response);
      res.json({ success: true, messageId: response });
    } else if (firebaseApp && registeredTokens.size > 0) {
      // Send to all registered tokens
      const response = await admin.messaging().sendMulticast({
        ...message,
        tokens: Array.from(registeredTokens),
      });
      console.log('Multicast sent successfully:', response);
      res.json({ 
        success: true, 
        successCount: response.successCount,
        failureCount: response.failureCount 
      });
    } else {
      // Mock response
      console.log('Mock notification sent:', { title, body, data });
      res.json({ success: true, message: 'Mock notification sent' });
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Specific notification endpoints
app.post('/send-call-notification', async (req, res) => {
  const { callerName, isVideoCall = false, token } = req.body;
  
  const message = {
    title: `${isVideoCall ? 'Video' : 'Voice'} Call`,
    body: `${callerName} is calling you...`,
    data: {
      screen: 'Call',
      callerName,
      isVideoCall: isVideoCall.toString(),
      isIncoming: 'true',
    },
  };

  try {
    const response = await sendNotification(message, token);
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/send-message-notification', async (req, res) => {
  const { senderName, message, token } = req.body;
  
  const notification = {
    title: `New message from ${senderName}`,
    body: message,
    data: {
      screen: 'Chat',
      senderName,
      message,
    },
  };

  try {
    const response = await sendNotification(notification, token);
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper function to send notifications
async function sendNotification(message, token) {
  const fcmMessage = {
    notification: {
      title: message.title,
      body: message.body,
    },
    data: message.data,
    android: {
      notification: {
        channelId: 'whatsapp_clone_channel',
        priority: 'high',
        sound: 'default',
      },
    },
  };

  if (firebaseApp && token) {
    const response = await admin.messaging().send({
      ...fcmMessage,
      token,
    });
    return { success: true, messageId: response };
  } else {
    console.log('Mock notification:', message);
    return { success: true, message: 'Mock notification sent' };
  }
}

// Get registered tokens
app.get('/tokens', (req, res) => {
  res.json({ 
    tokens: Array.from(registeredTokens),
    count: registeredTokens.size 
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    firebaseConfigured: !!firebaseApp,
    registeredTokens: registeredTokens.size
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend simulation server running on port ${PORT}`);
  console.log(`Firebase configured: ${!!firebaseApp}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Register token: POST http://localhost:${PORT}/register-token`);
  console.log(`Send notification: POST http://localhost:${PORT}/send-notification`);
});

// Example usage:
/*
// Register a token
curl -X POST http://localhost:3000/register-token \
  -H "Content-Type: application/json" \
  -d '{"token": "your-fcm-token-here"}'

// Send a call notification
curl -X POST http://localhost:3000/send-call-notification \
  -H "Content-Type: application/json" \
  -d '{"callerName": "John Doe", "isVideoCall": false, "token": "your-fcm-token"}'

// Send a message notification
curl -X POST http://localhost:3000/send-message-notification \
  -H "Content-Type: application/json" \
  -d '{"senderName": "Jane Smith", "message": "Hey, how are you?", "token": "your-fcm-token"}'
*/ 