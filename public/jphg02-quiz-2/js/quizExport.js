import { createQuizExport } from "../../shared/quiz/quizExport.js?v=20260704f";

const { downloadWord, printSheet } = createQuizExport({
  titleEnQuestions: "JPHG02 Heat and internal energy — Quiz 2 — Questions",
  titleEnAnswers: "JPHG02 Heat and internal energy — Quiz 2 — Answers",
  titleZhQuestions: "JPHG02 熱與內能 — 測驗 2 — 試題",
  titleZhAnswers: "JPHG02 熱與內能 — 測驗 2 — 答案",
  filePrefix: "jphg02_quiz_2",
});

export { downloadWord, printSheet };
