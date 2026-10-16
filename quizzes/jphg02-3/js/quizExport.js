import { createQuizExport } from "../../shared/quiz/quizExport.js?v=20260704f";

const { downloadWord, printSheet } = createQuizExport({
  titleEnQuestions: "JPHG02 Heat and internal energy — Quiz 3 — Questions",
  titleEnAnswers: "JPHG02 Heat and internal energy — Quiz 3 — Answers",
  titleZhQuestions: "JPHG02 熱與內能 — 測驗 3 — 試題",
  titleZhAnswers: "JPHG02 熱與內能 — 測驗 3 — 答案",
  filePrefix: "jphg02_quiz_3",
});

export { downloadWord, printSheet };
