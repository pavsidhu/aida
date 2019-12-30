import React, { useState, useEffect } from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'

import colors from '../colors'

const Container = styled.View`
  flex: 1;
  align-items: center;
  background: ${colors.lilac};
`

const Details = styled.View`
  margin-bottom: 24px;
  align-items: center;
`

const ProfilePicture = styled.Image`
  margin-top: 24px;
  width: 180px;
  height: 180px;
  border-radius: 90px;
  margin-bottom: 24px;
  border-width: 5px;
  border-color: ${colors.purple};
`

const Name = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${colors.black};
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

  return (
    <Container>
      <Details>
        <ProfilePicture source={{ uri: photoUrl }} />
        <Name>{currentUser.displayName}</Name>
      </Details>
    </Container>
  )
}
