import { observable, decorate } from 'mobx'
import { persist, create } from 'mobx-persist'
import AsyncStorage from '@react-native-community/async-storage'

class OnboardingStore {
  step = 'introduction-1'
  isOnboarding = true
  context: { [key: string]: string } = {}
}

decorate(OnboardingStore, {
  step: [persist, observable],
  isOnboarding: [persist, observable],
  context: [persist, observable]
})

const onboardingStore = new OnboardingStore()

const hydrate = create({
  storage: AsyncStorage
})
hydrate('onboarding', onboardingStore)

export default onboardingStore
