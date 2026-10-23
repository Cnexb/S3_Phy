/** CH1 Heat and Gases · JPHG02 Heat and internal energy · Quiz 4 */
export const QUIZ_META = {
  subject: "PHY",
  quizId: "phy-jphg02-4",
  chapter: "CH1 Heat and Gases",
  topic: "JPHG02 Heat and internal energy",
};

/** Student picker: syllabus topic. Subtopic codes stay on each item.section for tracker only. */
export const QUIZ_TOPICS = [
  {
    id: "JPHG02",
    label: "JPHG02 Heat and internal energy",
    labelZh: "JPHG02 熱與內能",
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
    id: "jphg02-4-1",
    topic: "JPHG02",
    section: "JPHG02.2",
    subtopic: "JPHG02.2 Energy transfer and Power",
    label: "JPHG02.2 Question 1",
    difficulty: "Standard",
    stem: "Which of the following best describes heat?",
    options: [
      { key: "A", text: "The temperature of an object" },
      { key: "B", text: "Energy stored inside an object because of its mass" },
      {
        key: "C",
        text: "Energy transferred from one body to another because of a temperature difference",
      },
      { key: "D", text: "The average kinetic energy of the molecules of an object" },
    ],
    answer: "C",
    explanation:
      "Heat is energy transferred from one body to another because of a temperature difference. Temperature is how hot the object is, and that follows the average kinetic energy of its molecules. Energy stored because of mass is part of the internal energy.",
  },
  {
    id: "jphg02-4-2",
    topic: "JPHG02",
    section: "JPHG02.4",
    subtopic: "JPHG02.4 Specific heat capacity and experiments to find specific heat capacity",
    label: "JPHG02.4 Question 2",
    difficulty: "Standard",
    stem: "The same amount of energy is supplied to equal masses of copper and glass. The temperature of the copper rises more than the temperature of the glass. Which statement explains this?",
    options: [
      { key: "A", text: "Copper has a smaller specific heat capacity than glass." },
      { key: "B", text: "Copper has a larger specific heat capacity than glass." },
      { key: "C", text: "Copper has a higher melting point than glass." },
      { key: "D", text: "Glass does not change temperature when it absorbs energy." },
    ],
    answer: "A",
    explanation:
      "E = mcΔT. For the same energy and the same mass, a smaller specific heat capacity gives a larger temperature rise. Copper’s temperature rises more, so copper has the smaller specific heat capacity.",
  },
  {
    id: "jphg02-4-3",
    topic: "JPHG02",
    section: "JPHG02.3",
    subtopic: "JPHG02.3 Energy transfer and Temperature change",
    label: "JPHG02.3 Question 3",
    difficulty: "Standard",
    stem: "A 600 W heater heats 0.40 kg of water for 70 s. The specific heat capacity of water is 4 200 J kg⁻¹ °C⁻¹. All of the electrical energy heats the water. What is the temperature rise?",
    options: [
      { key: "A", text: "0.417 °C" },
      { key: "B", text: "10.0 °C" },
      { key: "C", text: "25.0 °C" },
      { key: "D", text: "1 500 °C" },
    ],
    answer: "C",
    explanation:
      "E = Pt = 600 W × 70 s = 42 000 J. ΔT = E / (mc) = 42 000 J / (0.40 kg × 4 200 J kg⁻¹ °C⁻¹) = 25.0 °C. Dividing the time by 60 gives 0.417 °C. Omitting the mass gives 10.0 °C. Treating 70 s as 70 min gives 1 500 °C.",
  },
];
