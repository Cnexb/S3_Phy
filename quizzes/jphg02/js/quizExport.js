import { createQuizExport } from "../../shared/quiz/quizExport.js?v=20260704f";

const { downloadWord, printSheet } = createQuizExport({
  titleEnQuestions: "JPHG02 Heat and internal energy — Questions",
  titleEnAnswers: "JPHG02 Heat and internal energy — Answers",
  titleZhQuestions: "JPHG02 熱與內能 — 試題",
  titleZhAnswers: "JPHG02 熱與內能 — 答案",
  filePrefix: "jphg02_quiz",
});

export { downloadWord, printSheet };
