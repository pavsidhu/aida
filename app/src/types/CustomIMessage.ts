import { IMessage } from 'react-native-gifted-chat'

export default interface CustomIMessage extends IMessage {
  match: string
}
