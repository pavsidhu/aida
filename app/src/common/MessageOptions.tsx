import React from 'react'
import styled from 'styled-components/native'

import colors from '../colors'

const Container = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: ${colors.lilac};
  align-items: center;
  justify-content: center;
  flex-direction: row;
`

const Option = styled.View`
  background-color: ${colors.lightGrey};
  border-radius: 20px;
  padding: 8px 16px;
  margin: 0 8px;
`

const Text = styled.Text`
  color: ${colors.black};
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`

interface Props {
  options: string[]
  onPress: (option: string) => void
}

export default function MessageOptions(props: Props) {
  return (
    <Container>
      {props.options.map(option => (
        <Option key={option}>
          <Text onPress={() => props.onPress(option)}>{option}</Text>
        </Option>
      ))}
    </Container>
  )
}
