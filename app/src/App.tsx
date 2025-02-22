import React, { useEffect, useState } from 'react'
import { StatusBar, Platform } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
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
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions'
import geohash from 'ngeohash'

import Home from './Home'
import SignIn from './SignIn'
import colors from './colors'
import config from '../config'
import { UserDoc } from './types/firestore'

const Navigator = createSwitchNavigator({
  Home: { screen: Home },
  SignIn: { screen: SignIn }
})

function App(props: NavigationContainerProps) {
  const [initialised, setInitialised] = useState(false)
  const [user, setUser] = useState<UserDoc>()
  const { currentUser } = auth()

  useEffect(() => {
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
        if (!initialised) {
          SplashScreen.hide()
          setInitialised(true)
        }
        props.navigation?.navigate(user ? 'Home' : 'SignIn')
      }),
    []
  )

  useEffect(() => {
    if (!currentUser) return

    firestore()
      .collection('users')
      .doc(currentUser.uid)
      .onSnapshot(snapshot => {
        setUser(snapshot.data() as UserDoc)
      })
  }, [currentUser])

  useEffect(() => {
    if (!currentUser || user?.onboarding.isOnboarding) return

    // Update FCM token on launch
    messaging()
      .getToken()
      .then(token => {
        firestore()
          .collection('users')
          .doc(currentUser.uid)
          .update({ notification_token: token })
      })

    // Update user's location on launch
    check(
      Platform.select({
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      })
    ).then(result => {
      if (result !== RESULTS.GRANTED) return

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
        () => null,
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      )
    })
  }, [currentUser, user?.onboarding.isOnboarding])

  return (
    initialised && (
      <>
        <StatusBar backgroundColor={colors.lilac} barStyle="dark-content" />
        <Navigator navigation={props.navigation} />
      </>
    )
  )
}

App.router = Navigator.router

export default createAppContainer(App)
