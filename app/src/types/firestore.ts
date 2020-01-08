import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

interface FirestoreTimestamp {
  _nanoseconds: number
  _seconds: number
}

export interface UserDoc {
  id: string
  name: string
  age: string
  photo: string
  location: {
    _latitude: number
    _longitude: number
  }
  interests: string[]
  personality: {
    extroversion: number
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
  content: string
  type: MessageType
  sender: FirebaseFirestoreTypes.DocumentReference | UserDoc
  createdAt: FirestoreTimestamp
}

export enum MessageType {
  'TEXT' = 'text',
  'PHOTO' = 'photo',
  'MATCH' = 'match'
}
