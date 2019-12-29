import { observable, decorate, computed, action } from 'mobx'
import { persist } from 'mobx-persist'

import onboardingMessages, { startingStep } from '.'

class OnboardingStore {
  step = startingStep
  isOnboarding = true
  context: { [key: string]: string } = {}

  get currentMessage() {
    return onboardingMessages[this.step]
  }

  get hasNotStarted() {
    return this.isOnboarding && this.step === startingStep
  }

  getMessage(route?: string) {
    if (!route) return undefined

    const onboardingMessage = onboardingMessages[route]

    // Replace message templates with data from the chatbot context
    const message = Object.keys(this.context).reduce(
      (newMessage, key) => newMessage.replace(`{{${key}}}`, this.context[key]),
      onboardingMessage.message
    )

    return { ...onboardingMessage, message }
  }

  nextMessage(next?: string) {
    if (next) this.step = next
    else this.isOnboarding = false
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
