import { createQuizExport } from "../../shared/quiz/quizExport.js?v=20260704f";

const { downloadWord, printSheet } = createQuizExport({
  titleEnQuestions: "Foundations · Useful mathematics — Questions",
  titleEnAnswers: "Foundations · Useful mathematics — Answers",
  titleZhQuestions: "物理基礎 · 物理中常用的數學 — 試題",
  titleZhAnswers: "物理基礎 · 物理中常用的數學 — 答案",
  filePrefix: "foundations_useful_math_quiz",
});

export { downloadWord, printSheet };
