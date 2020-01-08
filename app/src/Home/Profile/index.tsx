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

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
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

const Analysis = styled.ScrollView.attrs({
  justifyContent: 'flex-start'
})`
  background-color: ${colors.white};
  elevation: 10;
  width: ${Dimensions.get('window').width - 32}px;
  flex: 1;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 0 24px;
`

const AnalysisTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${colors.black};
  margin: 24px 0;
`

const Traits = styled.View`
  margin-bottom: 16px;
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
            <AnalysisTitle>Your Analysis</AnalysisTitle>

            {user.personality && (
              <Traits>
                <Trait
                  name="Extroversion"
                  leftName="Introverted"
                  rightName="Extroverted"
                  value={user.personality.extroversion}
                />
                <Trait
                  name="Agreeableness"
                  leftName="Disagreeable"
                  rightName="Agreeable"
                  value={user.personality.agreeableness}
                />
                <Trait
                  name="Openness"
                  leftName="Close-Minded"
                  rightName="Open-Minded"
                  value={user.personality.openness}
                />
                <Trait
                  name="Conscientiousness"
                  leftName="Disorganised"
                  rightName="Organised"
                  value={user.personality.conscientiousness}
                />
                <Trait
                  name="Neuroticism"
                  leftName="Relaxed"
                  rightName="Nervous"
                  value={user.personality.neuroticism}
                />
              </Traits>
            )}
          </Analysis>
        </>
      ) : (
        <LoadingIndicator size="large" color={colors.purple} />
      )}
    </Container>
  )
}
