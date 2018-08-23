const path = require('path')
const os = require('os')

const NEXT_QUESTION = '—'

const REGULAR_TYPES = {
  YESTERDAY: '1',
  NOW: '2',
  TOMORROW: '3',
  DISTRACTED: '4',
  BLOCK: '5',
  EST_CHANGES: '6',
}

const REGULAR_QUESTIONS = {
  [REGULAR_TYPES.YESTERDAY]: {
    name: REGULAR_TYPES.YESTERDAY,
    message: 'Что Вы делали вчера?',
  },
  [REGULAR_TYPES.NOW]: {
    name: REGULAR_TYPES.NOW,
    message: 'Что Вы делаете сейчас?',
  },
  [REGULAR_TYPES.TOMORROW]: {
    name: REGULAR_TYPES.TOMORROW,
    message: 'Что Вы будете делать завтра?',
  },
  [REGULAR_TYPES.DISTRACTED]: {
    name: REGULAR_TYPES.DISTRACTED,
    message: 'Было отвлечение на задачу',
  },
  [REGULAR_TYPES.BLOCK]: {
    name: REGULAR_TYPES.BLOCK,
    message: 'Меня блокирует',
  },
  [REGULAR_TYPES.EST_CHANGES]: {
    name: REGULAR_TYPES.EST_CHANGES,
    message: 'Сменился эстимейт у задачи',
  },
}

const PATH_TO_PROFILE = path.resolve(os.homedir(), '.tipsi_profile.json')
const PATH_TO_REPORT = path.resolve(os.homedir(), '.tipsi_report.json')

module.exports = {
  NEXT_QUESTION,
  REGULAR_TYPES,
  REGULAR_QUESTIONS,
  PATH_TO_PROFILE,
  PATH_TO_REPORT,
}
