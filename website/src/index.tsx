import React from "react"
import ReactDOM from "react-dom"
import { createGlobalStyle } from "styled-components"
import firebase from "firebase"

import App from "./App"
import config from "./config"
import * as serviceWorker from "./serviceWorker"

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing:border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`

firebase.initializeApp(config.firebase)

ReactDOM.render(
  <>
    <GlobalStyle />
    <App />
  </>,
  document.getElementById("root")
)

serviceWorker.unregister()
