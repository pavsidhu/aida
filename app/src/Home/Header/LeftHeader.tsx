import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import { TouchableRipple } from 'react-native-paper'
import { NavigationStackScreenProps } from 'react-navigation-stack'

import colors from '../../colors'
import { UserDoc } from '../../types/firestore'

const ProfileIcon = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 32px;
  border-width: 1px;
  border-color: ${colors.purple};
  background-color: ${colors.purple};
`

export default function LeftHeader(props: NavigationStackScreenProps) {
  const [photoUrl, setPhotoUrl] = useState<string>()
  const [user, setUser] = useState<UserDoc>()
  const { currentUser } = auth()

  const isOnboarding = user?.onboarding.isOnboarding

  useEffect(() => {
    if (!currentUser) return

    firestore()
      .collection('users')
      .doc(currentUser.uid)
      .onSnapshot(snapshot => {
        setUser(snapshot.data() as UserDoc)
      })
  }, [currentUser])

  useEffect(() => {
    if (currentUser && isOnboarding === false) {
      storage()
        .ref(`${currentUser.uid}/photo.jpeg`)
        .getDownloadURL()
        .then(url => setPhotoUrl(url))
    }
  }, [isOnboarding])

  return (
    isOnboarding === false && (
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
}
