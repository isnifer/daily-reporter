const isEmpty = require('lodash/isEmpty')
const get = require('lodash/get')
const {
  NEXT_QUESTION,
  REGULAR_TYPES,
  REGULAR_QUESTIONS,
  PATH_TO_PROFILE,
} = require('../constants')

// eslint-disable-next-line
const { taskType } = require(PATH_TO_PROFILE)
const transformer = value => value ? `[${taskType}-${value}]` : NEXT_QUESTION
const isTaskANumber = (rawValue) => {
  const value = rawValue.trim()
  const numbers = value.match(/\d/g)

  return get(numbers, 'length') === value.length
}

module.exports = {
  questions: REGULAR_QUESTIONS,
  getQuestion: (id) => {
    const { name, message } = REGULAR_QUESTIONS[id]

    return {
      type: 'input',
      name,
      message,
      filter: (value) => {
        if (isTaskANumber(value) || isEmpty(value)) {
          return transformer(value)
        }

        return value
      },
    }
  },
  FIRST_QUESTION: REGULAR_TYPES.YESTERDAY,
  NEXT_QUESTION,
  callback: (answers) => {
    const [[question, answer]] = Object.entries(answers)
    const { SUBQUESTION_TYPES } = require('./refinement')

    // Если пришел ответ на последний вопрос об эстимейте
    if (question === REGULAR_TYPES.EST_CHANGES) {
      // Если ответить нечего, то выходим
      if (answer === NEXT_QUESTION) {
        return 'DONE'
      }

      // Иначе следующий вопрос о том насколько увеличился эстимейт
      return SUBQUESTION_TYPES.EST_DIFF
    }

    if (question === REGULAR_TYPES.BLOCK && answer !== NEXT_QUESTION) {
      return 'SAME'
    }

    // Если пришел ответ на вопрос не об эстимейте, то нужно отправить вопрос о типе работы
    if (question !== REGULAR_TYPES.EST_CHANGES && answer !== NEXT_QUESTION) {
      return SUBQUESTION_TYPES.WORK_TYPE
    }

    if (answer === NEXT_QUESTION) {
      return parseInt(question, 10) + 1
    }

    return false
  },
}
