/** CH3 Wave Motion and Optics · JPWM06 Light reflection · Quiz 3 */
export const QUIZ_META = {
  subject: "PHY",
  quizId: "phy-jpwm06-3",
  chapter: "CH3 Wave Motion and Optics",
  topic: "JPWM06 Light reflection (Quiz 3)",
};

/** Student picker: syllabus topic. Subtopic codes stay on each item.section for tracker only. */
export const QUIZ_TOPICS = [
  {
    id: "JPWM06",
    label: "JPWM06 Light reflection",
    labelZh: "JPWM06 光的反射",
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
    id: "jpwm06-3-1",
    topic: "JPWM06",
    section: "JPWM06.4",
    difficulty: "Standard",
    stem: "An object is placed near one end of a periscope as shown. Which of the following figures best represents the image observed?",
    options: [
      { key: "A", text: "letter b", image: "./assets/jpwm06-3-q1-a.png?v=20260924q3" },
      { key: "B", text: "letter q", image: "./assets/jpwm06-3-q1-b.png?v=20260924q3" },
      { key: "C", text: "letter d", image: "./assets/jpwm06-3-q1-c.png?v=20260924q3" },
      { key: "D", text: "letter P", image: "./assets/jpwm06-3-q1-d.png?v=20260924q3" },
    ],
    answer: "D",
    explanation:
      "A periscope has two plane mirrors. Each mirror reverses the image once, so the two reversals cancel. The observer sees an upright image with the same left-right orientation as the object: P.",
    image: {
      src: "./assets/jpwm06-3-q1-periscope.png?v=20260924q3",
      alt: "Periscope with object P at the upper opening and an observer at the lower opening",
      caption: "Fig · Object P at one end of a periscope",
    },
  },
  {
    id: "jpwm06-3-2",
    topic: "JPWM06",
    section: "JPWM06.4",
    difficulty: "Standard",
    stem: "In the figure below the angle of incidence of a ray on a plane mirror is 30°. If the mirror is rotated anti-clockwise through an angle of 20°, what is the reflected ray rotated?",
    options: [
      { key: "A", text: "20°, clockwise." },
      { key: "B", text: "20°, anticlockwise." },
      { key: "C", text: "40°, clockwise." },
      { key: "D", text: "40°, anticlockwise." },
    ],
    answer: "D",
    explanation:
      "Turning a plane mirror through an angle θ turns the reflected ray through 2θ in the same direction. The mirror turns through 20° anti-clockwise, so the reflected ray turns through 40° anti-clockwise. The incident ray stays fixed: the angle of incidence falls from 30° to 10°, and the angle of reflection falls by the same amount, so the reflected ray swings through 40°.",
    image: {
      src: "./assets/jpwm06-3-q2-rays.png?v=20260924q3",
      alt: "Plane mirror with a ray at 30° to the normal, and a dashed line at 20° to the mirror",
      caption: "Fig · Ray incident at 30° on a plane mirror",
    },
  },
  {
    id: "jpwm06-3-3",
    topic: "JPWM06",
    section: "JPWM06.3",
    difficulty: "Standard",
    stem: "A clear image of a pen is formed by a plane mirror but not a metal plate. Which of the following is a reason for this?",
    options: [
      { key: "A", text: "The plane mirror reflects light but the metal plate does not." },
      {
        key: "B",
        text: "Reflection of light by the plane mirror obeys the laws of reflection but that by the metal plate does not.",
      },
      { key: "C", text: "The plane mirror provides diffuse reflection of light but the metal plate does not." },
      {
        key: "D",
        text: "The plane mirror reflects parallel light rays into the same direction but the metal plate does not.",
      },
    ],
    answer: "D",
    explanation:
      "Since the metal plate is not smooth enough, diffuse reflection of light takes place on the metal plate. On the other hand, regular reflection of light takes place on the plane mirror.",
  },
];
