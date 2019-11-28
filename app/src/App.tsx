import React, { useEffect, useState } from 'react'
import {
  createAppContainer,
  NavigationScreenProp,
  NavigationState,
  StackActions,
  createSwitchNavigator
} from 'react-navigation'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import Home from './Home'
import SignIn from './SignIn'

const Navigator = createSwitchNavigator({
  Home: { screen: Home },
  SignIn: { screen: SignIn }
})

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
        setUser(user ? user : undefined)
      }),
    []
  )

  useEffect(() => {
    if (!initialised) return

    if (!user) {
      props.navigation.navigate('SignIn')
      return
    }

    props.navigation.navigate({
      routeName: 'Home',
      action: StackActions.popToTop()
    })
  }, [user, initialised])

  return initialised ? <Navigator navigation={props.navigation} /> : null
}

App.router = Navigator.router

export default createAppContainer(App)
