import React from 'react'
import styled from 'styled-components/native'
import IMatch from './IMatch'

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 24px;
`

const ProfilePicture = styled.Image`
  width: 72px;
  height: 72px;
  margin-right: 24px;
  border-radius: 36px;
`

const Details = styled.View`
  flex: 1;
`

const Name = styled.Text`
  font-weight: bold;
  font-size: 18px;
  color: #1b1b1b;
`

const LastMessage = styled.Text`
  font-size: 16px;
  color: #575757;
`

const LastMessageTime = styled.Text`
  font-size: 14px;
  color: #575757;
`

export default function Match(props: IMatch) {
  return (
    <Container>
      <ProfilePicture
        source={{
          uri: props.profilePicture
        }}
      />
      <Details>
        <Name>{props.fullName}</Name>
        <LastMessage>{props.lastMessage}</LastMessage>
      </Details>

      <LastMessageTime>{props.lastMessageTime}</LastMessageTime>
    </Container>
  )
}
