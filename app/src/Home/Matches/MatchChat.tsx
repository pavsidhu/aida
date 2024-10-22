import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'
import { useNavigation } from 'react-navigation-hooks'
import { NavigationStackProp } from 'react-navigation-stack'
import firestore, {
  FirebaseFirestoreTypes
} from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'

import { MessageBubble, MessageInput } from '../../common'
import colors from '../../colors'
import {
  MatchDoc,
  UserDoc,
  MessageDoc,
  MessageType
} from '../../types/firestore'
import config from '../../../config'

const Container = styled.SafeAreaView`
  flex: 1;
  background: ${colors.lilac};
  justify-content: center;
`

const LoadingIndicator = styled.ActivityIndicator`
  align-self: center;
`

export default function MatchChat() {
  const navigation = useNavigation()
  const id = navigation.getParam('id')
  const [match, setMatch] = useState<MatchDoc>()
  const [messages, setMessages] = useState<IMessage[]>()
  const [loading, setLoading] = useState(true)
  const { currentUser } = auth()

  if (!currentUser) return null

  useEffect(() => {
    if (!loading) return

    const unsubscribe = firestore()
      .collection('matches')
      .doc(id)
      .onSnapshot(async snapshot => {
        const data = snapshot.data() as MatchDoc

        const userRefs = data.users as FirebaseFirestoreTypes.DocumentReference[]
        const users = await Promise.all(
          userRefs.map(
            async userRef =>
              ({
                id: userRef.id,
                ...(await userRef.get()).data()
              } as UserDoc)
          )
        )

        await Promise.all(
          users.map(async user => {
            user.photo = await storage()
              .ref(`${currentUser.uid}/photo.jpeg`)
              .getDownloadURL()
          })
        )

        setMatch({
          ...data,
          id: snapshot.id,
          users
        })
      })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (!match) return

    const matchedUser = (match.users as UserDoc[]).find(
      user => user.id !== currentUser.uid
    )

    navigation.setParams({ title: matchedUser?.name })

    const unsubscribe = firestore()
      .collection('matches')
      .doc(id)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(async snapshot => {
        const previousMessages = await Promise.all(
          snapshot.docs.map(async doc => {
            const data = doc.data() as MessageDoc

            return {
              _id: doc.id,
              text: data.content,
              user: { _id: data.sender.id },
              createdAt: new Date(data.createdAt._seconds * 1000)
            }
          })
        )

        setMessages(previousMessages)

        if (loading) setLoading(false)
      })

    return unsubscribe
  }, [match])

  function onSend(messages: IMessage[]) {
    if (!currentUser || !match) return

    const message = messages[0]

    firestore()
      .collection('matches')
      .doc(id)
      .collection('messages')
      .add({
        content: message.text,
        type: MessageType.TEXT,
        sender: firestore().doc(`user/${currentUser.uid}`),
        createdAt: message.createdAt
      })

    const users = match.users as UserDoc[]
    const me = users.find(({ id }) => id === currentUser.uid)

    // Send notification to other user
    if (me) {
      fetch(config.firebase.messaging.url, {
        method: 'POST',
        headers: {
          Authorization: `key=${config.firebase.messaging.serverKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: `/topics/match-${match.id}`,
          notification: {
            title: me.name,
            body: message.text
          }
        })
      })
    }
  }

  return (
    <Container>
      {loading ? (
        <LoadingIndicator size="large" color={colors.purple} />
      ) : (
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{ _id: currentUser.uid }}
          renderInputToolbar={props => <MessageInput {...props} />}
          renderBubble={props => <MessageBubble {...props} />}
          renderAvatar={null}
          showAvatarForEveryMessage={false}
          renderAvatarOnTop={false}
          showUserAvatar={false}
          minInputToolbarHeight={82}
        />
      )}
    </Container>
  )
}

MatchChat.navigationOptions = ({
  navigation
}: {
  navigation: NavigationStackProp
}) => ({
  title: navigation.getParam('title')
})
