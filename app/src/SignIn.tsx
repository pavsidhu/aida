import React from 'react'
import { NativeModules, StatusBar } from 'react-native'
import styled from 'styled-components/native'
import auth from '@react-native-firebase/auth'
import Icon from 'react-native-vector-icons/FontAwesome5'

import config from '../config'
import colors from './colors'
import logo from './images/logo.png'

const { RNTwitterSignIn } = NativeModules

const Container = styled.View`
  flex: 1;
  padding: 24px;
  background-color: ${colors.purple};
`

const TitleSection = styled.View`
  flex: 2;
  padding: 24px;
  padding-bottom: 80px;
  justify-content: center;
  align-items: center;
`

const Logo = styled.Image`
  width: 180px;
  height: 180px;
`

const Title = styled.Text`
  color: ${colors.white};
  font-size: 56px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 8px;
`

const Subtitle = styled.Text`
  color: ${colors.white};
  font-size: 18px;
  text-align: center;
`

const Button = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background: ${colors.white};
  padding: 20px;
  align-items: center;
  border-radius: 18px;
`

const TwitterIcon = styled(Icon)`
  position: absolute;
  left: 20px;
`

const ButtonText = styled.Text`
  flex: 1;
  font-size: 14px;
  font-weight: bold;
  color: ${colors.black};
  text-transform: uppercase;
  text-align: center;
`

export default function SignIn() {
  async function continueWithTwitter() {
    RNTwitterSignIn.init(
      config.twitter.consumerKey,
      config.twitter.consumerSecret
    )

    const { authToken, authTokenSecret } = await RNTwitterSignIn.logIn()
    const credential = auth.TwitterAuthProvider.credential(
      authToken,
      authTokenSecret
    )
    await auth()
      .signInWithCredential(credential)
      .catch(error => console.log(error))
  }

  return (
    <Container>
      <StatusBar translucent={true} backgroundColor="transparent" />

      <TitleSection>
        <Logo source={logo} resizeMode="contain" />
        <Title>Aida</Title>
        <Subtitle>
          Your digital assistant for {'\n'} meeting new people
        </Subtitle>
      </TitleSection>

      <Button onPress={continueWithTwitter}>
        <TwitterIcon name="twitter" size={24} color={colors.blueTwitter} />
        <ButtonText>Continue With Twitter</ButtonText>
      </Button>
    </Container>
  )
}
