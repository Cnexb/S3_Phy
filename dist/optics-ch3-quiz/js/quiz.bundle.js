(() => {
  // ../js/quizData.js
  var QUIZ_SECTIONS = [
    {
      "id": "reflection",
      "label": "Reflection"
    },
    {
      "id": "refraction-snells-law",
      "label": "Refraction and Snell's Law"
    },
    {
      "id": "total-internal-reflection",
      "label": "Total Internal Reflection"
    },
    {
      "id": "convex-lens",
      "label": "Convex Lens"
    },
    {
      "id": "magnification-lens-formula",
      "label": "Magnification and Lens Formula"
    },
    {
      "id": "concave-lens",
      "label": "Concave Lens"
    }
  ];
  var QUIZ_ITEMS = [
    { "id": "ch31-r01", "section": "reflection", "difficulty": "Standard", "stem": "Object O is placed in front of two plane mirrors as shown in the following diagram.", "options": [{ "key": "A", "text": "At P only" }, { "key": "B", "text": "At Q only" }, { "key": "C", "text": "At P and Q only" }, { "key": "D", "text": "At P and R only" }], "answer": "D", "hint": "Object O is placed in front of two plane mirrors as shown in the following diagram.", "image": { "src": "./assets/ch31-r01-fig.png", "alt": "Diagram for ch31-r01", "caption": "Fig \xB7 ch31-r01" } },
    { "id": "ch31-r02", "section": "reflection", "difficulty": "Foundation", "stem": "Simon stands in front of a plane mirror as shown. There is an opaque obstacle between Simon and the mirror. Which of the following statements is/are correct? (1)When he stands at the position shown, he cannot see the image of his shoes in the mirror. (2)If he walks closer to the obstacle, he may see the image of his shoes in the mirror. (3)If he walks away from the obstacle, he may see the image of his shoes in the mirror.", "options": [{ "key": "A", "text": "(1) only" }, { "key": "B", "text": "(2) only" }, { "key": "C", "text": "(3) only" }, { "key": "D", "text": "(1) and (2) only" }], "answer": "A", "hint": "As long as the obstacle is between him and the mirror, light from his shoes is always blocked by the obstacle and cannot reach the mirror. Therefore (1) is correct; (2) and (3) are incorrect.", "image": { "src": "./assets/ch31-r02-fig.png", "alt": "Diagram for ch31-r02", "caption": "Fig \xB7 ch31-r02" } },
    { "id": "ch31-r03", "section": "reflection", "difficulty": "Standard", "stem": "The figure shows a student standing in front of a wall mirror. What is the minimum height of the mirror above the floor so that she can see her full image in the mirror?", "options": [{ "key": "A", "text": "40 cm" }, { "key": "B", "text": "54 cm" }, { "key": "C", "text": "80 cm" }, { "key": "D", "text": "94 cm" }], "answer": "D", "hint": "The bottom edge of the mirror must be at half the height of her eyes above the floor.", "image": { "src": "./assets/ch31-r03-fig.png", "alt": "Diagram for ch31-r03", "caption": "Fig \xB7 ch31-r03" } },
    { "id": "ch31-r04", "section": "reflection", "difficulty": "Standard", "stem": "Heidi is standing between two parallel mirrors, M1 and M2, with their reflective surfaces facing each other as shown below. When Heidi looks at M1, she sees multiple images in the mirror. Which of the following is/are the image(s) of Heidi seen in M1?", "options": [{ "key": "A", "text": "I1 only" }, { "key": "B", "text": "I1 and I2 only" }, { "key": "C", "text": "I1 and I3 only" }, { "key": "D", "text": "I1, I3 and I4 only" }], "answer": "C", "hint": "I1 is the image of Heidi formed by mirror M1. There is also an image I' of Heidi 1 m behind M2 formed by mirror M2.", "image": { "src": "./assets/ch31-r04-fig.png", "alt": "Diagram for ch31-r04", "caption": "Fig \xB7 ch31-r04" } },
    { "id": "ch31-r05", "section": "reflection", "difficulty": "Standard", "stem": "Which of the following correctly shows the image of the letter 'P' as seen in the mirror?", "options": [{ "key": "A", "text": "Option A" }, { "key": "B", "text": "Option B" }, { "key": "C", "text": "Option C" }, { "key": "D", "text": "Option D" }], "answer": "C", "hint": "Which of the following correctly shows the image of the letter 'P' as seen in the mirror?", "images": [{ "src": "./assets/ch31-r05-fig-1.png", "alt": "Diagram for ch31-r05", "caption": "Fig \xB7 ch31-r05 (1/2)" }, { "src": "./assets/ch31-r05-fig-2.png", "alt": "Diagram for ch31-r05", "caption": "Fig \xB7 ch31-r05 (2/2)" }] },
    { "id": "ch31-r06", "section": "reflection", "difficulty": "Standard", "stem": "What is the actual time at this instant?", "options": [{ "key": "A", "text": "2:58" }, { "key": "B", "text": "3:02" }, { "key": "C", "text": "8:58" }, { "key": "D", "text": "12:13" }], "answer": "B", "hint": "What is the actual time at this instant?", "image": { "src": "./assets/ch31-r06-fig.png", "alt": "Diagram for ch31-r06", "caption": "Fig \xB7 ch31-r06" } },
    { "id": "ch31-r07", "section": "reflection", "difficulty": "Foundation", "stem": "Which of the following statements about the image formed by a plane mirror is/are correct? (1)The image cannot be projected on a screen. (2)Light rays entering the eyes do not come from the image. (3)The image is behind the mirror.", "options": [{ "key": "A", "text": "(1) only" }, { "key": "B", "text": "(1) and (3) only" }, { "key": "C", "text": "(2) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "D", "hint": "Light rays entering the eyes are emitted or reflected from the object. They do not come from the image. \u2234 (2) is correct." },
    { "id": "ch31-r08", "section": "reflection", "difficulty": "Standard", "stem": "In the figure below, what is the angle of reflection of the ray after being reflected by mirror ?", "options": [{ "key": "A", "text": "40" }, { "key": "B", "text": "45" }, { "key": "C", "text": "50" }, { "key": "D", "text": "55" }], "answer": "A", "hint": "M2M13010060\xB060\xB030\xB0\u03B8irM2M13010060\xB060\xB030\xB0\u03B8ir \u03B8 i r \u03B8 i r", "image": { "src": "./assets/ch31-r08-fig.png", "alt": "Diagram for ch31-r08", "caption": "Fig \xB7 ch31-r08" } },
    { "id": "ch31-r09", "section": "reflection", "difficulty": "Standard", "stem": "John is in front of a plane mirror. If the mirror moves away from him at a speed of 2 m s\u207B\xB9, at what speed does his image move away from him?", "options": [{ "key": "A", "text": "1 m s\u207B\xB9" }, { "key": "B", "text": "2 m s\u207B\xB9" }, { "key": "C", "text": "4 m s\u207B\xB9" }, { "key": "D", "text": "8 m s\u207B\xB9" }], "answer": "C", "hint": "John is in front of a plane mirror. If the mirror moves away from him at a speed of 2 m s\u207B\xB9, at what speed does his image move away from him?" },
    { "id": "ch31-r10", "section": "reflection", "difficulty": "Standard", "stem": "A girl with her eyes 1.5 m above the ground stands in front of a wall, as shown in the figure below. If a small mirror is to be hung on the wall, how high should it be placed so that the girl can see the light in the mirror?", "options": [{ "key": "A", "text": "1.50 m above the ground" }, { "key": "B", "text": "1.63 m above the ground" }, { "key": "C", "text": "1.75 m above the ground" }, { "key": "D", "text": "1.83 m above the ground" }], "answer": "D", "hint": "The light is 3 m away from the mirror, so the image of the light is 3 m behind the mirror. 1 mh1.5 m3 mES1 mh1.5 m3 mES h h = h = 0.33 m = 1.5 + 0.33 = 1.83 m The mirror should be placed 1.83 m above the ground. --", "image": { "src": "./assets/ch31-r10-fig.png", "alt": "Diagram for ch31-r10", "caption": "Fig \xB7 ch31-r10" } },
    { "id": "ch32-f01", "section": "refraction-snells-law", "difficulty": "Applied", "stem": "The figure shows a light ray passing through three media X, Y and Z. Which of the following statements about the three media are correct? (1)Z is optically denser than X. (2)Light travels the fastest in X. (3)Y has the greatest refractive index.", "options": [{ "key": "A", "text": "(1) and (2) only" }, { "key": "B", "text": "(1) and (3) only" }, { "key": "C", "text": "(2) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "D", "hint": "Let i1, i2 and r1, r2 be the angles of incidence and angles of refractions in the 1st and the 2nd refraction. r1 = i2 1st refraction: nX sin i1 = nY sin r1 2nd refraction: nZ sin r2 = nY sin i2 = nY sin r1 = nX sin i1 i1 r2 sin i1 sin r2 nX nZ \u2234 (1) is correct. i1 r1 sin i1 sin r1 nX nY The refractive index of X is the", "image": { "src": "./assets/ch32-f01-fig.png", "alt": "Diagram for ch32-f01", "caption": "Fig \xB7 ch32-f01" } },
    { "id": "ch32-f02", "section": "refraction-snells-law", "difficulty": "Applied", "stem": "The figure shows a light ray refracted at the boundary between medium X and medium Y. The refractive index of X is 1.77. What is the refractive index of Y?", "options": [{ "key": "A", "text": "1.16" }, { "key": "B", "text": "1.53" }, { "key": "C", "text": "1.70" }, { "key": "D", "text": "2.05" }], "answer": "B", "hint": "What is the refractive index of Y?", "image": { "src": "./assets/ch32-f02-fig.png", "alt": "Diagram for ch32-f02", "caption": "Fig \xB7 ch32-f02" } },
    { "id": "ch32-f03", "section": "refraction-snells-law", "difficulty": "Standard", "stem": "Which of the following are examples of refraction? (1)A chopstick appears bent when dipped in water. (2)A distorted image of a tree is observed on a ruffled water surface. (3)A goldfish in a tank appears nearer and bigger than it really is.", "options": [{ "key": "A", "text": "(1) and (2) only" }, { "key": "B", "text": "(1) and (3) only" }, { "key": "C", "text": "(2) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "B", "hint": "Which of the following are examples of refraction? (1)A chopstick appears bent when dipped in water. (2)A distorted image of a tree is observed on a ruffled water surface. (3)A gol" },
    { "id": "ch32-f04", "section": "refraction-snells-law", "difficulty": "Applied", "stem": "The following figure shows a light ray travelling from medium X to a vacuum. What is the refractive index of medium X?", "options": [{ "key": "A", "text": "sin \u03B2 / cos \u03B8" }, { "key": "B", "text": "cos \u03B8 / sin \u03B2" }, { "key": "C", "text": "sin \u03B8 / sin \u03B2" }, { "key": "D", "text": "cos \u03B2 / sin \u03B8" }], "answer": "A", "hint": "What is the refractive index of ?", "image": { "src": "./assets/ch32-f04-fig.png", "alt": "Diagram for ch32-f04", "caption": "Fig \xB7 ch32-f04" } },
    { "id": "ch32-f05", "section": "refraction-snells-law", "difficulty": "Standard", "stem": "The figure shows a light ray travelling from medium Y to medium X. What is the angle of refraction?", "options": [{ "key": "A", "text": "10.5" }, { "key": "B", "text": "18.1" }, { "key": "C", "text": "21.5" }, { "key": "D", "text": "26.1" }], "answer": "C", "hint": "What is the angle of refraction?", "image": { "src": "./assets/ch32-f05-fig.png", "alt": "Diagram for ch32-f05", "caption": "Fig \xB7 ch32-f05" } },
    { "id": "ch32-f06", "section": "refraction-snells-law", "difficulty": "Applied", "stem": "A ray of light travels from medium X to medium Y as shown. The speed of light in air and medium X are 3 \xD7 10\u2078 m s\u207B\xB9 and 2.5 \xD7 10\u2078 m s\u207B\xB9 respectively. Find the refractive index of medium Y.", "options": [{ "key": "A", "text": "1.27" }, { "key": "B", "text": "1.29" }, { "key": "C", "text": "1.52" }, { "key": "D", "text": "1.83" }], "answer": "D", "hint": "Find the refractive index of . 4025medium Xmedium Y4025medium Xmedium Y", "image": { "src": "./assets/ch32-f06-fig.png", "alt": "Diagram for ch32-f06", "caption": "Fig \xB7 ch32-f06" } },
    { "id": "ch32-f07", "section": "refraction-snells-law", "difficulty": "Foundation", "stem": "Which of the following statements about the laws of refraction is/are correct? (1)The angle of refraction r is always equal to the angle of incidence i. (2)The ratio of the sine of the angle of incidence i to the sine of the angle of refraction r is always equal to 1, i.e. sin i / sin r = 1. (3)The incident ray, the refracted ray and the normal all lie in the same plane.", "options": [{ "key": "A", "text": "(3) only" }, { "key": "B", "text": "(1) and (2) only" }, { "key": "C", "text": "(2) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "A", "hint": "Which of the following statements about the laws of refraction is/are correct? (1)The angle of refraction r is always equal to the angle of incidence i. (2)The ratio of the sine of" },
    { "id": "ch32-f08", "section": "refraction-snells-law", "difficulty": "Standard", "stem": "Three light rays enter an air bubble in water. C is the centre of the bubble. Which of the paths shown below is/are correct?", "options": [{ "key": "A", "text": "(2) only" }, { "key": "B", "text": "(1) and (2) only" }, { "key": "C", "text": "(1) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "B", "hint": "Three light rays enter an air bubble in water. C is the centre of the bubble. Which of the paths shown below is/are correct? water air water air", "image": { "src": "./assets/ch32-f08-fig.png", "alt": "Diagram for ch32-f08", "caption": "Fig \xB7 ch32-f08" } },
    { "id": "ch32-f09", "section": "refraction-snells-law", "difficulty": "Standard", "stem": "The figure below shows the apparent position of a goldfish as seen by an observer above water. Where is the actual position of the goldfish?", "options": [{ "key": "A", "text": "Option A" }, { "key": "B", "text": "Option B" }, { "key": "C", "text": "Option C" }, { "key": "D", "text": "Option D" }], "answer": "D", "hint": "Where is the actual position of the goldfish? observer's eyeapparent position of goldfishobserver's eyeapparent position of goldfish observer's eye apparent position of goldfish ob", "image": { "src": "./assets/ch32-f09-fig.png", "alt": "Diagram for ch32-f09", "caption": "Fig \xB7 ch32-f09" } },
    { "id": "ch32-f10", "section": "refraction-snells-law", "difficulty": "Foundation", "stem": "Which of the following statements about this phenomenon is/are correct? (1)White light is composed of a mixture of colours. (2)Different colours of light travel at different speeds in glass. (3)Green light is refracted more than red light in passing through the prism.", "options": [{ "key": "A", "text": "(1) only" }, { "key": "B", "text": "(1) and (2) only" }, { "key": "C", "text": "(2) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "D", "hint": "White light is composed of a mixture of coloured lights. A beam of white light is dispersed into lights of different colours when it passes through a glass prism as lights of different colours travel at different speeds in glass. \u2234 (1) and (2) are correct. Green light is refracted more than red light in passing through" },
    { "id": "ch33-t01", "section": "total-internal-reflection", "difficulty": "Standard", "stem": "The figure shows light refracted at a boundary between water and air. What is \u03B2?", "options": [{ "key": "A", "text": "14.4" }, { "key": "B", "text": "21.3" }, { "key": "C", "text": "35.6" }, { "key": "D", "text": "42.0" }], "answer": "C", "hint": "Use Snell's law and the geometry of the triangle formed by the refracted ray and the boundaries.", "image": { "src": "./assets/ch33-t01-fig.png", "alt": "Diagram for ch33-t01", "caption": "Fig \xB7 ch33-t01" } },
    { "id": "ch33-t02", "section": "total-internal-reflection", "difficulty": "Standard", "stem": "Why does the air bubble appear silvery?", "options": [{ "key": "A", "text": "Total internal reflection occurs when light rays travel from above the water surface to the water." }, { "key": "B", "text": "Total internal reflection occurs when light rays travel from water to above the water surface." }, { "key": "C", "text": "Total internal reflection occurs when light rays travel from water to the air bubble." }, { "key": "D", "text": "Total internal reflection occurs when light rays travel from the air bubble to water." }], "answer": "C", "hint": "Total internal reflection occurs only when light travels from an optically denser medium to an optically less dense medium. In this case, water is the optically denser medium. \u2234 A and D are incorrect. Total internal reflection may occur when light rays travel from water to above the water surface, but the light rays wo", "image": { "src": "./assets/ch33-t02-fig.png", "alt": "Diagram for ch33-t02", "caption": "Fig \xB7 ch33-t02" } },
    { "id": "ch33-t03", "section": "total-internal-reflection", "difficulty": "Standard", "stem": "The figure shows a light ray incident on a semicircular glass block. Which of the following correctly describes what happens to the light ray at the curved surface?", "options": [{ "key": "A", "text": "reflection only." }, { "key": "B", "text": "refraction only." }, { "key": "C", "text": "total internal reflection only." }, { "key": "D", "text": "refraction and total internal reflection." }], "answer": "D", "hint": "Refer to the figure." },
    { "id": "ch33-t04", "section": "total-internal-reflection", "difficulty": "Standard", "stem": "Which of the following instruments make(s) use of total internal reflection of light? (1)Optical fibre (2)Plane mirror (3)Prisms in a periscope", "options": [{ "key": "A", "text": "(1) only" }, { "key": "B", "text": "(1) and (3) only" }, { "key": "C", "text": "(2) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "B", "hint": "Which of the following instruments make(s) use of total internal reflection of light? (1)Optical fibre (2)Plane mirror (3)Prisms in a periscope" },
    { "id": "ch33-t05", "section": "total-internal-reflection", "difficulty": "Standard", "stem": "The figure shows a light ray travelling from medium X to medium Y. Which of the following statements is/are correct? (1)Medium X is optically denser than medium Y. (2)Light travels faster in medium Y than in medium X. (3)Medium Y is air.", "options": [{ "key": "A", "text": "(2) only" }, { "key": "B", "text": "(1) and (2) only" }, { "key": "C", "text": "(1) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "A", "hint": "(2)Light travels faster in than in . (3) is air.", "image": { "src": "./assets/ch33-t05-fig.png", "alt": "Diagram for ch33-t05", "caption": "Fig \xB7 ch33-t05" } },
    { "id": "ch33-t06", "section": "total-internal-reflection", "difficulty": "Standard", "stem": "What is/are the advantage(s) of right-angled prisms over plane glass mirrors in making periscopes? (1)The image is erect. (2)Multiple images are not formed. (3)The image is of the same size as the object.", "options": [{ "key": "A", "text": "(2) only" }, { "key": "B", "text": "(1) and (3) only" }, { "key": "C", "text": "(2) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "A", "hint": "What is/are the advantage(s) of right-angled prisms over plane glass mirrors in making periscopes? (1)The image is erect. (2)Multiple images are not formed. (3)The image is of the " },
    { "id": "ch33-t07", "section": "total-internal-reflection", "difficulty": "Standard", "stem": "Which of the diagrams are correct? (1) (2) (3)", "options": [{ "key": "A", "text": "(1) and (2) only" }, { "key": "B", "text": "(1) and (3) only" }, { "key": "C", "text": "(2) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "B", "hint": "When a light ray travels from air to an optically denser medium (glass), it bends towards the normal. \u2234 (1) is correct. When a light ray travels from air to an optically denser medium (glass), total internal reflection will never occur. \u2234 (2) is incorrect. When a light ray travels from glass to an optically less dense ", "image": { "src": "./assets/ch33-t07-fig.png", "alt": "Diagram for ch33-t07", "caption": "Fig \xB7 ch33-t07" } },
    { "id": "ch33-t08", "section": "total-internal-reflection", "difficulty": "Standard", "stem": "Which of the following ray diagrams is correct?", "options": [{ "key": "B", "text": "60306030" }, { "key": "C", "text": "60306030" }, { "key": "D", "text": "60306030" }], "answer": "C", "hint": "Which of the following ray diagrams is correct?", "images": [{ "src": "./assets/ch33-t08-fig-1.png", "alt": "Diagram for ch33-t08", "caption": "Fig \xB7 ch33-t08 (1/2)" }, { "src": "./assets/ch33-t08-fig-2.png", "alt": "Diagram for ch33-t08", "caption": "Fig \xB7 ch33-t08 (2/2)" }] },
    { "id": "ch33-t09", "section": "total-internal-reflection", "difficulty": "Applied", "stem": "Which of the following statements about total internal reflection of light is/are correct? (1)It occurs only when light travels from glass to air. (2)It will never occur if light travels from air to glass. (3)It will occur if light travels from a medium with a refractive index of 1.6 to air at an angle of incidence of 35.", "options": [{ "key": "A", "text": "(1) only" }, { "key": "B", "text": "(2) only" }, { "key": "C", "text": "(1) and (3) only" }, { "key": "D", "text": "(2) and (3) only" }], "answer": "B", "hint": "Total internal reflection occurs only when light travels from an optically denser medium to an optically less dense medium. \u2234 (1) is incorrect while (2) is correct. For (3), nm sin m = na sin a 1.6 sin C = 1 sin 90" },
    { "id": "ch33-t10", "section": "total-internal-reflection", "difficulty": "Applied", "stem": "As shown below, a small fish hides under the centre of a floating circular dish with a diameter of 2 m. If the fish moves vertically downwards from the water surface, how far can it move down the water before somebody above the water can see it? Given: refractive index of water = 1.33", "options": [{ "key": "A", "text": "0.53 m" }, { "key": "B", "text": "0.66 m" }, { "key": "C", "text": "0.88 m" }, { "key": "D", "text": "1.14 m" }], "answer": "C", "hint": "Light from the fish is totally internally reflected when the angle of incidence is larger than the critical angle. nw sin w= na sin a 1.33 sin C = 1 sin 90 Let d be the maximum distance that the fish can move down before somebody above the water can see it. tan 48.8 = d = 0.88 m", "image": { "src": "./assets/ch33-t10-fig.png", "alt": "Diagram for ch33-t10", "caption": "Fig \xB7 ch33-t10" } },
    { "id": "ch34-c01", "section": "convex-lens", "difficulty": "Applied", "stem": "Which of the following statements about lens L shown in the figure below is/are correct? (1)Lens L is a convex lens. (2)Lens L has only one principal focus. (3)The focal length of lens L equals distance d.", "options": [{ "key": "A", "text": "(1) only" }, { "key": "B", "text": "(3) only" }, { "key": "C", "text": "(1) and (2) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "A", "hint": "Which of the following statements about lens L shown in the figure below is/are correct? Ld Ld d d (1)Lens L is a . (2)Lens L has only one principal focus. (3)The focal length of l", "image": { "src": "./assets/ch34-c01-fig.png", "alt": "Diagram for ch34-c01", "caption": "Fig \xB7 ch34-c01" } },
    { "id": "ch34-c02", "section": "convex-lens", "difficulty": "Standard", "stem": "In the figure below, lens L is a convex lens and F is its principal focus. Which of the rays is wrongly drawn?", "options": [{ "key": "A", "text": "P" }, { "key": "B", "text": "Q" }, { "key": "C", "text": "R" }, { "key": "D", "text": "S" }], "answer": "A", "hint": "FLPQRS FLPQRS", "image": { "src": "./assets/ch34-c02-fig.png", "alt": "Diagram for ch34-c02", "caption": "Fig \xB7 ch34-c02" } },
    { "id": "ch34-c03", "section": "convex-lens", "difficulty": "Applied", "stem": "An object is 10 cm away from a convex lens. The focal length of the lens is 15 cm. The image formed is", "options": [{ "key": "A", "text": "real, erect and magnified." }, { "key": "B", "text": "virtual, inverted and diminished." }, { "key": "C", "text": "real, inverted and magnified." }, { "key": "D", "text": "virtual, erect and magnified." }], "answer": "D", "hint": "An object is away from a . The focal length of the lens is . The image formed is", "image": { "src": "./assets/ch34-c03-fig.png", "alt": "Diagram for ch34-c03", "caption": "Fig \xB7 ch34-c03" } },
    { "id": "ch34-c04", "section": "convex-lens", "difficulty": "Standard", "stem": "P is an emergent ray from a lens as shown below. F and F' are the principal foci of the lens. Which of the following rays is a possible incident ray?", "options": [{ "key": "A", "text": "Ray w" }, { "key": "B", "text": "Ray x" }, { "key": "C", "text": "Ray y" }, { "key": "D", "text": "Ray z" }], "answer": "A", "hint": "Which of the following rays is a possible incident ray?", "image": { "src": "./assets/ch34-c04-fig.png", "alt": "Diagram for ch34-c04", "caption": "Fig \xB7 ch34-c04" } },
    { "id": "ch34-c05", "section": "convex-lens", "difficulty": "Foundation", "stem": "Which of the following statements about the image formed by a is/are correct? (1)If the image is virtual, it must be erect. (2)If the image is real, it can be either erect or inverted. (3)If the image is real, it can be either magnified or diminished.", "options": [{ "key": "A", "text": "(1) only" }, { "key": "B", "text": "(1) and (3) only" }, { "key": "C", "text": "(2) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "B", "hint": "Which of the following statements about the image formed by a is/are correct? (1)If the image is virtual, it must be erect. (2)If the image is real, it can be either erect or inver" },
    { "id": "ch34-c06", "section": "convex-lens", "difficulty": "Applied", "stem": "Which of the following statements is/are correct? (1)The lens is a . (2)If the lens is moved further away from the object, the image will become smaller. (3)If the lens is replaced by the same type of lens with a shorter focal length, the image will become smaller.", "options": [{ "key": "A", "text": "(1) only" }, { "key": "B", "text": "(1) and (2) only" }, { "key": "C", "text": "(2) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "D", "hint": "The image is real as it can be captured on a screen. Only a can form a magnified/real image. A magnified real image is formed when the object distance lies between f and 2f, where f is the focal length of the lens." },
    { "id": "ch34-c07", "section": "convex-lens", "difficulty": "Standard", "stem": "If F and F' are the principal foci of a convex lens, which of the following ray diagrams is/are incorrect? (1) (2) (3)", "options": [{ "key": "A", "text": "(3) only" }, { "key": "B", "text": "(1) and (2) only" }, { "key": "C", "text": "(2) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "D", "hint": "If F and F' are the principal foci of a , which of the following ray diagrams is/are incorrect? (1) (2) (3)", "image": { "src": "./assets/ch34-c07-fig.png", "alt": "Diagram for ch34-c07", "caption": "Fig \xB7 ch34-c07" } },
    { "id": "ch34-c08", "section": "convex-lens", "difficulty": "Standard", "stem": "Which of the following correctly describes how the image changes?", "options": [{ "key": "A", "text": "Magnified, erect magnified, inverted diminished, inverted" }, { "key": "B", "text": "Magnified, erect magnified, inverted more magnified, inverted" }, { "key": "C", "text": "Magnified, erect diminished, inverted more diminished, inverted" }, { "key": "D", "text": "Magnified, erect diminished, erect more diminished, erect" }], "answer": "A", "hint": "Let f be the focal length of the lens. When the object distance becomes larger than f, the image becomes magnified and inverted. When the object distance becomes larger than 2f, the image becomes diminished and inverted. 9. The figure below shows an experiment set-up. A clear image is formed on the screen when the and ", "image": { "src": "./assets/ch34-c08-fig.png", "alt": "Diagram for ch34-c08", "caption": "Fig \xB7 ch34-c08" } },
    { "id": "ch34-c09", "section": "convex-lens", "difficulty": "Applied", "stem": "Which of the following statements are correct? (1)The lens is convex. (2)The image formed is real. (3)The image distance is equal to the focal length.", "options": [{ "key": "A", "text": "(1) and (2) only" }, { "key": "B", "text": "(1) and (3) only" }, { "key": "C", "text": "(2) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "D", "hint": "Parallel incident rays converge only after passing through a . \u2234 (1) is correct. When rays from a distant object pass through a , a real image is formed on the focal plane. \u2234 (2) and (3) are correct.", "image": { "src": "./assets/ch34-c09-fig.png", "alt": "Diagram for ch34-c09", "caption": "Fig \xB7 ch34-c09" } },
    { "id": "ch34-c10", "section": "convex-lens", "difficulty": "Applied", "stem": "Which of the following statements about the experiment is/are correct? (1)The focal length of the is equal to the distance between the and the lamp-housing. (2)The brightness and shape of the image will not change if the plane mirror is moved a little bit backwards. (3)The image will be larger if the experiment is repeated by using another with a shorter focal length.", "options": [{ "key": "A", "text": "(1) only" }, { "key": "B", "text": "(1) and (2) only" }, { "key": "C", "text": "(2) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "B", "hint": "Only when the object is located at the principal focus of the , rays from the object are parallel to the after passing through the lens. These parallel rays are reflected by the plane mirror and then converge to the principal focus of the lens after passing through the lens once again. \u2234 (1) is correct. The reflection " },
    { "id": "ch35-m01", "section": "magnification-lens-formula", "difficulty": "Standard", "stem": "The graph shows the variation of image distance v with object distance u for a convex lens. Which of the following statements is/are correct? (1)The focal length of the lens is 5 cm. (2)The value of x is 5. (3)The slope of the graph is 1.", "options": [{ "key": "A", "text": "(1) only" }, { "key": "B", "text": "(2) only" }, { "key": "C", "text": "(2) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "B", "hint": "= + \u2026\u2026(*) \u2234 (3) is incorrect. From the graph, when = 0, = 5 m1. Substitute the values into (*), 5 = 0 + f = 0.2 m \u2234 (1) is incorrect. From the graph, when = 0, = x m1. Substitute the values into (*), 0 = x + x = 5 \u2234 (2) is correct. v v If another of greater refractive index is used, which of the following graphs (in do", "image": { "src": "./assets/ch35-m01-fig.png", "alt": "Diagram for ch35-m01", "caption": "Fig \xB7 ch35-m01" } },
    { "id": "ch35-m02", "section": "magnification-lens-formula", "difficulty": "Standard", "stem": "Fig. a and Fig. b show the experimental set-up and the m\u2013v graph for a convex lens. If another convex lens of greater refractive index is used, which of the following graphs (in dotted line) best shows the new m\u2013v graph?", "options": [{ "key": "A", "text": "3.75 cm, diverging lens" }, { "key": "B", "text": "3.75 cm, converging lens" }, { "key": "C", "text": "15 cm, diverging lens" }, { "key": "D", "text": "15 cm, converging lens" }], "answer": "C", "hint": "v v", "images": [{ "src": "./assets/ch35-m02-fig-1.png", "alt": "Diagram for ch35-m02", "caption": "Fig \xB7 ch35-m02 (1/2)" }, { "src": "./assets/ch35-m02-fig-2.png", "alt": "Diagram for ch35-m02", "caption": "Fig \xB7 ch35-m02 (2/2)" }] },
    { "id": "ch35-m03", "section": "magnification-lens-formula", "difficulty": "Standard", "stem": "An object is placed 5 cm in front of a convex lens with a focal length of 3 cm. In applying the lens formula to find the position of the image, which of the following statements is/are correct? (1)f is 3 cm. (2)u is +5 cm. (3)The image is 1.875 cm from the lens on the same side as the object.", "options": [{ "key": "A", "text": "(2) only" }, { "key": "B", "text": "(1) and (3) only" }, { "key": "C", "text": "(2) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "A", "hint": "f is positive for a . Therefore, f is + . \u2234 (1) is incorrect. u is always positive. \u2234 (2) is correct." },
    { "id": "ch35-m04", "section": "magnification-lens-formula", "difficulty": "Applied", "stem": "An object 7 cm tall is placed in front of a lens and the image formed is 5 cm tall. Which of the following may be the lens used? (1)Convex lens of focal length 2.92 cm (2)Convex lens of focal length 17.5 cm (3)Concave lens of focal length 2.92 cm (4)Concave lens of focal length 17.5 cm", "options": [{ "key": "A", "text": "(3) only" }, { "key": "B", "text": "(2) and (3) only" }, { "key": "C", "text": "(1) and (4) only" }, { "key": "D", "text": "(1), (2), (3) and (4)" }], "answer": "D", "hint": "Let f be the foal length. If the lens is convex and the object distance is greater than 2f, a diminished image is formed. Since the object distance is not given, (1) and (2) may be used." },
    { "id": "ch35-m05", "section": "magnification-lens-formula", "difficulty": "Applied", "stem": "What is the focal length of the lens?", "options": [{ "key": "A", "text": "4 cm" }, { "key": "B", "text": "6 cm" }, { "key": "C", "text": "8 cm" }, { "key": "D", "text": "30 cm" }], "answer": "B", "hint": "What is the focal length of the lens?", "image": { "src": "./assets/ch35-m05-fig.png", "alt": "Diagram for ch35-m05", "caption": "Fig \xB7 ch35-m05" } },
    { "id": "ch35-m06", "section": "magnification-lens-formula", "difficulty": "Standard", "stem": "The magnification of an image is 2, and the distance between the image and the lens is 8 cm. Which of the following may be the distance between the image and the object? (1)4 cm (2)8 cm (3)12 cm", "options": [{ "key": "A", "text": "(3) only" }, { "key": "B", "text": "(1) and (3) only" }, { "key": "C", "text": "(2) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "B", "hint": "u = = = Since the image is magnified, the lens must be convex. There are two scenarios the image can be formed. Scenario 1: If the object distance is between f and 2f, the image and the object are on opposite sides of the lens. Scenario 2: If the object distance is smaller than f, the image and the object are on the sa" },
    { "id": "ch35-m07", "section": "magnification-lens-formula", "difficulty": "Applied", "stem": "In the figure below, the positions of an object and its image formed by a convex lens are shown. The focal length of the lens is", "options": [{ "key": "A", "text": "1 cm, 0.75 cm" }, { "key": "B", "text": "1 cm, 1.5 cm" }, { "key": "C", "text": "9 cm, 2.25 cm" }, { "key": "D", "text": "9 cm, 4.5 cm" }], "answer": "D", "hint": "An object is placed in front of a lens and an erect image is formed from the lens. Which of the following is the correct description of the lens? Focal length Type of the lens diverging lens converging lens diverging lens", "image": { "src": "./assets/ch35-m07-fig.png", "alt": "Diagram for ch35-m07", "caption": "Fig \xB7 ch35-m07" } },
    { "id": "ch35-m08", "section": "magnification-lens-formula", "difficulty": "Standard", "stem": "An object is placed 10 cm in front of a lens and an erect image is formed 6 cm from the lens. Which of the following is the correct description of the lens?", "options": [{ "key": "A", "text": "3.75 cm, diverging lens" }, { "key": "B", "text": "3.75 cm, converging lens" }, { "key": "C", "text": "15 cm, diverging lens" }, { "key": "D", "text": "15 cm, converging lens" }], "answer": "C", "hint": "Since the image is erect and diminished, the lens is diverging (concave) and the image is virtual. The focal length of the lens is . 9.A student holds a lens above a piece of paper. The image of the letters 'AT' is shown in the figure below. Its magnification is 3. PHYSICS AT WORKlensATPHYSICS AT WORKlensAT" },
    { "id": "ch35-m09", "section": "magnification-lens-formula", "difficulty": "Applied", "stem": "The figure shows a lens used in a Physics at Work experiment. Find the image distance and the focal length of the lens.", "options": [{ "key": "A", "text": "1 cm, 0.75 cm" }, { "key": "B", "text": "1 cm, 1.5 cm" }, { "key": "C", "text": "9 cm, 2.25 cm" }, { "key": "D", "text": "9 cm, 4.5 cm" }], "answer": "D", "hint": "Since the image is erect and magnified, the lens is convex. image distance = mu = 3 3 =", "image": { "src": "./assets/ch35-m09-fig.png", "alt": "Diagram for ch35-m09", "caption": "Fig \xB7 ch35-m09" } },
    { "id": "ch35-m10", "section": "magnification-lens-formula", "difficulty": "Standard", "stem": "A luminous point object is placed 3 cm above the principal axis of a converging lens of focal length 10 cm. Its image is 5 cm below the axis. How far is the object from the lens?", "options": [{ "key": "A", "text": "4 cm" }, { "key": "B", "text": "5.33 cm" }, { "key": "C", "text": "12 cm" }, { "key": "D", "text": "16 cm" }], "answer": "D", "hint": "For this object, The object is from the lens." },
    { "id": "ch36-v01", "section": "concave-lens", "difficulty": "Foundation", "stem": "Which of the following statements about lenses is/are correct? (1)Convex and concave lenses form images by refraction. (2)Convex lenses are thinner in the middle. (3)Concave lenses are diverging lenses.", "options": [{ "key": "A", "text": "(1) only" }, { "key": "B", "text": "(1) and (3) only" }, { "key": "C", "text": "(2) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "B", "hint": "Light rays are bent due to refraction when entering and leaving a lens. \u2234 (1) is correct. \u2234 (2) is incorrect." },
    { "id": "ch36-v02", "section": "concave-lens", "difficulty": "Standard", "stem": "In the figure below, lens L is a concave lens and F' is its principal focus. Which of the rays is wrongly drawn?", "options": [{ "key": "A", "text": "P" }, { "key": "B", "text": "Q" }, { "key": "C", "text": "R" }, { "key": "D", "text": "S" }], "answer": "B", "hint": "In the figure below, lens L is a concave lens and F' is its principal focus. Which of the rays is wrongly drawn? LF'PQRS LF'PQRS F' F'", "image": { "src": "./assets/ch36-v02-fig.png", "alt": "Diagram for ch36-v02", "caption": "Fig \xB7 ch36-v02" } },
    { "id": "ch36-v03", "section": "concave-lens", "difficulty": "Standard", "stem": "Which of the following correctly describe the nature of an image formed by a concave lens? (1)Erect (2)Magnified (3)Virtual", "options": [{ "key": "A", "text": "(1) only" }, { "key": "B", "text": "(3) only" }, { "key": "C", "text": "(1) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "C", "hint": "Which of the following correctly describe the nature of an image formed by a concave lens? (1)Erect (2)Magnified (3)Virtual" },
    { "id": "ch36-v04", "section": "concave-lens", "difficulty": "Standard", "stem": "The image formed by a concave lens must be", "options": [{ "key": "A", "text": "real, erect and magnified." }, { "key": "B", "text": "real, erect and diminished." }, { "key": "C", "text": "virtual, inverted and magnified." }, { "key": "D", "text": "virtual, erect and diminished." }], "answer": "D", "hint": "The image formed by a concave lens must be" },
    { "id": "ch36-v05", "section": "concave-lens", "difficulty": "Applied", "stem": "An object is put in front of a lens and a virtual image is formed. The figure below shows the positions of the object and the image. What is the focal length of the lens?", "options": [{ "key": "A", "text": "5 cm" }, { "key": "B", "text": "10 cm" }, { "key": "C", "text": "15 cm" }, { "key": "D", "text": "20 cm" }], "answer": "C", "hint": "Only a concave lens can form an erect and diminished image, so both the object and its image are on the same side of the lens.", "image": { "src": "./assets/ch36-v05-fig.png", "alt": "Diagram for ch36-v05", "caption": "Fig \xB7 ch36-v05" } },
    { "id": "ch36-v06", "section": "concave-lens", "difficulty": "Standard", "stem": "F and F' are the principal foci of a concave lens. Which of the following ray diagrams is/are incorrect? (1) (2) (3)", "options": [{ "key": "A", "text": "(2) only" }, { "key": "B", "text": "(1) and (3) only" }, { "key": "C", "text": "(2) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "D", "hint": "Only incident rays parallel to the will bend after passing through the lens so that they appear to come from the principal focus F'. \u2234 (1), (2) and (3) are incorrect. 7. In the following diagram, intervals AB, BC, CD, DE and EF are of equal length. An object is placed at O. When a lens is put in front of the object, an", "image": { "src": "./assets/ch36-v06-fig.png", "alt": "Diagram for ch36-v06", "caption": "Fig \xB7 ch36-v06" } },
    { "id": "ch36-v07", "section": "concave-lens", "difficulty": "Standard", "stem": "In the following diagram, intervals AB, BC, CD, DE and EF are of equal length. An object is placed at O. When a lens is put in front of the object, an image is formed at I. Which of the following show(s) the possible position(s), type(s) and focal length(s) of the lens? (1)convex lens, about 1 interval (2)concave lens, about 2 intervals (3)convex lens, about 1 interval", "options": [{ "key": "A", "text": "(1) only" }, { "key": "B", "text": "(2) only" }, { "key": "C", "text": "(1) and (3) only" }, { "key": "D", "text": "(2) and (3) only" }], "answer": "B", "hint": "about 1 intervals", "image": { "src": "./assets/ch36-v07-fig.png", "alt": "Diagram for ch36-v07", "caption": "Fig \xB7 ch36-v07" } },
    { "id": "ch36-v08", "section": "concave-lens", "difficulty": "Foundation", "stem": "Which of the following statements about the image formed by a concave lens is/are correct? (1)It is always between the lens and object. (2)It is always diminished. (3)It will be formed at infinity if the object is located at the focus of the lens.", "options": [{ "key": "A", "text": "(1) only" }, { "key": "B", "text": "(3) only" }, { "key": "C", "text": "(1) and (2) only" }, { "key": "D", "text": "(2) and (3) only" }], "answer": "C", "hint": "Which of the following statements about the image formed by a concave lens is/are correct? (1)It is always between the lens and object. (2)It is always diminished. (3)It will be fo" },
    { "id": "ch36-v09", "section": "concave-lens", "difficulty": "Applied", "stem": "An object is placed in front of a concave lens and an image is formed. The positions of the image and the lens are shown below. The focal length of the concave lens is 9 cm. The object distance is", "options": [{ "key": "A", "text": "6 cm" }, { "key": "B", "text": "12 cm" }, { "key": "C", "text": "18 cm" }, { "key": "D", "text": "24 cm" }], "answer": "C", "hint": "The image formed by a concave lens is virtual. Therefore, v = .", "image": { "src": "./assets/ch36-v09-fig.png", "alt": "Diagram for ch36-v09", "caption": "Fig \xB7 ch36-v09" } },
    { "id": "ch36-v10", "section": "concave-lens", "difficulty": "Applied", "stem": "In the following diagram, lenses X and Y are made of the same material but have different shapes, while lenses X and Z are made of different materials but have the same shape. Which of the following statements is/are correct? (1)X, Y and Z are diverging lenses. (2)Y has a shorter focal length than X. (3)Z has a shorter focal length than X.", "options": [{ "key": "A", "text": "(2) only" }, { "key": "B", "text": "(3) only" }, { "key": "C", "text": "(2) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "D", "hint": "Which of the following statements is/are correct? (1)X, Y and Z are diverging lenses. (2)Y has a shorter focal length than X. (3)Z has a shorter focal length than X.", "image": { "src": "./assets/ch36-v10-fig.png", "alt": "Diagram for ch36-v10", "caption": "Fig \xB7 ch36-v10" } }
  ];

  // ../js/quizUtils.js
  var QUIZ_UI_LANGS = ["en", "zh", "zh-Hant"];
  function isChineseUI(lang) {
    return lang === "zh" || lang === "zh-Hant";
  }
  function noQuizAlertMessage(lang) {
    if (lang === "zh") return "\u8BF7\u5148\u751F\u6210\u9898\u76EE\u3002";
    if (lang === "zh-Hant") return "\u8ACB\u5148\u7522\u751F\u984C\u76EE\u3002";
    return "Generate questions first.";
  }
  function resolveQuizLang() {
    try {
      const parentLang = window.parent.document.documentElement.lang;
      if (parentLang && QUIZ_UI_LANGS.includes(parentLang)) return parentLang;
      if (parentLang?.startsWith("zh")) return parentLang === "zh-Hant" ? "zh-Hant" : "zh";
    } catch (_) {
    }
    const local = document.documentElement.lang;
    if (local && QUIZ_UI_LANGS.includes(local)) return local;
    if (local?.startsWith("zh")) return local === "zh-Hant" ? "zh-Hant" : "zh";
    return "en";
  }
  var DIFFICULTY_MAP = {
    Foundation: "easy",
    Standard: "medium",
    Applied: "hard"
  };
  function difficultyLevel(q) {
    return DIFFICULTY_MAP[q.difficulty] || "medium";
  }
  function createRng(seedStr) {
    let s = 0;
    const str = String(seedStr || "").trim();
    if (str) {
      for (let i = 0; i < str.length; i++) s = Math.imul(31, s) + str.charCodeAt(i) | 0;
    } else {
      s = Date.now() ^ Math.random() * 2147483647 | 0;
    }
    if (s === 0) s = 1;
    return {
      random() {
        s = Math.imul(1664525, s) + 1013904223 | 0;
        return (s >>> 0) / 4294967296;
      }
    };
  }
  function seededShuffle(arr, seedStr) {
    const rng = createRng(seedStr);
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rng.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }
  function escHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function stripLeadingQuestionNumber(text) {
    return String(text || "").replace(/^\d+\.(?:\s+)?/, "").trim();
  }
  function stemParagraphHtml(block) {
    const trimmed = block.trim();
    const isStatement = /^\(\d+\)/.test(trimmed);
    const cls = isStatement ? "stem-block stem-statement split-text-target mb-3 last:mb-0 leading-snug" : "stem-block split-text-target mb-4 last:mb-0 leading-snug";
    return `<p class="${cls}">${block.replace(/\n/g, "<br>")}</p>`;
  }
  function expandStemBlocks(block) {
    if (/\(\d+\)/.test(block)) {
      const parts = block.split(/(?=\(\d+\))/).map((part) => part.trim()).filter(Boolean);
      if (parts.length > 1) return parts;
    }
    return [block];
  }
  function formatStemHtml(text) {
    if (!text) return "";
    const s = escHtml(stripLeadingQuestionNumber(text));
    return s.split(/\n\n+/).map((part) => part.trim()).filter(Boolean).map((section) => expandStemBlocks(section).map(stemParagraphHtml).join("")).join("");
  }
  function questionFormat(q) {
    return q.format || "mcq";
  }
  function buildQuizBankStats(questions, sectionIds, formatIds) {
    const bySection = {};
    const byFormat = Object.fromEntries(formatIds.map((id) => [id, 0]));
    const matrix = {};
    for (const sid of sectionIds) {
      matrix[sid] = Object.fromEntries(formatIds.map((fid) => [fid, 0]));
    }
    for (const q of questions) {
      const fmt = questionFormat(q);
      if (!sectionIds.includes(q.section) || !formatIds.includes(fmt)) continue;
      bySection[q.section] = (bySection[q.section] || 0) + 1;
      byFormat[fmt] = (byFormat[fmt] || 0) + 1;
      if (matrix[q.section]) matrix[q.section][fmt] = (matrix[q.section][fmt] || 0) + 1;
    }
    return { total: questions.length, bySection, byFormat, matrix };
  }
  function filterQuizPool(allQuestions, { sections, formats, difficulty }) {
    let pool = allQuestions.filter(
      (q) => sections.includes(q.section) && formats.includes(questionFormat(q))
    );
    if (difficulty && difficulty !== "all") {
      pool = pool.filter((q) => difficultyLevel(q) === difficulty);
    }
    return pool;
  }
  function formatTypeLabel(q) {
    const f = questionFormat(q);
    if (f === "tf") return "T/F";
    if (f === "fill") return "FILL";
    return "MCQ";
  }
  function normalizeFillAnswer(s) {
    return String(s || "").trim().toLowerCase().replace(/\s+/g, " ").replace(/[.,;]/g, "");
  }
  function fillAnswerMatches(input, acceptList) {
    const n = normalizeFillAnswer(input);
    if (!n) return false;
    return (acceptList || []).some((a) => normalizeFillAnswer(a) === n);
  }
  function getFillLines(q) {
    if (q.lines?.length) return q.lines;
    return (q.fields || []).map((field) => ({
      segments: [
        { type: "text", value: String(field.label || "").replace(/_+/g, "") },
        { type: "blank", accept: field.accept || [] }
      ]
    }));
  }
  function countFillBlanks(q) {
    return getFillLines(q).reduce(
      (n, line) => n + line.segments.filter((s) => s.type === "blank").length,
      0
    );
  }
  function fillLineAnswerText(line) {
    return line.segments.map((seg) => {
      if (seg.type === "text") return seg.value || "";
      return seg.accept?.[0] || "___";
    }).join("");
  }
  function allFillFieldsCorrect(q, values) {
    const lines = getFillLines(q);
    if (!lines.length) return false;
    let i = 0;
    for (const line of lines) {
      for (const seg of line.segments) {
        if (seg.type !== "blank") continue;
        if (!fillAnswerMatches(values[i], seg.accept)) return false;
        i += 1;
      }
    }
    return i === values.length && i > 0;
  }
  function modelAnswerText(q) {
    const f = questionFormat(q);
    if (f === "tf") {
      const opt2 = q.options?.find((o) => o.key === q.answer);
      const word = opt2?.text || (q.answer === "T" ? "True" : "False");
      const wordZh = opt2?.textZh || (q.answer === "T" ? "\u6B63\u78BA" : "\u932F\u8AA4");
      return { en: `${word}.`, zh: `${wordZh}\u3002` };
    }
    if (f === "fill") {
      const lines = getFillLines(q);
      if (lines.length) {
        return { en: lines.map((line) => fillLineAnswerText(line)).join(" | "), zh: "" };
      }
    }
    const opt = q.options?.find((o) => o.key === q.answer);
    const en = opt ? `${q.answer}. ${opt.text}` : q.answer;
    const zh = opt?.textZh ? `${q.answer}. ${opt.textZh}` : "";
    return { en, zh };
  }

  // ../js/quizSummary.js
  function sectionLabel(id, lang) {
    const row = QUIZ_SECTIONS.find((s) => s.id === id);
    if (!row) return id;
    return isChineseUI(lang) ? row.labelZh : row.label;
  }
  function buildRevisionSuggestions({ total, correct, firstTry, failed, incomplete, byType, t, lang }) {
    const lines = [];
    const seen = /* @__PURE__ */ new Set();
    const add = (s) => {
      if (!s || seen.has(s)) return;
      seen.add(s);
      lines.push(s);
    };
    const pctAll = total ? Math.round(100 * correct / total) : 0;
    const ftPctAll = total ? Math.round(100 * firstTry / total) : 0;
    if (pctAll >= 85) add(t("revBandExcellent"));
    else if (pctAll >= 65) add(t("revBandGood"));
    else if (pctAll >= 40) add(t("revBandFair"));
    else add(t("revBandLow"));
    const typeRows = [];
    byType.forEach((agg, sid) => {
      if (!agg?.total) return;
      typeRows.push({
        name: sectionLabel(sid, lang),
        id: sid,
        total: agg.total,
        correct: agg.correct,
        pct: Math.round(100 * agg.correct / agg.total)
      });
    });
    typeRows.sort((a, b) => a.pct - b.pct || b.total - a.total);
    let weak = typeRows.filter((r) => r.total >= 2 && r.pct < 66);
    if (!weak.length) weak = typeRows.filter((r) => r.total >= 1 && r.pct < 50);
    weak.slice(0, 2).forEach((r) => {
      add(
        t("revWeakOne").replace("{type}", r.name).replace("{c}", String(r.correct)).replace("{t}", String(r.total)).replace("{pct}", String(r.pct))
      );
    });
    const strong = typeRows.filter((r) => r.total >= 2 && r.pct === 100);
    if (strong.length && !weak.length) {
      add(t("revStrongOne").replace("{type}", strong[0].name).replace("{n}", String(strong[0].total)));
    }
    if (total >= 4 && pctAll >= 45 && ftPctAll < 40) add(t("revFirstTryLow"));
    if (failed.length) add(t("revTwoStrike"));
    if (incomplete.length) add(t("revIncomplete"));
    if (!weak.length && typeRows.length >= 2 && pctAll >= 35 && pctAll < 78) add(t("revBalanced"));
    return lines;
  }
  function renderSessionSummary({ questions, attemptMap, panel, t, lang }) {
    if (!questions.length) {
      alert(t("alertNoQuiz"));
      return;
    }
    const total = questions.length;
    let correct = 0;
    let firstTry = 0;
    const failed = [];
    const incomplete = [];
    const byType = /* @__PURE__ */ new Map();
    questions.forEach((q, idx) => {
      const st = attemptMap.get(q.id) || { wrong: 0, solved: false };
      const n = idx + 1;
      const sid = q.section;
      if (!byType.has(sid)) byType.set(sid, { total: 0, correct: 0, firstTry: 0 });
      const agg = byType.get(sid);
      agg.total += 1;
      if (st.solved && st.wrong < 2) {
        correct += 1;
        agg.correct += 1;
        if (st.wrong === 0) {
          firstTry += 1;
          agg.firstTry += 1;
        }
      } else if (st.solved && st.wrong >= 2) {
        failed.push({ n, q });
      } else {
        incomplete.push(n);
      }
    });
    let html = `<h3 class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-3">${escHtml(t("summaryTitle"))}</h3>`;
    html += `<div class="text-body-md font-label-bold text-on-surface mb-1">${escHtml(t("summaryScoreLabel"))}: ${correct} / ${total}</div>`;
    html += `<p class="text-body-sm text-on-surface-variant mb-4">${escHtml(t("summaryFirstTry"))}: ${firstTry} / ${total}</p>`;
    html += `<div class="font-label-bold text-on-surface text-body-sm mb-2">${escHtml(t("summaryByTypeTitle"))}</div>`;
    html += `<div class="overflow-x-auto mb-4"><table class="w-full text-left text-body-sm border-collapse summary-type-table">
    <thead><tr class="border-b border-outline-variant/30 text-on-surface-variant">
      <th class="p-2">${escHtml(t("summaryByTypeColType"))}</th>
      <th class="p-2 text-right">${escHtml(t("summaryByTypeColFraction"))}</th>
      <th class="p-2 text-right">${escHtml(t("summaryByTypeColRate"))}</th>
      <th class="p-2 text-right">${escHtml(t("summaryByTypeColFirst"))}</th>
    </tr></thead><tbody>`;
    QUIZ_SECTIONS.forEach((sec) => {
      const agg = byType.get(sec.id);
      if (!agg?.total) return;
      const pct = Math.round(100 * agg.correct / agg.total);
      const name = isChineseUI(lang) ? sec.labelZh : sec.label;
      html += `<tr class="border-b border-outline-variant/15">
      <td class="p-2 font-label-bold text-on-surface">${escHtml(name)}</td>
      <td class="p-2 text-right tabular-nums">${agg.correct} / ${agg.total}</td>
      <td class="p-2 text-right tabular-nums">${pct}%</td>
      <td class="p-2 text-right tabular-nums">${agg.firstTry} / ${agg.total}</td>
    </tr>`;
    });
    html += "</tbody></table></div>";
    const revLines = buildRevisionSuggestions({ total, correct, firstTry, failed, incomplete, byType, t, lang });
    html += `<div class="p-4 rounded-xl bg-primary-fixed/40 border border-primary/15 mb-4">
    <h4 class="font-label-bold text-primary mb-2">${escHtml(t("revTitle"))}</h4>
    <ul class="list-disc list-inside text-body-sm text-on-surface-variant space-y-1">`;
    revLines.forEach((line) => {
      html += `<li>${escHtml(line)}</li>`;
    });
    html += "</ul></div>";
    html += `<div class="font-label-bold text-on-surface text-body-sm mb-2">${escHtml(t("summaryWrongTitle"))}</div>`;
    if (!failed.length) {
      html += `<p class="text-secondary font-label-bold text-body-sm">${escHtml(t("summaryNoneWrong"))}</p>`;
    } else {
      html += '<ul class="space-y-2">';
      failed.forEach(({ n, q }) => {
        const label = sectionLabel(q.section, lang);
        html += `<li class="p-3 rounded-xl bg-tertiary/10 border border-tertiary/25 text-body-sm font-label-bold text-tertiary">Q${n} \xB7 ${escHtml(label)}</li>`;
      });
      html += "</ul>";
    }
    if (incomplete.length) {
      const sep = isChineseUI(lang) ? "\u3001" : ", ";
      html += `<p class="text-body-sm text-on-surface-variant mt-4">${escHtml(t("summaryIncomplete"))}: ${incomplete.map((x) => "Q" + x).join(sep)}</p>`;
    }
    panel.hidden = false;
    panel.innerHTML = html;
  }

  // ../js/quizExport.js
  function figureExportCaptions(q) {
    if (q.images?.length) {
      return q.images.map((img) => img.caption || img.alt || "see notes");
    }
    if (q.image?.src) {
      return [q.image.caption || q.image.alt || "see notes"];
    }
    return [];
  }
  function fillLineExportHtml(line, answersMode) {
    let html = "";
    line.segments.forEach((seg) => {
      if (seg.type === "text") {
        html += escHtml(seg.value || "");
        return;
      }
      if (answersMode) {
        html += `<b>${escHtml(seg.accept?.[0] || "")}</b>`;
      } else {
        html += "__________";
      }
    });
    return html;
  }
  function buildDocBody(questions, answersMode) {
    let body = "";
    questions.forEach((q, i) => {
      const fmt = questionFormat(q);
      body += `<h2>Q${i + 1} \xB7 ${escHtml(q.section)} \xB7 ${escHtml(q.difficulty)} \xB7 ${escHtml(fmt.toUpperCase())}</h2>`;
      body += `<div class="stem"><b>EN:</b> ${formatStemHtml(q.stem)}</div>`;
      if (q.stemZh) body += `<p><b>\u4E2D\u6587\uFF1A</b> ${escHtml(q.stemZh)}</p>`;
      if (!answersMode) {
        figureExportCaptions(q).forEach((caption) => {
          body += `<p><i>[Diagram: ${escHtml(caption)}]</i></p>`;
        });
      }
      if (!answersMode) {
        if (fmt === "fill" && getFillLines(q).length) {
          if (q.wordBank?.length) {
            body += `<p><i>Word bank:</i> ${escHtml(q.wordBank.join(", "))}</p>`;
          }
          body += "<ol>";
          getFillLines(q).forEach((line) => {
            body += `<li>${fillLineExportHtml(line, answersMode)}</li>`;
          });
          body += "</ol>";
        } else if (q.options?.length) {
          body += "<ul>";
          q.options.forEach((opt) => {
            const zh = opt.textZh ? ` / ${escHtml(opt.textZh)}` : "";
            body += `<li><b>${escHtml(opt.key)}.</b> ${escHtml(opt.text)}${zh}</li>`;
          });
          body += "</ul>";
        }
      }
      if (answersMode) {
        const ma = modelAnswerText(q);
        body += `<p><b>Answer / \u7B54\u6848\uFF1A</b> ${escHtml(ma.en)}</p>`;
        if (ma.zh) body += `<p>${escHtml(ma.zh)}</p>`;
        body += `<p><i>Hint / \u63D0\u793A:</i> ${escHtml(q.hint || "")}</p>`;
      }
    });
    return body;
  }
  function downloadWord(questions, answersMode, lang) {
    if (!questions.length) {
      alert(noQuizAlertMessage(lang));
      return;
    }
    const titleEn = answersMode ? "S3 Optics Ch.3 \u2014 Light & Lens \u2014 Answers" : "S3 Optics Ch.3 \u2014 Light & Lens \u2014 Questions";
    const titleZh = answersMode ? "S3 \u5149\u5B78 \u7B2C\u4E09\u7AE0 \u2014 \u7B54\u6848" : "S3 \u5149\u5B78 \u7B2C\u4E09\u7AE0 \u2014 \u8A66\u984C";
    const body = buildDocBody(questions, answersMode);
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${escHtml(titleEn)}</title></head><body><h1>${escHtml(titleEn)}</h1><h2 style="font-size:14pt">${escHtml(titleZh)}</h2>${body}</body></html>`;
    const blob = new Blob(["\uFEFF", html], { type: "application/msword" });
    const a = document.createElement("a");
    const ts = (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace(/[:T]/g, "-");
    a.href = URL.createObjectURL(blob);
    a.download = (answersMode ? "optics_ch3_answers_" : "optics_ch3_questions_") + ts + ".doc";
    a.click();
    URL.revokeObjectURL(a.href);
  }
  function printSheet(questions, answersMode, lang) {
    if (!questions.length) {
      alert(noQuizAlertMessage(lang));
      return;
    }
    const sheet = document.getElementById("quiz-pdf-sheet");
    if (!sheet) return;
    const titleEn = answersMode ? "S3 Optics Ch.3 \u2014 Light & Lens (Answers)" : "S3 Optics Ch.3 \u2014 Light & Lens (Questions)";
    let html = `<h1>${escHtml(titleEn)}</h1>`;
    html += buildDocBody(questions, answersMode);
    sheet.innerHTML = html;
    window.print();
  }

  // ../js/quizEffects.js
  function animateSplitText(element) {
    if (!element) return;
    const stemBlocks = element.querySelectorAll(":scope > .stem-block");
    if (stemBlocks.length) {
      stemBlocks.forEach((block) => animateSplitText(block));
      return;
    }
    const text = element.textContent?.trim() || "";
    if (!text) return;
    element.classList.remove("reveal");
    element.innerHTML = text.split(/\s+/).map((word, i) => `<span class="split-word" style="transition-delay:${i * 28}ms">${word}</span>`).join(" ");
    requestAnimationFrame(() => {
      setTimeout(() => element.classList.add("reveal"), 40);
    });
  }
  function bindMagnets(root = document) {
    root.querySelectorAll(".magnet-link").forEach((magnet) => {
      magnet.onmousemove = (e) => {
        const rect = magnet.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        magnet.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      };
      magnet.onmouseleave = () => {
        magnet.style.transform = "";
      };
    });
  }
  function bindTrueFocus(container, body = document.body) {
    if (!container) return;
    container.addEventListener("mouseenter", () => body.classList.add("true-focus-active"));
    container.addEventListener("mouseleave", () => body.classList.remove("true-focus-active"));
  }
  function revealQuestionBlocks(root = document) {
    const blocks = root.querySelectorAll?.(".q-block") || [];
    blocks.forEach((block, i) => {
      block.classList.remove("q-visible");
      block.style.transitionDelay = `${Math.min(i * 70, 420)}ms`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => block.classList.add("q-visible"));
      });
    });
  }
  function initSettingsToggle({ layout, panel, btn, icon, label, storageKey = "quiz-settings-open" }) {
    if (!layout || !panel || !btn) return;
    const readOpen = () => {
      try {
        const v = sessionStorage.getItem(storageKey);
        return v === null ? true : v === "1";
      } catch {
        return true;
      }
    };
    let open = readOpen();
    function apply() {
      layout.classList.toggle("settings-collapsed", !open);
      panel.hidden = !open;
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      if (icon) icon.textContent = open ? "chevron_left" : "chevron_right";
      if (label) {
        label.textContent = open ? label.dataset.labelHide || label.getAttribute("data-label-hide") || "Hide settings" : label.dataset.labelShow || label.getAttribute("data-label-show") || "Show settings";
      }
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      try {
        sessionStorage.setItem(storageKey, open ? "1" : "0");
      } catch {
      }
    }
    btn.addEventListener("click", () => {
      open = !open;
      apply();
    });
    apply();
  }

  // ../js/quizApp.js
  var UI = {
    en: {
      appSubtitle: "S3 Optics Ch.3 \xB7 Reflection, refraction, lenses \xB7 English UI",
      hSettings: "Worksheet settings",
      lblTypes: "Topics",
      lblFormats: "Question types",
      bankSummaryTitle: "Question bank (current filters)",
      bankAvailable: "Available to generate",
      bankByTopic: "By topic",
      bankByType: "By question type",
      bankMatrix: "Topic \xD7 type",
      bankNone: "Select at least one topic.",
      lblCount: "Number of questions (1\u201350)",
      lblDiff: "Difficulty",
      lblSeed: "Random seed (optional)",
      btnGenerate: "Generate questions",
      hExport: "Export",
      txtExportHint: "Word: .doc for Microsoft Word. Use Print \u2192 Save as PDF for a PDF copy.",
      btnDocQ: "Word \u2014 Questions",
      btnDocA: "Word \u2014 Answers",
      btnPrint: "Print / Save as PDF",
      hPractice: "On-screen practice",
      txtPracticeHint: "First wrong: hint only. Second wrong: model answer.",
      btnSummary: "Session summary",
      quizCheck: "Check answer",
      empty: "Generate questions first.",
      alertNoQuiz: "Generate questions first.",
      alertNoTypes: "Select at least one topic.",
      alertNoFormats: "Select at least one question type.",
      alertNoMatch: "No questions match your filters.",
      alertPoolLimited: "Only {available} question(s) match your topics (you asked for {requested}). Questions were not repeated.",
      progressNone: "No session yet",
      progressCompletedPrefix: "Completed ",
      correct: "Correct.",
      hintPrefix: "Hint:",
      modelPrefix: "Model answer:",
      printConfirm: "Print ANSWER sheet? (Cancel = questions only)",
      summaryTitle: "Summary",
      summaryScoreLabel: "Score (correct / total)",
      summaryFirstTry: "Correct on first attempt",
      summaryWrongTitle: "Wrong twice \u2014 review these",
      summaryNoneWrong: "None \u2014 no questions failed after two attempts.",
      summaryIncomplete: "Still in progress",
      summaryByTypeTitle: "Correct rate by topic",
      summaryByTypeColType: "Topic",
      summaryByTypeColFraction: "Correct / in topic",
      summaryByTypeColRate: "Rate",
      summaryByTypeColFirst: "First-try / in topic",
      revTitle: "Comments & revision suggestions",
      revBandExcellent: "Overall accuracy is very high. Keep mixing topics so recall stays sharp for HKDSE.",
      revBandGood: "Good result. Use the table above to add a short round on weaker topics.",
      revBandFair: "Mixed performance: re-read weaker Optics Ch.3 topics, then regenerate.",
      revBandLow: "Several concepts need consolidation. Review reflection, Snell's law, total internal reflection, lens ray diagrams, and the lens formula before the next round.",
      revWeakOne: "Prioritise revision on {type} \u2014 you scored {c}/{t} ({pct}%) in that topic.",
      revStrongOne: "Strength: every {type} item correct ({n} questions).",
      revTwoStrike: "Questions missed twice: study the model answers, then regenerate those topics.",
      revIncomplete: "Finish questions still in progress for a fair measure of strengths and gaps.",
      revFirstTryLow: "Many items needed two attempts. Read each stem carefully before answering.",
      revBalanced: "Errors spread across topics \u2014 continue balanced practice.",
      hideSettings: "Hide settings",
      showSettings: "Show settings"
    },
    zh: {
      appSubtitle: "\u6982\u5FF5\u68C0\u67E5 \xB7 \u754C\u9762\u7B80\u4F53\u4E2D\u6587",
      hSettings: "\u5DE5\u4F5C\u7EB8\u8BBE\u5B9A",
      lblTypes: "\u8BFE\u9898",
      lblFormats: "\u9898\u578B",
      bankSummaryTitle: "\u9898\u5E93\uFF08\u4F9D\u76EE\u524D\u7B5B\u9009\uFF09",
      bankAvailable: "\u53EF\u751F\u6210\u9898\u6570",
      bankByTopic: "\u6309\u8BFE\u9898",
      bankByType: "\u6309\u9898\u578B",
      bankMatrix: "\u8BFE\u9898 \xD7 \u9898\u578B",
      bankNone: "\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u4E2A\u8BFE\u9898\u3002",
      lblCount: "\u9898\u6570\uFF081\u201350\uFF09",
      lblDiff: "\u96BE\u5EA6",
      lblSeed: "\u968F\u673A\u79CD\u5B50\uFF08\u53EF\u7559\u7A7A\uFF09",
      btnGenerate: "\u751F\u6210\u9898\u76EE",
      hExport: "\u5BFC\u51FA",
      txtExportHint: "Word\uFF1A\u4E0B\u8F7D .doc \u4EE5 Word \u6253\u5F00\u3002PDF \u8BF7\u7528\u300C\u6253\u5370\u300D\u2192\u300C\u53E6\u5B58 PDF\u300D\u3002",
      btnDocQ: "Word \u2014 \u8BD5\u9898",
      btnDocA: "Word \u2014 \u7B54\u6848",
      btnPrint: "\u6253\u5370\uFF0F\u53E6\u5B58 PDF",
      hPractice: "\u4E92\u52A8\u7EC3\u4E60",
      txtPracticeHint: "\u7B2C\u4E00\u6B21\u7B54\u9519\u53EA\u663E\u793A\u63D0\u793A\uFF1B\u7B2C\u4E8C\u6B21\u7B54\u9519\u663E\u793A\u53C2\u8003\u7B54\u6848\u3002",
      btnSummary: "\u5B66\u4E60\u6458\u8981",
      quizCheck: "\u68C0\u67E5\u7B54\u6848",
      empty: "\u8BF7\u5148\u6309\u300C\u751F\u6210\u9898\u76EE\u300D\u3002",
      alertNoQuiz: "\u8BF7\u5148\u751F\u6210\u9898\u76EE\u3002",
      alertNoTypes: "\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u4E2A\u8BFE\u9898\u3002",
      alertNoFormats: "\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u79CD\u9898\u578B\u3002",
      alertNoMatch: "\u6CA1\u6709\u7B26\u5408\u6761\u4EF6\u7684\u9898\u76EE\u3002",
      alertPoolLimited: "\u7B26\u5408\u8BFE\u9898\u6761\u4EF6\u7684\u53EA\u6709 {available} \u9898\uFF08\u4F60\u8981\u6C42 {requested} \u9898\uFF09\u3002\u4E0D\u4F1A\u91CD\u590D\u51FA\u9898\u3002",
      progressNone: "\u5C1A\u672A\u751F\u6210\u9898\u76EE",
      progressCompletedPrefix: "\u5DF2\u5B8C\u6210 ",
      correct: "\u6B63\u786E\u3002",
      hintPrefix: "\u63D0\u793A\uFF1A",
      modelPrefix: "\u53C2\u8003\u7B54\u6848\uFF1A",
      printConfirm: "\u8981\u6253\u5370\u300C\u7B54\u6848\u7248\u300D\u5417\uFF1F\uFF08\u53D6\u6D88 = \u8BD5\u9898\u7248\uFF09",
      summaryTitle: "\u6458\u8981",
      summaryScoreLabel: "\u5F97\u5206\uFF08\u7B54\u5BF9\uFF0F\u603B\u9898\u6570\uFF09",
      summaryFirstTry: "\u9996\u6B21\u5373\u7B54\u5BF9",
      summaryWrongTitle: "\u4E24\u6B21\u7686\u9519 \u2014 \u9700\u91CD\u6E29",
      summaryNoneWrong: "\u6CA1\u6709\u6B64\u7C7B\u9898\u76EE\u3002",
      summaryIncomplete: "\u5C1A\u672A\u7B54\u5BF9",
      summaryByTypeTitle: "\u5404\u8BFE\u9898\u7B54\u5BF9\u7387",
      summaryByTypeColType: "\u8BFE\u9898",
      summaryByTypeColFraction: "\u7B54\u5BF9\uFF0F\u8BE5\u8BFE\u9898\u9898\u6570",
      summaryByTypeColRate: "\u7B54\u5BF9\u7387",
      summaryByTypeColFirst: "\u9996\u6B21\u5373\u5BF9\uFF0F\u8BE5\u8BFE\u9898\u9898\u6570",
      revTitle: "\u8BC4\u8BED\u4E0E\u6E29\u4E60\u5EFA\u8BAE",
      revBandExcellent: "\u6574\u4F53\u7B54\u5BF9\u7387\u5F88\u9AD8\u3002\u5EFA\u8BAE\u6301\u7EED\u6DF7\u5408\u5404\u8BFE\u9898\u7EC3\u4E60\u3002",
      revBandGood: "\u6574\u4F53\u8868\u73B0\u4E0D\u9519\u3002\u53EF\u9488\u5BF9\u8F83\u5F31\u8BFE\u9898\u52A0\u505A\u4E00\u8F6E\u3002",
      revBandFair: "\u8868\u73B0\u53C2\u5DEE\uFF1A\u8BF7\u91CD\u6E29\u76F8\u5173\u7B14\u8BB0\u540E\u518D\u751F\u6210\u9898\u76EE\u3002",
      revBandLow: "\u591A\u4E2A\u6982\u5FF5\u4ECD\u9700\u5DE9\u56FA\u3002\u8BF7\u5148\u6E29\u4E60\u6D41\u52A8\u9576\u5D4C\u3001\u6E17\u900F\u6027\u3001\u6E17\u900F\u4E0E\u4E3B\u52A8\u8FD0\u8F93\u3002",
      revWeakOne: "\u5EFA\u8BAE\u4F18\u5148\u6E29\u4E60\u300C{type}\u300D\uFF1A\u672C\u6B21 {c}/{t}\uFF08{pct}%\uFF09\u3002",
      revStrongOne: "\u5F3A\u9879\uFF1A\u300C{type}\u300D\u672C\u6B21\u5168\u5BF9\uFF08\u5171 {n} \u9898\uFF09\u3002",
      revTwoStrike: "\u66FE\u4E24\u6B21\u7B54\u9519\u7684\u9898\u76EE\uFF1A\u8BF7\u7EC6\u8BFB\u53C2\u8003\u7B54\u6848\u540E\u518D\u7EC3\u3002",
      revIncomplete: "\u5C1A\u6709\u672A\u7B54\u5BF9\u9898\u76EE\uFF0C\u5EFA\u8BAE\u5148\u5B8C\u6210\u3002",
      revFirstTryLow: "\u4E0D\u5C11\u9898\u76EE\u9700\u7B2C\u4E8C\u6B21\u624D\u7B54\u5BF9\u3002\u4F5C\u7B54\u524D\u5B9C\u653E\u6162\u9605\u8BFB\u9898\u5E72\u3002",
      revBalanced: "\u9519\u8BEF\u5206\u6563\u5728\u4E0D\u540C\u8BFE\u9898\uFF0C\u5B9C\u5747\u8861\u7EC3\u4E60\u3002",
      hideSettings: "\u9690\u85CF\u8BBE\u5B9A",
      showSettings: "\u663E\u793A\u8BBE\u5B9A"
    },
    "zh-Hant": {
      appSubtitle: "\u6982\u5FF5\u6AA2\u67E5 \xB7 \u4ECB\u9762\u7E41\u9AD4\u4E2D\u6587",
      hSettings: "\u5DE5\u4F5C\u7D19\u8A2D\u5B9A",
      lblTypes: "\u8AB2\u984C",
      lblFormats: "\u984C\u578B",
      bankSummaryTitle: "\u984C\u5EAB\uFF08\u4F9D\u76EE\u524D\u7BE9\u9078\uFF09",
      bankAvailable: "\u53EF\u7522\u751F\u984C\u6578",
      bankByTopic: "\u6309\u8AB2\u984C",
      bankByType: "\u6309\u984C\u578B",
      bankMatrix: "\u8AB2\u984C \xD7 \u984C\u578B",
      bankNone: "\u8ACB\u81F3\u5C11\u9078\u64C7\u4E00\u500B\u8AB2\u984C\u3002",
      lblCount: "\u984C\u6578\uFF081\u201350\uFF09",
      lblDiff: "\u96E3\u5EA6",
      lblSeed: "\u96A8\u6A5F\u7A2E\u5B50\uFF08\u53EF\u7559\u7A7A\uFF09",
      btnGenerate: "\u7522\u751F\u984C\u76EE",
      hExport: "\u532F\u51FA",
      txtExportHint: "Word\uFF1A\u4E0B\u8F09 .doc \u4EE5 Word \u958B\u555F\u3002PDF \u8ACB\u7528\u300C\u5217\u5370\u300D\u2192\u300C\u53E6\u5B58 PDF\u300D\u3002",
      btnDocQ: "Word \u2014 \u8A66\u984C",
      btnDocA: "Word \u2014 \u7B54\u6848",
      btnPrint: "\u5217\u5370\uFF0F\u53E6\u5B58 PDF",
      hPractice: "\u4E92\u52D5\u7DF4\u7FD2",
      txtPracticeHint: "\u7B2C\u4E00\u6B21\u7B54\u932F\u53EA\u986F\u793A\u63D0\u793A\uFF1B\u7B2C\u4E8C\u6B21\u7B54\u932F\u986F\u793A\u53C3\u8003\u7B54\u6848\u3002",
      btnSummary: "\u5B78\u7FD2\u6458\u8981",
      quizCheck: "\u6AA2\u67E5\u7B54\u6848",
      empty: "\u8ACB\u5148\u6309\u300C\u7522\u751F\u984C\u76EE\u300D\u3002",
      alertNoQuiz: "\u8ACB\u5148\u7522\u751F\u984C\u76EE\u3002",
      alertNoTypes: "\u8ACB\u81F3\u5C11\u9078\u64C7\u4E00\u500B\u8AB2\u984C\u3002",
      alertNoFormats: "\u8ACB\u81F3\u5C11\u9078\u64C7\u4E00\u7A2E\u984C\u578B\u3002",
      alertNoMatch: "\u6C92\u6709\u7B26\u5408\u689D\u4EF6\u7684\u984C\u76EE\u3002",
      alertPoolLimited: "\u7B26\u5408\u8AB2\u984C\u689D\u4EF6\u7684\u53EA\u6709 {available} \u984C\uFF08\u4F60\u8981\u6C42 {requested} \u984C\uFF09\u3002\u4E0D\u6703\u91CD\u8907\u51FA\u984C\u3002",
      progressNone: "\u5C1A\u672A\u7522\u751F\u984C\u76EE",
      progressCompletedPrefix: "\u5DF2\u5B8C\u6210 ",
      correct: "\u6B63\u78BA\u3002",
      hintPrefix: "\u63D0\u793A\uFF1A",
      modelPrefix: "\u53C3\u8003\u7B54\u6848\uFF1A",
      printConfirm: "\u8981\u5217\u5370\u300C\u7B54\u6848\u7248\u300D\u55CE\uFF1F\uFF08\u53D6\u6D88 = \u8A66\u984C\u7248\uFF09",
      summaryTitle: "\u6458\u8981",
      summaryScoreLabel: "\u5F97\u5206\uFF08\u7B54\u5C0D\uFF0F\u7E3D\u984C\u6578\uFF09",
      summaryFirstTry: "\u9996\u6B21\u5373\u7B54\u5C0D",
      summaryWrongTitle: "\u5169\u6B21\u7686\u932F \u2014 \u9700\u91CD\u6EAB",
      summaryNoneWrong: "\u6C92\u6709\u6B64\u985E\u984C\u76EE\u3002",
      summaryIncomplete: "\u5C1A\u672A\u7B54\u5C0D",
      summaryByTypeTitle: "\u5404\u8AB2\u984C\u7B54\u5C0D\u7387",
      summaryByTypeColType: "\u8AB2\u984C",
      summaryByTypeColFraction: "\u7B54\u5C0D\uFF0F\u8A72\u8AB2\u984C\u984C\u6578",
      summaryByTypeColRate: "\u7B54\u5C0D\u7387",
      summaryByTypeColFirst: "\u9996\u6B21\u5373\u5C0D\uFF0F\u8A72\u8AB2\u984C\u984C\u6578",
      revTitle: "\u8A55\u8A9E\u8207\u6EAB\u7FD2\u5EFA\u8B70",
      revBandExcellent: "\u6574\u9AD4\u7B54\u5C0D\u7387\u5F88\u9AD8\u3002\u5EFA\u8B70\u6301\u7E8C\u6DF7\u5408\u5404\u8AB2\u984C\u7DF4\u7FD2\u3002",
      revBandGood: "\u6574\u9AD4\u8868\u73FE\u4E0D\u932F\u3002\u53EF\u91DD\u5C0D\u8F03\u5F31\u8AB2\u984C\u52A0\u505A\u4E00\u8F2A\u3002",
      revBandFair: "\u8868\u73FE\u53C3\u5DEE\uFF1A\u8ACB\u91CD\u6EAB\u76F8\u95DC\u7B46\u8A18\u5F8C\u518D\u7522\u751F\u984C\u76EE\u3002",
      revBandLow: "\u591A\u500B\u6982\u5FF5\u4ECD\u9700\u978F\u56FA\u3002\u8ACB\u5148\u6EAB\u7FD2\u6D41\u52D5\u9472\u5D4C\u3001\u6EF2\u900F\u6027\u3001\u6EF2\u900F\u8207\u4E3B\u52D5\u904B\u8F38\u3002",
      revWeakOne: "\u5EFA\u8B70\u512A\u5148\u6EAB\u7FD2\u300C{type}\u300D\uFF1A\u672C\u6B21 {c}/{t}\uFF08{pct}%\uFF09\u3002",
      revStrongOne: "\u5F37\u9805\uFF1A\u300C{type}\u300D\u672C\u6B21\u5168\u5C0D\uFF08\u5171 {n} \u984C\uFF09\u3002",
      revTwoStrike: "\u66FE\u5169\u6B21\u7B54\u932F\u7684\u984C\u76EE\uFF1A\u8ACB\u7D30\u8B80\u53C3\u8003\u7B54\u6848\u5F8C\u518D\u7DF4\u3002",
      revIncomplete: "\u5C1A\u6709\u672A\u7B54\u5C0D\u984C\u76EE\uFF0C\u5EFA\u8B70\u5148\u5B8C\u6210\u3002",
      revFirstTryLow: "\u4E0D\u5C11\u984C\u76EE\u9700\u7B2C\u4E8C\u6B21\u624D\u7B54\u5C0D\u3002\u4F5C\u7B54\u524D\u5B9C\u653E\u6162\u95B1\u8B80\u984C\u5E79\u3002",
      revBalanced: "\u932F\u8AA4\u5206\u6563\u5728\u4E0D\u540C\u8AB2\u984C\uFF0C\u5B9C\u5747\u8861\u7DF4\u7FD2\u3002",
      hideSettings: "\u96B1\u85CF\u8A2D\u5B9A",
      showSettings: "\u986F\u793A\u8A2D\u5B9A"
    }
  };
  function initQuiz() {
    let lang = resolveQuizLang();
    let lastQuestions = [];
    const attemptMap = /* @__PURE__ */ new Map();

    const QUIZ_META = { subject: "PHY", quizId: "phy-optics-ch3" };
    function getOptionOrTableText(q, key) {
      if (key === undefined || key === null) return null;
      const opt = q.options?.find((o) => o.key === key);
      if (opt) return opt.text || null;
      const row = q.optionTable?.rows?.find((r) => r.key === key);
      if (row) {
        const cells = (row.cells || []).join(" ");
        return cells ? `${row.key}. ${cells}` : row.key;
      }
      return null;
    }

    function reportPhyAttempt(q, isCorrect, state) {
      try {
        let selectedAnswerText = getOptionOrTableText(q, state.selected);
        if (!selectedAnswerText) {
          if (state.fillValues) {
            selectedAnswerText = state.fillValues.filter(Boolean).join(" / ") || null;
          } else if (state.typeinValue !== undefined && state.typeinValue !== null && state.typeinValue !== "") {
            selectedAnswerText = String(state.typeinValue);
          }
        }

        let correctAnswerText = getOptionOrTableText(q, q.answer);
        if (!correctAnswerText) {
          try {
            const ma = modelAnswerText(q);
            correctAnswerText = ma?.en || null;
          } catch (_) {}
        }

        const payload = {
          type: "uniplus:quizAnswer",
          subject: QUIZ_META.subject,
          quizId: QUIZ_META.quizId,
          questionId: String(q.id),
          section: q.section || null,
          difficulty: q.difficulty || null,
          stem: q.stem || null,
          selectedAnswer: state.selected !== undefined && state.selected !== null ? String(state.selected) : (state.fillValues ? JSON.stringify(state.fillValues) : null),
          selectedAnswerText,
          correctAnswer: q.answer !== undefined ? String(q.answer) : null,
          correctAnswerText,
          isCorrect: !!isCorrect,
          attemptNumber: state.wrong + 1,
          msTaken: 0
        };
        window.parent.postMessage(payload, "*");
        if (window.top !== window.parent) {
          try { window.top.postMessage(payload, "*"); } catch (_) {}
        }
      } catch (_) {}
    }
    const t = (key) => UI[lang]?.[key] || UI.en[key] || key;
    const els = {
      typeChecks: document.getElementById("quiz-type-checks"),
      bankSummary: document.getElementById("quiz-bank-summary"),
      numCount: document.getElementById("quiz-num-count"),
      quizArea: document.getElementById("quiz-area"),
      summaryPanel: document.getElementById("summary-panel"),
      progressText: document.getElementById("quiz-progress-text"),
      progressBar: document.getElementById("quiz-progress-bar"),
      quizContainer: document.getElementById("quiz-container")
    };
    if (!els.quizArea) return;
    function applyLang() {
      document.documentElement.lang = lang;
      document.querySelectorAll("[data-i18n]").forEach((node) => {
        const key = node.getAttribute("data-i18n");
        if (UI[lang]?.[key] || UI.en[key]) node.textContent = t(key);
      });
      const toggleLabel = document.getElementById("settings-toggle-label");
      if (toggleLabel) {
        toggleLabel.dataset.labelHide = t("hideSettings");
        toggleLabel.dataset.labelShow = t("showSettings");
        const layout = document.getElementById("quiz-layout");
        const open = layout && !layout.classList.contains("settings-collapsed");
        toggleLabel.textContent = open ? t("hideSettings") : t("showSettings");
      }
      initMeta();
      const pageTitle = document.getElementById("page-title");
      if (pageTitle) {
        pageTitle.textContent = t("hPractice");
        animateSplitText(pageTitle);
      }
      if (lastQuestions.length) renderQuiz();
      if (els.summaryPanel && !els.summaryPanel.hidden && lastQuestions.length) {
        renderSessionSummary({
          questions: lastQuestions,
          attemptMap,
          panel: els.summaryPanel,
          t,
          lang
        });
      }
    }
    function applyEffectsAfterRender() {
      bindMagnets(els.quizArea);
      revealQuestionBlocks(els.quizArea);
      els.quizArea.querySelectorAll(".split-text-target").forEach((node) => animateSplitText(node));
    }
    function getFilterState() {
      return {
        sections: selectedSections(),
        formats: ["mcq"],
        difficulty: "all"
      };
    }
    function updateBankSummary() {
      if (!els.bankSummary) return;
      const { sections } = getFilterState();
      if (!sections.length) {
        els.bankSummary.innerHTML = `<p class="font-label-bold text-on-surface mb-1">${escHtml(t("bankSummaryTitle"))}</p><p class="text-on-surface-variant">${escHtml(t("bankNone"))}</p>`;
        return;
      }
      const pool = filterQuizPool(QUIZ_ITEMS, getFilterState());
      const stats = buildQuizBankStats(pool, sections, ["mcq"]);
      const topicRows = sections.map((sid) => {
        const sec = QUIZ_SECTIONS.find((s) => s.id === sid);
        const label = sec ? isChineseUI(lang) ? sec.labelZh : sec.label : sid;
        const n = stats.bySection[sid] || 0;
        return `<li class="flex justify-between gap-2"><span>${escHtml(label)}</span><span class="font-label-bold tabular-nums">${n}</span></li>`;
      }).join("");
      els.bankSummary.innerHTML = `
      <p class="font-label-bold text-on-surface mb-2">${escHtml(t("bankSummaryTitle"))}</p>
      <p class="text-on-surface-variant text-[11px] uppercase tracking-wide mb-0.5">${escHtml(t("bankAvailable"))}</p>
      <p class="bank-available tabular-nums mb-4">${stats.total}</p>
      <div>
        <p class="font-label-bold text-on-surface-variant text-[11px] uppercase tracking-wide mb-2">${escHtml(t("bankByTopic"))}</p>
        <ul class="space-y-1 text-on-surface">${topicRows}</ul>
      </div>`;
    }
    function bindFilterListeners() {
      const panel = document.getElementById("settings-panel");
      if (!panel || panel.dataset.bankListeners === "1") return;
      panel.dataset.bankListeners = "1";
      panel.addEventListener("change", (e) => {
        if (e.target?.matches?.("#quiz-type-checks input")) updateBankSummary();
      });
    }
    function initMeta() {
      if (els.typeChecks) {
        els.typeChecks.innerHTML = QUIZ_SECTIONS.map((sec) => {
          const label = isChineseUI(lang) ? sec.labelZh : sec.label;
          return `
        <label class="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 cursor-pointer">
          <input type="checkbox" class="rounded border-outline-variant text-primary focus:ring-primary" value="${sec.id}" checked />
          <span class="text-body-sm text-on-surface flex-1">${escHtml(label)}</span>
        </label>`;
        }).join("");
      }
      bindFilterListeners();
      updateBankSummary();
    }
    function selectedSections() {
      return Array.from(els.typeChecks?.querySelectorAll("input:checked") || []).map((x) => x.value);
    }
    function generate() {
      const sections = selectedSections();
      if (!sections.length) {
        alert(t("alertNoTypes"));
        return;
      }
      const count = Math.min(50, Math.max(1, Number(els.numCount?.value) || 10));
      const seed = String(Date.now());
      const pool = filterQuizPool(QUIZ_ITEMS, getFilterState());
      if (!pool.length) {
        alert(t("alertNoMatch"));
        return;
      }
      const shuffled = seededShuffle(pool, seed);
      const take = Math.min(count, shuffled.length);
      lastQuestions = shuffled.slice(0, take);
      if (take < count) {
        alert(
          t("alertPoolLimited").replace("{available}", String(take)).replace("{requested}", String(count))
        );
      }
      attemptMap.clear();
      lastQuestions.forEach((q) => {
        const state = { wrong: 0, solved: false, selected: null };
        if (questionFormat(q) === "fill" && countFillBlanks(q) > 0) {
          state.fillValues = Array(countFillBlanks(q)).fill("");
        }
        attemptMap.set(q.id, state);
      });
      if (els.summaryPanel) {
        els.summaryPanel.hidden = true;
        els.summaryPanel.innerHTML = "";
      }
      updateProgress();
      renderQuiz();
    }
    function updateProgress() {
      if (!lastQuestions.length) {
        if (els.progressText) els.progressText.textContent = t("progressNone");
        if (els.progressBar) els.progressBar.style.width = "0%";
        return;
      }
      let done = 0;
      lastQuestions.forEach((q) => {
        const st = attemptMap.get(q.id);
        if (st?.solved) done += 1;
      });
      if (els.progressText) {
        els.progressText.textContent = t("progressCompletedPrefix") + done + " / " + lastQuestions.length;
      }
      if (els.progressBar) {
        els.progressBar.style.width = `${done / lastQuestions.length * 100}%`;
      }
    }
    function renderQuiz() {
      const el = els.quizArea;
      if (!lastQuestions.length) {
        el.className = "quiz-empty text-center text-on-surface-variant py-12 text-body-sm";
        el.textContent = t("empty");
        return;
      }
      el.className = "space-y-5";
      el.innerHTML = "";
      lastQuestions.forEach((q, idx) => {
        const st = attemptMap.get(q.id) || { wrong: 0, solved: false, selected: null };
        const wrap = document.createElement("article");
        wrap.className = "q-block p-5 md:p-6 rounded-2xl bg-surface border border-outline-variant/25 shadow-sm";
        wrap.id = "q-block-" + q.id;
        const head = document.createElement("div");
        head.className = "text-[11px] font-label-bold uppercase tracking-wide text-on-surface-variant mb-3";
        head.textContent = "Q" + (idx + 1) + " \xB7 " + sectionLabel(q.section, lang).toUpperCase() + " \xB7 " + formatTypeLabel(q) + " \xB7 " + q.difficulty.toUpperCase();
        wrap.appendChild(head);
        const figures = q.images?.length ? q.images : q.image?.src ? [q.image] : [];
        figures.forEach((img) => {
          const fig = document.createElement("figure");
          fig.className = "quiz-fig mb-4";
          fig.innerHTML = `<img src="${escHtml(img.src)}" alt="${escHtml(img.alt || "")}" loading="lazy" />
          <figcaption class="text-body-sm text-on-surface-variant mt-2">${escHtml(img.caption || "")}</figcaption>`;
          wrap.appendChild(fig);
        });
        const stem = document.createElement("div");
        stem.className = "font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-4";
        stem.innerHTML = formatStemHtml(q.stem);
        wrap.appendChild(stem);
        if (q.stemZh) {
          const stemZh = document.createElement("p");
          stemZh.className = "text-body-sm text-on-surface-variant mb-4";
          stemZh.textContent = q.stemZh;
          wrap.appendChild(stemZh);
        }
        const fmt = questionFormat(q);
        const optionButtons = [];
        const fillInputs = [];
        if (fmt === "fill" && countFillBlanks(q) > 0) {
          if (q.wordBank?.length) {
            const bank = document.createElement("p");
            bank.className = "text-body-sm text-on-surface-variant mb-4 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20";
            bank.innerHTML = `<strong>Word bank:</strong> ${escHtml(q.wordBank.join(" \xB7 "))}`;
            wrap.appendChild(bank);
          }
          const fillWrap = document.createElement("div");
          fillWrap.className = "space-y-4 mb-4";
          let blankIndex = 0;
          getFillLines(q).forEach((line) => {
            const row = document.createElement("div");
            row.className = "fill-line flex flex-wrap items-baseline gap-x-2 gap-y-2 text-body-sm text-on-surface leading-relaxed";
            line.segments.forEach((seg) => {
              if (seg.type === "text") {
                const span = document.createElement("span");
                span.className = "fill-line-text whitespace-pre-wrap";
                span.textContent = seg.value || "";
                row.appendChild(span);
                return;
              }
              const inp = document.createElement("input");
              inp.type = "text";
              inp.autocomplete = "off";
              inp.className = "fill-inline-input shrink-0 min-w-[7rem] sm:min-w-[8.5rem] max-w-[12rem] px-3 py-2 rounded-lg border-2 border-outline-variant/30 bg-surface text-on-surface text-body-sm focus:border-primary focus:ring-1 focus:ring-primary align-baseline";
              inp.disabled = st.solved;
              const bi = blankIndex;
              inp.value = st.fillValues?.[bi] || "";
              inp.addEventListener("input", () => {
                const state = attemptMap.get(q.id) || { wrong: 0, solved: false, fillValues: [] };
                if (!state.fillValues) state.fillValues = Array(countFillBlanks(q)).fill("");
                state.fillValues[bi] = inp.value;
                attemptMap.set(q.id, state);
              });
              row.appendChild(inp);
              fillInputs.push(inp);
              blankIndex += 1;
            });
            fillWrap.appendChild(row);
          });
          wrap.appendChild(fillWrap);
        } else if (q.options?.length) {
          const og = document.createElement("div");
          og.className = "grid grid-cols-1 gap-3 mb-4";
          q.options.forEach((opt) => {
            const magnet = document.createElement("div");
            magnet.className = "magnet-link group";
            const btnOpt = document.createElement("button");
            btnOpt.type = "button";
            btnOpt.className = "quiz-option w-full text-left p-4 md:p-5 rounded-2xl border-2 border-outline-variant/20 bg-surface hover:border-primary hover:bg-primary-fixed transition-all flex items-center gap-4 relative disabled:opacity-60";
            btnOpt.dataset.key = opt.key;
            btnOpt.disabled = st.solved;
            const badge = document.createElement("span");
            badge.className = "w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-surface-container-high font-label-bold group-hover:bg-primary group-hover:text-on-primary transition-colors";
            badge.textContent = opt.key;
            const text = document.createElement("span");
            text.className = "font-body-md text-on-surface flex-1 text-left";
            text.innerHTML = `${escHtml(opt.text)}${opt.textZh ? `<span class="block text-body-sm text-on-surface-variant mt-1">${escHtml(opt.textZh)}</span>` : ""}`;
            btnOpt.appendChild(badge);
            btnOpt.appendChild(text);
            magnet.appendChild(btnOpt);
            og.appendChild(magnet);
            optionButtons.push(btnOpt);
            if (!st.solved) {
              btnOpt.addEventListener("click", () => {
                optionButtons.forEach((b) => {
                  b.classList.remove("border-primary", "bg-primary-fixed/30", "shadow-sm", "border-tertiary", "bg-tertiary/10");
                  b.classList.add("border-outline-variant/20", "bg-surface");
                  const bd = b.querySelector("span:first-child");
                  bd?.classList.remove("bg-primary", "text-on-primary", "bg-tertiary");
                  bd?.classList.add("bg-surface-container-high");
                });
                btnOpt.classList.add("border-primary", "bg-primary-fixed/30", "shadow-sm");
                btnOpt.classList.remove("border-outline-variant/20", "bg-surface");
                badge.classList.add("bg-primary", "text-on-primary");
                badge.classList.remove("bg-surface-container-high");
                const state = attemptMap.get(q.id) || { wrong: 0, solved: false, selected: null };
                state.selected = opt.key;
                attemptMap.set(q.id, state);
                wrap.dataset.selected = opt.key;
              });
            } else if (opt.key === q.answer) {
              btnOpt.classList.add("border-secondary", "bg-secondary/10");
              badge.classList.add("bg-secondary", "text-on-secondary");
            }
          });
          wrap.appendChild(og);
          if (st.selected) {
            const sel = optionButtons.find((b) => b.dataset.key === st.selected);
            if (sel && !st.solved) {
              sel.classList.add("border-primary", "bg-primary-fixed/30", "shadow-sm");
              sel.classList.remove("border-outline-variant/20", "bg-surface");
              const bd = sel.querySelector("span:first-child");
              bd?.classList.add("bg-primary", "text-on-primary");
            }
          }
        }
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "px-8 py-3 rounded-full bg-primary text-on-primary font-label-bold text-body-sm hover:opacity-90 transition-opacity disabled:opacity-50";
        btn.textContent = t("quizCheck");
        btn.disabled = st.solved;
        const fb = document.createElement("div");
        fb.className = "mt-3 text-body-sm hidden";
        fb.setAttribute("role", "status");
        const showModelAnswer = () => {
          const ma = modelAnswerText(q);
          fb.className = "mt-3 text-body-sm p-3 rounded-xl bg-tertiary/10 text-tertiary border border-tertiary/25";
          fb.innerHTML = `<strong>${escHtml(t("modelPrefix"))}</strong> ${escHtml(ma.en)}${ma.zh ? `<span class="block mt-1 text-on-surface-variant">${escHtml(ma.zh)}</span>` : ""}`;
        };
        btn.addEventListener("click", () => {
          const state = attemptMap.get(q.id) || { wrong: 0, solved: false, selected: null };
          if (state.solved) return;
          let ok = false;
          if (fmt === "fill" && countFillBlanks(q) > 0) {
            const values = fillInputs.map((inp) => inp.value);
            state.fillValues = values;
            if (values.some((v) => !String(v).trim())) return;
            ok = allFillFieldsCorrect(q, values);
          } else {
            const selected = state.selected;
            if (!selected) return;
            ok = selected === q.answer;
          }
          fb.classList.remove("hidden");
          if (ok) {
            state.solved = true;
            attemptMap.set(q.id, state);
            reportPhyAttempt(q, true, state);
            fb.className = "mt-3 text-body-sm p-3 rounded-xl bg-secondary/10 text-secondary font-label-bold";
            fb.textContent = t("correct");
            btn.disabled = true;
            optionButtons.forEach((b) => {
              b.disabled = true;
              if (b.dataset.key === q.answer) {
                b.classList.add("border-secondary", "bg-secondary/10");
              }
            });
            fillInputs.forEach((inp) => {
              inp.disabled = true;
              inp.classList.add("border-secondary/50", "bg-secondary/5");
            });
            updateProgress();
            return;
          }
          state.wrong += 1;
          attemptMap.set(q.id, state);
          if (fmt !== "fill") {
            const wrongBtn = optionButtons.find((b) => b.dataset.key === state.selected);
            wrongBtn?.classList.add("border-tertiary", "bg-tertiary/10");
          } else {
            fillInputs.forEach((inp) => inp.classList.add("border-tertiary"));
          }
          if (state.wrong === 1) {
            fb.className = "mt-3 text-body-sm p-3 rounded-xl bg-primary-fixed/50 text-on-surface border border-primary/20";
            fb.innerHTML = `<strong>${escHtml(t("hintPrefix"))}</strong> ${escHtml(q.hint || "")}`;
          } else {
            state.solved = true;
            attemptMap.set(q.id, state);
            reportPhyAttempt(q, false, state);
            showModelAnswer();
            btn.disabled = true;
            optionButtons.forEach((b) => {
              b.disabled = true;
              if (b.dataset.key === q.answer) {
                b.classList.add("border-tertiary", "bg-tertiary/10");
              }
            });
            fillInputs.forEach((inp) => {
              inp.disabled = true;
            });
            updateProgress();
          }
        });
        wrap.appendChild(btn);
        wrap.appendChild(fb);
        if (st.solved && st.wrong > 0 && st.wrong < 2) {
          fb.classList.remove("hidden");
          fb.className = "mt-3 text-body-sm p-3 rounded-xl bg-primary-fixed/50 text-on-surface border border-primary/20";
          fb.innerHTML = `<strong>${escHtml(t("hintPrefix"))}</strong> ${escHtml(q.hint || "")}`;
        }
        if (st.solved && st.wrong >= 2) {
          fb.classList.remove("hidden");
          showModelAnswer();
          btn.disabled = true;
        }
        el.appendChild(wrap);
      });
      applyEffectsAfterRender();
    }
    document.getElementById("btn-generate")?.addEventListener("click", generate);
    document.getElementById("btn-summary")?.addEventListener("click", () => {
      if (!els.summaryPanel) return;
      renderSessionSummary({
        questions: lastQuestions,
        attemptMap,
        panel: els.summaryPanel,
        t,
        lang
      });
    });
    document.getElementById("btn-doc-q")?.addEventListener("click", () => downloadWord(lastQuestions, false, lang));
    document.getElementById("btn-doc-a")?.addEventListener("click", () => downloadWord(lastQuestions, true, lang));
    document.getElementById("btn-print")?.addEventListener("click", () => {
      if (!lastQuestions.length) {
        alert(t("alertNoQuiz"));
        return;
      }
      const want = confirm(t("printConfirm"));
      printSheet(lastQuestions, want, lang);
    });
    function syncLangFromParent() {
      const next = resolveQuizLang();
      if (next === lang) return;
      lang = next;
      applyLang();
    }
    try {
      const observer = new MutationObserver(syncLangFromParent);
      observer.observe(window.parent.document.documentElement, {
        attributes: true,
        attributeFilter: ["lang"]
      });
      if (window.parent.document.readyState === "complete") {
        syncLangFromParent();
      } else {
        window.parent.addEventListener("load", syncLangFromParent, { once: true });
      }
    } catch (_) {
    }
    requestAnimationFrame(syncLangFromParent);
    bindFilterListeners();
    applyLang();
    els.quizArea.textContent = t("empty");
    els.quizArea.className = "quiz-empty text-center text-on-surface-variant py-12 text-body-sm";
    bindTrueFocus(els.quizContainer);
    initSettingsToggle({
      layout: document.getElementById("quiz-layout"),
      panel: document.getElementById("settings-panel"),
      btn: document.getElementById("btn-toggle-settings"),
      icon: document.getElementById("settings-toggle-icon"),
      label: document.getElementById("settings-toggle-label")
    });
  }
  document.addEventListener("DOMContentLoaded", () => initQuiz());
})();
