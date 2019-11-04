import React from 'react'
import styled from 'styled-components/native'
import Match from './Match'
import IMatch from './IMatch'
import { ScrollView } from 'react-native-gesture-handler'

const Container = styled.SafeAreaView`
  flex: 1;
  background: #fefefe;
`

const NoMatchesContainer = styled.SafeAreaView`
  flex: 1;
  background: #fefefe;
  justify-content: center;
  align-items: center;
`

const NoMatchesText = styled.Text`
  font-size: 16px;
`

export default function Matches() {
  const matchList: IMatch[] = []

  return matchList.length > 0 ? (
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
  ) : (
    <NoMatchesContainer>
      <NoMatchesText>
        When Aida finds you matches, they will appear here!
      </NoMatchesText>
    </NoMatchesContainer>
  )
}
