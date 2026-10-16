/** CH3 Wave Motion and Optics · JPWM07 Light refraction · Quiz 2 */
export const QUIZ_META = {
  subject: "PHY",
  quizId: "phy-jpwm07-2",
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
    id: "jpwm07-2-1",
    topic: "JPWM07",
    section: "JPWM07.3",
    subtopic: "JPWM07.3 Speed of light and refraction",
    label: "JPWM07.3 Question 1",
    difficulty: "Foundation",
    stem: "The speed of light in a medium is 2 × 10⁸ m s⁻¹. What is the refractive index of the medium? (Given that the speed of light in vacuum = 3 × 10⁸ m s⁻¹)",
    options: [
      { key: "A", text: "0.67" },
      { key: "B", text: "1.33" },
      { key: "C", text: "1.50" },
      { key: "D", text: "2.00" },
    ],
    answer: "C",
    explanation:
      "n = c / v = (3 × 10⁸ m s⁻¹) / (2 × 10⁸ m s⁻¹) = 1.50. Option A is v / c.",
  },
  {
    id: "jpwm07-2-2",
    topic: "JPWM07",
    section: "JPWM07.3",
    subtopic: "JPWM07.3 Speed of light and refraction",
    label: "JPWM07.3 Question 2",
    difficulty: "Standard",
    stem: "When a light ray travels from air to water with an angle of incidence of 45°, the angle of refraction is 32.1°. What is the speed of light in the water? (Given that the speed of light in vacuum = 3 × 10⁸ m s⁻¹)",
    options: [
      { key: "A", text: "2.14 × 10⁸ m s⁻¹" },
      { key: "B", text: "2.25 × 10⁸ m s⁻¹" },
      { key: "C", text: "2.42 × 10⁸ m s⁻¹" },
      { key: "D", text: "2.59 × 10⁸ m s⁻¹" },
    ],
    answer: "B",
    explanation:
      "By Snell's law, n = sin 45° / sin 32.1° ≈ 1.33. Then n = c / v, so v = c / n = (3 × 10⁸ m s⁻¹) / 1.33 ≈ 2.25 × 10⁸ m s⁻¹.",
  },
  {
    id: "jpwm07-2-3",
    topic: "JPWM07",
    section: "JPWM07.4",
    subtopic: "JPWM07.4 Apparent depth",
    label: "JPWM07.4 Question 3",
    difficulty: "Standard",
    stem: "A boy is looking at small print on a piece of paper. He moves a glass block of uniform thickness 3 cm over the print. The print appears to rise by 0.9 cm. What is the refractive index of the glass?",
    options: [
      { key: "A", text: "0.70" },
      { key: "B", text: "1.30" },
      { key: "C", text: "1.43" },
      { key: "D", text: "3.33" },
    ],
    answer: "C",
    explanation:
      "Apparent depth = real depth − rise = 3 cm − 0.9 cm = 2.1 cm. n = real depth / apparent depth = 3 / 2.1 ≈ 1.43. Option A is 2.1 / 3. Option D uses the rise instead of the apparent depth (3 / 0.9).",
  },
];
