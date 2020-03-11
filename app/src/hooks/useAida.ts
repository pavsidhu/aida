import { useState, useEffect } from 'react'
import ImagePicker, { Image } from 'react-native-image-crop-picker'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging'
import { Dialogflow_V2 } from 'react-native-dialogflow'
import { IMessage } from 'react-native-gifted-chat'
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions'

import onboardingFlow from '../onboardingFlow'
import OnboardingMessage from '../types/OnboardingMessage'
import { MessageDoc, MessageType, UserDoc } from '../types/firestore'
import config from '../../config'
import { Platform } from 'react-native'

const WORDS_PER_MINUTE = 200
const MESSAGE_DELAY = 1500

function calculateReadingTime(content: string) {
  const wordCount = content.split(' ').length
  return (wordCount / WORDS_PER_MINUTE) * 60 * 1000 + MESSAGE_DELAY
}

type AidaResponse = [
  IMessage[] | undefined,
  OnboardingMessage['input'] | undefined,
  (message: IMessage) => void,
  {
    setGender: (gender: string) => void
    uploadPhoto: () => void
    showLocationPrompt: () => void
  }
]

export default function useAida(): AidaResponse {
  const [messages, setMessages] = useState<IMessage[]>()
  const [user, setUser] = useState<UserDoc>()
  const { currentUser } = auth()

  const onboarding = user?.onboarding

  // Restore messages from firebase on initial load
  useEffect(() => {
    if (!currentUser) return

    return firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(async snapshot => {
        setMessages(
          await Promise.all(
            snapshot.docs.map(async doc => {
              const data = doc.data() as MessageDoc

              return {
                _id: doc.id,
                text: data.type === MessageType.TEXT ? data.content : '',
                image:
                  data.type === MessageType.PHOTO ? data.content : undefined,
                match:
                  data.type === MessageType.MATCH ? data.content : undefined,
                user: { _id: data.sender ? data.sender.id : 0 },
                createdAt: new Date(data.createdAt._seconds * 1000)
              }
            })
          )
        )
      })
  }, [])

  // Get user
  useEffect(() => {
    if (!currentUser) return

    return firestore()
      .collection('users')
      .doc(currentUser.uid)
      .onSnapshot(async snapshot => {
        setUser(snapshot.data() as UserDoc)
      })
  }, [])

  // Handle onboarding if the user is new
  useEffect(() => {
    if (currentUser && onboarding?.isOnboarding) {
      firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('messages')
        .where('step', '==', onboarding.step)
        .get()
        .then(doc => {
          if (doc.size === 0) nextOnboardingMessage(onboarding.step)
        })
    }
  }, [onboarding?.isOnboarding])

  async function getMessage(step: string) {
    if (!currentUser) return

    const onboardingMessage = onboardingFlow.messages[step]
    const context: { [key: string]: any } =
      (await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .get()
        .then(doc => doc.data())) || {}

    // Replace message templates with data from the chatbot context
    const message = Object.keys(context).reduce(
      (newMessage, key) =>
        context[key]
          ? newMessage.replace(`{{${key}}}`, context[key])
          : newMessage,
      onboardingMessage.message
    )

    return { ...onboardingMessage, message }
  }

  function nextOnboardingMessage(next?: string) {
    // If no next onboarding has finished
    if (!next) {
      finishOnboarding()
      return
    }

    if (!currentUser) return

    // Fetch the next onboarding message
    firestore()
      .collection('users')
      .doc(currentUser.uid)
      .update({ onboarding: { ...onboarding, step: next } })
      .then(async () => {
        const onboardingMessage = await getMessage(next)

        // If there's no message onboarding has finished
        if (!onboardingMessage) return

        const { message, route, input } = onboardingMessage

        // Store the onboarding message
        firestore()
          .collection('users')
          .doc(currentUser.uid)
          .collection('messages')
          .add({
            content: message,
            type: MessageType.TEXT,
            sender: null,
            step: next,
            createdAt: new Date()
          })

        // Schedule the next message/action after the current message
        setTimeout(() => {
          if (!input) nextOnboardingMessage(route.next)
        }, calculateReadingTime(message))
      })
  }

  async function finishOnboarding() {
    if (!currentUser) return

    firestore()
      .collection('users')
      .doc(currentUser.uid)
      .update({
        onboarding: { isOnboarding: false }
      })

    const idToken = await currentUser.getIdToken()

    if (idToken) {
      await fetch(`${config.server.url}/onboarding/complete`, {
        headers: { Authorization: 'Bearer ' + idToken }
      })

      if (!messaging().hasPermission()) messaging().requestPermission()
    }
  }

  async function setGender(gender: string) {
    if (!currentUser || !user) return

    const onboardingMessage = await getMessage(user.onboarding.step)
    if (!onboardingMessage) return
    const { route, input } = onboardingMessage

    if (input?.values && !input.values.includes(gender)) {
      nextOnboardingMessage(route.failure)
      return
    }

    await firestore()
      .collection('users')
      .doc(currentUser.uid)
      .update({ gender })

    await firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('messages')
      .add({
        content: gender,
        type: MessageType.TEXT,
        sender: firestore().doc(`user/${currentUser.uid}`),
        createdAt: new Date()
      })

    nextOnboardingMessage(route.next)
  }

  async function uploadPhoto() {
    if (!user) return

    const onboardingMessage = await getMessage(user.onboarding.step)
    if (!onboardingMessage) return
    const { route } = onboardingMessage

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

        nextOnboardingMessage(route.next)
      }
    } catch (error) {
      nextOnboardingMessage(route.failure)
    }
  }

  async function showLocationPrompt() {
    if (!user) return

    const onboardingMessage = await getMessage(user.onboarding.step)
    if (!onboardingMessage) return
    const { route } = onboardingMessage

    const granted = await request(
      Platform.select({
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      })
    ).catch(() => nextOnboardingMessage(route.failure))

    switch (granted) {
      case RESULTS.GRANTED:
        nextOnboardingMessage(route.next)
        break

      case RESULTS.BLOCKED:
        nextOnboardingMessage(route.deny)
        break

      default:
        nextOnboardingMessage(route.failure)
    }
  }

  async function handleTextInput(message: IMessage) {
    if (!currentUser) return

    const text = message.text.trim()

    const messagesRef = firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('messages')

    const lastMessage = (
      await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .limit(2)
        .get()
    ).docs[1].data() as MessageDoc

    if (lastMessage.scheduled) return

    Dialogflow_V2.requestQuery(
      text,
      result =>
        messagesRef.add({
          content: (result as any).queryResult.fulfillmentText,
          sender: null,
          type: MessageType.TEXT,
          createdAt: new Date()
        }),
      () =>
        messagesRef.add({
          content:
            "Sorry I can't connect to the internet right now, please try again soon 😢",
          sender: null,
          type: MessageType.TEXT,
          createdAt: new Date()
        })
    )
  }

  async function handleOnboardingTextInput(message: IMessage) {
    const text = message.text.trim()

    if (!user) return

    const onboardingMessage = await getMessage(user.onboarding.step)
    if (!onboardingMessage) return
    const { route, input } = onboardingMessage

    if (text === '') nextOnboardingMessage(route.failure)

    if (!currentUser || !input) return

    if (input.name === 'name') {
      await currentUser.updateProfile({
        displayName: text
      })

      await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .update({ name: text })
    }

    if (input.name === 'age') {
      // Make sure text is a number
      if (isNaN(Number(text))) {
        nextOnboardingMessage(route.failure)
        return
      }

      if (Number(text) < 18) {
        nextOnboardingMessage(route.tooYoung)
        return
      }

      await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .update({ age: text })
    }

    nextOnboardingMessage(route.next)
  }

  async function addMessage(message: IMessage) {
    if (!currentUser) return

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

    if (message.user._id === currentUser.uid)
      onboarding?.isOnboarding
        ? handleOnboardingTextInput(message)
        : handleTextInput(message)
  }

  return [
    messages,
    onboarding ? onboardingFlow.messages[onboarding.step]?.input : undefined,
    addMessage,
    { uploadPhoto, showLocationPrompt, setGender }
  ]
}
