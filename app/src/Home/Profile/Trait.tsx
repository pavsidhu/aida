import React from 'react'
import styled from 'styled-components/native'
import colors from '../../colors'

const Container = styled.View`
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`

const BarContainer = styled.View`
  width: 100%;
  height: 30px;
  background-color: ${colors.purple};
  overflow: hidden;
  border-radius: 10px;
  margin: 4px 0;
`

interface BarProps {
  value: number
}

const LeftBar = styled.View<BarProps>`
  background-color: ${colors.purpleDark};
  position: absolute;
  width: 10px;
  height: 100%;
  left: 50%;
  top: 0;
`

const RightBar = styled.View<BarProps>`
  background-color: ${colors.purpleDark};
  position: absolute;
  width: 100px;
  height: 100%;
  right: 50%;
  top: 0;
`

const TopNames = styled.View`
  flex-direction: row;
`

const LeftName = styled.Text`
  flex: 1;
  font-size: 12px;
  font-weight: bold;
  color: ${colors.secondaryText};
`

const RightName = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${colors.secondaryText};
`

const Name = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${colors.black};
`

interface Props {
  name: string
  leftName: string
  rightName: string
  value: number
}

export default function Trait(props: Props) {
  return (
    <Container>
      <TopNames>
        <LeftName>{props.leftName}</LeftName>
        <RightName>{props.rightName}</RightName>
      </TopNames>

      <BarContainer>
        {props.value < 0 ? (
          <LeftBar value={props.value} />
        ) : (
          <RightBar value={props.value} />
        )}
      </BarContainer>

      <Name>{props.name}</Name>
    </Container>
  )
}
