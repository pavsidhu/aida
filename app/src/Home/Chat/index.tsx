import React from 'react'
import styled from 'styled-components/native'
import auth from '@react-native-firebase/auth'
import { useObservable } from 'mobx-react-lite'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'

import {
  MessageBubble,
  MessageButton,
  MessageInput,
  MessageOptions
} from '../../common'
import useAida from '../../hooks/useAida'
import colors from '../../colors'
import onboardingStore from '../../onboarding/onboardingStore'

const Container = styled.SafeAreaView`
  flex: 1;
  background: ${colors.white};
  justify-content: center;
`

const LoadingIndicator = styled.ActivityIndicator`
  align-self: center;
`

export default function Chat() {
  const { currentUser } = auth()
  const onboarding = useObservable(onboardingStore)
  const [messages, addMessage, addInput] = useAida()

  if (!currentUser) return null

  function onSend(messages: IMessage[]) {
    addMessage(messages[0])
  }

  const { input } = onboarding.currentMessage

  return (
    <Container>
      {!messages ? (
        <LoadingIndicator size="large" color={colors.purple} />
      ) : (
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{ _id: currentUser.uid }}
          renderInputToolbar={props => {
            switch (input?.type) {
              case 'photo':
                return (
                  <MessageButton
                    text="Upload a Photo"
                    onPress={addInput.uploadPhoto}
                  />
                )

              case 'options':
                return (
                  input.values && (
                    <MessageOptions
                      options={input.values}
                      onPress={addInput.setGender}
                    />
                  )
                )

              case 'permission':
                return (
                  <MessageButton
                    text="Enable Location Access"
                    onPress={addInput.showLocationPrompt}
                  />
                )

              default:
                return <MessageInput {...props} />
            }
          }}
          renderBubble={props => <MessageBubble {...props} />}
          renderAvatar={null}
          showAvatarForEveryMessage={false}
          renderAvatarOnTop={false}
          showUserAvatar={false}
          minInputToolbarHeight={60}
        />
      )}
    </Container>
  )
}
