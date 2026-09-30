import { createQuizExport } from "../../shared/quiz/quizExport.js?v=20260704f";

const { downloadWord, printSheet } = createQuizExport({
  titleEnQuestions: "JPWM06 Light reflection Quiz 4 — Questions",
  titleEnAnswers: "JPWM06 Light reflection Quiz 4 — Answers",
  titleZhQuestions: "JPWM06 光的反射 測驗 4 — 試題",
  titleZhAnswers: "JPWM06 光的反射 測驗 4 — 答案",
  filePrefix: "jpwm06_quiz_4",
});

export { downloadWord, printSheet };
