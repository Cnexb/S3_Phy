/** CH3 Wave Motion and Optics · JPWM06 Light reflection · Quiz 4 */
export const QUIZ_META = {
  subject: "PHY",
  quizId: "phy-jpwm06-4",
  chapter: "CH3 Wave Motion and Optics",
  topic: "JPWM06 Light reflection",
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
    id: "jpwm06-4-1",
    topic: "JPWM06",
    section: "JPWM06.4",
    subtopic: "JPWM06.4 Using reflection by plane mirror",
    difficulty: "Standard",
    stem: "In the following figure, two plane mirrors at right angles face each other. An object is placed at O. Multiple images are thus formed by the mirrors. Which of the following is/are NOT the image(s) formed by the mirrors?",
    options: [
      { key: "A", text: "I₂ only" },
      { key: "B", text: "I₃ only" },
      { key: "C", text: "I₂ and I₄ only" },
      { key: "D", text: "I₂, I₃ and I₄ only" },
    ],
    answer: "C",
    explanation:
      "Two plane mirrors at 90° form three images. I₁ is the image in the vertical mirror, the same distance behind that mirror as O is in front. I₅ is the image in the horizontal mirror, directly opposite O. I₃ is the image formed by reflection in both mirrors, found by reflecting O through the corner. I₂ and I₄ are not at any of these positions, so they are not images.",
    image: {
      src: "./assets/jpwm06-4-q1-mirrors.png?v=20260930q4",
      alt: "Two plane mirrors at right angles, object O, and points labelled I1 to I5",
      caption: "Fig · Object O and points I₁ to I₅",
    },
  },
  {
    id: "jpwm06-4-2",
    topic: "JPWM06",
    section: "JPWM06.4",
    subtopic: "JPWM06.4 Using reflection by plane mirror",
    difficulty: "Standard",
    stem: "A beam of sunlight is incident on a plane mirror as shown in the figure. The light beam is reflected and hits point P on a wall. How should the mirror be rotated so that the reflected beam hits point Q?",
    options: [
      { key: "A", text: "Clockwise, 10°." },
      { key: "B", text: "Clockwise, 20°." },
      { key: "C", text: "Anticlockwise, 10°." },
      { key: "D", text: "Anticlockwise, 20°." },
    ],
    answer: "A",
    explanation:
      "The reflected rays to P and to Q differ by 20°, and the ray must turn clockwise to move from P up to Q. Turning a plane mirror through an angle θ turns the reflected ray through 2θ in the same direction. The mirror is therefore rotated clockwise through 10°.",
    image: {
      src: "./assets/jpwm06-4-q2-rays.png?v=20260930q4",
      alt: "Sunlight reflected from a plane mirror to point P on a wall, with Q above P and a 20° angle between the rays",
      caption: "Fig · Reflected beam to P, and the direction toward Q",
    },
  },
  {
    id: "jpwm06-4-3",
    topic: "JPWM06",
    section: "JPWM06.4",
    subtopic: "JPWM06.4 Using reflection by plane mirror",
    difficulty: "Standard",
    stem: "Daisy is sitting on a chair and a clock is installed on the wall at 3 m behind her. She wants to install a plane mirror on the wall at 2 m in front of her so that she can see the image of the clock in the mirror. Daisy’s eyes and the clock are at 1.5 m and 2.7 m above the ground respectively. Find the minimum height of the upper edge of the mirror.",
    options: [
      { key: "A", text: "0.77 m" },
      { key: "B", text: "1.08 m" },
      { key: "C", text: "1.84 m" },
      { key: "D", text: "1.98 m" },
    ],
    answer: "C",
    explanation:
      "The clock is 2 m + 3 m = 5 m in front of the mirror, so its image is 5 m behind the mirror and still 2.7 m above the ground. Daisy’s eyes are 2 m in front of the mirror and 1.5 m above the ground. The top edge of the mirror lies on the straight line from her eyes to that image. The height is 1.5 + (2/7)×(2.7 − 1.5) = 1.84 m.",
    image: {
      src: "./assets/jpwm06-4-q3-daisy.png?v=20260930q4",
      alt: "Daisy 2 m in front of a mirror and 3 m in front of a clock. Her eyes are 1.5 m high and the clock is 2.7 m high.",
      caption: "Fig · Daisy, the mirror and the clock",
    },
  },
];
