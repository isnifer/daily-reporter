/*

1) Что делали вчера
2) Что делаете сейчас
3) Что будете делать завтра;
4) Отвлекались ли на другие таски (на какие);
5) Блокирует ли что-то вашу работу.
6) Менялись ли эстимейты (к какой задаче, на сколько, причина)

 */

const inquirer = require('inquirer')
const range = require('lodash/range')

const QUESTION_TYPES = {
  YESTERDAY: 1,
  NOW: 2,
  TOMORROW: 3,
  OTHER: 4,
  BLOCK: 5,
  ESTIMATE: 6,
}

const output = range(Object.keys(QUESTION_TYPES).length).map(() => [])

const NEXT_QUESTION = 'Следующий вопрос'
const transformer = value => value ? `[RNA-${value}]` : NEXT_QUESTION

const questions = [
  {
    type: 'input',
    name: QUESTION_TYPES.YESTERDAY,
    message: 'Что Вы делали вчера?',
    filter: transformer,
  },
  {
    type: 'input',
    name: QUESTION_TYPES.NOW,
    message: 'Что Вы делаете сейчас?',
    filter: transformer,
  },
  {
    type: 'input',
    name: QUESTION_TYPES.TOMORROW,
    message: 'Что Вы будете делать завтра?',
    filter: transformer,
  },
  {
    type: 'input',
    name: QUESTION_TYPES.OTHER,
    message: 'Отвлекались ли Вы на другие таски (на какие)?',
    filter: transformer,
  },
  {
    type: 'input',
    name: QUESTION_TYPES.BLOCK,
    message: 'Блокирует ли что-то Вашу работу?',
    filter: transformer,
  },
  {
    type: 'input',
    name: QUESTION_TYPES.ESTIMATE,
    message: 'Менялись ли сроки (к какой задаче, на сколько, почему)?',
    filter: transformer,
  },
]

let questionId = 0

function ask(counter = 0) {
  if (counter !== questions.length) {
    inquirer.prompt(questions[counter]).then(answers => {
      if (counter !== questions.length && Object.values(answers)[0] === NEXT_QUESTION) {
        ask(counter + 1)
      } else {
        const name = questions[counter].name

        output[name - 1].push(answers[name])

        ask(counter)
      }
    })
  } else {
    const report = output.reduce((result, group, index) => {
      return result + `${index + 1}) ` + (group.join(' ') || '—') + '\n'
    }, '')

    console.log(`Ваш репорт: \n${report}`)
  }
}

ask()
