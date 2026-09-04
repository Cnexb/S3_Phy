import { createQuizExport } from "../../shared/quiz/quizExport.js?v=20260704f";

const { downloadWord, printSheet } = createQuizExport({
  titleEnQuestions: "Foundations · F01 & F02 — Questions",
  titleEnAnswers: "Foundations · F01 & F02 — Answers",
  titleZhQuestions: "物理基礎 · F01 與 F02 — 試題",
  titleZhAnswers: "物理基礎 · F01 與 F02 — 答案",
  filePrefix: "foundations_quiz",
});

export { downloadWord, printSheet };
