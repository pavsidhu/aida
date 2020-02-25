import React from "react"
import styled from "styled-components"
import config from "../config"

const Title = styled.h1`
  font-size: 48px;
  font-weight: bold;
  color: #353535;
  margin-bottom: 24px;
`

const Button = styled.button`
  display: block;
  margin-bottom: 24px;
  border: none;
  border-radius: 10px;
  background-color: #8e92f4;
  padding: 16px 18px;
  color: #fefefe;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  &:hover {
    cursor: pointer;
    filter: brightness(1.1);
  }
`

export default function DemoTab() {
  async function askQuestion() {
    const response = await fetch(`${config.backend}`)
    if (response.status === 200) alert("Question sent to user")
  }

  async function calculatePersonality() {
    const response = await fetch(`${config.backend}`)
    if (response.status === 200) alert("Personality calculated for user")
  }

  async function startMatching() {
    const response = await fetch(`${config.backend}`)
    if (response.status === 200) alert("Match created for user")
  }

  return (
    <>
      <Title>Demo</Title>

      <Button onClick={askQuestion}>Ask Question</Button>
      <Button onClick={calculatePersonality}>Calculate Personality</Button>
      <Button onClick={startMatching}>Start Matching</Button>
    </>
  )
}
