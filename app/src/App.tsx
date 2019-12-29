import React, { useEffect, useState } from 'react'
import {
  createAppContainer,
  createSwitchNavigator,
  NavigationContainerProps
} from 'react-navigation'
import auth from '@react-native-firebase/auth'
import Home from './Home'
import SignIn from './SignIn'

const Navigator = createSwitchNavigator({
  Home: { screen: Home },
  SignIn: { screen: SignIn }
})

function App(props: NavigationContainerProps) {
  const [initialised, setInitialised] = useState(false)

  useEffect(
    () =>
      auth().onAuthStateChanged(user => {
        if (!initialised) setInitialised(true)
        props.navigation?.navigate(user ? 'Home' : 'SignIn')
      }),
    []
  )

  return initialised && <Navigator navigation={props.navigation} />
}

App.router = Navigator.router

export default createAppContainer(App)
