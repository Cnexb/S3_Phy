/** CH1 Heat and Gases · JPHG02 Heat and internal energy */
export const QUIZ_META = {
  subject: "PHY",
  quizId: "phy-jphg02",
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
    id: "jphg02-1",
    topic: "JPHG02",
    section: "JPHG02.2",
    subtopic: "JPHG02.2 Energy transfer and Power",
    label: "JPHG02.2 Question 1",
    difficulty: "Standard",
    stem: "An 800 W electric heater is switched on for 3 minutes. How much electrical energy does it use? (E = Pt)",
    options: [
      { key: "A", text: "2,400 J" },
      { key: "B", text: "48,000 J" },
      { key: "C", text: "144,000 J" },
      { key: "D", text: "1,440,000 J" },
    ],
    answer: "C",
    explanation:
      "Time is 3 × 60 = 180 s. E = Pt = 800 W × 180 s = 144,000 J.",
  },
  {
    id: "jphg02-2",
    topic: "JPHG02",
    section: "JPHG02.3",
    subtopic: "JPHG02.3 Energy transfer and Temperature change",
    label: "JPHG02.3 Question 2",
    difficulty: "Standard",
    stem: "A 0.30 kg sample of water is heated from 25°C to 65°C. How much energy does it gain? (E = mcΔT)\nSpecific heat capacity of water = 4,200 J/(kg°C)",
    options: [
      { key: "A", text: "5,040 J" },
      { key: "B", text: "12,600 J" },
      { key: "C", text: "50,400 J" },
      { key: "D", text: "504,000 J" },
    ],
    answer: "C",
    explanation:
      "ΔT = 65°C − 25°C = 40°C. E = mcΔT = 0.30 kg × 4,200 J/(kg°C) × 40°C = 50,400 J.",
  },
  {
    id: "jphg02-3",
    topic: "JPHG02",
    section: "JPHG02.4",
    subtopic: "JPHG02.4 Specific heat capacity and experiments to find specific heat capacity",
    label: "JPHG02.4 Question 3",
    difficulty: "Standard",
    stem: "A 0.40 kg metal block absorbs 18,000 J of energy. Its temperature rises by 50°C. What is its specific heat capacity? Assume no energy is lost.",
    options: [
      { key: "A", text: "90 J/(kg°C)" },
      { key: "B", text: "360 J/(kg°C)" },
      { key: "C", text: "900 J/(kg°C)" },
      { key: "D", text: "2,250 J/(kg°C)" },
    ],
    answer: "C",
    explanation:
      "c = E / (mΔT) = 18,000 J / (0.40 kg × 50°C) = 900 J/(kg°C).",
  },
  {
    id: "jphg02-4",
    topic: "JPHG02",
    section: "JPHG02.6",
    subtopic: "JPHG02.6 Heat transfer calculation",
    label: "JPHG02.6 Question 4",
    difficulty: "Standard",
    stem: "A 0.28 kg aluminium block at 100°C is placed in 0.18 kg of water at 20°C in an insulated container. What is their final temperature? Ignore energy absorbed by the container.\nSpecific heat capacity of aluminium = 900 J/(kg°C)\nSpecific heat capacity of water = 4,200 J/(kg°C)",
    options: [
      { key: "A", text: "30°C" },
      { key: "B", text: "40°C" },
      { key: "C", text: "60°C" },
      { key: "D", text: "80°C" },
    ],
    answer: "B",
    explanation:
      "Energy lost by the aluminium equals energy gained by the water: 0.28 × 900 × (100 − T) = 0.18 × 4,200 × (T − 20). This gives 252(100 − T) = 756(T − 20), so T = 40°C.",
  },
];
