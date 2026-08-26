import { createQuizExport } from "../../shared/quiz/quizExport.js?v=20260704f";

const { downloadWord, printSheet } = createQuizExport({
  titleEnQuestions: "S3 Foundations · Quantities, units and maths — Questions",
  titleEnAnswers: "S3 Foundations · Quantities, units and maths — Answers",
  titleZhQuestions: "中三物理基礎 · 物理量、單位與常用數學 — 試題",
  titleZhAnswers: "中三物理基礎 · 物理量、單位與常用數學 — 答案",
  filePrefix: "foundations_notes_worksheet",
});

export { downloadWord, printSheet };
