import React, { useState } from 'react'
import { StatusBar } from 'react-native'
import styled from 'styled-components/native'
import auth from '@react-native-firebase/auth'
import LinearGradient from 'react-native-linear-gradient'

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

const Input = styled.TextInput`
  background: #fefefe;
  margin-bottom: 16px;
  padding: 16px;
  align-items: center;
  font-size: 16px;
  border-radius: 8px;
  color: #1b1b1b;
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
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  async function* handleSignIn() {
    if (!phoneNumber) return

    const { confirm } = await auth().signInWithPhoneNumber(phoneNumber)

    setIsVerifying(true)

    yield

    confirm(verificationCode)
  }

  const signInHandler = handleSignIn()

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

      {isVerifying ? (
        <>
          <Input
            placeholder="Verification Code"
            placeholderTextColor="#5D5D5D"
            value={verificationCode}
            onChangeText={text => setVerificationCode(text)}
            onSubmitEditing={() => signInHandler.next()}
          />
          <Button onPress={() => signInHandler.next()}>
            <ButtonText>Verify</ButtonText>
          </Button>
        </>
      ) : (
        <>
          <Input
            placeholder="Phone Number"
            placeholderTextColor="#5D5D5D"
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text)}
            onSubmitEditing={() => signInHandler.next()}
          />

          <Button onPress={() => signInHandler.next()}>
            <ButtonText>Send Verification Code</ButtonText>
          </Button>
        </>
      )}
    </Container>
  )
}
