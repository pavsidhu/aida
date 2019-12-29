import React from 'react'
import styled, { css } from 'styled-components/native'
import { createAnimatableComponent } from 'react-native-animatable'
import GFBubble from 'react-native-gifted-chat/lib/Bubble'

import colors from '../colors'

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

const TextBubble = styled.Text<PositionProps>`
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 16px;

  ${props =>
    props.bubblePosition === 'left'
      ? css`
          color: ${colors.white};
          background-color: ${colors.purple};
          border-top-left-radius: 0;
          margin-right: 8px;
        `
      : css`
          color: ${colors.black};
          background-color: ${colors.ownMessageBubble};
          border-top-right-radius: 0;
          margin-left: 8px;
        `};
`

const PhotoBubble = styled.Image<PositionProps>`
  padding: 8px 12px;
  border-radius: 12px;
  width: 200px;
  height: 200px;

  ${props =>
    props.bubblePosition === 'left'
      ? css`
          background-color: ${colors.purple};
          border-top-left-radius: 0;
          margin-right: 8px;
        `
      : css`
          background-color: ${colors.ownMessageBubble};
          border-top-right-radius: 0;
          margin-left: 8px;
        `};
`

export default function MessageBubble(props: GFBubble['props']) {
  function renderBubble() {
    if (props.currentMessage?.image) {
      return (
        <PhotoBubble
          bubblePosition={props.position}
          source={{ uri: props.currentMessage?.image }}
        />
      )
    }

    return (
      <TextBubble bubblePosition={props.position}>
        {props.currentMessage?.text}
      </TextBubble>
    )
  }

  return (
    <AnimatableContainer
      bubblePosition={props.position}
      animation="slideInUp"
      delay={0}
      duration={100}
    >
      {renderBubble()}
    </AnimatableContainer>
  )
}
