/** CH3 Wave Motion and Optics · JPWM06 Light reflection · Quiz 2 */
export const QUIZ_META = {
  subject: "PHY",
  quizId: "phy-jpwm06-2",
  chapter: "CH3 Wave Motion and Optics",
  topic: "JPWM06 Light reflection (Quiz 2)",
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
    id: "jpwm06-2-1",
    topic: "JPWM06",
    section: "JPWM06.2",
    difficulty: "Applied",
    stem: "The figure above shows the image of a digital clock face formed by a plane mirror. What is the time shown by the clock?",
    options: [
      { key: "A", text: "12:10" },
      { key: "B", text: "10:12" },
      { key: "C", text: "01:15" },
      { key: "D", text: "01:51" },
    ],
    answer: "D",
    hint: "A plane mirror reverses left and right. Reverse the digit order and flip each 7-segment digit (2 looks like 5, and 5 looks like 2). The image 12:10 therefore corresponds to 01:51.",
    image: {
      src: "./assets/jpwm06-2-q1-clock.png",
      alt: "Digital clock image formed by a plane mirror, appearing as 12:10",
      caption: "Fig · Plane-mirror image of a digital clock",
    },
  },
  {
    id: "jpwm06-2-2",
    topic: "JPWM06",
    section: "JPWM06.4",
    difficulty: "Applied",
    stem: "Three dancers O, P and Q stand in front of a plane mirror as shown. What is the minimum width of the mirror for dancer O to see both dancers P and Q?",
    options: [
      { key: "A", text: "0.667 m" },
      { key: "B", text: "0.833 m" },
      { key: "C", text: "1 m" },
      { key: "D", text: "1.33 m" },
    ],
    answer: "B",
    hint: "Draw the images of P and Q behind the mirror. The rays from those images to O meet the mirror at two points. The distance between those points is 5/6 m = 0.833 m, which is the shortest mirror that lets O see both P and Q.",
    image: {
      src: "./assets/jpwm06-2-q2-dancers.png",
      alt: "Plane mirror with dancers P and O 1 m in front and 1 m apart, and dancer Q 2 m in front and 1 m to the right of O",
      caption: "Fig · Dancers O, P and Q in front of a plane mirror",
    },
  },
  {
    id: "jpwm06-2-3",
    topic: "JPWM06",
    section: "JPWM06.4",
    difficulty: "Applied",
    stem: "A 158-cm-tall girl stands 1.5 m from a wall mirror as shown below. Her eyes are 148 cm above the floor. The girl can just see the bottom of her skirt, which is 40 cm above the floor, in the mirror. What is the height of the bottom edge of the mirror above the floor?",
    options: [
      { key: "A", text: "40 cm" },
      { key: "B", text: "54 cm" },
      { key: "C", text: "80 cm" },
      { key: "D", text: "94 cm" },
    ],
    answer: "D",
    hint: "The ray from the hem of the skirt to her eyes meets the bottom of the mirror. That point is midway in height between the eyes (148 cm) and the hem (40 cm): (148 + 40) / 2 = 94 cm.",
    image: {
      src: "./assets/jpwm06-2-q3-wall-mirror.png",
      alt: "Girl 158 cm tall standing 1.5 m from a wall mirror, eyes 148 cm and skirt hem 40 cm above the floor",
      caption: "Fig · Girl looking at a wall mirror",
    },
  },
  {
    id: "jpwm06-2-4",
    topic: "JPWM06",
    section: "JPWM06.4",
    difficulty: "Applied",
    stem: "In a room ABCD, a tall plane mirror of width 1 m is placed at the middle of the wall BD. The top view of the room is shown below. A student facing the mirror wants to see the objects placed at corners A and C at the same time. At most how far can he stand away from the mirror?",
    options: [
      { key: "A", text: "2.25 m" },
      { key: "B", text: "3 m" },
      { key: "C", text: "5 m" },
      { key: "D", text: "6 m" },
    ],
    answer: "B",
    hint: "Draw the images of A and C behind the mirror. The furthest point from which both images can be seen is on the centre line, with the two rays just grazing the ends of the 1 m mirror. Similar triangles then give a maximum distance of 3 m from the mirror.",
    image: {
      src: "./assets/jpwm06-2-q4-room-mirror.png",
      alt: "Top view of room ABCD, 9 m by 4 m, with a 1 m mirror in the middle of wall BD",
      caption: "Fig · Top view of room ABCD with a plane mirror on wall BD",
    },
  },
];
