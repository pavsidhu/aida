import { useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { IMessage } from 'react-native-gifted-chat'
import { MessageDoc } from './firestore-docs'
import onboardingStore from './onboarding/onboardingStore'
import onboardingMessages from './onboarding'

const WORDS_PER_MINUTE = 200
// const MESSAGE_DELAY = 1500
const MESSAGE_DELAY = 0

function calculateReadingTime(content: string) {
  const wordCount = content.split(' ').length
  return (wordCount / WORDS_PER_MINUTE) * 60 * 1000 + MESSAGE_DELAY
}

export default function useAida(): [
  IMessage[] | undefined,
  (message: IMessage) => void
] {
  const forceUpdate = useState<string>()[1]

  const [messages, setMessages] = useState<IMessage[]>()

  const { currentUser } = auth()

  function addMessage(message: IMessage) {
    if (!currentUser) return

    if (onboardingStore.isOnboarding && message.user._id === currentUser.uid) {
      const { route, input } = onboardingMessages[onboardingStore.step]

      if (input && route.next && route.failure) {
        if (message.text.trim() !== '') {
          onboardingStore.step = route.next
          onboardingStore.context[input.name] = message.text.trim()
        } else {
          onboardingStore.step = route.failure
        }

        forceUpdate(onboardingStore.step)
      }
    }

    firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('messages')
      .add({
        content: message.text,
        sender:
          message.user._id !== 0
            ? firestore().doc(`user/${message.user._id}`)
            : null,
        createdAt: message.createdAt
      })
  }

  useEffect(() => {
    if (!currentUser) return

    return firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(async snapshot => {
        const previousMessages = await Promise.all(
          snapshot.docs.map(async doc => {
            const data = doc.data() as MessageDoc

            return {
              _id: doc.id,
              text: data.content,
              user: { _id: data.sender ? data.sender.id : 0 },
              createdAt: new Date(data.createdAt._seconds * 1000)
            }
          })
        )

        setMessages(previousMessages)
      })
  }, [])

  useEffect(() => {
    if (!onboardingStore.isOnboarding || !currentUser) return

    const { message, route, input } = onboardingMessages[onboardingStore.step]

    const parsedMessage = Object.keys(onboardingStore.context).reduce(
      (newMessage, key) =>
        newMessage.replace(`{{${key}}}`, onboardingStore.context[key]),
      message
    )

    firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('messages')
      .add({
        content: parsedMessage,
        sender: null,
        createdAt: new Date()
      })

    setTimeout(() => {
      if (route.next && !input) {
        onboardingStore.step = route.next
        forceUpdate(onboardingStore.step)
      }
    }, calculateReadingTime(parsedMessage))
  }, [onboardingStore.isOnboarding, onboardingStore.step])

  return [messages, addMessage]
}
