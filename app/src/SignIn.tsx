import React from 'react'
import { NativeModules, StatusBar } from 'react-native'
import styled from 'styled-components/native'
import auth from '@react-native-firebase/auth'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome5'
import config from '../config'
import logo from './images/logo.png'

const { RNTwitterSignIn } = NativeModules

const Container = styled(LinearGradient)`
  flex: 1;
  padding: 24px;
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
  flex-direction: row;
  align-items: center;
  background: rgba(255, 255, 255, 0.25);
  padding: 20px;
  align-items: center;
  border-radius: 15px;
`

const TwitterIcon = styled(Icon)`
  position: absolute;
  left: 20px;
`

const ButtonText = styled.Text`
  flex: 1;
  font-size: 14px;
  font-weight: bold;
  color: #360069;
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
    await auth().signInWithCredential(credential)
  }

  return (
    <Container
      colors={['#405DF8', '#9379FF', '#E8A2FF']}
      start={{ x: 0.2, y: 0.2 }}
      end={{ x: 0.8, y: 0.8 }}
    >
      <StatusBar translucent={true} backgroundColor="transparent" />

      <TitleSection>
        <Logo source={logo} resizeMode="contain" />
        <Title>Aida</Title>
        <Subtitle>
          Your digital assistant for {'\n'} meeting new people
        </Subtitle>
      </TitleSection>

      <Button onPress={continueWithTwitter}>
        <TwitterIcon name="twitter" size={24} color="#1DA1F2" />
        <ButtonText>Continue With Twitter</ButtonText>
      </Button>
    </Container>
  )
}
