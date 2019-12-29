import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import { useObservable, useObserver } from 'mobx-react-lite'

import colors from '../../colors'
import { TalkToAidaPrompt } from '../../common'
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
  border-width: 5px;
  border-color: ${colors.purple};
`

const Name = styled.Text`
  font-size: 24px;
`

export default function Profile() {
  return useObserver(() => {
    const onboarding = useObservable(onboardingStore)
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
        {!onboarding.isOnboarding ? (
          <>
            <ProfilePicture source={{ uri: photoUrl }} />
            <Name>{currentUser.displayName}</Name>
          </>
        ) : (
          <TalkToAidaPrompt description="You don't have a profile yet" />
        )}
      </Container>
    )
  })
}
