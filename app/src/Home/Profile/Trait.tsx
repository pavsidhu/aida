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

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${colors.black};
  text-transform: capitalize;
  text-align: center;
  margin-bottom: 16px;
`

const BarContainer = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
`

const BarLowValue = styled.Text`
  margin-right: 8px;
  font-size: 14px;
  font-weight: bold;

  ${(props: { shouldHighlight: boolean }) =>
    props.shouldHighlight &&
    css`
      color: ${colors.purple};
    `}
`

const BarHighValue = styled.Text`
  margin-left: 8px;
  font-size: 14px;
  font-weight: bold;

  ${(props: { shouldHighlight: boolean }) =>
    props.shouldHighlight &&
    css`
      color: ${colors.purple};
    `}
`

const BarNames = styled.View`
  margin-top: 4px;
  flex-direction: row;
  justify-content: space-between;
`

const BarName = styled.Text`
  font-size: 14px;
  font-weight: bold;
  text-transform: capitalize;

  ${(props: { shouldHighlight: boolean }) =>
    props.shouldHighlight &&
    css`
      color: ${colors.purple};
    `}
`

const Bar = styled(LinearGradient)`
  flex: 1;
  height: 12px;
  border-radius: 6px;
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

function generateLocation(percent: number) {
  if (percent >= 0.8) return [0, 0.8, 0.8, 1]
  if (percent <= 0.2) return [0, 0.2, 0.2, 1]
  return [0, percent, percent, 1]
}

export default function Trait(props: Props) {
  const type = props.type as keyof typeof personalities
  const personality = personalities[type]

  // If higher in a trait
  const isHigh = percent > 0.5

  const lowPercent = percentAsString(1 - props.value)
  const highPercent = percentAsString(props.value)
  const { description } = isHigh ? personality.high : personality.low

  const location = generateLocation(props.value)

  return (
    <Container>
      <Title>{type}</Title>
      <BarContainer>
        <BarLowValue shouldHighlight={!isHigh}>{lowPercent}</BarLowValue>
        <Bar
          colors={[
            colors.purple,
            colors.purple,
            colors.lightGrey,
            colors.lightGrey
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          useAngle={true}
          angle={isHigh ? -90 : 90}
          locations={location}
        />
        <BarHighValue shouldHighlight={isHigh}>{highPercent}</BarHighValue>
      </BarContainer>

      <BarNames>
        <BarName shouldHighlight={!isHigh}>{personality.low.title}</BarName>
        <BarName shouldHighlight={isHigh}>{personality.high.title}</BarName>
      </BarNames>

      {description.map((description, index) => (
        <Description key={index}>{'\u2022  ' + description}</Description>
      ))}
    </Container>
  )
}
