import { useState, useEffect, useMemo } from 'react'
import { PermissionsAndroid } from 'react-native'
import ImagePicker, { Image } from 'react-native-image-crop-picker'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import { IMessage } from 'react-native-gifted-chat'
import { MessageDoc, MessageType } from './firestore-docs'
import onboardingStore from './onboarding/onboardingStore'

const WORDS_PER_MINUTE = 200
const MESSAGE_DELAY = 1500

function calculateReadingTime(content: string) {
  const wordCount = content.split(' ').length
  return (wordCount / WORDS_PER_MINUTE) * 60 * 1000 + MESSAGE_DELAY
}

export default function useAida(): [
  IMessage[] | undefined,
  (message: IMessage) => void,
  () => void,
  () => void
] {
  const forceUpdate = useState<string>()[1]
  const [messages, setMessages] = useState<IMessage[]>()
  const { currentUser } = auth()

  // Restore messages from firebase on initial load
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
              text: data.type === MessageType.TEXT ? data.content : '',
              image: data.type === MessageType.PHOTO ? data.content : undefined,
              user: { _id: data.sender ? data.sender.id : 0 },
              createdAt: new Date(data.createdAt._seconds * 1000)
            }
          })
        )

        setMessages(previousMessages)
      })
  }, [])

  // Handle onboarding if the user is new
  useMemo(() => {
    if (!onboardingStore.isOnboarding || !currentUser) return

    // Fetch the current onboarding message
    const { message, route, input } = onboardingStore.currentMessage

    // Replace message templates with data from the chatbot context
    const parsedMessage = Object.keys(onboardingStore.context).reduce(
      (newMessage, key) =>
        newMessage.replace(`{{${key}}}`, onboardingStore.context[key]),
      message
    )

    // Store the onboarding message
    firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('messages')
      .add({
        content: parsedMessage,
        type: MessageType.TEXT,
        sender: null,
        createdAt: new Date()
      })

    // Schedule the next message/action after the current message
    setTimeout(() => {
      if (!input && route.next) {
        onboardingStore.nextMessage(route.next)
        forceUpdate(onboardingStore.step)
      }
    }, calculateReadingTime(parsedMessage))
  }, [onboardingStore.isOnboarding, onboardingStore.currentMessage])

  async function uploadPhoto() {
    const { route } = onboardingStore.currentMessage

    try {
      const image = await ImagePicker.openPicker({
        width: 1000,
        height: 1000,
        cropping: true,
        includeBase64: true
      })

      const { data, mime } = image as Image

      if (currentUser && data) {
        const fileType = mime.split('/')[1]

        const ref = storage().ref(`${currentUser.uid}/photo.${fileType}`)
        await ref.putString(data, 'base64')

        await firestore()
          .collection('users')
          .doc(currentUser.uid)
          .collection('messages')
          .add({
            content: await ref.getDownloadURL(),
            type: MessageType.PHOTO,
            sender: firestore().doc(`user/${currentUser.uid}`),
            createdAt: new Date()
          })

        onboardingStore.nextMessage(route.next)
        forceUpdate(onboardingStore.step)
      }
    } catch (error) {
      onboardingStore.nextMessage(route.failure)
      forceUpdate(onboardingStore.step)
    }
  }

  async function showLocationPrompt() {
    const { route } = onboardingStore.currentMessage

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      )

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        onboardingStore.nextMessage(route.next)
      } else {
        onboardingStore.nextMessage(route.failure)
      }
    } catch {
      onboardingStore.nextMessage(route.failure)
    }

    forceUpdate(onboardingStore.step)
  }

  function addMessage(message: IMessage) {
    if (!currentUser) return

    if (onboardingStore.isOnboarding && message.user._id === currentUser.uid) {
      const { route, input } = onboardingStore.currentMessage

      if (input && route.next && route.failure) {
        if (message.text.trim() !== '') {
          onboardingStore.nextMessage(route.next)
          onboardingStore.context[input.name] = message.text.trim()
        } else {
          onboardingStore.nextMessage(route.failure)
        }

        forceUpdate(onboardingStore.step)
      }
    }

    // Store the message
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
        type: MessageType.TEXT,
        createdAt: message.createdAt
      })
  }

  return [messages, addMessage, uploadPhoto, showLocationPrompt]
}
