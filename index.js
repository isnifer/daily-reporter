#!/usr/bin/env node

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

  Пример JSON:
  {
    1: [
      { TASK_NUMBER, WORK },
    ],
    2: [
      { TASK_NUMBER, WORK },
    ],
    3: [
      { TASK_NUMBER: CUSTOM, WORK },
    ],
    4: [
      { TASK_NUMBER, WORK },
      { TASK_NUMBER: CUSTOM, WORK },
    ],
    5: [
      { TASK_NUMBER, WORK },
      { TASK_NUMBER: CUSTOM, WORK },
    ],
    6: [
      { TASK_NUMBER, EST_DIFF, DESCRIPTION },
    ]
  }

  Схема конечного сообщения:

  SIMPLE_CASE (1—3):

  %QUESTION_TYPE%)
  [TASK_NUMBER] [[WORK]]
  [TASK_NUMBER] [[WORK]]
  [CUSTOM] DESCRIPTION

  %SUMMARY%)
  [DISTRACTED] [TASK_NUMBER?] DESCRIPTION
  [DISTRACTED] [TASK_NUMBER?] DESCRIPTION
  [DISTRACTED] [TASK_NUMBER?] DESCRIPTION
  [BLOCK] [TASK_NUMBER?] DESCRIPTION
  [BLOCK] [TASK_NUMBER?] DESCRIPTION
  [BLOCK] [TASK_NUMBER?] DESCRIPTION
  [BLOCK] [TASK_NUMBER?] DESCRIPTION
  [EST_CHANGES] [TASK_NUMBER] EST_DIFF EST_DESCRIPTION
  [EST_CHANGES] [TASK_NUMBER] EST_DIFF EST_DESCRIPTION
  [EST_CHANGES] [TASK_NUMBER] EST_DIFF EST_DESCRIPTION
  [EST_CHANGES] [TASK_NUMBER] EST_DIFF EST_DESCRIPTION

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
const { updateReport, writeReport } = require('./report')
const main = require('./questions/main')

let regular = {}
let refinement = {}

function askRegularQuestion(item) {
  return inquirer.prompt(regular.getQuestion(item))
    .then(answers => updateReport(answers, item))
    .then(regular.callback)
    .then((nextQuestion) => {
      if (nextQuestion === 'SAME') {
        return askRegularQuestion(item)
      }

      if (nextQuestion === 'DONE') {
        return true
      }

      if (refinement[nextQuestion]) {
        return askRefinementQuestion(nextQuestion, item)
      }

      return askRegularQuestion(nextQuestion)
    })
}

function askRefinementQuestion(questionName, regularQuestion) {
  const currentQuestion = refinement[questionName]

  return inquirer.prompt(currentQuestion)
    .then(answers => updateReport(answers, regularQuestion, questionName))
    .then(currentQuestion.callback)
    .then((nextQuestion) => {
      if (nextQuestion === 'SAME') {
        return askRegularQuestion(regularQuestion)
      }

      return askRefinementQuestion(nextQuestion, regularQuestion)
    })
}

async function reporter() {
  // Main Questions (Ask once)
  if (!main.isProfileExists()) {
    await inquirer.prompt(main.questions).then(main.callback)
  }

  regular = require('./questions/regular')
  refinement = require('./questions/refinement')

  await askRegularQuestion(regular.FIRST_QUESTION).then(writeReport)
}

reporter()
