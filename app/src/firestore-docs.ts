import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

interface FirestoreTimestamp {
  _nanoseconds: number
  _seconds: number
}

export interface UserDoc {
  id: string
  name: string
  photo: string
  location: {
    _latitude: number
    _longitude: number
  }
  interests: string[]
  personality: {
    extraversion: number
    agreeableness: number
    openness: number
    conscientiousness: number
    neuroticism: number
  }
  messages: FirebaseFirestoreTypes.DocumentReference[] | MessageDoc[]
  createdAt: FirestoreTimestamp
}

export interface MatchDoc {
  id: string
  users: FirebaseFirestoreTypes.DocumentReference[] | UserDoc[]
  messages: FirebaseFirestoreTypes.DocumentReference[] | MessageDoc[]
  createdAt: FirestoreTimestamp
}

export interface MessageDoc {
  sender: FirebaseFirestoreTypes.DocumentReference | UserDoc
  text: string
  createdAt: FirestoreTimestamp
}
