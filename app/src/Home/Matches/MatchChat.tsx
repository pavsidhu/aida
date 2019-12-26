import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'
import firestore, {
  FirebaseFirestoreTypes
} from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { MatchDoc, UserDoc, MessageDoc } from 'src/firestore-docs'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import MessageBubble from '../../common/MessageBubble'
import colors from '../../colors'

const Container = styled.SafeAreaView`
  flex: 1;
  background: ${colors.white};
  margin-bottom: 18px;
  justify-content: center;
`

const LoadingIndicator = styled.ActivityIndicator`
  align-self: center;
`

interface Props extends NavigationStackScreenProps {}

export default function MatchChat(props: Props) {
  const id = props.navigation.getParam('id')

  const [loading, setLoading] = useState(true)
  const [match, setMatch] = useState<MatchDoc>()
  const [messages, setMessages] = useState<IMessage[]>()
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

    props.navigation.setParams({ title: matchedUser?.name })

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
    if (!currentUser) return

    const message = messages[0]

    firestore()
      .collection('matches')
      .doc(id)
      .collection('messages')
      .add({
        content: message.text,
        sender: firestore().doc(`user/${currentUser.uid}`),
        createdAt: message.createdAt
      })
  }

  return (
    <Container>
      {loading ? (
        <LoadingIndicator size="large" color="#5C30D3" />
      ) : (
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{ _id: currentUser.uid }}
          // renderInputToolbar={props => <MessageInput {...props} />}
          renderBubble={props => <MessageBubble {...props} />}
          renderAvatar={null}
          showAvatarForEveryMessage={false}
          renderAvatarOnTop={false}
          showUserAvatar={false}
        />
      )}
    </Container>
  )
}

MatchChat.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('title')
})
