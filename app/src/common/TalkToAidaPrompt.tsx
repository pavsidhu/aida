import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'
import colors from '../colors'

const Container = styled.View`
  flex: 1;
  justify-content: center;
`

const Title = styled.Text`
  align-self: center;
  font-weight: bold;
  font-size: 20px;
  color: ${colors.black};
  margin-bottom: 8px;
`

const Description = styled.Text`
  align-self: center;
  font-size: 16px;
  color: ${colors.black};
`

interface Props {
  description: string
}

export default function TalkToAidaPrompt(props: Props) {
  return (
    <Container>
      <Title>Go Talk to Aida</Title>
      <Description>{props.description}</Description>
    </Container>
  )
}
