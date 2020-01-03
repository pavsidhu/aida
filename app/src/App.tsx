import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import Geolocation from 'react-native-geolocation-service'
import {
  createAppContainer,
  createSwitchNavigator,
  NavigationContainerProps
} from 'react-navigation'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { create } from 'mobx-persist'

import Home from './Home'
import SignIn from './SignIn'
import onboardingStore from './onboarding/onboardingStore'
import { StatusBar, Alert } from 'react-native'
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
  const { currentUser } = auth()

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

  // Update user's location everytime the app is launched
  useEffect(() => {
    if (!currentUser) return

    Geolocation.getCurrentPosition(
      position =>
        firestore()
          .collection('users')
          .doc(currentUser.uid)
          .update({
            location: new firestore.GeoPoint(
              position.coords.latitude,
              position.coords.longitude
            )
          }),
      () =>
        Alert.alert(
          'Location Access',
          'Please enable location permissions to use Aida'
        ),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    )
  }, [currentUser])

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
