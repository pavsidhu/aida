import React, { useState, useEffect } from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'

import Trait from './Trait'
import colors from '../../colors'
import getCity from '../../util/getCity'
import { UserDoc } from '../../types/firestore'

const Container = styled.ScrollView.attrs({
  justifyContent: 'flex-start',
  alignItems: 'center'
})`
  flex: 1;
  background: ${colors.lilac};
`

const LoadingIndicator = styled.ActivityIndicator`
  align-self: center;
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
  background: ${colors.purple};
`

const Name = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${colors.black};
`

const Location = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${colors.black};
`

const Analysis = styled.View`
  background-color: ${colors.white};
  elevation: 10;
  margin: 0 16px;
  flex: 1;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 0 24px;
`

export default function Profile() {
  const [user, setUser] = useState<UserDoc>()
  const { currentUser } = auth()

  useEffect(() => {
    if (!currentUser) return

    return firestore()
      .collection('users')
      .doc(currentUser.uid)
      .onSnapshot(async snapshot => {
        const data = snapshot.data() as UserDoc

        const location = await getCity(
          data.location._latitude,
          data.location._longitude
        )

        const photo = await storage()
          .ref(`${currentUser.uid}/photo.jpeg`)
          .getDownloadURL()

        setUser({
          ...data,
          id: snapshot.id,
          location,
          photo
        })
      })
  }, [])

  return (
    <Container>
      {user ? (
        <>
          <Details>
            <ProfilePicture source={{ uri: user.photo }} />
            <Name>
              {user.name}, {user.age}
            </Name>
            <Location>{user.location}</Location>
          </Details>

          <Analysis>
            {user.personality &&
              Object.entries(user.personality).map(([type, value]) => (
                <Trait type={type} value={value} key={type} />
              ))}
          </Analysis>
        </>
      ) : (
        <LoadingIndicator size="large" color={colors.purple} />
      )}
    </Container>
  )
}
