/** S3 Foundations — Useful mathematics in physics */
export const QUIZ_SECTIONS = [
  { id: "useful-maths", label: "F02 Useful Mathematics in Physics", labelZh: "F02 物理中常用的數學" },
];

export const QUIZ_ITEMS = [
  {
    id: "um-q01",
    section: "useful-maths",
    difficulty: "Foundation",
    stem: "A straight line passes through (0, 4) and (3, 0). What is the y-intercept?",
    options: [
      { key: "A", text: "3" },
      { key: "B", text: "−4/3" },
      { key: "C", text: "4" },
      { key: "D", text: "0" },
    ],
    answer: "C",
    hint: "The y-intercept is where the line meets the y-axis (x = 0), so b = 4. 3 is the x-intercept; −4/3 is the slope.",
  },
  {
    id: "um-q02",
    section: "useful-maths",
    difficulty: "Foundation",
    stem: "Line AB passes through A(−3, 4) and B(−1, 1). What is the slope m_AB?",
    options: [
      { key: "A", text: "−3/2" },
      { key: "B", text: "3/2" },
      { key: "C", text: "−3/4" },
      { key: "D", text: "2/3" },
    ],
    answer: "A",
    hint: "m = (y₂ − y₁) / (x₂ − x₁) = (1 − 4) / ((−1) − (−3)) = −3/2.",
  },
  {
    id: "um-q03",
    section: "useful-maths",
    difficulty: "Foundation",
    stem: "A straight line passes through (0, 1) and (6, 4). Its equation is",
    options: [
      { key: "A", text: "y = 2x + 1" },
      { key: "B", text: "y = (1/2)x + 4" },
      { key: "C", text: "y = x + 1" },
      { key: "D", text: "y = (1/2)x + 1" },
    ],
    answer: "D",
    hint: "The line meets the y-axis at 1. Slope = (4 − 1)/(6 − 0) = 1/2, so y = (1/2)x + 1.",
  },
  {
    id: "um-q04",
    section: "useful-maths",
    difficulty: "Foundation",
    stem: "For y = 3x − 1, the slope and y-intercept are",
    options: [
      { key: "A", text: "−1 and 3" },
      { key: "B", text: "3 and −1" },
      { key: "C", text: "3 and 1" },
      { key: "D", text: "−3 and −1" },
    ],
    answer: "B",
    hint: "In y = mx + b, m is the slope and b is the y-intercept, so m = 3 and b = −1.",
  },
  {
    id: "um-q05",
    section: "useful-maths",
    difficulty: "Foundation",
    stem: "Rewrite 8x − 5y + 40 = 0 as y = mx + b.",
    options: [
      { key: "A", text: "y = (5/8)x + 8" },
      { key: "B", text: "y = (8/5)x − 8" },
      { key: "C", text: "y = (8/5)x + 8" },
      { key: "D", text: "y = −(8/5)x + 8" },
    ],
    answer: "C",
    hint: "5y = 8x + 40, so y = (8/5)x + 8.",
  },
];
