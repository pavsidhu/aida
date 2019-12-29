export default interface OnboardingMessage {
  message: string
  input?: {
    name: string
    type: 'text' | 'photo' | 'permission' | 'options'
    values?: string[]
  }
  route: {
    next?: string
    failure?: string
  }
}
