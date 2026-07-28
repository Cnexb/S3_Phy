(() => {
  // js/quizData.js
  var QUIZ_SECTIONS = [
    {
      "id": "em-waves",
      "label": "EM waves",
      "labelZh": "\u96FB\u78C1\u6CE2"
    }
  ];
  var QUIZ_ITEMS = [
    { "id": "ch4-q01", "section": "em-waves", "difficulty": "Standard", "stem": "Student draws the electromagnetic spectrum. However, the part for X-ray is missing. Where should the part for X-ray be?", "options": [{ "key": "A", "text": "P" }, { "key": "B", "text": "Q" }, { "key": "C", "text": "R" }, { "key": "D", "text": "S" }], "answer": "D", "hint": "Student draws the electromagnetic spectrum. However, the part for X-ray is missing. Where should the part for X-ray be?", "image": { "src": "./assets/ch4-q01.png", "alt": "Diagram for ch4-q01", "caption": "Fig - ch4-q01" } },
    { "id": "ch4-q02", "section": "em-waves", "difficulty": "Standard", "stem": "Which of the following shows the correct order of five electromagnetic waves arranged in the order of decreasing frequency?", "options": [{ "key": "A", "text": "X-rays, infra-red, microwaves, radio waves, ultraviolet" }, { "key": "B", "text": "Ultra-violet, infra-red, radio waves, X-rays, microwaves" }, { "key": "C", "text": "Radio waves, microwaves, ultraviolet, infra-red, X-rays" }, { "key": "D", "text": "X-rays, ultraviolet, infra-red, microwaves, radio waves" }], "answer": "D", "hint": "Which of the following shows the correct order of five electromagnetic waves arranged in the order of decreasing frequency?" },
    { "id": "ch4-q03", "section": "em-waves", "difficulty": "Standard", "stem": "Which of the following statements about electromagnetic waves is/are correct?\n\n(1) The speeds of electromagnetic waves are equal to the speed of light.\n\n(2) All kinds of electromagnetic waves can travel in a vacuum.\n\n(3) Electromagnetic waves are transverse waves.", "options": [{ "key": "A", "text": "(1) only" }, { "key": "B", "text": "(2) only" }, { "key": "C", "text": "(1) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "D", "hint": "Which of the following statements about electromagnetic waves is/are correct?\n\n(1) The speeds of electromagnetic waves are equal to the speed of light.\n\n(2) All kinds of electromagnetic waves can travel in a vacuum.\n\n(3) Electromagnetic waves are transverse waves." },
    { "id": "ch4-q04", "section": "em-waves", "difficulty": "Standard", "stem": "Which of the following is not an application of microwaves?", "options": [{ "key": "A", "text": "Radar" }, { "key": "B", "text": "Microwave oven" }, { "key": "C", "text": "Satellite communication" }, { "key": "D", "text": "Thermometer" }], "answer": "D", "hint": "Which of the following is not an application of microwaves?" },
    { "id": "ch4-q05", "section": "em-waves", "difficulty": "Standard", "stem": "Which of the following is not an application of infrared radiation?", "options": [{ "key": "A", "text": "Thermometer" }, { "key": "B", "text": "Auto-focus camera" }, { "key": "C", "text": "Laser pointer" }, { "key": "D", "text": "Electric oven" }], "answer": "C" },
    { "id": "ch4-q06", "section": "em-waves", "difficulty": "Standard", "stem": "Which of the following type of electromagnetic waves is best used for killing cancer cells?", "options": [{ "key": "A", "text": "Gamma rays" }, { "key": "B", "text": "Infrared radiation" }, { "key": "C", "text": "Visible light" }, { "key": "D", "text": "Ultraviolet radiation" }], "answer": "A", "hint": "Which of the following type of electromagnetic waves is best used for killing cancer cells?" },
    { "id": "ch4-q07", "section": "em-waves", "difficulty": "Standard", "stem": "Which of the following correctly shows the uses of microwaves, radio waves and ultraviolet radiation? Microwaves, Radio waves, Ultraviolet radiation", "options": [{ "key": "A", "text": "Radar, Burglar alarm, Medical diagnosis" }, { "key": "B", "text": "Communication, TV broadcast, Checking banknote" }, { "key": "C", "text": "Tracer, Sterilizing water, Remote control" }, { "key": "D", "text": "Cooking, Radiotherapy, Thermography" }], "answer": "B", "hint": "Which of the following correctly shows the uses of microwaves, radio waves and ultraviolet radiation? Microwaves, Radio waves, Ultraviolet radiation" },
    { "id": "ch4-q08", "section": "em-waves", "difficulty": "Standard", "stem": "Given the following types of electromagnetic waves\n\n(1) radio waves\n\n(2) yellow\n\n(3) green light\n\nThe waves listed in ascending order of their wavelength are", "options": [{ "key": "A", "text": "(1), (3), (2)" }, { "key": "B", "text": "(2), (1), (3)" }, { "key": "C", "text": "(3), (1), (2)" }, { "key": "D", "text": "(3), (2), (1)" }], "answer": "D" },
    { "id": "ch4-q09", "section": "em-waves", "difficulty": "Standard", "stem": "Arrange the following electromagnetic waves in descending order of their wavelength.\n\n(1) visible\n\n(2) X-rays\n\n(3) radio waves", "options": [{ "key": "A", "text": "(1), (3), (2)" }, { "key": "B", "text": "(2), (3), (1)" }, { "key": "C", "text": "(3), (1), (2)" }, { "key": "D", "text": "(3), (2), (1)" }], "answer": "C" },
    { "id": "ch4-q10", "section": "em-waves", "difficulty": "Standard", "stem": "The diagram shows part of the electromagnetic spectrum.\n\nWhich of the following statements is/are true?\n\n(1) The wavelength of P is longer than that of Q.\n\n(2) The velocity of P in a vacuum is smaller than that of Q.\n\n(3) Q can be deflected by an electric field.", "options": [{ "key": "A", "text": "(1) only" }, { "key": "B", "text": "(3) only" }, { "key": "C", "text": "(1) and (2) only" }, { "key": "D", "text": "(2) and (3) only" }], "answer": "A", "image": { "src": "./assets/ch4-q10.png", "alt": "Diagram for ch4-q10", "caption": "Fig - ch4-q10" } },
    { "id": "ch4-q11", "section": "em-waves", "difficulty": "Standard", "stem": "(1) X-rays\n\n(2) Ultra-violet rays.\n\n(3) Radio waves\n\nArrange the above electromagnetic waves in ascending order of frequencies.", "options": [{ "key": "A", "text": "(1)\u3001(3)\u3001(2)" }, { "key": "B", "text": "(2)\u3001(1)\u3001(3)" }, { "key": "C", "text": "(3)\u3001(1)\u3001(2)" }, { "key": "D", "text": "(3)\u3001(2)\u3001(1)" }], "answer": "D" },
    { "id": "ch4-q12", "section": "em-waves", "difficulty": "Standard", "stem": "Which of the following statements concerning infra-red radiation is correct?", "options": [{ "key": "A", "text": "Infra-red can be detected by a Geiger-Muller counter." }, { "key": "B", "text": "Infra-red can be used to sterilizing drinking water." }, { "key": "C", "text": "Infra-red is a longitudinal wave." }, { "key": "D", "text": "Warm objects emit infra-red." }], "answer": "D" },
    { "id": "ch4-q13", "section": "em-waves", "difficulty": "Standard", "stem": "Part of the electromagnetic spectrum is shown above.\n\nWhich of the following statements is/are correct?\n\n(1) P is ultra-violet and Q is infra-red.\n\n(2) The wavelength of P is shorter than that of Q.\n\n(3) The speed of P in vacuum is higher than that of Q.", "options": [{ "key": "A", "text": "(1) only" }, { "key": "B", "text": "(3) only" }, { "key": "C", "text": "(1) and (2) only" }, { "key": "D", "text": "(2) and (3) only" }], "answer": "C", "image": { "src": "./assets/ch4-q13.png", "alt": "Diagram for ch4-q13", "caption": "Fig - ch4-q13" } },
    { "id": "ch4-q14", "section": "em-waves", "difficulty": "Standard", "stem": "Which of the following is not an application of the corresponding electromagnetic wave? Electromagnetic wave, Application", "options": [{ "key": "A", "text": "Ultra-violet, Camera autofocusing" }, { "key": "B", "text": "Infra-red, Detecting survivors buried in landslides" }, { "key": "C", "text": "Microwaves, Satellite communication" }, { "key": "D", "text": "X-rays, Detecting weapons hidden in suitcases" }], "answer": "A" },
    { "id": "ch4-q15", "section": "em-waves", "difficulty": "Standard", "stem": "Which of the following is an application of ultra-violet radiation?", "options": [{ "key": "A", "text": "Detecting cracks in railway tracks" }, { "key": "B", "text": "Detecting survivors buried in landslides" }, { "key": "C", "text": "Measurement of the depth of the sea-bed" }, { "key": "D", "text": "Sterilization of drinking water" }], "answer": "D" },
    { "id": "ch4-q16", "section": "em-waves", "difficulty": "Standard", "stem": "Which of the following is/are the reason(s) for not over-using ultra-violet lamps to produce a suntan effect?\n\n(1) Ultra-violet radiation is highly penetrating and will damage body tissue.\n\n(2) Ultra-violet radiation has a strong heating effect and will damage body tissue.\n\n(3) Over exposure to ultra-violet radiation may cause skin cancer.", "options": [{ "key": "A", "text": "(2) only" }, { "key": "B", "text": "(3) only" }, { "key": "C", "text": "(1) and (2) only" }, { "key": "D", "text": "(1) and (3) only" }], "answer": "B" },
    { "id": "ch4-q17", "section": "em-waves", "difficulty": "Standard", "stem": "The photograph shows a digital video camera recorder. The recorder has a nightshot function for capturing images in the dark. Which of the following electromagnetic waves is employed by the recorder in capturing images in the dark?", "options": [{ "key": "A", "text": "radio waves" }, { "key": "B", "text": "infra-red" }, { "key": "C", "text": "ultra-violet" }, { "key": "D", "text": "X-rays" }], "answer": "B", "image": { "src": "./assets/ch4-q17.png", "alt": "Diagram for ch4-q17", "caption": "Fig - ch4-q17" } },
    { "id": "ch4-q18", "section": "em-waves", "difficulty": "Standard", "stem": "Which of the following shows the correct order of the relative positions of five electromagnetic waves in the electromagnetic spectrum, in the order of decreasing wavelength?", "options": [{ "key": "A", "text": "microwaves, infra-red, visible light, ultra-violet, X-rays" }, { "key": "B", "text": "microwaves, ultra-violet, visible light, infra-red, X-rays" }, { "key": "C", "text": "X-rays, infra-red, visible light, ultra-violet, microwaves" }, { "key": "D", "text": "X-rays, ultra-violet, visible light, infra-red, microwaves" }], "answer": "A" },
    { "id": "ch4-q19", "section": "em-waves", "difficulty": "Standard", "stem": "Which of the following phenomena demonstrate(s) that light is an electromagnetic wave?\n\n(1) Light bends when it travels across a boundary from one medium into another.\n\n(2) Light reflects when it meets a polished metal surface.\n\n(3) Light can travel from the Sun to the Earth.", "options": [{ "key": "A", "text": "(1) only" }, { "key": "B", "text": "(3) only" }, { "key": "C", "text": "(1) and (2) only" }, { "key": "D", "text": "(2) and (3) only" }], "answer": "B" },
    { "id": "ex-q01", "section": "em-waves", "difficulty": "Applied", "stem": "Which of the following statements about X-rays is/are correct?\n\n(1) They can be deflected by an electric field.\n\n(2) They consist of a stream of electrons.\n\n(3) They may affect a photographic plate.", "options": [{ "key": "A", "text": "(1) only" }, { "key": "B", "text": "(3) only" }, { "key": "C", "text": "(1) and (2) only" }, { "key": "D", "text": "(2) and (3) only" }], "answer": "B", "hint": "Which of the following statements about X-rays is/are correct?\n\n(1) They can be deflected by an electric field.\n\n(2) They consist of a stream of electrons.\n\n(3) They may affect a photographic plate." },
    { "id": "ex-q02", "section": "em-waves", "difficulty": "Applied", "stem": "Arrange the following electromagnetic waves in descending order of their wavelength.\n\n(1) visible\n\n(2) X-rays\n\n(3) radio waves", "options": [{ "key": "A", "text": "(1), (3), (2)" }, { "key": "B", "text": "(2), (3), (1)" }, { "key": "C", "text": "(3), (1), (2)" }, { "key": "D", "text": "(3), (2), (1)" }], "answer": "C" },
    { "id": "ex-q03", "section": "em-waves", "difficulty": "Applied", "stem": "Which of the following statements concerning infra-red radiation is correct?", "options": [{ "key": "A", "text": "Infra-red can be detected by a Geiger-Muller counter." }, { "key": "B", "text": "Infra-red can be used to sterilizing drinking water." }, { "key": "C", "text": "Infra-red is a longitudinal wave." }, { "key": "D", "text": "Warm objects emit infra-red." }], "answer": "D", "hint": "Which of the following statements concerning infra-red radiation is correct?" },
    { "id": "ex-q04", "section": "em-waves", "difficulty": "Applied", "stem": "Which of the following is not an application of the corresponding electromagnetic wave? Electromagnetic wave, Application", "options": [{ "key": "A", "text": "Ultra-violet, Camera autofocusing" }, { "key": "B", "text": "Infra-red, Detecting survivors buried in landslides" }, { "key": "C", "text": "Microwaves, Satellite communication" }, { "key": "D", "text": "Detecting weapons hidden in suitcases" }], "answer": "A", "hint": "Which of the following is not an application of the corresponding electromagnetic wave? Electromagnetic wave" },
    { "id": "ex-q05", "section": "em-waves", "difficulty": "Applied", "stem": "Which of the following is/are the reason(s) for not over-using ultra-violet lamps to produce a suntan effect?\n\n(1) Ultra-violet radiation is highly penetrating and will damage body tissue.\n\n(2) Ultra-violet radiation has a strong heating effect and will damage body tissue.\n\n(3) Over exposure to ultra-violet radiation may cause skin cancer.", "options": [{ "key": "A", "text": "(2) only" }, { "key": "B", "text": "(3) only" }, { "key": "C", "text": "(1) and (2) only" }, { "key": "D", "text": "(1) and (3) only" }], "answer": "B" },
    { "id": "ex-q07", "section": "em-waves", "difficulty": "Applied", "stem": "Given the following types of electromagnetic waves\n\n(1) radio waves\n\n(2) yellow\n\n(3) green light\n\nThe waves listed in ascending order of their wavelength are", "options": [{ "key": "A", "text": "(1), (3), (2)" }, { "key": "B", "text": "(2), (1), (3)" }, { "key": "C", "text": "(3), (1), (2)" }, { "key": "D", "text": "(3), (2), (1)" }], "answer": "D", "hint": "Given the following types of electromagnetic waves\n\n(1) radio waves\n\n(2) yellow\n\n(3) green light\n\nThe waves listed in ascending order of their wavelength are" },
    { "id": "ex-q08", "section": "em-waves", "difficulty": "Applied", "stem": "The diagram shows part of the electromagnetic spectrum.\n\nWhich of the following statements is/are true?\n\n(1) The wavelength of P is longer than that of Q.\n\n(2) The velocity of P in a vacuum is smaller than that of Q.\n\n(3) Q can be deflected by an electric field.", "options": [{ "key": "A", "text": "(1) only" }, { "key": "B", "text": "(3) only" }, { "key": "C", "text": "(1) and (2) only" }, { "key": "D", "text": "(2) and (3) only" }], "answer": "A", "hint": "The diagram shows part of the electromagnetic spectrum.\n\nWhich of the following statements is/are true?\n\n(1) The wavelength of P is longer than that of Q.\n\n(2) The velocity of P in a vacuum is smaller than that of Q.\n\n(3) Q can be deflected by an electric field." },
    { "id": "ex-q09", "section": "em-waves", "difficulty": "Applied", "stem": "(1) X-rays\n\n(2) Ultra-violet rays.\n\n(3) Radio waves\n\nArrange the above electromagnetic waves in ascending order of frequencies.", "options": [{ "key": "A", "text": "(1)\u3001(3)\u3001(2)" }, { "key": "B", "text": "(2)\u3001(1)\u3001(3)" }, { "key": "C", "text": "(3)\u3001(1)\u3001(2)" }, { "key": "D", "text": "(3)\u3001(2)\u3001(1)" }], "answer": "D", "hint": "(1) X-rays\n\n(2) Ultra-violet rays.\n\n(3) Radio waves" },
    { "id": "ex-q10", "section": "em-waves", "difficulty": "Applied", "stem": "Part of the electromagnetic spectrum is shown above.\n\nWhich of the following statements is/are correct?\n\n(1) P is ultra-violet and Q is infra-red.\n\n(2) The wavelength of P is shorter than that of Q.\n\n(3) The speed of P in vacuum is higher than that of Q.", "options": [{ "key": "A", "text": "(1) only" }, { "key": "B", "text": "(3) only" }, { "key": "C", "text": "(1) and (2) only" }, { "key": "D", "text": "(2) and (3) only" }], "answer": "C", "image": { "src": "./assets/ex-q10.png", "alt": "Diagram for ex-q10", "caption": "Fig - ex-q10" } },
    { "id": "ex-q11", "section": "em-waves", "difficulty": "Applied", "stem": "Which of the following is an application of ultra-violet radiation?", "options": [{ "key": "A", "text": "Detecting cracks in railway tracks" }, { "key": "B", "text": "Detecting survivors buried in landslides" }, { "key": "C", "text": "Measurement of the depth of the sea-bed" }, { "key": "D", "text": "Sterilization of drinking water" }], "answer": "D", "hint": "Which of the following is an application of ultra-violet radiation?" },
    { "id": "ex-q12", "section": "em-waves", "difficulty": "Applied", "stem": "Which of the following statements about infra-red radiation is/are correct?\n\n(1) It bends towards the normal when it travels from air to water.\n\n(2) It travels faster in water than in air.\n\n(3) It is used for satellite communication.", "options": [{ "key": "A", "text": "(1) only" }, { "key": "B", "text": "(3) only" }, { "key": "C", "text": "(1) and (2) only" }, { "key": "D", "text": "(2) and (3) only" }], "answer": "A", "hint": "Which of the following statements about infra-red radiation is/are correct?\n\n(1) It bends towards the normal when it travels from air to water.\n\n(2) It travels faster in water than in air.\n\n(3) It is used for satellite communication." },
    { "id": "ex-q13", "section": "em-waves", "difficulty": "Applied", "stem": "Which description below is INCORRECT ?", "options": [{ "key": "A", "text": "Microwaves are a kind of electromagnetic waves." }, { "key": "B", "text": "Microwaves can be observed with the naked eye." }, { "key": "C", "text": "Microwaves propagate with the speed of light in a vacuum." }, { "key": "D", "text": "Microwaves are used in radar to detect the position of an aeroplane." }], "answer": "B", "hint": "Which description below is INCORRECT ?" },
    { "id": "ex-q14", "section": "em-waves", "difficulty": "Standard", "stem": "Student draws the electromagnetic spectrum. However, the part for X-ray is missing. Where should the part for X-ray be?", "options": [{ "key": "A", "text": "P" }, { "key": "B", "text": "Q" }, { "key": "C", "text": "R" }, { "key": "D", "text": "S" }], "answer": "D", "hint": "Student draws the electromagnetic spectrum. However, the part for X-ray is missing. Where should the part for X-ray be?", "image": { "src": "./assets/ex-q14.png", "alt": "Diagram for ex-q14", "caption": "Fig - ex-q14" } },
    { "id": "ex-q15", "section": "em-waves", "difficulty": "Standard", "stem": "Which of the following shows the correct order of five electromagnetic waves arranged in the order of decreasing frequency?", "options": [{ "key": "A", "text": "X-rays, infra-red, microwaves, radio waves, ultraviolet" }, { "key": "B", "text": "Ultra-violet, infra-red, radio waves, X-rays, microwaves" }, { "key": "C", "text": "Radio waves, microwaves, ultraviolet, infra-red, X-rays" }, { "key": "D", "text": "X-rays, ultraviolet, infra-red, microwaves, radio waves" }], "answer": "D", "hint": "Which of the following shows the correct order of five electromagnetic waves arranged in the order of decreasing frequency?" },
    { "id": "ex-q16", "section": "em-waves", "difficulty": "Standard", "stem": "Which of the following statements about electromagnetic waves is/are correct?\n\n(1) The speeds of electromagnetic waves are equal to the speed of light.\n\n(2) All kinds of electromagnetic waves can travel in a vacuum.\n\n(3) Electromagnetic waves are transverse waves.", "options": [{ "key": "A", "text": "(1) only" }, { "key": "B", "text": "(2) only" }, { "key": "C", "text": "(1) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "D" },
    { "id": "ex-q17", "section": "em-waves", "difficulty": "Standard", "stem": "Which of the following statements about electromagnetic waves is INCORRECT?", "options": [{ "key": "A", "text": "They can transmit energy through a vacuum." }, { "key": "B", "text": "They travel with the same speed in all media." }, { "key": "C", "text": "They are transverse waves in the electric and magnetic fields." }, { "key": "D", "text": "They all show reflection, refraction, interference and diffraction." }], "answer": "B", "hint": "Which of the following statements about electromagnetic waves is INCORRECT?" },
    { "id": "ex-q18", "section": "em-waves", "difficulty": "Standard", "stem": "Which of the following is not an application of microwaves?", "options": [{ "key": "A", "text": "Radar" }, { "key": "B", "text": "Microwave oven" }, { "key": "C", "text": "Satellite communication" }, { "key": "D", "text": "Thermometer" }], "answer": "D", "hint": "Which of the following is not an application of microwaves?" },
    { "id": "ex-q19", "section": "em-waves", "difficulty": "Standard", "stem": "Which of the following is not an application of infrared radiation?", "options": [{ "key": "A", "text": "Thermometer" }, { "key": "B", "text": "Auto-focus camera" }, { "key": "C", "text": "Laser pointer" }, { "key": "D", "text": "Electric oven" }], "answer": "C", "hint": "Which of the following is not an application of infrared radiation?" },
    { "id": "ex-q20", "section": "em-waves", "difficulty": "Standard", "stem": "Which of the following are applications of ultraviolet radiation?\n\n(1) Sterilization of water\n\n(2) Remote control\n\n(3) Checking of banknote", "options": [{ "key": "A", "text": "(1) and (2) only" }, { "key": "B", "text": "(1) and (3) only" }, { "key": "C", "text": "(2) and (3) only" }, { "key": "D", "text": "(1), (2) and (3)" }], "answer": "B", "hint": "Which of the following are applications of ultraviolet radiation?\n\n(1) Sterilization of water\n\n(2) Remote control\n\n(3) Checking of banknote" },
    { "id": "ex-q21", "section": "em-waves", "difficulty": "Standard", "stem": "Which of the following type of electromagnetic waves is best used for killing cancer cells?", "options": [{ "key": "A", "text": "Gamma rays" }, { "key": "B", "text": "Infrared radiation" }, { "key": "C", "text": "Visible light" }, { "key": "D", "text": "Ultraviolet radiation" }], "answer": "A", "hint": "Which of the following type of electromagnetic waves is best used for killing cancer cells?" },
    { "id": "ex-q22", "section": "em-waves", "difficulty": "Standard", "stem": "Which of the following correctly shows the uses of microwaves, radio waves and ultraviolet radiation? Microwaves, Radio waves, Ultraviolet radiation", "options": [{ "key": "A", "text": "Radar, Burglar alarm, Medical diagnosis" }, { "key": "B", "text": "Communication, TV broadcast, Checking banknote" }, { "key": "C", "text": "Tracer, Sterilizing water, Remote control" }, { "key": "D", "text": "Cooking, Radiotherapy, Thermography" }], "answer": "B", "hint": "Which of the following correctly shows the uses of microwaves, radio waves and ultraviolet radiation? Microwaves, Radio waves, Ultraviolet radiation" },
    { "id": "ch4-q20", "section": "em-waves", "difficulty": "Standard", "stem": "Figure below shows part of the electromagnetic spectrum.", "format": "fill", "lines": [{ "segments": [{ "type": "text", "value": "(a) Which one has the longest wavelength, P, Q, R or S? " }, { "type": "blank", "accept": ["P"] }] }, { "segments": [{ "type": "text", "value": "(b) Which one has the highest speed in a vacuum? " }, { "type": "blank", "accept": ["same", "Same", "the same"] }] }, { "segments": [{ "type": "text", "value": "(c) What is the speed of Q in a vacuum? " }, { "type": "blank", "accept": ["3\xD710^8 m s^-1", "3\xD710^(8) m s^(-1)", "3\xD710^8 m/s", "3 x 10^8 m s^-1", "3 x 10^8 m s-1", "3 x 10^8 m/s", "3\xD710^8 ms-1", "3\xD710^8 ms^-1", "3\xD710^(8) ms^(-1)", "3 x 10^8 ms^-1"] }] }, { "segments": [{ "type": "text", "value": "(d) Name P: " }, { "type": "blank", "accept": ["infared", "infrared", "infra-red", "infared radiation", "infrared radiation", "infra-red radiation"] }, { "type": "text", "value": " ; Name S: " }, { "type": "blank", "accept": ["ultraviolet", "ultra-violet", "ultraviolet radiation", "ultra-violet radiation"] }] }], "hint": "All EM waves travel at the same speed c in vacuum. Wavelength increases toward the red end of the diagram.", "image": { "src": "./assets/ch4-q20.png", "alt": "Diagram for ch4-q20", "caption": "Fig - ch4-q20" } },
    { "id": "ch4-q21", "section": "em-waves", "difficulty": "Standard", "stem": "The electromagnetic spectrum is shown in the figure (radio waves, X, infra-red, visible light, Y, X-rays, Z).", "format": "fill", "lines": [{ "segments": [{ "type": "text", "value": "(a) X = " }, { "type": "blank", "accept": ["microwave", "microwaves"] }, { "type": "text", "value": " ; Y = " }, { "type": "blank", "accept": ["ultraviolet", "ultra-violet", "ultraviolet radiation"] }, { "type": "text", "value": " ; Z = " }, { "type": "blank", "accept": ["gamma rays", "gamma ray", "gamma radiation", "gamma"] }] }, { "segments": [{ "type": "text", "value": "(b)(i) Shortest wavelength: " }, { "type": "blank", "accept": ["gamma rays", "gamma", "Z", "gamma radiation"] }] }, { "segments": [{ "type": "text", "value": "(b)(ii) Lowest frequency: " }, { "type": "blank", "accept": ["radio waves", "radio wave", "radio"] }] }, { "segments": [{ "type": "text", "value": "(c) One application of Z: " }, { "type": "blank", "accept": ["killing cancer cells", "radiotherapy"] }] }], "hint": "Frequency increases toward the gamma-ray end; radio waves have the longest wavelength and lowest frequency.", "image": { "src": "./assets/ch4-q21.png", "alt": "Diagram for ch4-q21", "caption": "Fig - ch4-q21" } }
  ];

  // js/quizUtils.js
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
  var DIFFICULTY_LEVELS = [
    { id: "all", labelEn: "All levels", labelZh: "\u5168\u90E8\u96E3\u5EA6" },
    { id: "easy", labelEn: "Easy", labelZh: "\u6613" },
    { id: "medium", labelEn: "Medium", labelZh: "\u4E2D" },
    { id: "hard", labelEn: "Hard", labelZh: "\u96E3" }
  ];
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
  function questionFormat(q) {
    return q.format || "mcq";
  }
  var QUIZ_FORMAT_FILTERS = [
    { id: "mcq", labelEn: "Multiple choice", labelZh: "\u9078\u64C7\u984C", labelZhHans: "\u9009\u62E9\u9898" },
    { id: "fill", labelEn: "Fill in the blanks", labelZh: "\u586B\u5145\u984C", labelZhHans: "\u586B\u7A7A\u9898" }
  ];
  function formatFilterLabel(filter, lang) {
    if (lang === "zh") return filter.labelZhHans || filter.labelZh;
    if (lang === "zh-Hant") return filter.labelZh;
    return filter.labelEn;
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
    return String(s || "").trim().toLowerCase().replace(/×/g, "x").replace(/\^\s*\(\s*-\s*1\s*\)/g, "^-1").replace(/\^\s*\(\s*(\d+)\s*\)/g, "^$1").replace(/ms(\^-1|-1)/g, "m s$1").replace(/m s-1/g, "m s^-1").replace(/\s+/g, " ").replace(/[.,;]/g, "");
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

  // js/quizSummary.js
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

  // js/quizExport.js
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
      body += `<p><b>EN:</b> ${escHtml(q.stem)}</p>`;
      if (q.stemZh) body += `<p><b>\u4E2D\u6587\uFF1A</b> ${escHtml(q.stemZh)}</p>`;
      if (q.image?.src && !answersMode) {
        body += `<p><i>[Diagram: ${escHtml(q.image.caption || q.image.alt || "see notes")}]</i></p>`;
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
    const titleEn = answersMode ? "Ch 3.7 Refraction \u2014 Answers" : "Ch 3.7 Refraction \u2014 Questions";
    const titleZh = answersMode ? "\u7B2C\u4E09\u7AE0 3.7 \u6298\u5C04 \u2014 \u7B54\u6848" : "\u7B2C\u4E09\u7AE0 3.7 \u6298\u5C04 \u2014 \u8A66\u984C";
    const body = buildDocBody(questions, answersMode);
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${escHtml(titleEn)}</title></head><body><h1>${escHtml(titleEn)}</h1><h2 style="font-size:14pt">${escHtml(titleZh)}</h2>${body}</body></html>`;
    const blob = new Blob(["\uFEFF", html], { type: "application/msword" });
    const a = document.createElement("a");
    const ts = (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace(/[:T]/g, "-");
    a.href = URL.createObjectURL(blob);
    a.download = (answersMode ? "refraction_answers_" : "refraction_questions_") + ts + ".doc";
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
    const titleEn = answersMode ? "Ch 3.7 Refraction (Answers)" : "Ch 3.7 Refraction (Questions)";
    let html = `<h1>${escHtml(titleEn)}</h1>`;
    html += buildDocBody(questions, answersMode);
    sheet.innerHTML = html;
    window.print();
  }

  // js/quizEffects.js
  function animateSplitText(element) {
    if (!element) return;
    const text = element.textContent?.trim() || "";
    if (!text) return;
    element.classList.remove("reveal");
    let delay = 0;
    const paragraphs = text.split(/\n\n+/);
    element.innerHTML = paragraphs.map((para, pi) => {
      const words = para.trim().split(/\s+/).filter(Boolean);
      const html = words.map((word) => {
        const span = `<span class="split-word" style="transition-delay:${delay * 28}ms">${word}</span>`;
        delay += 1;
        return span;
      }).join(" ");
      return pi < paragraphs.length - 1 ? html + "<br><br>" : html;
    }).join("");
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

  // js/quizApp.js
  var UI = {
    en: {
      appSubtitle: "S3 Optics Ch.4 \u2014 EM waves, spectrum & applications \u2014 English UI",
      hSettings: "Worksheet settings",
      lblTypes: "Topics",
      lblFormats: "Question types",
      bankSummaryTitle: "Question bank (current filters)",
      bankAvailable: "Available to generate",
      bankByTopic: "By topic",
      bankByType: "By question type",
      bankMatrix: "Topic \xD7 type",
      bankNone: "Select at least one topic and one question type.",
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
      alertPoolLimited: "Only {available} question(s) match your topics, question types, and difficulty (you asked for {requested}). Questions were not repeated.",
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
      revBandFair: "Mixed performance: re-read weaker Ch.4 EM wave topics, then regenerate.",
      revBandLow: "Several concepts need consolidation. Review EM wave nature, the spectrum order, band properties, and applications/safety before the next round.",
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
      bankNone: "\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u4E2A\u8BFE\u9898\u548C\u4E00\u79CD\u9898\u578B\u3002",
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
      alertPoolLimited: "\u7B26\u5408\u8BFE\u9898\u3001\u9898\u578B\u4E0E\u96BE\u5EA6\u6761\u4EF6\u7684\u53EA\u6709 {available} \u9898\uFF08\u4F60\u8981\u6C42 {requested} \u9898\uFF09\u3002\u4E0D\u4F1A\u91CD\u590D\u51FA\u9898\u3002",
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
      revBandLow: "\u591A\u4E2A\u6982\u5FF5\u4ECD\u9700\u5DE9\u56FA\u3002\u8BF7\u5148\u6E29\u4E60\u7535\u78C1\u6CE2\u6027\u8D28\u3001\u7535\u78C1\u6CE2\u8C31\u6B21\u5E8F\u3001\u5404\u6CE2\u6BB5\u7279\u6027\uFF0C\u4EE5\u53CA\u5E94\u7528\u4E0E\u5B89\u5168\u3002",
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
      appSubtitle: "\u4E2D\u4E09\u5149\u5B78 \u7B2C4\u7AE0 \u96FB\u78C1\u6CE2 \u2014 \u7E41\u9AD4\u4E2D\u6587\u4ECB\u9762",
      hSettings: "\u5DE5\u4F5C\u7D19\u8A2D\u5B9A",
      lblTypes: "\u8AB2\u984C",
      lblFormats: "\u984C\u578B",
      bankSummaryTitle: "\u984C\u5EAB\uFF08\u4F9D\u76EE\u524D\u7BE9\u9078\uFF09",
      bankAvailable: "\u53EF\u7522\u751F\u984C\u6578",
      bankByTopic: "\u6309\u8AB2\u984C",
      bankByType: "\u6309\u984C\u578B",
      bankMatrix: "\u8AB2\u984C \xD7 \u984C\u578B",
      bankNone: "\u8ACB\u81F3\u5C11\u9078\u64C7\u4E00\u500B\u8AB2\u984C\u548C\u4E00\u7A2E\u984C\u578B\u3002",
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
      alertPoolLimited: "\u7B26\u5408\u8AB2\u984C\u3001\u984C\u578B\u8207\u96E3\u5EA6\u689D\u4EF6\u7684\u53EA\u6709 {available} \u984C\uFF08\u4F60\u8981\u6C42 {requested} \u984C\uFF09\u3002\u4E0D\u6703\u91CD\u8907\u51FA\u984C\u3002",
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
      revBandFair: "\u8868\u73FE\u53C3\u5DEE\uFF1A\u8ACB\u5148\u6EAB\u7FD2\u8F03\u5F31\u7684\u7B2C4\u7AE0\u96FB\u78C1\u6CE2\u8AB2\u984C\uFF0C\u518D\u91CD\u65B0\u51FA\u984C\u3002",
      revBandLow: "\u591A\u500B\u6982\u5FF5\u4ECD\u9700\u978F\u56FA\u3002\u8ACB\u5148\u6EAB\u7FD2\u96FB\u78C1\u6CE2\u6027\u8CEA\u3001\u96FB\u78C1\u8B5C\u6B21\u5E8F\u3001\u5404\u6CE2\u6BB5\u7279\u6027\uFF0C\u4EE5\u53CA\u61C9\u7528\u8207\u5B89\u5168\uFF0C\u518D\u9032\u884C\u4E0B\u4E00\u8F2A\u3002",
      revWeakOne: "\u5EFA\u8B70\u512A\u5148\u6EAB\u7FD2\u300C{type}\u300D\uFF1A\u672C\u984C\u5F97\u5206 {c}/{t}\uFF08{pct}%\uFF09\u3002",
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

    const QUIZ_META = { subject: "PHY", quizId: "phy-optics-ch4-em-wave" };
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
      formatChecks: document.getElementById("quiz-format-checks"),
      bankSummary: document.getElementById("quiz-bank-summary"),
      numCount: document.getElementById("quiz-num-count"),
      selDiff: document.getElementById("quiz-sel-diff"),
      txtSeed: document.getElementById("quiz-txt-seed"),
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
        formats: selectedFormats(),
        difficulty: els.selDiff?.value || "all"
      };
    }
    function updateBankSummary() {
      if (!els.bankSummary) return;
      const { sections, formats, difficulty } = getFilterState();
      if (!sections.length || !formats.length) {
        els.bankSummary.innerHTML = `<p class="font-label-bold text-on-surface mb-1">${escHtml(t("bankSummaryTitle"))}</p><p class="text-on-surface-variant">${escHtml(t("bankNone"))}</p>`;
        return;
      }
      const pool = filterQuizPool(QUIZ_ITEMS, { sections, formats, difficulty });
      const stats = buildQuizBankStats(pool, sections, formats);
      const topicRows = sections.map((sid) => {
        const sec = QUIZ_SECTIONS.find((s) => s.id === sid);
        const label = sec ? isChineseUI(lang) ? sec.labelZh : sec.label : sid;
        const n = stats.bySection[sid] || 0;
        return `<li class="flex justify-between gap-2"><span>${escHtml(label)}</span><span class="font-label-bold tabular-nums">${n}</span></li>`;
      }).join("");
      const typeRows = formats.map((fid) => {
        const fmt = QUIZ_FORMAT_FILTERS.find((f) => f.id === fid);
        const label = fmt ? formatFilterLabel(fmt, lang) : fid;
        const n = stats.byFormat[fid] || 0;
        return `<li class="flex justify-between gap-2"><span>${escHtml(label)}</span><span class="font-label-bold tabular-nums">${n}</span></li>`;
      }).join("");
      const headCells = formats.map((fid) => {
        const fmt = QUIZ_FORMAT_FILTERS.find((f) => f.id === fid);
        const short = fid === "mcq" ? "MCQ" : fid === "tf" ? "T/F" : fid === "fill" ? "Fill" : fid;
        const title = fmt ? formatFilterLabel(fmt, lang) : short;
        return `<th scope="col" title="${escHtml(title)}">${escHtml(short)}</th>`;
      }).join("");
      const bodyRows = sections.map((sid) => {
        const sec = QUIZ_SECTIONS.find((s) => s.id === sid);
        const label = sec ? isChineseUI(lang) ? sec.labelZh : sec.label : sid;
        const cells = formats.map((fid) => {
          const n = stats.matrix[sid]?.[fid] || 0;
          const cls = n > 0 ? "cell-hit" : "cell-zero";
          return `<td class="${cls}">${n}</td>`;
        }).join("");
        return `<tr><th scope="row">${escHtml(label)}</th>${cells}</tr>`;
      }).join("");
      els.bankSummary.innerHTML = `
      <p class="font-label-bold text-on-surface mb-2">${escHtml(t("bankSummaryTitle"))}</p>
      <p class="text-on-surface-variant text-[11px] uppercase tracking-wide mb-0.5">${escHtml(t("bankAvailable"))}</p>
      <p class="bank-available tabular-nums mb-4">${stats.total}</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <p class="font-label-bold text-on-surface-variant text-[11px] uppercase tracking-wide mb-2">${escHtml(t("bankByTopic"))}</p>
          <ul class="space-y-1 text-on-surface">${topicRows}</ul>
        </div>
        <div>
          <p class="font-label-bold text-on-surface-variant text-[11px] uppercase tracking-wide mb-2">${escHtml(t("bankByType"))}</p>
          <ul class="space-y-1 text-on-surface">${typeRows}</ul>
        </div>
      </div>
      <p class="font-label-bold text-on-surface-variant text-[11px] uppercase tracking-wide mb-2">${escHtml(t("bankMatrix"))}</p>
      <div class="overflow-x-auto -mx-1 px-1">
        <table class="quiz-bank-matrix">
          <thead><tr><th scope="col"></th>${headCells}</tr></thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>`;
    }
    function bindFilterListeners() {
      const panel = document.getElementById("settings-panel");
      if (!panel || panel.dataset.bankListeners === "1") return;
      panel.dataset.bankListeners = "1";
      panel.addEventListener("change", (e) => {
        const t2 = e.target;
        if (t2?.matches?.("#quiz-type-checks input, #quiz-format-checks input") || t2?.id === "quiz-sel-diff") {
          updateBankSummary();
        }
      });
    }
    function initMeta() {
      if (els.selDiff) {
        els.selDiff.innerHTML = DIFFICULTY_LEVELS.map(
          (d) => `<option value="${d.id}">${isChineseUI(lang) ? d.labelZh : d.labelEn}</option>`
        ).join("");
      }
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
      if (els.formatChecks) {
        els.formatChecks.innerHTML = QUIZ_FORMAT_FILTERS.map((fmt) => {
          const label = formatFilterLabel(fmt, lang);
          return `
        <label class="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 cursor-pointer">
          <input type="checkbox" class="rounded border-outline-variant text-primary focus:ring-primary" value="${fmt.id}" checked />
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
    function selectedFormats() {
      return Array.from(els.formatChecks?.querySelectorAll("input:checked") || []).map((x) => x.value);
    }
    function generate() {
      const sections = selectedSections();
      if (!sections.length) {
        alert(t("alertNoTypes"));
        return;
      }
      const formats = selectedFormats();
      if (!formats.length) {
        alert(t("alertNoFormats"));
        return;
      }
      const count = Math.min(50, Math.max(1, Number(els.numCount?.value) || 10));
      const diffFilter = els.selDiff?.value || "all";
      const seed = els.txtSeed?.value || "";
      const pool = filterQuizPool(QUIZ_ITEMS, {
        sections,
        formats,
        difficulty: diffFilter
      });
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
      const firstOpen = lastQuestions.find((q) => !attemptMap.get(q.id)?.solved);
      lastQuestions.forEach((q, idx) => {
        const st = attemptMap.get(q.id) || { wrong: 0, solved: false, selected: null };
        const wrap = document.createElement("article");
        wrap.className = "q-block p-5 md:p-6 rounded-2xl bg-surface border border-outline-variant/25 shadow-sm";
        wrap.id = "q-block-" + q.id;
        const head = document.createElement("div");
        head.className = "text-[11px] font-label-bold uppercase tracking-wide text-on-surface-variant mb-3";
        head.textContent = "Q" + (idx + 1) + " \xB7 " + sectionLabel(q.section, lang).toUpperCase() + " \xB7 " + formatTypeLabel(q) + " \xB7 " + q.difficulty.toUpperCase();
        wrap.appendChild(head);
        if (q.image?.src) {
          const fig = document.createElement("figure");
          fig.className = "quiz-fig mb-4";
          fig.innerHTML = `<img src="${escHtml(q.image.src)}" alt="${escHtml(q.image.alt || "")}" loading="lazy" />
          <figcaption class="text-body-sm text-on-surface-variant mt-2">${escHtml(q.image.caption || "")}</figcaption>`;
          wrap.appendChild(fig);
        }
        const stem = document.createElement("p");
        stem.className = "split-text-target font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1 leading-tight whitespace-pre-line";
        stem.textContent = q.stem;
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
