import React from 'react'
import styled from 'styled-components/native'

import colors from '../colors'

const Container = styled.TouchableOpacity`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: ${colors.lilac};
  align-items: center;
  justify-content: center;
`

const Button = styled.View`
  background-color: ${colors.lightGrey};
  border-radius: 20px;
  padding: 8px 16px;
`

const Text = styled.Text`
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
      <Button>
        <Text>{props.text}</Text>
      </Button>
    </Container>
  )
}
