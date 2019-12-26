import React from 'react'
import styled from 'styled-components/native'
import auth from '@react-native-firebase/auth'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import colors from '../../colors'

const Container = styled.SafeAreaView`
  flex: 1;
  background: ${colors.white};
`

const Setting = styled.TouchableOpacity`
  flex: 1;
  background: ${colors.white};
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
