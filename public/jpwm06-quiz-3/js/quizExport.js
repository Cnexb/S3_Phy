import { createQuizExport } from "../../shared/quiz/quizExport.js?v=20260704f";

const { downloadWord, printSheet } = createQuizExport({
  titleEnQuestions: "JPWM06 Light reflection Quiz 3 — Questions",
  titleEnAnswers: "JPWM06 Light reflection Quiz 3 — Answers",
  titleZhQuestions: "JPWM06 光的反射 測驗 3 — 試題",
  titleZhAnswers: "JPWM06 光的反射 測驗 3 — 答案",
  filePrefix: "jpwm06_quiz_3",
});

export { downloadWord, printSheet };
