import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { firestore } from "firebase"
import similarity from "compute-cosine-similarity"

const Title = styled.h1`
  font-size: 48px;
  font-weight: bold;
  color: #353535;
  margin-bottom: 24px;
`

const Table = styled.table`
  width: 100%;
  border-spacing: 0;
`

const HeaderTitle = styled.td`
  font-weight: bold;
  padding: 16px 12px;
  background-color: #f7f7f7;
`

const RowItem = styled.td`
  padding: 16px 12px;
  border-bottom: 1px solid #f7f7f7;
`

export default function MatchesTab() {
  const [matches, setMatches] = useState<any[]>([])

  useEffect(
    () =>
      firestore()
        .collection("matches")
        .onSnapshot(async snapshot =>
          setMatches(
            await Promise.all(
              snapshot.docs.map(async doc => {
                const data = doc.data()

                const userRefs = data.users
                const users = await Promise.all(
                  userRefs.map(async (userRef: any) => ({
                    ...(await userRef.get()).data(),
                    id: userRef.id
                  }))
                )

                return {
                  ...data,
                  id: doc.id,
                  users
                }
              })
            )
          )
        ),
    []
  )

  return (
    <>
      <Title>Matches</Title>
      <Table>
        <thead>
          <tr>
            <HeaderTitle>User 1</HeaderTitle>
            <HeaderTitle>User 2</HeaderTitle>
            <HeaderTitle>Similarity</HeaderTitle>
          </tr>
        </thead>
        <tbody>
          {matches.map((match: any) => {
            const user1 = match.users[0]
            const user2 = match.users[1]
            const matchSimilarity = similarity(
              Object.values(user1.personality),
              Object.values(user2.personality)
            )
            return (
              <tr key={match.id}>
                <RowItem>{user1.name}</RowItem>
                <RowItem>{user2.name}</RowItem>
                <RowItem>{(matchSimilarity * 100).toFixed(2) + "%"}</RowItem>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </>
  )
}
