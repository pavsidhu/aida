import React, { useEffect, useState } from 'react'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import Home from './Home'
import SignIn from './SignIn'

export default function App() {
  const [initilizing, setInitilizing] = useState(true)
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>()

  function handleAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    if (initilizing) setInitilizing(false)
    setUser(user)
  }

  useEffect(() => auth().onAuthStateChanged(handleAuthStateChanged), [])

  if (initilizing) return null

  return user ? <Home /> : <SignIn />
}
