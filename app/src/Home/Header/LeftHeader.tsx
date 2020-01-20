import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import { TouchableRipple } from 'react-native-paper'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { useObservable, useObserver } from 'mobx-react-lite'

import onboardingStore from '../../onboarding/onboardingStore'
import colors from '../../colors'

const ProfileIcon = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 32px;
  border-width: 1px;
  border-color: ${colors.purple};
  background-color: ${colors.purple};
`

export default function LeftHeader(props: NavigationStackScreenProps) {
  return useObserver(() => {
    const onboarding = useObservable(onboardingStore)
    const [photoUrl, setPhotoUrl] = useState<string>()
    const { currentUser } = auth()

    useEffect(() => {
      if (!currentUser) return

      storage()
        .ref(`${currentUser.uid}/photo.jpeg`)
        .getDownloadURL()
        .then(url => setPhotoUrl(url))
    }, [onboarding.isOnboarding])

    return (
      !onboarding.isOnboarding && (
        <TouchableRipple
          onPress={() => {
            props.navigation.navigate('Profile')
          }}
          style={{ padding: 16 }}
        >
          <ProfileIcon source={{ uri: photoUrl }} />
        </TouchableRipple>
      )
    )
  })
}
