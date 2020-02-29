import React from "react"
import styled from "styled-components"

import Bar from "./Bar"

const Label = styled.div`
  display: flex;
  justify-content: space-between;
`

interface Props {
  name: string
  value: number
}

export default function Trait(props: Props) {
  const percent = (props.value * 100).toFixed(0) + "%"

  return (
    <>
      <Label>
        <p>{props.name}</p>
        <p>{percent}</p>
      </Label>
      <Bar percent={percent} />
    </>
  )
}
