import React from "react"
import styled, { css } from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faHeart, faLaptop } from "@fortawesome/free-solid-svg-icons"
import { NavLink, useLocation } from "react-router-dom"

import { ReactComponent as LogoSvg } from "../images/logo.svg"

const Container = styled.nav`
  background-color: #8e92f4;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  padding: 40px;
  height: 100vh;
  position: sticky;
  top: 0;
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
    background-color: rgba(255, 255, 255, 0.2);
  }

  ${(props: { active: boolean }) =>
    props.active &&
    css`
      background-color: #fefefe;
      color: #8e92f4;

      &:hover {
        background-color: #fefefe;
      }
    `}
`

const Icon = styled(FontAwesomeIcon)`
  margin-right: 8px;
`

export default function Sidebar() {
  const location = useLocation()

  return (
    <Container>
      <FullLogo>
        <Logo />
        <Title>Aida</Title>
      </FullLogo>
      <List>
        <NavLink to="/users">
          <ListItem active={location.pathname === "/users"}>
            <Icon icon={faUser} fixedWidth={true} />
            Users
          </ListItem>
        </NavLink>
        <NavLink to="/matches">
          <ListItem active={location.pathname === "/matches"}>
            <Icon icon={faHeart} fixedWidth={true} />
            Matches
          </ListItem>
        </NavLink>
        <NavLink to="/demo">
          <ListItem active={location.pathname === "/demo"}>
            <Icon icon={faLaptop} fixedWidth={true} />
            Demo
          </ListItem>
        </NavLink>
      </List>
    </Container>
  )
}
