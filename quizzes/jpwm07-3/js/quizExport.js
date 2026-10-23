import { createQuizExport } from "../../shared/quiz/quizExport.js?v=20260704f";

const { downloadWord, printSheet } = createQuizExport({
  titleEnQuestions: "JPWM07 Light refraction Quiz 3 — Questions",
  titleEnAnswers: "JPWM07 Light refraction Quiz 3 — Answers",
  titleZhQuestions: "JPWM07 光的折射 測驗 3 — 試題",
  titleZhAnswers: "JPWM07 光的折射 測驗 3 — 答案",
  filePrefix: "jpwm07_quiz_3",
});

export { downloadWord, printSheet };
