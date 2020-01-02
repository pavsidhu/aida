import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import {
  createAppContainer,
  createSwitchNavigator,
  NavigationContainerProps
} from 'react-navigation'
import auth from '@react-native-firebase/auth'
import { create } from 'mobx-persist'

import Home from './Home'
import SignIn from './SignIn'
import onboardingStore from './onboarding/onboardingStore'
import { StatusBar } from 'react-native'
import colors from './colors'
import './questioning/scheduler'

const hydrate = create({ storage: AsyncStorage })

const Navigator = createSwitchNavigator({
  Home: { screen: Home },
  SignIn: { screen: SignIn }
})

function App(props: NavigationContainerProps) {
  const [initialised, setInitialised] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    hydrate('onboarding', onboardingStore).then(() => setHydrated(true))
  }, [])

  useEffect(
    () =>
      auth().onAuthStateChanged(user => {
        if (!initialised) setInitialised(true)
        props.navigation?.navigate(user ? 'Home' : 'SignIn')
      }),
    []
  )

  return (
    initialised &&
    hydrated && (
      <>
        <StatusBar backgroundColor={colors.lilac} barStyle="dark-content" />
        <Navigator navigation={props.navigation} />
      </>
    )
  )
}

App.router = Navigator.router

export default createAppContainer(App)
