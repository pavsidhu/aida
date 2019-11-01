import React from 'react'
import styled from 'styled-components/native'

const Container = styled.SafeAreaView`
  flex: 1;
  background: #fefefe;
`

const Section = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const ProfilePicture = styled.Image`
  width: 180px;
  height: 180px;
  border-radius: 90px;
  margin-bottom: 24px;
`

const Name = styled.Text`
  font-size: 24px;
`

export default function Profile() {
  return (
    <Container>
      <Section>
        <ProfilePicture source={{ uri: undefined }} />
        <Name></Name>
      </Section>

      <Section></Section>
    </Container>
  )
}
