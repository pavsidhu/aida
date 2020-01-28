import React, { useEffect, useState } from 'react'
import { StatusBar, Alert } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Geolocation from 'react-native-geolocation-service'
import {
  createAppContainer,
  createSwitchNavigator,
  NavigationContainerProps
} from 'react-navigation'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging'
import { Dialogflow_V2 } from 'react-native-dialogflow'
import { create } from 'mobx-persist'
import { useObservable } from 'mobx-react-lite'
import geohash from 'ngeohash'

import Home from './Home'
import SignIn from './SignIn'
import colors from './colors'
import config from '../config'
import onboardingStore from './onboarding/onboardingStore'

const hydrate = create({ storage: AsyncStorage })

const Navigator = createSwitchNavigator({
  Home: { screen: Home },
  SignIn: { screen: SignIn }
})

function App(props: NavigationContainerProps) {
  const [initialised, setInitialised] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const { currentUser } = auth()
  const onboarding = useObservable(onboardingStore)

  useEffect(() => {
    hydrate('onboarding', onboardingStore).then(() => setHydrated(true))

    Dialogflow_V2.setConfiguration(
      config.dialogflow.serviceAccount,
      config.dialogflow.privateKey,
      Dialogflow_V2.LANG_ENGLISH_GB,
      config.dialogflow.projectId
    )
  }, [])

  useEffect(
    () =>
      auth().onAuthStateChanged(user => {
        if (!initialised) setInitialised(true)
        props.navigation?.navigate(user ? 'Home' : 'SignIn')
      }),
    []
  )

  useEffect(() => {
    if (!currentUser || onboarding.isOnboarding) return

    // Update FCM token on launch
    messaging()
      .getToken()
      .then(token => {
        firestore()
          .collection('users')
          .doc(currentUser.uid)
          .update({ notificationToken: token })
      })

    // Update user's location on launch
    Geolocation.getCurrentPosition(
      position =>
        firestore()
          .collection('users')
          .doc(currentUser.uid)
          .update({
            location: geohash.encode(
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
  }, [currentUser, onboarding.isOnboarding])

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
