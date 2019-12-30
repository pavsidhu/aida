import { observable, decorate, computed, action } from 'mobx'
import { persist } from 'mobx-persist'

import onboardingMessages, { startingStep } from '.'

class OnboardingStore {
  step = startingStep
  isOnboarding = true
  context: { [key: string]: string } = {}

  get currentMessage() {
    const onboardingMessage = onboardingMessages[this.step]

    // Replace message templates with data from the chatbot context
    const message = Object.keys(this.context).reduce(
      (newMessage, key) => newMessage.replace(`{{${key}}}`, this.context[key]),
      onboardingMessage.message
    )

    return { ...onboardingMessage, message }
  }

  get hasNotStarted() {
    return this.isOnboarding && this.step === startingStep
  }
  nextMessage(next?: string) {
    // If there's no route, assume onboarding has finished
    if (!next) {
      this.isOnboarding = false
      return undefined
    }

    this.step = next
    return this.currentMessage
  }
}

// @ts-ignore
decorate(OnboardingStore, {
  step: [persist, observable],
  isOnboarding: [persist, observable],
  context: [persist('object'), observable],
  currentMessage: [computed],
  hasNotStarted: [computed],
  nextMessage: [action]
})

const onboardingStore = new OnboardingStore()

export default onboardingStore
