import React, { useState } from 'react'
import styled from 'styled-components/native'
import { InputToolbar } from 'react-native-gifted-chat'

import colors from '../colors'
import { Dimensions } from 'react-native'

const Container = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  margin: 16px;
  width: ${Dimensions.get('window').width - 32}px;
  border-radius: 18px;
  elevation: 1;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  height: 60px;
  padding: 0 16px;
  background-color: ${colors.white};
  border-color: ${colors.lightGrey};
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
      <SendButton
        onPress={() => {
          props.onSend({ text: message.trim() }, true)
          setMessage('')
        }}
      >
        <SendButtonText>{message.trim() ? 'Send' : ''}</SendButtonText>
      </SendButton>
    </Container>
  )
}

export default MessageInput
