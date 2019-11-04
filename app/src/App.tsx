import React, { useEffect, useState } from 'react'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import Home from './Home'
import SignIn from './SignIn'

export default function App() {
  const [initilizing, setInitilizing] = useState(true)
  const [user, setUser] = useState<FirebaseAuthTypes.User>()

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      if (user) setUser(user)
      if (initilizing) setInitilizing(false)
    })

    return subscriber
  }, [])

  if (initilizing) return null

  return user ? <Home /> : <SignIn />
}
