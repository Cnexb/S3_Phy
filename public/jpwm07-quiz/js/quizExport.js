import { createQuizExport } from "../../shared/quiz/quizExport.js?v=20260704f";

const { downloadWord, printSheet } = createQuizExport({
  titleEnQuestions: "JPWM07 Light refraction Quiz 1 — Questions",
  titleEnAnswers: "JPWM07 Light refraction Quiz 1 — Answers",
  titleZhQuestions: "JPWM07 光的折射 測驗 1 — 試題",
  titleZhAnswers: "JPWM07 光的折射 測驗 1 — 答案",
  filePrefix: "jpwm07_quiz_1",
});

export { downloadWord, printSheet };
