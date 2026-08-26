import { createQuizExport } from "../../shared/quiz/quizExport.js?v=20260704f";

const { downloadWord, printSheet } = createQuizExport({
  titleEnQuestions: "Foundations · Quantities and units — Questions",
  titleEnAnswers: "Foundations · Quantities and units — Answers",
  titleZhQuestions: "物理基礎 · 物理量與單位 — 試題",
  titleZhAnswers: "物理基礎 · 物理量與單位 — 答案",
  filePrefix: "foundations_quantities_quiz",
});

export { downloadWord, printSheet };
