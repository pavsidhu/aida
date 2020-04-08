import React from 'react'
import styled, { css } from 'styled-components/native'
import LinearGradient from 'react-native-linear-gradient'

import colors from '../../colors'
import personalities from './personalities.json'

const Container = styled.View`
  padding-vertical: 32px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.lightGrey};
`

const Top = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`

const Value = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${colors.white};
  text-align: center;
  line-height: 32px;
  padding: 8px;
  border-radius: 14px;
  background-color: ${colors.purple};
`

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${colors.black};
  text-transform: capitalize;
`

const Description = styled.Text`
  font-size: 17px;
  color: ${colors.black};
  margin-top: 16px;
`

interface Props {
  type: string
  value: number
}

function percentAsString(value: number) {
  return (value * 100).toFixed(0) + '%'
}

export default function Trait(props: Props) {
  const type = props.type as keyof typeof personalities
  const personality = personalities[type]

  // If higher in a trait
  const isHigh = props.value >= 0.5
  const { description } = isHigh ? personality.high : personality.low

  return (
    <Container>
      <Top>
        <Title>{type}</Title>
        <Value>{percentAsString(props.value)}</Value>
      </Top>

      {description.map((description, index) => (
        <Description key={index}>{'\u2022  ' + description}</Description>
      ))}
    </Container>
  )
}
