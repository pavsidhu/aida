import React from 'react'
import { StatusBar } from 'react-native'
import styled from 'styled-components/native'
import { GoogleSignin } from '@react-native-community/google-signin'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import Icon from 'react-native-vector-icons/FontAwesome5'

import colors from './colors'
import logo from './images/logo.png'
import onboardingFlow from './onboardingFlow'

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
  elevation: 10;
`

const GoogleIcon = styled(Icon)`
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

GoogleSignin.configure({ scopes: [], webClientId: '' })

export default function SignIn() {
  async function continueWithGoogle() {
    await GoogleSignin.signIn()
    const { idToken, accessToken } = await GoogleSignin.getTokens()

    const credential = auth.GoogleAuthProvider.credential(idToken, accessToken)

    await auth()
      .signInWithCredential(credential)
      .then(userCredential => {
        const { additionalUserInfo } = userCredential

        if (additionalUserInfo?.isNewUser) {
          firestore()
            .collection('users')
            .doc(userCredential.user.uid)
            .set({
              onboarding: {
                isOnboarding: true,
                step: onboardingFlow.start
              }
            })
        }
      })
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

      <Button onPress={continueWithGoogle}>
        <GoogleIcon name="google" size={24} color={colors.black} />
        <ButtonText>Continue With Google</ButtonText>
      </Button>
    </Container>
  )
}
