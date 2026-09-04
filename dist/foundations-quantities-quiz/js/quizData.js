/** S3 Foundations — Quantities and units (Ch.00 notes) */
export const QUIZ_SECTIONS = [
  { id: "quantities-units", label: "F01 Quantities and Units", labelZh: "F01 物理量與單位" },
];

export const QUIZ_ITEMS = [
  {
    id: "qu-q01",
    section: "quantities-units",
    difficulty: "Foundation",
    stem: "What is the base SI unit of length?",
    options: [
      { key: "A", text: "m" },
      { key: "B", text: "metre" },
      { key: "C", text: "kilometre" },
      { key: "D", text: "centimetre" },
    ],
    answer: "B",
    hint: "The base SI unit is metre. m is only the symbol for that unit.",
  },
  {
    id: "qu-q02",
    section: "quantities-units",
    difficulty: "Foundation",
    stem: "What is the symbol for the base SI unit of mass?",
    options: [
      { key: "A", text: "kilogram" },
      { key: "B", text: "kg" },
      { key: "C", text: "g" },
      { key: "D", text: "m" },
    ],
    answer: "B",
    hint: "kg is the symbol. kilogram is the name of the unit.",
  },
  {
    id: "qu-q03",
    section: "quantities-units",
    difficulty: "Foundation",
    stem: "Write 4600 in scientific notation (1 figure before the decimal point).",
    options: [
      { key: "A", text: "4.6 × 10²" },
      { key: "B", text: "4.6 × 10³" },
      { key: "C", text: "46 × 10²" },
      { key: "D", text: "4.6 × 10⁻³" },
    ],
    answer: "B",
    hint: "Move the decimal point so there is one figure before it: 4.6 × 10³.",
  },
  {
    id: "qu-q04",
    section: "quantities-units",
    difficulty: "Foundation",
    stem: "Which is the most suitable prefix form of 0.007 s?",
    options: [
      { key: "A", text: "7 ms" },
      { key: "B", text: "7 μs" },
      { key: "C", text: "7 ks" },
      { key: "D", text: "0.7 cs" },
    ],
    answer: "A",
    hint: "milli (m) means 10⁻³, so 0.007 s = 7 ms.",
  },
  {
    id: "qu-q05",
    section: "quantities-units",
    difficulty: "Foundation",
    stem: "Convert 36 km/h to m/s.",
    options: [
      { key: "A", text: "6" },
      { key: "B", text: "10" },
      { key: "C", text: "36" },
      { key: "D", text: "129.6" },
    ],
    answer: "B",
    hint: "36 × (1000 m) / (3600 s) = 36 × 5/18 = 10 m/s.",
  },
];
