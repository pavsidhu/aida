import { IMessage } from 'react-native-gifted-chat'
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

export default interface CustomIMessage extends IMessage {
  match: FirebaseFirestoreTypes.DocumentReference
}
