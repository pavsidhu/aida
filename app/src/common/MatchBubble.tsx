import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import firestore, {
  FirebaseFirestoreTypes
} from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import { useNavigation } from 'react-navigation-hooks'
import LinearGradient from 'react-native-linear-gradient'
import geohash from 'ngeohash'

import colors from '../colors'
import { MatchDoc, UserDoc } from '../types/firestore'
import getCity from '../util/getCity'

const Container = styled.View`
  border-radius: 18px;
  font-size: 16px;
  elevation: 2;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  border-top-left-radius: 0;
  border-radius: 18px;
  margin-right: 8px;
  background-color: ${colors.purple};
`

const Title = styled.Text`
  padding: 12px 16px;
  font-size: 16px;
  color: ${colors.white};
`

const Photo = styled.Image`
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
  width: auto;
  aspect-ratio: 1;
  flex-direction: column-reverse;
`

const Description = styled(LinearGradient)`
  position: absolute;
  bottom: 48px;
  padding: 12px 16px;
  width: 100%;
`

const Name = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${colors.white};
`

const Location = styled.Text`
  font-size: 14px;
  color: ${colors.white};
`

const MessageButton = styled.TouchableOpacity`
  background-color: ${colors.lightGrey};
  align-items: center;
  justify-content: center;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
  padding: 8px 16px;
  height: 48px;
`

const MessageButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${colors.black};
`

interface Props {
  id: string
}

export default function MatchBubble(props: Props) {
  const { navigate } = useNavigation()

  const [loading, setLoading] = useState(true)
  const [match, setMatch] = useState<MatchDoc>()
  const [location, setLocation] = useState<string>()

  const { currentUser } = auth()

  if (!currentUser) return null

  useEffect(() => {
    if (!loading) return

    const unsubscribe = firestore()
      .collection('matches')
      .doc(props.id)
      .onSnapshot(async snapshot => {
        const data = snapshot.data() as MatchDoc

        const userRefs = data.users as FirebaseFirestoreTypes.DocumentReference[]
        const users = await Promise.all(
          userRefs.map(
            async userRef =>
              ({
                id: userRef.id,
                ...(await userRef.get()).data()
              } as UserDoc)
          )
        )

        await Promise.all(
          users.map(async user => {
            user.photo = await storage()
              .ref(`${user.id}/photo.jpeg`)
              .getDownloadURL()
          })
        )

        setMatch({
          ...data,
          id: snapshot.id,
          users
        })

        if (loading) setLoading(false)
      })

    return unsubscribe
  }, [props.id])

  const matchedUser = match
    ? (match.users as UserDoc[]).find(user => user.id !== currentUser.uid)
    : undefined

  useEffect(() => {
    if (!matchedUser) return
    const { latitude, longitude } = geohash.decode(matchedUser.location)
    getCity(latitude, longitude).then(location => setLocation(location))
  }, [matchedUser])

  if (!matchedUser) return null

  return (
    <Container>
      <Title>I've found you a match! 😍</Title>
      <Photo source={{ uri: matchedUser.photo }} />

      <Description colors={['transparent', 'black']}>
        <Name numberOfLines={1}>
          {`${matchedUser.name}, ${matchedUser.age}`}
        </Name>
        <Location numberOfLines={1}>{location}</Location>
      </Description>

      <MessageButton onPress={() => navigate('MatchChat', { id: props.id })}>
        <MessageButtonText>Send a Message</MessageButtonText>
      </MessageButton>
    </Container>
  )
}
