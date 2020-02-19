import React from "react"
import styled from "styled-components"
import { NavLink } from "react-router-dom"

import { ReactComponent as LogoSvg } from "../images/logo.svg"

const Container = styled.nav`
  background-color: #8e92f4;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  padding: 40px;
`

const FullLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 18px;
  margin-bottom: 16px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
`

const Logo = styled(LogoSvg)`
  height: 48px;
  width: 48px;
`

const Title = styled.p`
  font-size: 22px;
  font-weight: bold;
  color: #fefefe;
  margin-left: 8px;
`

const List = styled.ul`
  list-style-type: none;
`

const ListItem = styled.li`
  margin: 8px 0;
  padding: 8px 12px;
  font-size: 18px;
  font-weight: bold;
  color: #fefefe;
  border-radius: 10px;

  &:hover {
    background-color: #fefefe;
    color: #8e92f4;
  }

  &:active {
    background-color: #fefefe;
    color: #8e92f4;
  }
`

export default function Sidebar() {
  return (
    <Container>
      <FullLogo>
        <Logo />
        <Title>Aida</Title>
      </FullLogo>
      <List>
        <NavLink to="/users">
          <ListItem>Users</ListItem>
        </NavLink>
        <NavLink to="/matches">
          <ListItem>Matches</ListItem>
        </NavLink>
        <NavLink to="/demo">
          <ListItem>Demo</ListItem>
        </NavLink>
      </List>
    </Container>
  )
}
