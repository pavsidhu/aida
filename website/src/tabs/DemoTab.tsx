import React, { useState } from "react"
import styled from "styled-components"
import config from "../config"

const Title = styled.h1`
  font-size: 48px;
  font-weight: bold;
  color: #353535;
  margin-bottom: 24px;
`

const Subtitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #353535;
  margin-bottom: 16px;
`

const Paragraph = styled.p`
  color: #353535;
  margin-bottom: 16px;
  max-width: 60ch;
  line-height: 20px;
`

const Form = styled.form`
  display: flex;
  margin-bottom: 40px;
`

const TextInput = styled.input`
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  color: #353535;
  font-size: 16px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
  width: 350px;
`

const Button = styled.button`
  border: none;
  padding: 16px 18px;
  color: #8e92f4;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    cursor: pointer;
    filter: brightness(1.2);
  }
`

export default function DemoTab() {
  const [questionUserId, setQuestionUserId] = useState("")
  const [personalityUserId, setPersonalityUserId] = useState("")
  const [matchUserId, setMatchUserId] = useState("")

  async function sendQuestion() {
    const response = await fetch(
      `${config.backend.url}/questions/demo/${questionUserId}`
    )
    if (response.status === 200) alert("Question sent to user")
  }

  async function calculatePersonality() {
    const response = await fetch(
      `${config.backend.url}/user_analysis/demo/${personalityUserId}`
    )
    if (response.status === 200) alert("Personality calculated for user")
  }

  async function createMatch() {
    const response = await fetch(
      `${config.backend.url}/matching/demo/${matchUserId}`
    )
    if (response.status === 200) alert("Match created for user")
  }

  return (
    <>
      <Title>Demo</Title>

      <Subtitle>Send a Question</Subtitle>
      <Paragraph>
        The user will receive a notification with a dating question for them to
        answer.
      </Paragraph>
      <Form
        onSubmit={event => {
          event.preventDefault()
          sendQuestion()
        }}
      >
        <TextInput
          type="text"
          placeholder="Enter a user ID"
          onChange={event => setQuestionUserId(event.target.value)}
          value={questionUserId}
        />
        <Button>Submit</Button>
      </Form>

      <Subtitle>Calculate Personality</Subtitle>
      <Paragraph>
        Calculates the user's personality according to the Big 5 personality
        model using their tweets and messages with Aida.
      </Paragraph>
      <Form
        onSubmit={event => {
          event.preventDefault()
          calculatePersonality()
        }}
      >
        <TextInput
          type="text"
          placeholder="Enter a user ID"
          onChange={event => setPersonalityUserId(event.target.value)}
          value={personalityUserId}
        />
        <Button>Submit</Button>
      </Form>

      <Subtitle>Create a Match</Subtitle>
      <Paragraph>
        Using the user's personality data, a match is found for the user. A
        notification is sent to let them know they have a new match.
      </Paragraph>
      <Form
        onSubmit={event => {
          event.preventDefault()
          createMatch()
        }}
      >
        <TextInput
          type="text"
          placeholder="Enter a user ID"
          onChange={event => setMatchUserId(event.target.value)}
          value={matchUserId}
        />
        <Button>Submit</Button>
      </Form>
    </>
  )
}
