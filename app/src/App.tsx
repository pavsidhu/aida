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
import Onboarding from './Onboarding'

const Navigator = createSwitchNavigator({
  Home: { screen: Home },
  SignIn: { screen: SignIn },
  Onboarding: { screen: Onboarding }
})

interface Props {
  navigation: NavigationScreenProp<NavigationState>
}

function App(props: Props) {
  const [initialised, setInitialised] = useState(false)
  const [user, setUser] = useState<FirebaseAuthTypes.User>()
  const [isNewUser, setIsNewUser] = useState<boolean>()

  useEffect(
    () =>
      auth().onAuthStateChanged(user => {
        setInitialised(true)
        if (user) {
          const { creationTime, lastSignInTime } = user.metadata
          setIsNewUser(creationTime === lastSignInTime)
        }
        setUser(user ? user : undefined)
      }),
    []
  )

  useEffect(() => {
    if (!initialised) return

    if (user) {
      isNewUser
        ? props.navigation.navigate('Onboarding')
        : props.navigation.navigate({
            routeName: 'Home',
            action: StackActions.popToTop()
          })
    } else {
      props.navigation.navigate('SignIn')
    }
  }, [user, initialised])

  return initialised ? <Navigator navigation={props.navigation} /> : null
}

App.router = Navigator.router

export default createAppContainer(App)
