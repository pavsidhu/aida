import React, { useState, useEffect, useContext } from "react"
import styled from "styled-components"
import { firestore } from "firebase"
import similarity from "compute-cosine-similarity"

import { Tab, Bar } from "../components"
import { AppContext } from "../App"

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
  const context = useContext(AppContext)
  const [searchValue, setSearchValue] = useState("")

  useEffect(
    () =>
      firestore()
        .collection("matches")
        .onSnapshot(async snapshot => {
          const newMatches = await Promise.all(
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

          context.setMatches(
            newMatches.filter(
              (match: any) =>
                searchValue === "" ||
                match.users[0].name
                  .toLowerCase()
                  .includes(searchValue.toLowerCase()) ||
                match.users[1].name
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
            )
          )
        }),
    [context, searchValue]
  )

  return (
    <Tab title="Matches" onSearchValueChange={value => setSearchValue(value)}>
      <Table>
        <thead>
          <tr>
            <HeaderTitle>ID</HeaderTitle>
            <HeaderTitle>User 1</HeaderTitle>
            <HeaderTitle>User 2</HeaderTitle>
            <HeaderTitle>Similarity</HeaderTitle>
          </tr>
        </thead>
        <tbody>
          {context.matches.map((match: any) => {
            const user1 = match.users[0]
            const user2 = match.users[1]
            const matchSimilarity = similarity(
              Object.values(user1.personality),
              Object.values(user2.personality)
            )
            const percent = (matchSimilarity * 100).toFixed(2) + "%"
            return (
              <tr key={match.id}>
                <RowItem>{match.id}</RowItem>
                <RowItem>{user1.name}</RowItem>
                <RowItem>{user2.name}</RowItem>
                <RowItem>
                  {percent}
                  <Bar percent={percent} />
                </RowItem>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </Tab>
  )
}
