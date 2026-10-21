import { createQuizExport } from "../../shared/quiz/quizExport.js?v=20260704f";

const { downloadWord, printSheet } = createQuizExport({
  titleEnQuestions: "JPHG02 Heat and internal energy — Quiz 4 — Questions",
  titleEnAnswers: "JPHG02 Heat and internal energy — Quiz 4 — Answers",
  titleZhQuestions: "JPHG02 熱與內能 — 測驗 4 — 試題",
  titleZhAnswers: "JPHG02 熱與內能 — 測驗 4 — 答案",
  filePrefix: "jphg02_quiz_4",
});

export { downloadWord, printSheet };
