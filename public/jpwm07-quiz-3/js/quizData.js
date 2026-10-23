/** CH3 Wave Motion and Optics · JPWM07 Light refraction · Quiz 3 */
export const QUIZ_META = {
  subject: "PHY",
  quizId: "phy-jpwm07-3",
  chapter: "CH3 Wave Motion and Optics",
  topic: "JPWM07 Light refraction",
};

/** Student picker: syllabus topic. Subtopic codes stay on each item.section for tracker only. */
export const QUIZ_TOPICS = [
  {
    id: "JPWM07",
    label: "JPWM07 Light refraction",
    labelZh: "JPWM07 光的折射",
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
    id: "jpwm07-3-1",
    topic: "JPWM07",
    section: "JPWM07.2",
    subtopic: "JPWM07.2 Snell's law",
    label: "JPWM07.2 Question 1",
    difficulty: "Standard",
    stem: "A ray of light travels from air into glass. The refractive index of glass is 1.50 and the angle of incidence is 40.0°. What is the angle of refraction?",
    options: [
      { key: "A", text: "25.4°" },
      { key: "B", text: "26.7°" },
      { key: "C", text: "40.0°" },
      { key: "D", text: "74.6°" },
    ],
    answer: "A",
    explanation:
      "Using Snell's law, 1 × sin 40.0° = 1.50 × sin r, so sin r = sin 40.0° / 1.50 = 0.4285 and r = 25.4°. Dividing the angle by 1.50 gives 26.7°. Leaving the angle unchanged gives 40.0°. Swapping the indices gives sin r = 1.50 × sin 40.0°, so r = 74.6°.",
  },
  {
    id: "jpwm07-3-2",
    topic: "JPWM07",
    section: "JPWM07.3",
    subtopic: "JPWM07.3 Speed of light and refraction",
    label: "JPWM07.3 Question 2",
    difficulty: "Standard",
    stem: "The speed of light in a liquid is 2.21 × 10⁸ m s⁻¹. The speed of light in vacuum is 3.00 × 10⁸ m s⁻¹. What is the refractive index of the liquid?",
    options: [
      { key: "A", text: "0.737" },
      { key: "B", text: "1.36" },
      { key: "C", text: "2.21" },
      { key: "D", text: "3.00" },
    ],
    answer: "B",
    explanation:
      "n = c / v = (3.00 × 10⁸ m s⁻¹) / (2.21 × 10⁸ m s⁻¹) = 1.36, to 3 significant figures. Option A is v / c.",
  },
  {
    id: "jpwm07-3-3",
    topic: "JPWM07",
    section: "JPWM07.5",
    subtopic: "JPWM07.5 Daily examples of refraction of light",
    label: "JPWM07.5 Question 3",
    difficulty: "Standard",
    stem: "A coin lies at the bottom of a tank of liquid. Its real depth is 12.0 cm. Viewed from directly above in air, its apparent depth is 8.00 cm. What is the refractive index of the liquid?",
    options: [
      { key: "A", text: "0.667" },
      { key: "B", text: "1.50" },
      { key: "C", text: "4.00" },
      { key: "D", text: "20.0" },
    ],
    answer: "B",
    explanation:
      "n = real depth / apparent depth = 12.0 cm / 8.00 cm = 1.50. Option A is the reciprocal. Option C is the difference of the depths in centimetres. Option D is their sum.",
  },
];
