import React from 'react'
import styled from 'styled-components/native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'

import colors from '../colors'

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

interface Props {
  progress: number
}

export default function TalkToAidaPrompt(props: Props) {
  return (
    <Container>
      <ProgressCircle
        size={180}
        width={25}
        fill={props.progress}
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
