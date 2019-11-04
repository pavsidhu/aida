import React, { useEffect, useState } from 'react'
import Home from './Home'
import Welcome from './Welcome'
import { createStackNavigator } from 'react-navigation-stack'
import {
  createAppContainer,
  NavigationScreenProp,
  NavigationState,
  NavigationActions,
  StackActions
} from 'react-navigation'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'

const Navigator = createStackNavigator(
  {
    Home: { screen: Home },
    Welcome: { screen: Welcome }
  },
  { headerMode: 'none' }
)

interface Props {
  navigation: NavigationScreenProp<NavigationState>
}

function App(props: Props) {
  const [initialised, setInitialised] = useState(false)
  const [user, setUser] = useState<FirebaseAuthTypes.User>()

  useEffect(
    () =>
      auth().onAuthStateChanged(user => {
        setInitialised(true)
        user ? setUser(user) : setUser(undefined)
      }),
    []
  )

  useEffect(() => {
    initialised && user
      ? props.navigation.navigate({
          routeName: 'Home',
          action: StackActions.popToTop()
        })
      : props.navigation.navigate('SignIn')
  }, [user, initialised])

  return initialised ? <Navigator navigation={props.navigation} /> : null
}

App.router = Navigator.router

export default createAppContainer(App)
