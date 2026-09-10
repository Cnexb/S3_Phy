/** CH3 Wave Motion and Optics · JPWM06 Light reflection */
export const QUIZ_META = {
  subject: "PHY",
  quizId: "phy-jpwm06",
  chapter: "CH3 Wave Motion and Optics",
  topic: "JPWM06 Light reflection",
};

export const QUIZ_SECTIONS = [
  {
    id: "JPWM06.1",
    label: "JPWM06.1 Law of reflection",
    labelZh: "JPWM06.1 反射定律",
  },
  {
    id: "JPWM06.2",
    label: "JPWM06.2 Image formed by plane mirror",
    labelZh: "JPWM06.2 平面鏡所成的像",
  },
];

export const QUIZ_ITEMS = [
  {
    id: "jpwm06-1",
    section: "JPWM06.2",
    difficulty: "Foundation",
    stem: "The figure below shows the image of a clock formed by a plane mirror. The time is",
    options: [
      { key: "A", text: "2:50" },
      { key: "B", text: "4:40" },
      { key: "C", text: "8:20" },
      { key: "D", text: "10:10" },
    ],
    answer: "D",
    hint: "A plane mirror reverses left and right. The image 12 looks like SI, which corresponds to 10:10.",
    image: {
      src: "./assets/jpwm06-1-clock.png",
      alt: "Clock image formed by a plane mirror",
      caption: "Fig · Plane-mirror image of a clock",
    },
  },
  {
    id: "jpwm06-2",
    section: "JPWM06.1",
    difficulty: "Standard",
    stem: "An object O is placed in front of a plane mirror and an image I is formed behind the mirror as shown in the figure below. Among rays P, Q, R and S, which of them correctly represent the reflected rays from the mirror?",
    options: [
      { key: "A", text: "P and Q only" },
      { key: "B", text: "Q and S only" },
      { key: "C", text: "Q, R and S only" },
      { key: "D", text: "P, Q, R and S" },
    ],
    answer: "B",
    hint: "Reflected rays appear to come from the image I behind the mirror. Q and S do; P and R do not.",
    image: {
      src: "./assets/jpwm06-2-rays.png",
      alt: "Plane mirror with object O and rays P, Q, R and S",
      caption: "Fig · Object O and rays at a plane mirror",
    },
  },
  {
    id: "jpwm06-3",
    section: "JPWM06.2",
    difficulty: "Standard",
    stem: "Peter is standing 4 m in front of a plane mirror as shown. A lamp is located midway between Peter and the mirror. If Peter wants to take a clear photograph of the image of the lamp, at what distance should he focus?",
    options: [
      { key: "A", text: "2 m" },
      { key: "B", text: "4 m" },
      { key: "C", text: "6 m" },
      { key: "D", text: "8 m" },
    ],
    answer: "C",
    hint: "The lamp is 2 m from the mirror, so its image is 2 m behind the mirror. Peter is 4 m from the mirror, so he must focus 6 m away.",
    image: {
      src: "./assets/jpwm06-3-peter.png",
      alt: "Peter, a lamp, and a plane mirror",
      caption: "Fig · Photographing the image of the lamp",
    },
  },
  {
    id: "jpwm06-4",
    section: "JPWM06.1",
    difficulty: "Standard",
    stem: "The figure above shows a sunlight reflector installed on the roof of a building. At the instant shown, sunlight falls at an angle of 30° to the horizontal and is then reflected vertically into the building. What is the angle between the reflector and the horizontal?",
    options: [
      { key: "A", text: "30°" },
      { key: "B", text: "45°" },
      { key: "C", text: "60°" },
      { key: "D", text: "75°" },
    ],
    answer: "C",
    hint: "Incident ray is 30° to the horizontal and the reflected ray is vertical. Angle of incidence equals angle of reflection, so the reflector is 60° to the horizontal.",
    image: {
      src: "./assets/jpwm06-4-reflector.png",
      alt: "Sunlight reflector on a roof directing light vertically into a building",
      caption: "Fig · Sunlight reflector",
    },
  },
];
