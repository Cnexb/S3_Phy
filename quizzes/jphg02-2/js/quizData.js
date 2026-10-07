/** CH1 Heat and Gases · JPHG02 Heat and internal energy · Quiz 2 */
export const QUIZ_META = {
  subject: "PHY",
  quizId: "phy-jphg02-2",
  chapter: "CH1 Heat and Gases",
  topic: "JPHG02 Heat and internal energy (Quiz 2)",
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
    id: "jphg02-2-1",
    topic: "JPHG02",
    section: "JPHG02.4",
    label: "JPHG02.4 Question 1",
    difficulty: "Standard",
    stem: "Jimmy uses a joulemeter to find the specific heat capacity of water.\nMass of water = 0.2 kg\nInitial temperature = 25 °C\nFinal temperature = 42 °C\nInitial joulemeter reading = 64 350 J\nFinal joulemeter reading = 79 470 J\nWhat is the specific heat capacity of water?",
    options: [
      { key: "A", text: "1 800 J kg−1 °C−1" },
      { key: "B", text: "3 020 J kg−1 °C−1" },
      { key: "C", text: "4 450 J kg−1 °C−1" },
      { key: "D", text: "23 400 J kg−1 °C−1" },
    ],
    answer: "C",
    explanation:
      "Energy supplied = 79 470 − 64 350 = 15 120 J. ΔT = 42 °C − 25 °C = 17 °C. c = 15 120 / (0.2 × 17) = 4 450 J kg−1 °C−1.",
  },
  {
    id: "jphg02-2-2",
    topic: "JPHG02",
    section: "JPHG02.5",
    label: "JPHG02.5 Question 2",
    difficulty: "Standard",
    stem: "A heater supplies 1000 J of energy to a 5 kg metal block. The temperature of the metal block rises from 25 °C to 35 °C. Assume that there is no energy loss to the surroundings. What is the heat capacity of the metal block?",
    options: [
      { key: "A", text: "20 J °C−1" },
      { key: "B", text: "50 J °C−1" },
      { key: "C", text: "100 J °C−1" },
      { key: "D", text: "200 J °C−1" },
    ],
    answer: "C",
    explanation: "C = Q / ΔT = 1000 J / (35 °C − 25 °C) = 100 J °C−1.",
  },
  {
    id: "jphg02-2-3",
    topic: "JPHG02",
    section: "JPHG02.6",
    label: "JPHG02.6 Question 3",
    difficulty: "Standard",
    stem: "A metal block of mass 0.1 kg at 150 °C is put in water of mass 1 kg at 20 °C. The heat capacity of the metal block is 100 J °C−1. What is the final temperature of the mixture?\nSpecific heat capacity of water = 4200 J kg−1 °C−1",
    options: [
      { key: "A", text: "20.3 °C" },
      { key: "B", text: "23.0 °C" },
      { key: "C", text: "85 °C" },
      { key: "D", text: "Cannot be determined" },
    ],
    answer: "B",
    explanation:
      "Energy lost by the block equals energy gained by the water: 100 × (150 − T) = 1 × 4200 × (T − 20), so T = 23.0 °C.",
  },
];
