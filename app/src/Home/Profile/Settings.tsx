import React from 'react'
import styled from 'styled-components/native'
import auth from '@react-native-firebase/auth'
import { NavigationScreenProp, NavigationState } from 'react-navigation'

const Container = styled.SafeAreaView`
  flex: 1;
  background: #fefefe;
`

const Setting = styled.TouchableOpacity`
  flex: 1;
  background: #fefefe;
  padding: 20px;
`

const SettingTitle = styled.Text`
  font-size: 16px;
  color: #1b1b1b;
`

const SettingSubtitle = styled.Text`
  font-size: 14px;
  color: #858585;
`

interface Props {
  navigation: NavigationScreenProp<NavigationState>
}

export default function Settings(props: Props) {
  function handleSignOut() {
    auth().signOut()
  }

  const user = auth().currentUser

  if (!user) return null

  return (
    <Container>
      <Setting onPress={handleSignOut}>
        <SettingTitle>Sign Out</SettingTitle>
        <SettingSubtitle>
          You are signed in as {user.displayName}
        </SettingSubtitle>
      </Setting>
    </Container>
  )
}
