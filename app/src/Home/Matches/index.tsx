import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import firestore, {
  FirebaseFirestoreTypes
} from '@react-native-firebase/firestore'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { MatchDoc, UserDoc } from 'src/firestore-docs'
import Match from './Match'
import colors from '../../colors'

const Container = styled.View`
  flex: 1;
  justify-content: center;
`

interface MatchesListProps {
  hasMatches: boolean
}

const MatchesList = styled.ScrollView.attrs<MatchesListProps>(props => ({
  justifyContent: props.hasMatches ? 'flex-start' : 'center'
}))<MatchesListProps>`
  flex: 1;
`

const LoadingIndicator = styled.ActivityIndicator`
  align-self: center;
`

const NoMatchesTitle = styled.Text`
  align-self: center;
  font-weight: bold;
  font-size: 20px;
  color: ${colors.black};
  margin-bottom: 8px;
`

const NoMatchesDescription = styled.Text`
  align-self: center;
  font-size: 16px;
  color: ${colors.black};
`

interface Props extends NavigationStackScreenProps {}

export default function MatchesTab(props: Props) {
  const [matches, setMatches] = useState<MatchDoc[]>([])
  const [loading, setLoading] = useState(true)

  const { currentUser } = auth()

  if (!currentUser) return null

  useEffect(() => {
    const currentUserRef = firestore()
      .collection('users')
      .doc(currentUser.uid)

    const unsubscribe = firestore()
      .collection('matches')
      .where('users', 'array-contains', currentUserRef)
      .onSnapshot(async snapshot => {
        const matches = await Promise.all(
          snapshot.docs.map(async doc => {
            const data = doc.data() as MatchDoc

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
                  .ref(`${currentUser.uid}/photo.jpeg`)
                  .getDownloadURL()
              })
            )

            return {
              ...data,
              id: doc.id,
              users
            } as MatchDoc
          })
        )

        setMatches(matches)

        if (loading) setLoading(false)
      })

    return unsubscribe
  }, [])

  if (loading) {
    return (
      <Container>
        <LoadingIndicator size="large" color="#5C30D3" />
      </Container>
    )
  }

  return (
    <MatchesList hasMatches={matches.length > 0}>
      {matches.length > 0 ? (
        matches.map(match => (
          <Match
            match={match}
            key={match.id}
            onPress={() =>
              props.navigation.navigate('MatchChat', { id: match.id })
            }
          />
        ))
      ) : (
        <Container>
          <NoMatchesTitle>Go Talk to Aida</NoMatchesTitle>
          <NoMatchesDescription>
            When Aida finds you a match they'll appear here
          </NoMatchesDescription>
        </Container>
      )}
    </MatchesList>
  )
}
