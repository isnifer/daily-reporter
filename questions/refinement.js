const isNil = require('lodash/isNil')
const isNumber = require('lodash/isNumber')
const { PATH_TO_PROFILE } = require('../constants')

// eslint-disable-next-line
const profile = require(PATH_TO_PROFILE)

const SUBQUESTION_TYPES = {
  WORK_TYPE: 'WORK_TYPE',
  EST_DIFF: 'EST_DIFF',
  EST_DESCRIPTION: 'EST_DESCRIPTION',
}

const DEVELOPMENT = 'DEVELOPMENT'
const REVIEW = 'REVIEW'
const TEST = 'TEST'

module.exports = {
  questions: {
    [SUBQUESTION_TYPES.WORK_TYPE]: {
      type: 'list',
      name: SUBQUESTION_TYPES.WORK_TYPE,
      choices: () => {
        if (profile.role === 'QA') {
          return [TEST, DEVELOPMENT]
        }

        return [DEVELOPMENT, REVIEW]
      },
      message: 'Выберите тип выполняемой работы',
      callback: () => 'SAME',
    },
    [SUBQUESTION_TYPES.EST_DIFF]: {
      type: 'input',
      name: SUBQUESTION_TYPES.EST_DIFF,
      message: 'На сколько увеличился срок выполнения задачи?',
      validate: (input) => {
        const value = input.trim()

        if (isNil(value)) {
          return 'Введите дополнительно необходимое время для завершения задачи'
        }

        if (!isNumber(parseInt(value, 10))) {
          return 'Введенное время должно быть числом'
        }

        return true
      },
      filter: value => `+${value.trim()}h`,
      callback: () => SUBQUESTION_TYPES.EST_DESCRIPTION,
    },
    [SUBQUESTION_TYPES.EST_DESCRIPTION]: {
      type: 'input',
      name: SUBQUESTION_TYPES.EST_DESCRIPTION,
      message: 'Почему увеличился срок выполнения задачи?',
      validate: (input) => {
        const value = input.trim()

        if (isNil(value)) {
          return 'Введите причину увеличения срока выполнения задачи'
        }

        if (value.length < 10) {
          return 'Опишите чуть подробнее причину увеличения срока выполнения задачи'
        }

        return true
      },
      callback: () => 'SAME',
    },
  },
  SUBQUESTION_TYPES,
}
