const { writeFileSync } = require('fs')
const { PATH_TO_REPORT, PATH_TO_PROFILE, NEXT_QUESTION } = require('./constants')

const rex = /^\[\S*-\d*\]$/
const answers = {}

const getTaskName = (answer) => {
  let description

  if (answer.TASK_NUMBER === '[CUSTOM]') {
    description = answer.DESCRIPTION
  } else if (answer.WORK_TYPE !== 'DEVELOPMENT') {
    description = `[[${answer.WORK_TYPE}]]`
  } else {
    description = ''
  }

  return `${answer.TASK_NUMBER} ${description}`
}

const simpleReducer = (acc, answer) => acc.concat(getTaskName(answer))

const inlineReducer = groupName => (acc, answer) => (
  acc.concat(`${groupName} ${getTaskName(answer)}`)
)

const summaryLines = [
  {
    name: '[DISTRACTED]',
    reducer: inlineReducer,
  },
  {
    name: '[BLOCK]',
    reducer: inlineReducer,
  },
  {
    name: '[EST_CHANGES]',
    reducer: groupName => (acc, answer) => (
      acc.concat(`${groupName} ${answer.TASK_NUMBER} ${answer.EST_DIFF} ${answer.EST_DESCRIPTION}`)
    ),
  },
]

module.exports = {
  updateReport: (response, regularQuestion, refinementQuestion) => {
    const [answer] = Object.values(response)

    const answersInQuestion = answers[regularQuestion]
    answers[regularQuestion] = answersInQuestion || []

    if (answer !== NEXT_QUESTION) {
      if (refinementQuestion) {
        answersInQuestion[answersInQuestion.length - 1][refinementQuestion] = answer
      }

      if (regularQuestion && !refinementQuestion) {
        const TASK_NUMBER = rex.test(answer) ? answer : '[CUSTOM]'
        const DESCRIPTION = rex.test(answer) ? null : { DESCRIPTION: answer }

        answers[regularQuestion].push({
          TASK_NUMBER,
          ...(DESCRIPTION || {}),
        })
      }
    }

    return response
  },
  writeReport: () => {
    const today = new Date()
      .toLocaleDateString()
      .split('/')
      .reverse()
      .join('/')

    // eslint-disable-next-line
    const report = require(PATH_TO_REPORT)
    const content = {
      ...report,
      [today]: answers,
    }

    writeFileSync(PATH_TO_REPORT, JSON.stringify(content, null, 2))

    // eslint-disable-next-line
    console.log([].concat(
      'Ваш репорт готов:',
      '',
      // eslint-disable-next-line
      require(PATH_TO_PROFILE).fullName,
      Object.entries(answers).slice(0, 3).reduce((memo, [group, values]) => (
        memo.concat(
          `${group})${!values.length ? ' —' : ''}`,
          values.reduce(simpleReducer, [])
        )
      ), []),
      '',
      'Summary',
      Object.entries(answers).slice(3).reduce((memo, [, values], index) => (
        memo.concat(
          !values.length
            ? `${summaryLines[index].name} —`
            : values.reduce(summaryLines[index].reducer(summaryLines[index].name), [])
        )
      ), [])
    ).join('\n'))
  },
}
