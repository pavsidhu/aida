import React from "react"
import styled from "styled-components"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom"

import { Sidebar } from "./components"
import UsersTab from "./tabs/UsersTab"
import MatchesTab from "./tabs/MatchesTab"
import DemoTab from "./tabs/DemoTab"

const Container = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  background-color: #fefefe;
  min-height: 100vh;
`

const Content = styled.div`
  margin: 32px;
  padding: 32px;
  background-color: white;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
`

export default function App() {
  return (
    <Router>
      <Container>
        <Sidebar />
        <Content>
          <Switch>
            <Route path="/users">
              <UsersTab />
            </Route>
            <Route path="/matches">
              <MatchesTab />
            </Route>
            <Route path="/demo">
              <DemoTab />
            </Route>
            <Route path="/">
              <Redirect to="/users" />
            </Route>
          </Switch>
        </Content>
      </Container>
    </Router>
  )
}
