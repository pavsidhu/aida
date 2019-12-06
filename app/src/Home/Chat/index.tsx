import React from 'react'
import styled from 'styled-components/native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import MessageBubble from '../../common/MessageBubble'
import useAida from '../../useAida'

const Container = styled.SafeAreaView`
  flex: 1;
  background: #fefefe;
  margin-bottom: 18px;
  justify-content: center;
`

export default function Chat() {
  const { currentUser } = auth()
  if (!currentUser) return null

  const [messages, addMessage] = useAida()

  function onSend(messages: IMessage[]) {
    const message = messages[0]

    addMessage({
      content: message.text,
      sender:
        message.user._id !== 0
          ? firestore().doc(`user/${message.user._id}`)
          : null,
      createdAt: message.createdAt
    })
  }

  return (
    <Container>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{ _id: currentUser.uid }}
        renderBubble={props => <MessageBubble {...props} />}
        renderAvatar={null}
        showAvatarForEveryMessage={false}
        renderAvatarOnTop={false}
        showUserAvatar={false}
      />
    </Container>
  )
}
