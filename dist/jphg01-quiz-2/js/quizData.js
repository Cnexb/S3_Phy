/** CH1 Heat and Gases · JPHG01 Temperature and thermometer · Quiz 2 */
export const QUIZ_META = {
  subject: "PHY",
  quizId: "phy-jphg01-2",
  chapter: "CH1 Heat and Gases",
  topic: "JPHG01 Temperature and thermometer (Quiz 2)",
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
    id: "jphg01-2-1",
    topic: "JPHG01",
    section: "JPHG01.2",
    difficulty: "Applied",
    stem: "A thermometer makes use of the resistance R of a platinum wire wrapped around a ceramic core to measure temperature T. The thermometer is calibrated for the two fixed points. R is assumed to change linearly with T and the solid line in the figure is used to give the reading of the thermometer. The dotted line shows the actual variation of R with T. If the thermometer gives a reading of 120 °C in a measurement, which of the following statements is correct?",
    options: [
      { key: "A", text: "The actual temperature is lower than 120 °C." },
      { key: "B", text: "The actual temperature is higher than 120 °C." },
      { key: "C", text: "The resistance of the platinum wire is smaller than 100 Ω." },
      { key: "D", text: "The resistance of the platinum wire is larger than 100 Ω." },
    ],
    answer: "B",
    hint: "The reading 120 °C comes from the solid (linear) scale, so the measured resistance is 100 Ω. On the actual (dotted) curve, R = 100 Ω occurs at a temperature higher than 120 °C.",
    image: {
      src: "./assets/jphg01-2-q1-platinum-rt.png",
      alt: "Graph of resistance R against temperature T, with a solid linear calibration line and a dotted actual curve.",
      caption: "Fig · R–T graph of the platinum resistance thermometer",
    },
  },
  {
    id: "jphg01-2-2",
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
    hint: "A thinner wall lets heat reach the mercury faster, so the thermometer responds more quickly. A narrower tube or larger bulb changes sensitivity, not response time.",
  },
  {
    id: "jphg01-2-3",
    topic: "JPHG01",
    section: "JPHG01.3",
    difficulty: "Foundation",
    stem: "Which of the following methods can improve the sensitivity of a liquid-in-glass thermometer?\n(1) Reduce the diameter of the glass tube.\n(2) Increase the length of the glass tube.\n(3) Use a liquid which expands less for the same temperature increase.",
    options: [
      { key: "A", text: "(1) only" },
      { key: "B", text: "(2) only" },
      { key: "C", text: "(1) and (3) only" },
      { key: "D", text: "(2) and (3) only" },
    ],
    answer: "A",
    hint: "A narrower tube gives a larger column rise for the same volume expansion. A longer tube mainly affects range. A liquid that expands less makes the column rise less, so sensitivity falls.",
    image: {
      src: "./assets/jphg01-2-q3-liquid-in-glass.png",
      alt: "Liquid-in-glass thermometer labelled narrow glass tube, scale, liquid, and bulb.",
      caption: "Fig · Structure of a liquid-in-glass thermometer",
    },
  },
];
