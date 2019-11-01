import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import styled from 'styled-components/native'

const Container = styled.SafeAreaView`
  flex: 1;
  background: #fefefe;
  margin-bottom: 18px;
`

const MessageInput = styled.TextInput`
  padding: 16px;
  background: #fefefe;
  font-size: 16px;
  border-color: #eeeeee;
  border-top-width: 2px;
`

export default function Chat() {
  const messages = []

  function onSend(messages) {}

  return (
    <Container>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{ _id: 1 }}
        renderInputToolbar={props => <MessageInput {...props} />}
      />
    </Container>
  )
}
