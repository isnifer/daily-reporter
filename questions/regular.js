const isEmpty = require('lodash/isEmpty')
const get = require('lodash/get')
const { NEXT_QUESTION, REGULAR_TYPES, REGULAR_QUESTIONS, PATH_TO_PROFILE } = require('../constants')

// eslint-disable-next-line
const { taskType } = require(PATH_TO_PROFILE)
const transformer = value => value ? `[${taskType}-${value}]` : NEXT_QUESTION
const isTaskANumber = (rawValue) => {
  const value = rawValue.trim()
  const numbers = value.match(/\d/g)

  return get(numbers, 'length') === value.length
}

const defaultRegularFilter = (value) => {
  if (isTaskANumber(value) || isEmpty(value)) {
    return transformer(value)
  }

  return value
}

module.exports = {
  questions: REGULAR_QUESTIONS,
  getQuestion: id => ({
    type: 'input',
    filter: defaultRegularFilter,
    ...REGULAR_QUESTIONS[id],
  }),
  FIRST_QUESTION: REGULAR_TYPES.YESTERDAY,
  NEXT_QUESTION,
  callback: (answers) => {
    const [[question, response]] = Object.entries(answers)

    return REGULAR_QUESTIONS[question].then({ question, response })
  },
}
