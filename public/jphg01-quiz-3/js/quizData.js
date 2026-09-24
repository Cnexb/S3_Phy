/** CH1 Heat and Gases · JPHG01 Temperature and thermometer · Quiz 3 */
export const QUIZ_META = {
  subject: "PHY",
  quizId: "phy-jphg01-3",
  chapter: "CH1 Heat and Gases",
  topic: "JPHG01 Temperature and thermometer (Quiz 3)",
};

/** Student picker: syllabus topic. Subtopic codes stay on each item.section for tracker only. */
export const QUIZ_TOPICS = [
  {
    id: "JPHG01",
    label: "JPHG01 Temperature and thermometer",
    labelZh: "JPHG01 溫度與溫度計",
  },
];

export const QUIZ_SECTIONS = QUIZ_TOPICS;

export function itemTopicId(q) {
  if (q?.topic) return q.topic;
  const sec = String(q?.section || "");
  const i = sec.lastIndexOf(".");
  return i > 0 ? sec.slice(0, i) : sec;
}

export const QUIZ_ITEMS = [
  {
    id: "jphg01-3-1",
    topic: "JPHG01",
    section: "JPHG01.2",
    difficulty: "Standard",
    stem: "The resistance of the metal coil in a resistance thermometer is 70 Ω at 30 °C and 80 Ω at 50 °C. What is the resistance of the metal coil if it is placed in boiling water? Assume that the resistance of the coil varies linearly with temperature.",
    options: [
      { key: "A", text: "105 Ω" },
      { key: "B", text: "150 Ω" },
      { key: "C", text: "155 Ω" },
      { key: "D", text: "205 Ω" },
    ],
    answer: "A",
    explanation: "Let the resistance of the metal coil at 100 °C be x.\n(x − 70)/(80 − 70) = (100 − 30)/(50 − 30)\nx = 105 Ω.",
  },
  {
    id: "jphg01-3-2",
    topic: "JPHG01",
    section: "JPHG01.3",
    difficulty: "Foundation",
    stem: "A mercury-in-glass thermometer will response to temperature change more quickly if",
    options: [
      { key: "A", text: "the inner diameter of the tube is reduced." },
      { key: "B", text: "the thickness of the wall is reduced." },
      { key: "C", text: "the size of the bulb is increased." },
      { key: "D", text: "the length of the tube is increased." },
    ],
    answer: "B",
  },
  {
    id: "jphg01-3-3",
    topic: "JPHG01",
    section: "JPHG01.3",
    difficulty: "Standard",
    stem: "The graphs below show the variation of the electrical resistance R of four circuit elements with temperature T. Which of the circuit elements is the most suitable for measuring temperature?",
    options: [
      {
        key: "A",
        text: "R increases with T, and the graph curves upwards.",
        image: "./assets/jphg01-3-q3-a.png?v=20260924opt",
      },
      {
        key: "B",
        text: "R increases with T, and the graph curves downwards.",
        image: "./assets/jphg01-3-q3-b.png?v=20260924opt",
      },
      {
        key: "C",
        text: "R increases linearly with T.",
        image: "./assets/jphg01-3-q3-c.png?v=20260924opt",
      },
      {
        key: "D",
        text: "R does not change with T.",
        image: "./assets/jphg01-3-q3-d.png?v=20260924opt",
      },
    ],
    answer: "C",
    explanation: "The electrical resistance R of the circuit element varies linearly with the temperature T. The thermometer making use of the variation of R can have a linear scale which is the most suitable.",
  },
];
