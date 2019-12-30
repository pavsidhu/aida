import { useState, useEffect } from 'react'
import { PermissionsAndroid } from 'react-native'
import ImagePicker, { Image } from 'react-native-image-crop-picker'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import { useObserver, useObservable } from 'mobx-react-lite'
import { IMessage } from 'react-native-gifted-chat'

import onboardingStore from '../onboarding/onboardingStore'
import { MessageDoc, MessageType } from '../types/firestore'

const WORDS_PER_MINUTE = 200
const MESSAGE_DELAY = 1500

function calculateReadingTime(content: string) {
  const wordCount = content.split(' ').length
  return (wordCount / WORDS_PER_MINUTE) * 60 * 1000 + MESSAGE_DELAY
}

type AidaResponse = [
  IMessage[] | undefined,
  (message: IMessage) => void,
  {
    setGender: (gender: string) => void
    uploadPhoto: () => void
    showLocationPrompt: () => void
  }
]

export default function useAida(): AidaResponse {
  return useObserver(() => {
    const onboarding = useObservable(onboardingStore)

    const [messages, setMessages] = useState<IMessage[]>()
    const { currentUser } = auth()

    // Restore messages from firebase on initial load
    useEffect(() => {
      if (!currentUser) return

      const unsubscribe = firestore()
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
                  user: { _id: data.sender ? data.sender.id : 0 },
                  createdAt: new Date(data.createdAt._seconds * 1000)
                }
              })
            )
          )
        })

      // Handle onboarding if the user is new
      if (onboarding.hasNotStarted) nextOnboardingMessage(onboarding.step)

      return unsubscribe
    }, [])

    function nextOnboardingMessage(next: string) {
      if (!currentUser) return

      // Fetch the next onboarding message
      const onboardingMessage = onboarding.nextMessage(next)

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
          createdAt: new Date()
        })

      // Schedule the next message/action after the current message
      setTimeout(() => {
        if (!input) nextOnboardingMessage(route.next)
      }, calculateReadingTime(message))
    }

    async function setGender(gender: string) {
      if (!currentUser) return

      const { route, input } = onboarding.currentMessage

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
      const { route } = onboarding.currentMessage

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
      const { route } = onboarding.currentMessage

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).catch(() => nextOnboardingMessage(route.failure))

      switch (granted) {
        case PermissionsAndroid.RESULTS.GRANTED:
          nextOnboardingMessage(route.next)
          break

        case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
          nextOnboardingMessage(route.deny)
          break

        default:
          nextOnboardingMessage(route.failure)
      }
    }

    async function handleTextInput(message: IMessage) {
      if (!currentUser) return

      const text = message.text.trim()
      const { route, input } = onboarding.currentMessage

      if (input && route.next && route.failure) {
        if (text !== '') {
          if (input.name === 'name') {
            await currentUser.updateProfile({
              displayName: text
            })

            await firestore()
              .collection('users')
              .doc(currentUser.uid)
              .update({ name: text })
          }

          onboarding.context[input.name] = text
          nextOnboardingMessage(route.next)
        } else {
          nextOnboardingMessage(route.failure)
        }
      }
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

      if (onboarding.isOnboarding && message.user._id === currentUser.uid)
        await handleTextInput(message)
    }

    return [
      messages,
      addMessage,
      { uploadPhoto, showLocationPrompt, setGender }
    ]
  })
}
