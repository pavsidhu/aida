import PushNotification from 'react-native-push-notification'
import config from '../config'

PushNotification.configure({
  senderID: config.firebase.senderId,

  onNotification: function(notification) {
    console.log('NOTIFICATION:', notification)
  }
})
