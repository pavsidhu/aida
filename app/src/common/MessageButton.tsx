import React from 'react'
import styled from 'styled-components/native'

import colors from '../colors'

const Container = styled.TouchableOpacity`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: ${colors.white};
  align-items: center;
  justify-content: center;
`

const Text = styled.Text`
  background-color: #eeeeee;
  border-radius: 20px;
  padding: 8px 16px;
  color: ${colors.black};
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`

interface Props {
  text: string
  onPress: () => void
}

export default function MessageButton(props: Props) {
  return (
    <Container onPress={props.onPress}>
      <Text>{props.text}</Text>
    </Container>
  )
}
