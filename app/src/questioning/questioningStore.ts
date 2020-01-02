import { action, decorate, observable } from 'mobx'
import { persist } from 'mobx-persist'

const MINIMUM_QUESTION_TIME = 1000 * 60 * 30 // 0.5 Hours
const QUESTION_TIME_RANGE = 1000 * 60 * 60 * 5 // 5 Hours

class QuestioningStore {
  nextQuestionTime?: number = undefined

  generateNextQuestionTime() {
    this.nextQuestionTime =
      new Date().getTime() / 1000 +
      MINIMUM_QUESTION_TIME +
      Math.random() * QUESTION_TIME_RANGE
  }
}

decorate(QuestioningStore, {
  nextQuestionTime: [persist, observable],
  generateNextQuestionTime: [action]
})

const questioningStore = new QuestioningStore()

export default questioningStore
