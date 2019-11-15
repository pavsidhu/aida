import React from 'react'
import { NativeModules, StatusBar } from 'react-native'
import styled from 'styled-components/native'
import auth from '@react-native-firebase/auth'
import LinearGradient from 'react-native-linear-gradient'
import config from '../config'

const { RNTwitterSignIn } = NativeModules

const Container = styled(LinearGradient)`
  flex: 1;
  background: #fefefe;
  padding: 24px;
`

const TitleSection = styled.View`
  flex: 2;
  padding: 24px;
  justify-content: center;
  align-items: center;
`

const Title = styled.Text`
  color: #fefefe;
  font-size: 56px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 8px;
`

const Subtitle = styled.Text`
  color: #fefefe;
  font-size: 18px;
  text-align: center;
`

const Button = styled.TouchableOpacity`
  border: 2px solid #fefefe;
  padding: 16px;
  align-items: center;
  border-radius: 8px;
`

const ButtonText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #fefefe;
  text-transform: uppercase;
`

export default function SignIn() {
  async function continueWithTwitter() {
    RNTwitterSignIn.init(
      config.twitter.consumerKey,
      config.twitter.consumerSecret
    )

    const { authToken, authTokenSecret } = RNTwitterSignIn.logIn()
    const credential = auth.TwitterAuthProvider.credential(
      authToken,
      authTokenSecret
    )
    await auth().signInWithCredential(credential)
  }

  return (
    <Container
      colors={['#4D2ACC', '#C457FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar translucent={true} backgroundColor="transparent" />

      <TitleSection>
        <Title>Aida</Title>
        <Subtitle>
          Your digital assistant for {'\n'} meeting new people
        </Subtitle>
      </TitleSection>

      <Button onPress={continueWithTwitter}>
        <ButtonText>Continue With Twitter</ButtonText>
      </Button>
    </Container>
  )
}
