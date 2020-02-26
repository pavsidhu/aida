import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { firestore } from "firebase"

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

export default function UsersTab() {
  const [users, setUsers] = useState<any[]>([])

  useEffect(
    () =>
      firestore()
        .collection("users")
        .onSnapshot(snapshot =>
          setUsers(
            snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
          )
        ),
    []
  )

  return (
    <>
      <Title>Users</Title>
      <Table>
        <thead>
          <tr>
            <HeaderTitle>Name</HeaderTitle>
            <HeaderTitle>Age</HeaderTitle>
            <HeaderTitle>Gender</HeaderTitle>
            <HeaderTitle>Personality</HeaderTitle>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user.id}>
              <RowItem>{user.name}</RowItem>
              <RowItem>{user.age}</RowItem>
              <RowItem>{user.gender}</RowItem>
              <RowItem>
                {user.personality &&
                  Object.entries(
                    user.personality
                  ).map(([trait, value]: any) => (
                    <div key={trait}>{`${trait}: ${(value * 100).toFixed(
                      2
                    )}%`}</div>
                  ))}
              </RowItem>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}
