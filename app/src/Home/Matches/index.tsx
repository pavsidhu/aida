import React, { useState, useEffect } from 'react'
import { RefreshControl } from 'react-native'
import styled from 'styled-components/native'
import auth from '@react-native-firebase/auth'
import firestore, {
  FirebaseFirestoreTypes
} from '@react-native-firebase/firestore'
import { MatchDoc, UserDoc, Message } from 'src/firestore-docs'
import Match from './Match'

const Container = styled.ScrollView.attrs(() => ({
  justifyContent: 'center'
}))`
  flex: 1;
  background: #fefefe;
`

const LoadingIndicator = styled.ActivityIndicator`
  align-self: center;
`

const NoMatchesTitle = styled.Text`
  align-self: center;
  font-weight: bold;
  font-size: 20px;
  color: #1b1b1b;
  margin-bottom: 8px;
`

const NoMatchesDescription = styled.Text`
  align-self: center;
  font-size: 16px;
  color: #1b1b1b;
`

export default function MatchesTab() {
  const [matches, setMatches] = useState<MatchDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const { currentUser } = auth()

  if (!currentUser) return null

  useEffect(() => {
    if (!loading && !refreshing) return

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

            const message = (
              await doc.ref
                .collection('messages')
                .orderBy('createdAt', 'desc')
                .limit(1)
                .get()
            ).docs[0]

            return {
              ...data,
              messages: message && message.exists ? [message.data()] : [],
              users
            } as MatchDoc
          })
        )

        setMatches(matches)

        if (loading) setLoading(false)
        if (refreshing) setRefreshing(false)
      })

    return unsubscribe
  }, [refreshing])

  return (
    <Container
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => setRefreshing(true)}
        />
      }
    >
      {loading ? (
        <LoadingIndicator size="large" color="#5C30D3" />
      ) : matches.length > 0 ? (
        matches.map(match => {
          const matchedUser = (match.users as UserDoc[]).find(
            user => user.id !== currentUser.uid
          )

          const lastMessage = match.messages[0] as Message

          return (
            matchedUser && (
              <Match
                fullName={matchedUser.name}
                profilePicture={matchedUser.photo || ''}
                lastMessage={lastMessage.content || 'Why not say hello?'}
                lastMessageTime={lastMessage.createdAt || ''}
                key={matchedUser.id}
              />
            )
          )
        })
      ) : (
        <>
          <NoMatchesTitle>Go Talk to Aida</NoMatchesTitle>
          <NoMatchesDescription>
            When Aida finds you a match they'll appear here
          </NoMatchesDescription>
        </>
      )}
    </Container>
  )
}
