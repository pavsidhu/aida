import React, { useState } from 'react'
import styled from 'styled-components/native'
import { InputToolbar } from 'react-native-gifted-chat'

import colors from '../colors'

const Container = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  padding: 0 16px;
  background-color: ${colors.white};
  border-color: #eeeeee;
  border-top-width: 2px;
  flex-direction: row;
  align-items: center;
`

const Input = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: ${colors.black};
`

const SendButton = styled.TouchableOpacity`
  height: 100%;
  flex-direction: row;
  align-items: center;
`

const SendButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${colors.purple};
`

function MessageInput(props: InputToolbar['props']) {
  const [message, setMessage] = useState<string>('')

  return (
    <Container>
      <Input
        placeholder="Type a message..."
        value={message}
        onChangeText={value => setMessage(value)}
      />
      <SendButton onPress={() => props.onSend({ text: message.trim() }, true)}>
        <SendButtonText>{message.trim() ? 'Send' : ''}</SendButtonText>
      </SendButton>
    </Container>
  )
}

export default MessageInput
