import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { format, isToday, isThisWeek } from 'date-fns'
import { MessageDoc, MatchDoc, UserDoc } from '../../firestore-docs'

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 24px;
`

const Photo = styled.Image`
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

function formatTime(date: Date) {
  if (isToday(date)) {
    return format(date, 'h:mm a').toLowerCase()
  }

  if (isThisWeek(date)) {
    return format(date, 'ccc')
  }

  return format(date, 'e MMM')
}

interface Props {
  match: MatchDoc
  onPress: () => void
}

export default function Match(props: Props) {
  const [lastMessage, setLastMessage] = useState<MessageDoc>()
  const { currentUser } = auth()

  if (!currentUser) return null

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('matches')
      .doc(props.match.id)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(async snapshot => {
        if (snapshot.docs.length === 0) return

        const doc = snapshot.docs[0]
        const data = doc.data() as MessageDoc
        setLastMessage(data)
      })

    return unsubscribe
  }, [])

  const matchedUser = (props.match.users as UserDoc[]).find(
    user => user.id !== currentUser.uid
  )

  const lastMessagePreview = lastMessage
    ? `${
        lastMessage.sender.id === currentUser.uid ? 'You' : matchedUser?.name
      }: ${lastMessage.content}`
    : 'Why not say hello?'

  const lastMessageTime = lastMessage
    ? formatTime(new Date(lastMessage.createdAt._seconds * 1000))
    : null

  return (
    <Container onPress={props.onPress}>
      <Photo source={{ uri: matchedUser?.photo }} />

      <Details>
        <Name numberOfLines={1}>{matchedUser?.name}</Name>
        <LastMessage numberOfLines={1}>{lastMessagePreview}</LastMessage>
      </Details>

      <LastMessageTime>{lastMessageTime}</LastMessageTime>
    </Container>
  )
}
