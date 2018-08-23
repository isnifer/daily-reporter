/*

1) Что делали вчера
2) Что делаете сейчас
3) Что будете делать завтра;
4) Отвлекались ли на другие таски (на какие);
5) Блокирует ли что-то вашу работу.
6) Менялись ли эстимейты (к какой задаче, на сколько, причина)

 */

/*
  THINGS

  Проект (RNA, BACK, etc...) — заполняется один раз при первом заходе

  A) Номер задачи или текст (если введен чисто номер, то подставлять проект,
     иначе брать введенный текст и тип выполняемой работы ставить CUSTOM)

  B) Тип выполняемой работы (REVIEW, TEST) (DEVELOPMENT by default)

  C) На сколько увеличился срок выполнения задачи

  D) Почему увеличился срок выполнения задачи

  1: A, B
  2: A, B
  3: A, B
  4: A, B
  5: A, B
  6: A, C, D

  Схема конечного сообщения:

  SIMPLE_CASE (1—3):

  %QUESTION_TYPE%)
  [TASK_NUMBER] [[WORK_TYPE]]
  [TASK_NUMBER] [[WORK_TYPE]]
  [CUSTOM] DESCRIPTION

  %SUMMARY%)
  [DISTRACTED] [TASK_NUMBER?] DESCRIPTION
  [DISTRACTED] [TASK_NUMBER?] DESCRIPTION
  [DISTRACTED] [TASK_NUMBER?] DESCRIPTION
  [BLOCK] [TASK_NUMBER?] DESCRIPTION
  [BLOCK] [TASK_NUMBER?] DESCRIPTION
  [BLOCK] [TASK_NUMBER?] DESCRIPTION
  [BLOCK] [TASK_NUMBER?] DESCRIPTION
  [EST_CHANGES] [TASK_NUMBER] [EST_DIFF] DESCRIPTION
  [EST_CHANGES] [TASK_NUMBER] [EST_DIFF] DESCRIPTION
  [EST_CHANGES] [TASK_NUMBER] [EST_DIFF] DESCRIPTION
  [EST_CHANGES] [TASK_NUMBER] [EST_DIFF] DESCRIPTION

  Человекочитаемый формат сообщения:

  1)
  [RNA-1546]
  [RNA-1436] [[REVIEW]]
  [RNA-1567] [[TEST]]

  SUMMARY)
  [DISTRACTED] [RNA-1674] Helped Nikolay with Google Pay
  [BLOCK] Design from Denis
  [EST_CHANGES] [RNA-1678] [+4h] Bad code refactoring

  DESCRIPTION — обязательное поле

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
