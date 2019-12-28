export default interface OnboardingMessage {
  message: string
  input?: {
    name: string
    type: 'text' | 'photo' | 'permission'
  }
  route: {
    next?: string
    failure?: string
  }
}
