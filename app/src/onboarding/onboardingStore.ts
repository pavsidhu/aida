import { observable, decorate, computed, action } from 'mobx'
import { persist, create } from 'mobx-persist'
import AsyncStorage from '@react-native-community/async-storage'
import onboardingMessages from '.'

class OnboardingStore {
  step = 'introduction-1'
  isOnboarding = true
  context: { [key: string]: string } = {}

  get currentMessage() {
    return onboardingMessages[this.step]
  }

  nextMessage(next?: string) {
    if (next) this.step = next
    else this.isOnboarding = false
  }
}

decorate(OnboardingStore, {
  step: [persist, observable],
  isOnboarding: [persist, observable],
  context: [persist, observable],
  currentMessage: [computed],
  nextMessage: [action]
})

const onboardingStore = new OnboardingStore()

const hydrate = create({
  storage: AsyncStorage
})
hydrate('onboarding', onboardingStore)

export default onboardingStore
