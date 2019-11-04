import React from 'react'
import { StatusBar } from 'react-native'
import styled from 'styled-components/native'
import LinearGradient from 'react-native-linear-gradient'

const Container = styled(LinearGradient)`
  flex: 1;
  background: #fefefe;
`

export default function Onboarding() {
  return (
    <Container
      colors={['#4D2ACC', '#C457FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar translucent={true} backgroundColor="transparent" />
    </Container>
  )
}
