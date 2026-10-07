/** CH3 Wave Motion and Optics · JPWM07 Light refraction · Quiz 1 */
export const QUIZ_META = {
  subject: "PHY",
  quizId: "phy-jpwm07",
  chapter: "CH3 Wave Motion and Optics",
  topic: "JPWM07 Light refraction (Quiz 1)",
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
    id: "jpwm07-1",
    topic: "JPWM07",
    section: "JPWM07.1",
    label: "JPWM07.1 Question 1",
    difficulty: "Standard",
    stem: "The figure below shows a ray of light entering medium Y from medium X. Which of the following statements is/are correct?\n(1) Light travels faster in medium X than in medium Y.\n(2) φ is the angle of refraction.\n(3) The refractive index of medium X is larger than that of medium Y.",
    options: [
      { key: "A", text: "(1) only" },
      { key: "B", text: "(3) only" },
      { key: "C", text: "(1) and (2) only" },
      { key: "D", text: "(2) and (3) only" },
    ],
    answer: "A",
    explanation:
      "The light ray bends towards the normal when it travels from medium X to medium Y, so its speed decreases. Therefore (1) is correct. The angle of refraction is the angle between the refracted ray and the normal, so φ (measured from the surface) is not the angle of refraction and (2) is incorrect. By Snell's law, n_X sin θ_X = n_Y sin θ_Y. As θ_X > θ_Y (angles from the normal), n_X < n_Y, so (3) is incorrect.",
    image: {
      src: "./assets/jpwm07-1-ray.png?v=20261007q1",
      alt: "Ray of light entering medium Y from medium X with angles θ and φ marked from the surface",
      caption: "Fig · Refraction from medium X into medium Y",
    },
  },
  {
    id: "jpwm07-2",
    topic: "JPWM07",
    section: "JPWM07.2",
    label: "JPWM07.2 Question 2",
    difficulty: "Standard",
    stem: "The given ray diagram shows the refraction of light at the surface of an unknown liquid. If the refractive index of the liquid is 1.52, what is the angle of incidence?",
    options: [
      { key: "A", text: "46.9°" },
      { key: "B", text: "52.6°" },
      { key: "C", text: "70°" },
      { key: "D", text: "77.7°" },
    ],
    answer: "D",
    explanation:
      "The 50° mark is between the refracted ray and the surface, so the angle of refraction is 90° − 50° = 40°. Using Snell's law: 1 × sin i = 1.52 × sin 40°, so sin i ≈ 0.977 and i ≈ 77.7°.",
    image: {
      src: "./assets/jpwm07-2-liquid.png?v=20261007q1",
      alt: "Ray diagram of light refracting from air into a liquid with a 50° angle marked from the surface",
      caption: "Fig · Refraction at an air–liquid surface",
    },
  },
  {
    id: "jpwm07-3",
    topic: "JPWM07",
    section: "JPWM07.3",
    label: "JPWM07.3 Question 3",
    difficulty: "Foundation",
    stem: "The refractive index of diamond is 2.42. What is the speed of light in diamond? (Given that the speed of light in vacuum = 3 × 10⁸ ms⁻¹)",
    options: [
      { key: "A", text: "5.80 × 10⁷ ms⁻¹" },
      { key: "B", text: "1.24 × 10⁸ ms⁻¹" },
      { key: "C", text: "3.00 × 10⁸ ms⁻¹" },
      { key: "D", text: "7.26 × 10⁸ ms⁻¹" },
    ],
    answer: "B",
    explanation:
      "n = c / v, so v = c / n = (3 × 10⁸ ms⁻¹) / 2.42 ≈ 1.24 × 10⁸ ms⁻¹.",
  },
];
