const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test functions
async function testBackendHealth() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Backend health check:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Backend health check failed:', error.message);
    return false;
  }
}

async function registerToken(token) {
  try {
    const response = await axios.post(`${BASE_URL}/register-token`, { token });
    console.log('✅ Token registered:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Token registration failed:', error.message);
    return false;
  }
}

async function sendCallNotification(callerName, isVideoCall = false, token = null) {
  try {
    const payload = { callerName, isVideoCall };
    if (token) payload.token = token;
    
    const response = await axios.post(`${BASE_URL}/send-call-notification`, payload);
    console.log('✅ Call notification sent:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Call notification failed:', error.message);
    return false;
  }
}

async function sendMessageNotification(senderName, message, token = null) {
  try {
    const payload = { senderName, message };
    if (token) payload.token = token;
    
    const response = await axios.post(`${BASE_URL}/send-message-notification`, payload);
    console.log('✅ Message notification sent:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Message notification failed:', error.message);
    return false;
  }
}

async function sendCustomNotification(title, body, data = {}, token = null) {
  try {
    const payload = { title, body, data };
    if (token) payload.token = token;
    
    const response = await axios.post(`${BASE_URL}/send-notification`, payload);
    console.log('✅ Custom notification sent:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Custom notification failed:', error.message);
    return false;
  }
}

async function getRegisteredTokens() {
  try {
    const response = await axios.get(`${BASE_URL}/tokens`);
    console.log('✅ Registered tokens:', response.data);
    return response.data.tokens;
  } catch (error) {
    console.error('❌ Failed to get tokens:', error.message);
    return [];
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting notification tests...\n');
  
  // Test 1: Backend health
  console.log('1. Testing backend health...');
  const isHealthy = await testBackendHealth();
  if (!isHealthy) {
    console.log('❌ Backend is not running. Please start the backend server first.');
    console.log('Run: node backend-simulation.js');
    return;
  }
  
  // Test 2: Register a mock token
  console.log('\n2. Registering mock token...');
  const mockToken = 'mock-fcm-token-' + Date.now();
  await registerToken(mockToken);
  
  // Test 3: Send call notification
  console.log('\n3. Sending call notification...');
  await sendCallNotification('John Doe', false, mockToken);
  
  // Test 4: Send video call notification
  console.log('\n4. Sending video call notification...');
  await sendCallNotification('Jane Smith', true, mockToken);
  
  // Test 5: Send message notification
  console.log('\n5. Sending message notification...');
  await sendMessageNotification('Mike Johnson', 'Hey, how are you?', mockToken);
  
  // Test 6: Send custom notification
  console.log('\n6. Sending custom notification...');
  await sendCustomNotification(
    'System Update',
    'WhatsApp Clone has been updated to version 2.0',
    { type: 'system', version: '2.0' },
    mockToken
  );
  
  // Test 7: Get registered tokens
  console.log('\n7. Getting registered tokens...');
  await getRegisteredTokens();
  
  console.log('\n✅ All tests completed!');
  console.log('\n📱 To test on your device:');
  console.log('1. Start the backend: node backend-simulation.js');
  console.log('2. Run the app: npm start');
  console.log('3. Use the test buttons in the app or run this script');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testBackendHealth,
  registerToken,
  sendCallNotification,
  sendMessageNotification,
  sendCustomNotification,
  getRegisteredTokens,
  runTests
}; 