import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Notifications from 'expo-notifications';

interface Message {
  id: string;
  text: string;
  isSent: boolean;
  timestamp: string;
}

const ChatScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { chat } = route.params;
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey, how are you?',
      isSent: false,
      timestamp: '12:30 PM',
    },
    {
      id: '2',
      text: 'I\'m good, thanks! How about you?',
      isSent: true,
      timestamp: '12:31 PM',
    },
    {
      id: '3',
      text: 'Great! Are you free for a call?',
      isSent: false,
      timestamp: '12:32 PM',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        isSent: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, message]);
      setNewMessage('');

      // Send notification to the other person (simulated)
      setTimeout(() => {
        sendChatNotification();
      }, 1000);
    }
  };

  const sendChatNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `New message from ${chat.name}`,
        body: "You have a new message",
        data: { screen: 'Chat', chatId: chat.id, chatName: chat.name },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null,
    });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.isSent ? styles.sentMessage : styles.receivedMessage]}>
      <View style={[styles.messageBubble, item.isSent ? styles.sentBubble : styles.receivedBubble]}>
        <Text style={[styles.messageText, item.isSent ? styles.sentText : styles.receivedText]}>
          {item.text}
        </Text>
        <Text style={[styles.timestamp, item.isSent ? styles.sentTimestamp : styles.receivedTimestamp]}>
          {item.timestamp}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{chat.name}</Text>
          <Text style={styles.headerStatus}>
            {chat.isOnline ? 'online' : 'last seen recently'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => navigation.navigate('Call', { isIncoming: false, callerName: chat.name })}
        >
          <Text style={styles.callButtonText}>📞</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        inverted={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, newMessage.trim() ? styles.sendButtonActive : styles.sendButtonInactive]}
          onPress={sendMessage}
          disabled={!newMessage.trim()}
        >
          <Text style={styles.sendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5ddd5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#075E54',
  },
  backButton: {
    fontSize: 24,
    color: '#fff',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerStatus: {
    fontSize: 12,
    color: '#e0e0e0',
  },
  callButton: {
    padding: 8,
  },
  callButtonText: {
    fontSize: 20,
  },
  messagesList: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 8,
    flexDirection: 'row',
  },
  sentMessage: {
    justifyContent: 'flex-end',
  },
  receivedMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 16,
  },
  sentBubble: {
    backgroundColor: '#dcf8c6',
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  sentText: {
    color: '#000',
  },
  receivedText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  sentTimestamp: {
    color: '#666',
  },
  receivedTimestamp: {
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#25D366',
  },
  sendButtonInactive: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatScreen; 