import auth from '@react-native-firebase/auth'
import BackgroundTimer from 'react-native-background-timer'
import config from '../../config'
import onboardingStore from '../onboarding/onboardingStore'
import questioningStore from './questioningStore'

// Every thirty minutes check if a question is scheduled
BackgroundTimer.setInterval(async () => {
  if (onboardingStore.isOnboarding) return

  if (!questioningStore.nextQuestionTime) {
    questioningStore.generateNextQuestionTime()
    return
  }

  const unixTimestamp = new Date().getTime()

  // Check is message time in past
  if (questioningStore.nextQuestionTime <= unixTimestamp) {
    const idToken = await auth().currentUser?.getIdToken()

    if (!idToken) return

    const response = await fetch(`${config.server.url}/question`, {
      headers: { Authorization: 'Bearer ' + idToken }
    })

    if (response.status === 200) {
      const notification = new firebase.notifications.Notification()
        .setNotificationId('notificationId')
        .setTitle('My notification title')
        .setBody('My notification body')
        .setData({
          key1: 'value1',
          key2: 'value2'
        })

      questioningStore.generateNextQuestionTime()
    }
  }
}, 1000 * 60 * 30)
