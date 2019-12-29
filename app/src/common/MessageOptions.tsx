import React from 'react'
import styled from 'styled-components/native'

import colors from '../colors'

const Container = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: ${colors.white};
  align-items: center;
  justify-content: center;
  flex-direction: row;
`

const Text = styled.Text`
  background-color: #eeeeee;
  border-radius: 20px;
  padding: 8px 16px;
  color: ${colors.black};
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin: 0 8px;
`

interface Props {
  options: string[]
  onPress: (option: string) => void
}

export default function MessageOptions(props: Props) {
  return (
    <Container>
      {props.options.map(option => (
        <Text key={option} onPress={() => props.onPress(option)}>
          {option}
        </Text>
      ))}
    </Container>
  )
}
