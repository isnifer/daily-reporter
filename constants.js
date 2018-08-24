const path = require('path')
const os = require('os')

const PATH_TO_PROFILE = path.resolve(os.homedir(), '.tipsi_profile.json')
const PATH_TO_REPORT = path.resolve(os.homedir(), '.tipsi_report.json')

const TASK_NUMBER_REGEX = /^\[\S*-\d*\]$/

const NEXT_QUESTION = '—'

const REGULAR_TYPES = {
  YESTERDAY: '1',
  NOW: '2',
  TOMORROW: '3',
  DISTRACTED: '4',
  BLOCK: '5',
  EST_CHANGES: '6',
}

const REFINEMENT_TYPES = {
  WORK: 'WORK',
  DESCRIPTION: 'DESCRIPTION',
  EST_DIFF: 'EST_DIFF',
  EST_DESCRIPTION: 'EST_DESCRIPTION',
}

const TASK_TYPES = {
  DEVELOPMENT: 'DEVELOPMENT',
  REVIEW: 'REVIEW',
  TEST: 'TEST',
  DESIGN: 'DESIGN',
  DOCUMENTATION: 'DOCUMENTATION',
  CUSTOM: 'CUSTOM',
}

const TEAM_ROLES = {
  FRONTEND: 'Frontend Developer',
  BACKEND: 'Backend Developer',
  QA: 'QA',
  DESIGNER: 'Designer',
}

const TEAM_ROLES_ARRAY = [
  TEAM_ROLES.FRONTEND,
  TEAM_ROLES.BACKEND,
  TEAM_ROLES.QA,
  TEAM_ROLES.DESIGNER,
]

const moveToTheNextQustion = question => parseInt(question, 10) + 1

const simpleQuestionsReaction = ({ question, response }) => {
  if (response !== NEXT_QUESTION) {
    // If response is a task number
    if (TASK_NUMBER_REGEX.test(response)) {
      return REFINEMENT_TYPES.WORK
    }

    return 'SAME'
  }

  return moveToTheNextQustion(question)
}

const distractedBlockQuestionsReaction = ({ question, response }) => {
  if (response !== NEXT_QUESTION) {
    // If response is a task number
    if (TASK_NUMBER_REGEX.test(response)) {
      return REFINEMENT_TYPES.DESCRIPTION
    }

    return 'SAME'
  }

  return moveToTheNextQustion(question)
}

const estimateChangesQuestionsReaction = ({ response }) => {
  if (response !== NEXT_QUESTION) {
    return REFINEMENT_TYPES.EST_DIFF
  }

  return 'DONE'
}

const REGULAR_QUESTIONS = {
  [REGULAR_TYPES.YESTERDAY]: {
    name: REGULAR_TYPES.YESTERDAY,
    message: 'Что Вы делали вчера?',
    then: simpleQuestionsReaction,
  },
  [REGULAR_TYPES.NOW]: {
    name: REGULAR_TYPES.NOW,
    message: 'Что Вы делаете сейчас?',
    then: simpleQuestionsReaction,
  },
  [REGULAR_TYPES.TOMORROW]: {
    name: REGULAR_TYPES.TOMORROW,
    message: 'Что Вы будете делать завтра?',
    then: simpleQuestionsReaction,
  },
  [REGULAR_TYPES.DISTRACTED]: {
    name: REGULAR_TYPES.DISTRACTED,
    message: 'Было отвлечение на задачу',
    then: distractedBlockQuestionsReaction,
  },
  [REGULAR_TYPES.BLOCK]: {
    name: REGULAR_TYPES.BLOCK,
    message: 'Меня блокирует',
    then: distractedBlockQuestionsReaction,
  },
  [REGULAR_TYPES.EST_CHANGES]: {
    name: REGULAR_TYPES.EST_CHANGES,
    message: 'Сменился эстимейт у задачи',
    validate: (input) => {
      const value = input.trim()

      if (value !== NEXT_QUESTION && !TASK_NUMBER_REGEX.test(value)) {
        return 'Введите просто номер задачи, например, 1234'
      }

      return true
    },
    then: estimateChangesQuestionsReaction,
  },
}

module.exports = {
  NEXT_QUESTION,
  REGULAR_TYPES,
  REGULAR_QUESTIONS,
  PATH_TO_PROFILE,
  PATH_TO_REPORT,
  REFINEMENT_TYPES,
  TASK_TYPES,
  TASK_NUMBER_REGEX,
  TEAM_ROLES,
  TEAM_ROLES_ARRAY,
}
