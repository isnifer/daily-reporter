const { writeFileSync } = require('fs')
const clipboardy = require('clipboardy')
const {
  PATH_TO_REPORT,
  PATH_TO_PROFILE,
  NEXT_QUESTION,
  TASK_TYPES,
  TASK_NUMBER_REGEX,
} = require('./constants')
const { simpleQuestionsReducer, summaryQuestionsReducer } = require('./parsers')

const answers = {}

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
        const TASK_NUMBER = TASK_NUMBER_REGEX.test(answer) ? answer : `[${TASK_TYPES.CUSTOM}]`
        const DESCRIPTION = TASK_NUMBER_REGEX.test(answer) ? null : { DESCRIPTION: answer }

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

    const QUESTIONS = Object.entries(answers)
    const SIMPLE_QUESTIONS = QUESTIONS.slice(0, 3)
    const SUMMARY = QUESTIONS.slice(3)

    const summaryLines = SUMMARY.reduce(summaryQuestionsReducer, [])
    const summaryReport = summaryLines.length ? ['', 'Summary', ...summaryLines] : []

    const todayReport = [].concat(
      // eslint-disable-next-line
      require(PATH_TO_PROFILE).fullName,
      SIMPLE_QUESTIONS.reduce(simpleQuestionsReducer, []),
      summaryReport
    ).join('\n')

    // eslint-disable-next-line
    console.log([
      'Ваш репорт готов:',
      '',
      todayReport,
      '',
      'Вставьте репорт из буфера обмена (да-да, он уже там!) в Slack',
    ].join('\n'))

    clipboardy.writeSync(todayReport)
  },
}
