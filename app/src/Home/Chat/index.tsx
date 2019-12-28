import React from 'react'
import styled from 'styled-components/native'
import auth from '@react-native-firebase/auth'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import MessageBubble from '../../common/MessageBubble'
import MessageInput from '../../common/MessageInput'
import useAida from '../../useAida'
import colors from '../../colors'
import onboardingStore from '../../onboarding/onboardingStore'
import MessageButton from '../../common/MessageButton'

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
  if (!currentUser) return null

  const [messages, addMessage, uploadPhoto, showLocationPrompt] = useAida()

  function onSend(messages: IMessage[]) {
    addMessage(messages[0])
  }

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
            if (onboardingStore.currentMessage.input?.type === 'photo')
              return (
                <MessageButton text="Upload a Photo" onPress={uploadPhoto} />
              )

            if (onboardingStore.currentMessage.input?.type === 'permission')
              return (
                <MessageButton
                  text="Enable Location Access"
                  onPress={showLocationPrompt}
                />
              )

            return <MessageInput {...props} />
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
