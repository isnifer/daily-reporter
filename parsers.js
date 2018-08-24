const { TASK_TYPES } = require('./constants')

const getTaskName = (answer) => {
  let description

  if (answer.TASK_NUMBER === `[${TASK_TYPES.CUSTOM}]`) {
    description = answer.DESCRIPTION
  } else if (answer.WORK !== TASK_TYPES.DEVELOPMENT) {
    description = `[[${answer.WORK}]]`
  } else {
    description = ''
  }

  return `${answer.TASK_NUMBER} ${description}`
}

const simpleReducer = (acc, answer) => acc.concat(getTaskName(answer))

const simpleQuestionsReducer = (memo, [group, values]) => (
  memo.concat(
    `${group})${!values.length ? ' —' : ''}`,
    values.reduce(simpleReducer, [])
  )
)

const distractedBlockReducer = groupName => (acc, answer) => {
  const taskNumber = answer.TASK_NUMBER === `[${TASK_TYPES.CUSTOM}]` ? '' : `${answer.TASK_NUMBER} `

  return acc.concat(`${groupName} ${taskNumber}${answer.DESCRIPTION}`)
}

const summaryLines = [
  {
    name: '[DISTRACTED]',
    reducer: distractedBlockReducer,
  },
  {
    name: '[BLOCK]',
    reducer: distractedBlockReducer,
  },
  {
    name: '[EST_CHANGES]',
    reducer: groupName => (acc, answer) => (
      acc.concat(`${groupName} ${answer.TASK_NUMBER} ${answer.EST_DIFF} ${answer.EST_DESCRIPTION}`)
    ),
  },
]

const summaryQuestionsReducer = (memo, [, values], index) => (
  !values.length ? memo : memo.concat(
    values.reduce(summaryLines[index].reducer(summaryLines[index].name), [])
  )
)

module.exports = {
  simpleQuestionsReducer,
  summaryQuestionsReducer,
}
