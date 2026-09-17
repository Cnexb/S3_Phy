import { createQuizExport } from "../../shared/quiz/quizExport.js?v=20260704f";

const { downloadWord, printSheet } = createQuizExport({
  titleEnQuestions: "Heat Ch.1 Quiz — Questions",
  titleEnAnswers: "Heat Ch.1 Quiz — Answers",
  titleZhQuestions: "熱學 第一章 測驗 — 試題",
  titleZhAnswers: "熱學 第一章 測驗 — 答案",
  filePrefix: "heat_ch1_quiz",
});

export { downloadWord, printSheet };
