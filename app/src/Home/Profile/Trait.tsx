import React from 'react'
import styled from 'styled-components/native'
import LinearGradient from 'react-native-linear-gradient'
import colors from '../../colors'
import personalities from './personalities.json'

const Container = styled.View`
  padding-vertical: 16px;
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
`

const BarHighValue = styled.Text`
  margin-left: 8px;
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
  divider: boolean
}

export default function Trait(props: Props) {
  const type = props.type as keyof typeof personalities

  const detail =
    props.value > 0 ? personalities[type].high : personalities[type].low

  // Normalize values from -1-1 to 0-1
  const percent = props.value / 2 + 0.5
  const locations = [0, percent, percent, 1]
  const lowPercent = (props.value < 0 ? 1 - percent : percent) * 100
  const highPercent = (props.value > 0 ? 1 - percent : percent) * 100

  return (
    <Container>
      <Title>{type}</Title>
      <BarContainer>
        <BarLowValue>{lowPercent.toFixed(0) + '%'}</BarLowValue>
        <Bar
          colors={[colors.purple, colors.purple, 'transparent', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          useAngle={true}
          angle={props.value > 0 ? 90 : -90}
          locations={locations}
        />
        <BarHighValue>{highPercent.toFixed(0) + '%'}</BarHighValue>
      </BarContainer>
      {detail.description.map((description, index) => (
        <Description key={index}>{'\u2022  ' + description}</Description>
      ))}
    </Container>
  )
}
