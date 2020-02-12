import React from 'react'
import styled from 'styled-components/native'
import auth from '@react-native-firebase/auth'

import colors from '../colors'

const Container = styled.SafeAreaView`
  flex: 1;
  background: ${colors.lilac};
`

const Setting = styled.TouchableOpacity`
  padding: 20px;
`

const SettingTitle = styled.Text`
  font-size: 16px;
  color: ${colors.black};
`

const SettingSubtitle = styled.Text`
  font-size: 14px;
  color: ${colors.secondaryText};
`

export default function Settings() {
  function handleSignOut() {
    auth().signOut()
  }

  const user = auth().currentUser

  return (
    user && (
      <Container>
        <Setting onPress={handleSignOut}>
          <SettingTitle>Sign Out</SettingTitle>
          <SettingSubtitle>
            You are signed in as {user.displayName}
          </SettingSubtitle>
        </Setting>
      </Container>
    )
  )
}
