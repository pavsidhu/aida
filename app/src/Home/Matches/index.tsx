import React from 'react'
import styled from 'styled-components/native'
import Match from './Match'
import IMatch from './IMatch'
import { ScrollView } from 'react-native-gesture-handler'

const Container = styled.SafeAreaView`
  flex: 1;
  background: #fefefe;
`

export default function Matches() {
  const matchList: IMatch[] = []

  return (
    <Container>
      <ScrollView>
        {matchList.map(match => (
          <Match
            fullName={match.fullName}
            profilePicture={match.profilePicture}
            lastMessage={match.lastMessage}
            lastMessageTime={match.lastMessageTime}
          />
        ))}
      </ScrollView>
    </Container>
  )
}
