import { observable, decorate, computed, action } from 'mobx'
import { persist } from 'mobx-persist'

import onboardingFlow from './onboardingFlow'

class OnboardingStore {
  step = onboardingFlow.start
  isOnboarding = true
  context: { [key: string]: string } = {}

  get currentMessage() {
    const onboardingMessage = onboardingFlow.messages[this.step]

    // Replace message templates with data from the chatbot context
    const message = Object.keys(this.context).reduce(
      (newMessage, key) => newMessage.replace(`{{${key}}}`, this.context[key]),
      onboardingMessage.message
    )

    return { ...onboardingMessage, message }
  }

  get hasNotStarted() {
    return this.isOnboarding && this.step === onboardingFlow.start
  }

  nextMessage(next: string) {
    this.step = next
    return this.currentMessage
  }

  reset() {
    this.step = onboardingFlow.start
    this.isOnboarding = true
    this.context = {}
  }
}

// @ts-ignore
decorate(OnboardingStore, {
  step: [persist, observable],
  isOnboarding: [persist, observable],
  context: [persist('object'), observable],
  currentMessage: [computed],
  hasNotStarted: [computed],
  nextMessage: [action],
  reset: [action]
})

const onboardingStore = new OnboardingStore()

export default onboardingStore
