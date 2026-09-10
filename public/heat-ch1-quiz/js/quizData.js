/** CH1 Heat and Gases · JPHG01 Temperature and thermometer */
export const QUIZ_META = {
  subject: "PHY",
  quizId: "phy-jphg01",
  chapter: "CH1 Heat and Gases",
  topic: "JPHG01 Temperature and thermometer",
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
    id: "jphg01-1",
    topic: "JPHG01",
    section: "JPHG01.3",
    difficulty: "Foundation",
    stem: "Which of the following thermometers measures temperature by detecting the intensity of radiation?",
    options: [
      { key: "A", text: "Liquid-in-glass thermometer" },
      { key: "B", text: "Resistance thermometer" },
      { key: "C", text: "Thermistor thermometer" },
      { key: "D", text: "Infra-red thermometer" },
    ],
    answer: "D",
    hint: "The intensity of infra-red radiation given out by an object increases when its temperature increases.",
  },
  {
    id: "jphg01-2",
    topic: "JPHG01",
    section: "JPHG01.1",
    difficulty: "Foundation",
    stem: "Which of the following statements about the Celsius temperature scale is/are correct?\n(1) The lower fixed point is the lowest temperature existing in nature.\n(2) The upper fixed point is the temperature of steam.\n(3) The unit of this scale is °C.",
    options: [
      { key: "A", text: "(1) only" },
      { key: "B", text: "(3) only" },
      { key: "C", text: "(1) and (2) only" },
      { key: "D", text: "(2) and (3) only" },
    ],
    answer: "D",
    hint: "The lower fixed point is the ice point, not the lowest temperature in nature. The upper fixed point is the steam point. The unit is °C.",
  },
  {
    id: "jphg01-3",
    topic: "JPHG01",
    section: "JPHG01.2",
    difficulty: "Standard",
    stem: "A faulty thermometer with uniform scale reads 5 °C and 95 °C when it is placed in melting ice and boiling water respectively. What is the actual temperature if the thermometer reads 30 °C?",
    options: [
      { key: "A", text: "27.8 °C" },
      { key: "B", text: "28.5 °C" },
      { key: "C", text: "30 °C" },
      { key: "D", text: "35 °C" },
    ],
    answer: "A",
    hint: "Ice point is 0 °C and steam point is 100 °C. T/100 = (30 − 5)/(95 − 5).",
  },
];
