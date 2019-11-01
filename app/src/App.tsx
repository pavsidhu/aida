import React, { useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth'
import Home from './Home'
import SignIn from './SignIn'

export default function App() {
  // Set an initilizing state whilst Firebase connects
  const [initilizing, setInitilizing] = useState(true)
  const [user, setUser] = useState()

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user)
    if (initilizing) setInitilizing(false)
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber // unsubscribe on unmount
  }, [])

  if (initilizing) return null

  return user ? <Home /> : <SignIn />
}
