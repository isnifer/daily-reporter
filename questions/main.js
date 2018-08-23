const { writeFileSync } = require('fs')
const isNil = require('lodash/isNil')
const { PATH_TO_PROFILE, PATH_TO_REPORT } = require('../constants')

module.exports = {
  questions: [
    {
      type: 'input',
      name: 'fullName',
      message: 'Введите ваши имя и фамилию (на английском)',
      validate: (input) => {
        const value = input.trim()

        if (isNil(value)) {
          return 'Имя не может быть пустым'
        }

        if (value.split(' ').length !== 2) {
          return 'Введите имя и фамилию в формате %FIRST_NAME% %SECOND_NAME%'
        }

        return true
      },
    },
    {
      type: 'list',
      name: 'role',
      message: 'Выберите вашу роль в команде',
      choices: ['Frontend Developer', 'Backend Developer', 'QA'],
    },
    {
      type: 'list',
      name: 'taskType',
      message: 'Выберите тип проекта, над которым вы обычно работаете',
      choices: ['RNA', 'BACK'],
    },
  ],
  callback: (answers) => {
    writeFileSync(PATH_TO_PROFILE, JSON.stringify(answers, null, 2))
    writeFileSync(PATH_TO_REPORT, JSON.stringify({}, null, 2))
  },
  isProfileExists: () => {
    try {
      require.resolve(PATH_TO_PROFILE)
      return true
    } catch (error) {
      return false
    }
  },
}
