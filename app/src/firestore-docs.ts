import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

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
  messages: FirebaseFirestoreTypes.DocumentReference[] | Message[]
  createdAt: any
}

export interface MatchDoc {
  id: string
  users: FirebaseFirestoreTypes.DocumentReference[] | UserDoc[]
  messages: FirebaseFirestoreTypes.DocumentReference[] | Message[]
  createdAt: any
}

export interface Message {
  sender: FirebaseFirestoreTypes.DocumentReference[] | UserDoc[]
  type: MessageType
  content: string
  createdAt: any
}

export enum MessageType {
  'text'
}
