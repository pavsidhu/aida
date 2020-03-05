import React from 'react'
import styled, { css } from 'styled-components/native'
import { createAnimatableComponent } from 'react-native-animatable'
import GFBubble from 'react-native-gifted-chat/lib/Bubble'

import colors from '../colors'
import MatchBubble from './MatchBubble'
import CustomIMessage from '../types/CustomIMessage'

interface PositionProps {
  bubblePosition: 'left' | 'right'
}

const Container = styled.View<PositionProps>`
  flex: 1;
  margin: 16px 8px 0;

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

const TextBubble = styled.View<PositionProps>`
  padding: 12px 16px;
  border-radius: 18px;
  elevation: 2;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);

  ${props =>
    props.bubblePosition === 'left'
      ? css`
          background-color: ${colors.purple};
          border-top-left-radius: 0;
          margin-right: 8px;
        `
      : css`
          background-color: ${colors.white};
          border-top-right-radius: 0;
          margin-left: 8px;
        `};
`

const TextBubbleContent = styled.Text<PositionProps>`
  font-size: 16px;
  line-height: 22px;

  ${props =>
    props.bubblePosition === 'left'
      ? css`
          color: ${colors.white};
        `
      : css`
          color: ${colors.black};
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
          background-color: ${colors.lightGrey};
          border-top-right-radius: 0;
          margin-left: 8px;
        `};
`

export default function MessageBubble(props: GFBubble['props']) {
  function renderBubble() {
    const message = props.currentMessage as CustomIMessage

    if (!message) return null

    if (message.image) {
      return (
        <PhotoBubble
          bubblePosition={props.position}
          source={{ uri: message.image }}
        />
      )
    }
    if (message.match) {
      return <MatchBubble id={message.match.id} />
    }

    return (
      <TextBubble bubblePosition={props.position}>
        <TextBubbleContent bubblePosition={props.position}>
          {message.text}
        </TextBubbleContent>
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
