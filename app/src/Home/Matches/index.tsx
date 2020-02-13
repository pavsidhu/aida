import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import firestore, {
  FirebaseFirestoreTypes
} from '@react-native-firebase/firestore'
import { NavigationStackScreenProps } from 'react-navigation-stack'

import Match from './Match'
import { TalkToAidaPrompt } from '../../common'
import { MatchDoc, UserDoc } from '../../types/firestore'
import colors from '../../colors'

const Container = styled.View`
  flex: 1;
  justify-content: center;
  background-color: ${colors.lilac};
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

export default function MatchesTab(props: NavigationStackScreenProps) {
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
                    ...(await userRef.get()).data(),
                    id: userRef.id,
                    photo: await storage()
                      .ref(`${userRef.id}/photo.jpeg`)
                      .getDownloadURL()
                  } as UserDoc)
              )
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

  function renderMatchesList() {
    if (matches.length <= 0) {
      return <TalkToAidaPrompt />
    }

    return (
      <MatchesList hasMatches={matches.length > 0}>
        {matches.map(match => (
          <Match
            match={match}
            key={match.id}
            onPress={() =>
              props.navigation.navigate('MatchChat', { id: match.id })
            }
          />
        ))}
      </MatchesList>
    )
  }

  return (
    <Container>
      {loading ? (
        <LoadingIndicator size="large" color={colors.purple} />
      ) : (
        renderMatchesList()
      )}
    </Container>
  )
}
