const isEmpty = require('lodash/isEmpty')
const isInteger = require('lodash/isInteger')
const { PATH_TO_PROFILE, REFINEMENT_TYPES, TASK_TYPES, TEAM_ROLES } = require('../constants')

// eslint-disable-next-line
const profile = require(PATH_TO_PROFILE)

module.exports = {
  [REFINEMENT_TYPES.WORK]: {
    type: 'list',
    name: REFINEMENT_TYPES.WORK,
    choices: () => {
      if (profile.role === TEAM_ROLES.QA) {
        return [TASK_TYPES.TEST, TASK_TYPES.DOCUMENTATION, TASK_TYPES.DEVELOPMENT]
      }

      if (profile.role === TEAM_ROLES.DESIGNER) {
        return [TASK_TYPES.DESIGN, TASK_TYPES.DOCUMENTATION]
      }

      return [TASK_TYPES.DEVELOPMENT, TASK_TYPES.REVIEW, TASK_TYPES.DOCUMENTATION]
    },
    message: 'Выберите тип выполняемой работы',
    callback: () => 'SAME',
  },
  [REFINEMENT_TYPES.DESCRIPTION]: {
    type: 'input',
    name: REFINEMENT_TYPES.DESCRIPTION,
    message: 'Расскажите об этом несколько слов',
    validate: (input) => {
      const value = input.trim()

      if (isEmpty(value)) {
        return 'Расскажите об этом несколько слов'
      }

      if (value.length < 10) {
        return 'Чуточку подробнее'
      }

      return true
    },
    callback: () => 'SAME',
  },
  [REFINEMENT_TYPES.EST_DIFF]: {
    type: 'input',
    name: REFINEMENT_TYPES.EST_DIFF,
    message: 'На сколько увеличился срок выполнения задачи?',
    validate: (input) => {
      const value = input.trim().replace(/^\+/, '').replace(/h$/, '')

      if (isEmpty(value)) {
        return 'Введите дополнительно необходимое время для завершения задачи'
      }

      if (!isInteger(parseInt(value, 10))) {
        return 'Введенное время должно быть целым числом'
      }

      return true
    },
    filter: value => `+${value.trim()}h`,
    callback: () => REFINEMENT_TYPES.EST_DESCRIPTION,
  },
  [REFINEMENT_TYPES.EST_DESCRIPTION]: {
    type: 'input',
    name: REFINEMENT_TYPES.EST_DESCRIPTION,
    message: 'Почему увеличился срок выполнения задачи?',
    validate: (input) => {
      const value = input.trim()

      if (isEmpty(value)) {
        return 'Введите причину увеличения срока выполнения задачи'
      }

      if (value.length < 10) {
        return 'Опишите чуть подробнее причину увеличения срока выполнения задачи'
      }

      return true
    },
    callback: () => 'SAME',
  },
}
