import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import * as Notifications from 'expo-notifications';

const { width, height } = Dimensions.get('window');

const CallScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { isIncoming = false, callerName = 'Unknown', callerId } = route.params;
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);

  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    if (isIncoming) {
      // Start pulsing animation for incoming call
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => pulse());
      };
      pulse();
    }

    if (isCallActive) {
      // Start call timer
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isIncoming, isCallActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerCall = () => {
    setIsCallActive(true);
    pulseAnim.stopAnimation();
  };

  const handleRejectCall = () => {
    navigation.goBack();
  };

  const handleEndCall = () => {
    navigation.goBack();
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const handleToggleVideo = () => {
    setIsVideoCall(!isVideoCall);
  };

  const sendCallNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${isVideoCall ? 'Video' : 'Voice'} Call`,
        body: `${callerName} is calling you...`,
        data: { 
          screen: 'Call', 
          callerId, 
          callerName,
          isVideoCall,
          isIncoming: true 
        },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null,
    });
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.background}>
        <View style={styles.backgroundOverlay} />
      </View>

      {/* Call Info */}
      <View style={styles.callInfo}>
        <Animated.View style={[styles.avatar, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.avatarText}>👤</Text>
        </Animated.View>
        <Text style={styles.callerName}>{callerName}</Text>
        <Text style={styles.callStatus}>
          {isIncoming 
            ? 'Incoming call...' 
            : isCallActive 
              ? formatTime(callDuration)
              : 'Calling...'
          }
        </Text>
        {isVideoCall && <Text style={styles.callType}>Video call</Text>}
      </View>

      {/* Call Controls */}
      <View style={styles.controls}>
        {isIncoming && !isCallActive ? (
          // Incoming call controls
          <View style={styles.incomingControls}>
            <TouchableOpacity
              style={[styles.controlButton, styles.rejectButton]}
              onPress={handleRejectCall}
            >
              <Text style={styles.controlButtonText}>📞</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, styles.answerButton]}
              onPress={handleAnswerCall}
            >
              <Text style={styles.controlButtonText}>📞</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Active call controls
          <View style={styles.activeControls}>
            <TouchableOpacity
              style={[styles.controlButton, styles.muteButton]}
              onPress={handleToggleMute}
            >
              <Text style={styles.controlButtonText}>
                {isMuted ? '🔇' : '🎤'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, styles.speakerButton]}
              onPress={handleToggleSpeaker}
            >
              <Text style={styles.controlButtonText}>
                {isSpeakerOn ? '🔊' : '🔈'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, styles.videoButton]}
              onPress={handleToggleVideo}
            >
              <Text style={styles.controlButtonText}>
                {isVideoCall ? '📹' : '📷'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, styles.endCallButton]}
              onPress={handleEndCall}
            >
              <Text style={styles.controlButtonText}>📞</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Test Button */}
      <TouchableOpacity
        style={styles.testButton}
        onPress={sendCallNotification}
      >
        <Text style={styles.testButtonText}>Test Call Notification</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#075E54',
  },
  backgroundOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  callInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 60,
  },
  callerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  callStatus: {
    fontSize: 18,
    color: '#e0e0e0',
    marginBottom: 8,
  },
  callType: {
    fontSize: 16,
    color: '#25D366',
    fontWeight: 'bold',
  },
  controls: {
    paddingBottom: 50,
  },
  incomingControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  activeControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  answerButton: {
    backgroundColor: '#4CAF50',
  },
  muteButton: {
    backgroundColor: '#666',
  },
  speakerButton: {
    backgroundColor: '#666',
  },
  videoButton: {
    backgroundColor: '#666',
  },
  endCallButton: {
    backgroundColor: '#f44336',
  },
  controlButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  testButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#075E54',
    padding: 16,
    borderRadius: 8,
  },
  testButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CallScreen; 