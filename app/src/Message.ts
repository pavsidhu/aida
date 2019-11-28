export default interface Message {
  message: string
  input?: string
  route: {
    next: string | null
    failure?: string
  }
}
