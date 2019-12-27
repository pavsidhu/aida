import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import TakeToAidaPrompt from '../../common/TalkToAidaPrompt'
import colors from '../../colors'
import onboardingStore from '../../onboarding/onboardingStore'

const Container = styled.SafeAreaView`
  flex: 1;
  align-items: center;
  background: ${colors.white};
`

const ProfilePicture = styled.Image`
  margin-top: 24px;
  width: 180px;
  height: 180px;
  border-radius: 90px;
  margin-bottom: 24px;
  border: 5px solid ${colors.purple};
`

const Name = styled.Text`
  font-size: 24px;
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
      {!onboardingStore.isOnboarding ? (
        <>
          <ProfilePicture source={{ uri: photoUrl }} />
          <Name>{currentUser.displayName}</Name>
        </>
      ) : (
        <TakeToAidaPrompt description="You don't have a profile yet" />
      )}
    </Container>
  )
}
