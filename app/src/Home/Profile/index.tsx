import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'

const Container = styled.SafeAreaView`
  flex: 1;
  align-items: center;
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
  const [photoUrl, setPhotoUrl] = useState<string>()
  const { currentUser } = auth()

  if (!currentUser) return null

  useEffect(() => {
    storage()
      .ref(`${currentUser.uid}/photo.jpeg`)
      .getDownloadURL()
      .then(url => setPhotoUrl(url))
  }, [])

  return currentUser.displayName ? (
    <Container>
      <ProfilePicture source={{ uri: photoUrl }} />
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
