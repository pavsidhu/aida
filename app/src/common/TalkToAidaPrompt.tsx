import React, { useState, useEffect } from 'react'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import styled from 'styled-components/native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import colors from '../colors'
import { UserDoc } from '../types/firestore'

const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 24px;
`

const ProgressCircle = styled(AnimatedCircularProgress)`
  align-self: center;
  margin-bottom: 40px;
`

const ProgressText = styled.Text`
  font-weight: bold;
  font-size: 40px;
  text-align: center;
  color: ${colors.purple};
`

const Title = styled.Text`
  font-weight: bold;
  font-size: 24px;
  color: ${colors.black};
  margin-bottom: 16px;
`

const Description = styled.Text`
  line-height: 22px;
  font-size: 16px;
  color: ${colors.black};
`

export default function TalkToAidaPrompt() {
  const [progress, setProgress] = useState(0)
  const { currentUser } = auth()

  useEffect(() => {
    if (!currentUser) return

    firestore()
      .collection('users')
      .doc(currentUser.uid)
      .get()
      .then(doc => {
        const user = doc.data() as UserDoc
        setProgress(user.progress ? user.progress : 0)
      })
  }, [currentUser])

  return (
    <Container>
      <ProgressCircle
        size={180}
        width={25}
        fill={progress}
        rotation={0}
        tintColor={colors.purple}
        backgroundColor={colors.lightGrey}
      >
        {fill => <ProgressText>{fill.toFixed(0)}%</ProgressText>}
      </ProgressCircle>

      <Title>Aida's still learning about you</Title>
      <Description>
        Talking to Aida will help her learn about your personality. The more you
        chat with her the better your matches will be!
      </Description>
    </Container>
  )
}
