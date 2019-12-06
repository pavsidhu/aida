import { useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { MessageDoc } from './firestore-docs'
import { IMessage } from 'react-native-gifted-chat'

export default function useAida(): [IMessage[], (message: IMessage) => void] {
  const [messages, setMessages] = useState<IMessage[]>()

  const { currentUser } = auth()

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

  function addMessage(message: IMessage) {
    const { currentUser } = auth()

    if (currentUser) {
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
  }

  return [messages, addMessage]
}
