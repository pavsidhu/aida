import React from 'react'
import styled, { css } from 'styled-components/native'
import { createAnimatableComponent } from 'react-native-animatable'
import GFBubble from 'react-native-gifted-chat/lib/Bubble'

interface PositionProps {
  bubblePosition: 'left' | 'right'
}

const Container = styled.View<PositionProps>`
  flex: 1;
  margin: 8px 8px 0;

  ${props =>
    props.bubblePosition === 'left'
      ? css`
          flex-direction: row;
        `
      : css`
          flex-direction: row-reverse;
        `};
`

const AnimatableContainer = createAnimatableComponent(Container)

const Bubble = styled.Text<PositionProps>`
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 16px;

  ${props =>
    props.bubblePosition === 'left'
      ? css`
          color: #fefefe;
          background-color: #705ef1;
          border-top-left-radius: 0;
          margin-right: 8px;
        `
      : css`
          color: #1b1b1b;
          background-color: #eaeaea;
          border-top-right-radius: 0;
          margin-left: 8px;
        `};
`

export default function MessageBubble(props: GFBubble['props']) {
  return (
    <AnimatableContainer
      bubblePosition={props.position}
      animation="slideInUp"
      delay={0}
      duration={100}
    >
      <Bubble bubblePosition={props.position}>
        {props.currentMessage?.text}
      </Bubble>
    </AnimatableContainer>
  )
}
