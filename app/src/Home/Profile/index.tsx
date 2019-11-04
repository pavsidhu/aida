import React from 'react'
import styled from 'styled-components/native'
import auth from '@react-native-firebase/auth'

const Container = styled.SafeAreaView`
  flex: 1;
  background: #fefefe;
`

const ProfilePicture = styled.Image`
  width: 180px;
  height: 180px;
  border-radius: 90px;
  margin-bottom: 24px;
`

const Name = styled.Text`
  font-size: 24px;
`

const NoProfileContainer = styled.SafeAreaView`
  flex: 1;
  background: #fefefe;
  justify-content: center;
  align-items: center;
`

const NoProfileText = styled.Text`
  font-size: 16px;
`

export default function Profile() {
  const { currentUser } = auth()

  if (!currentUser) return null

  return currentUser.displayName && currentUser.photoURL ? (
    <Container>
      <ProfilePicture source={{ uri: currentUser.photoURL }} />
      <Name>{currentUser.displayName}</Name>
    </Container>
  ) : (
    <NoProfileContainer>
      <NoProfileText>
        You don't have a profile yet, go talk to Aida!
      </NoProfileText>
    </NoProfileContainer>
  )
}
