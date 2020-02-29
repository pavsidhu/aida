import React from "react"
import styled, { css } from "styled-components"

const Label = styled.div`
  margin: 8px 0 4px;
  display: flex;
  justify-content: space-between;
`

const Bar = styled.div`
  height: 3px;
  border-radius: 2px;

  ${(props: { percent: string }) =>
    css`
      background: linear-gradient(
        90deg,
        #8e92f4 ${props.percent},
        #8e92f4 ${props.percent},
        #eeeeee ${props.percent},
        #eeeeee ${props.percent}
      );
    `}
`

const Title = styled.p``

const Value = styled.p``
interface Props {
  name: string
  value: number
}

export default function Trait(props: Props) {
  const percent = (props.value * 100).toFixed(0) + "%"

  return (
    <>
      <Label>
        <Title>{props.name}</Title>
        <Value>{percent}</Value>
      </Label>
      <Bar percent={percent} />
    </>
  )
}
