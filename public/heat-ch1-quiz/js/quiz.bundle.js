(() => {
  // public/heat-ch1-quiz/js/quizData.js
  var QUIZ_SECTIONS = [
    { id: "thermometer", label: "Thermometer", labelZh: "\u6EAB\u5EA6\u8A08" },
    { id: "heat-internal-energy", label: "Heat and internal energy", labelZh: "\u71B1\u8207\u5167\u80FD" },
    { id: "change-of-state", label: "Change of state", labelZh: "\u7269\u614B\u8B8A\u5316" },
    { id: "heat-transfer", label: "Heat transfer", labelZh: "\u71B1\u50B3\u905E" }
  ];
  var QUIZ_ITEMS = [
    {
      id: "therm-q01",
      section: "thermometer",
      difficulty: "Foundation",
      stem: "Which of the following thermometers measures temperature by detecting the intensity of radiation?",
      options: [
        { key: "A", text: "Liquid-in-glass thermometer" },
        { key: "B", text: "Resistance thermometer" },
        { key: "C", text: "Thermistor thermometer" },
        { key: "D", text: "Infra-red thermometer" }
      ],
      answer: "D",
      hint: "The intensity of infra-red radiation given out by an object increases when its temperature increases."
    },
    {
      id: "therm-q02",
      section: "thermometer",
      difficulty: "Standard",
      stem: "A thermometer makes use of the resistance R of a material to measure temperature. The figure below shows how R varies with temperature T.\n\nWhat is the temperature when R is 100 \u03A9?",
      options: [
        { key: "A", text: "25 \xB0C" },
        { key: "B", text: "45 \xB0C" },
        { key: "C", text: "55 \xB0C" },
        { key: "D", text: "105 \xB0C" }
      ],
      answer: "C",
      hint: "Use linear interpolation on the R\u2013T graph between the marked points.",
      image: {
        src: "./assets/therm-q02-rt-graph.png",
        alt: "Graph of resistance R against temperature T",
        caption: "Fig \xB7 R\u2013T graph"
      }
    },
    {
      id: "therm-q03",
      section: "thermometer",
      difficulty: "Foundation",
      stem: "The graph below shows the variation of a property P of two materials X and Y with temperature T.\n\nWhich of the following statements is correct?",
      options: [
        { key: "A", text: "Only X is suitable for making thermometers." },
        { key: "B", text: "Only Y is suitable for making thermometers." },
        { key: "C", text: "Both X and Y are suitable for making thermometers." },
        { key: "D", text: "Neither X nor Y is suitable for making thermometers." }
      ],
      answer: "C",
      hint: "Each value of P must correspond to a single temperature T for thermometer use."
    },
    {
      id: "therm-q04",
      section: "thermometer",
      difficulty: "Foundation",
      stem: "Which of the following methods can improve the sensitivity of a liquid-in-glass thermometer?\n(1) Reduce the diameter of the glass tube.\n(2) Increase the length of the glass tube.\n(3) Use a liquid which expands less for the same temperature increase.",
      options: [
        { key: "A", text: "(1) only" },
        { key: "B", text: "(2) only" },
        { key: "C", text: "(1) and (3) only" },
        { key: "D", text: "(2) and (3) only" }
      ],
      answer: "A",
      hint: "A narrower tube gives a larger column rise for the same volume expansion."
    },
    {
      id: "therm-q05",
      section: "thermometer",
      difficulty: "Foundation",
      stem: "Which of the following statements about the Celsius temperature scale is/are correct?\n(1) The lower fixed point is the lowest temperature existing in nature.\n(2) The upper fixed point is the temperature of steam.\n(3) The unit of this scale is \xB0C.",
      options: [
        { key: "A", text: "(1) only" },
        { key: "B", text: "(3) only" },
        { key: "C", text: "(1) and (2) only" },
        { key: "D", text: "(2) and (3) only" }
      ],
      answer: "B",
      hint: "The lower fixed point is 0 \xB0C; the upper fixed point is the boiling point of pure water at 1 atm."
    },
    {
      id: "therm-q06",
      section: "thermometer",
      difficulty: "Standard",
      stem: "Mary calibrates a liquid-in-glass thermometer by putting it in water at room temperature of 25 \xB0C and pure boiling water in turn. The length of the liquid column increases by 16 cm in the process. Then she puts the thermometer in a glass of water of unknown temperature T. The liquid column is 8 cm above the level corresponding to 25 \xB0C. Find T.",
      options: [
        { key: "A", text: "25.2 \xB0C" },
        { key: "B", text: "37.5 \xB0C" },
        { key: "C", text: "50.0 \xB0C" },
        { key: "D", text: "62.5 \xB0C" }
      ],
      answer: "D",
      hint: "8 cm is half of the 16 cm rise from 25 \xB0C to 100 \xB0C."
    },
    {
      id: "therm-q07",
      section: "thermometer",
      difficulty: "Foundation",
      stem: "Which of the following statements about thermometer is incorrect?",
      options: [
        { key: "A", text: "All thermometers are using the Celsius temperature scale." },
        { key: "B", text: "Thermometer is an instrument for measuring the degree of hotness of an object." },
        { key: "C", text: "All types of thermometers make use of the temperature-dependent properties of materials." },
        { key: "D", text: "The temperature of steam point measured by different types of thermometers should be the same." }
      ],
      answer: "A",
      hint: "Fahrenheit and Kelvin scales are also used in thermometers."
    },
    {
      id: "therm-q08",
      section: "thermometer",
      difficulty: "Foundation",
      stem: "Which of the following temperatures is different from the others?",
      options: [
        { key: "A", text: "0 \xB0C" },
        { key: "B", text: "Upper fixed point of the Celsius temperature scale" },
        { key: "C", text: "Ice point" },
        { key: "D", text: "Temperature of melting ice" }
      ],
      answer: "B",
      hint: "The upper fixed point is 100 \xB0C; the others are 0 \xB0C."
    },
    {
      id: "therm-q09",
      section: "thermometer",
      difficulty: "Standard",
      stem: "A faulty thermometer with uniform scale reads 5 \xB0C and 95 \xB0C when it is placed in melting ice and boiling water respectively. What is the actual temperature if the thermometer reads 30 \xB0C?",
      options: [
        { key: "A", text: "27.8 \xB0C" },
        { key: "B", text: "28.5 \xB0C" },
        { key: "C", text: "30 \xB0C" },
        { key: "D", text: "35 \xB0C" }
      ],
      answer: "A",
      hint: "Use proportional intervals: T/100 = (30 \u2212 5)/(95 \u2212 5)."
    },
    {
      id: "therm-q10",
      section: "thermometer",
      difficulty: "Foundation",
      stem: "The graphs below show the variation of the electrical resistance R of four circuit elements with temperature. Which of the circuit elements is the most suitable for measuring temperature?",
      options: [
        { key: "A", text: "Graph A" },
        { key: "B", text: "Graph B" },
        { key: "C", text: "Graph C" },
        { key: "D", text: "Graph D" }
      ],
      answer: "C",
      hint: "A resistance thermometer needs R to vary linearly with temperature over the working range.",
      image: {
        src: "./assets/therm-q10-resistance-graphs.png",
        alt: "Four graphs A\u2013D showing resistance R against temperature T",
        caption: "Fig \xB7 R\u2013T graphs for four circuit elements"
      }
    },
    {
      id: "heat-q01",
      section: "heat-internal-energy",
      difficulty: "Foundation",
      stem: "Which of the following pairs of objects have the same specific heat capacity?\n(1) 1 kg of oil and 3 kg of oil\n(2) A 1-kg cubic copper block and a 1-kg long copper wire\n(3) 1 kg of solid wax and 1 kg of liquid wax",
      options: [
        { key: "A", text: "(1) and (2) only" },
        { key: "B", text: "(1) and (3) only" },
        { key: "C", text: "(2) and (3) only" },
        { key: "D", text: "(1), (2) and (3)" }
      ],
      answer: "A",
      hint: "Specific heat capacity depends on the substance and state, not mass or shape."
    },
    {
      id: "heat-q02",
      section: "heat-internal-energy",
      difficulty: "Applied",
      stem: "A heater supplies energy at 800 W to a cup of water for 100 s. The mass of the water is 350 g and its initial temperature is 25 \xB0C. Assume the cup has negligible heat capacity and there is no energy lost to the surroundings. Find the final temperature of the water.\n(Specific heat capacity of water = 4200 J kg\u207B\xB9 \xB0C\u207B\xB9)",
      options: [
        { key: "A", text: "32 \xB0C" },
        { key: "B", text: "54 \xB0C" },
        { key: "C", text: "79 \xB0C" },
        { key: "D", text: "100 \xB0C" }
      ],
      answer: "C",
      hint: "Use Pt = mc\u0394T."
    },
    {
      id: "heat-q03",
      section: "heat-internal-energy",
      difficulty: "Applied",
      stem: "An electric heater is turned on in a closed room. It releases 1732 kJ of energy in a certain period of time. The total volume of air in the room is 200 m\xB3. Estimate the increase in temperature of the air in the room. Assume that all the energy released by the heater is used to raise the temperature of the air inside the room and there is no energy loss from the room.\n\nGiven: density of air = 1.3 kg m\u207B\xB3; specific heat capacity of air = 1030 J kg\u207B\xB9 \xB0C\u207B\xB9.",
      options: [
        { key: "A", text: "0.0647 \xB0C" },
        { key: "B", text: "0.0841 \xB0C" },
        { key: "C", text: "6.47 \xB0C" },
        { key: "D", text: "8.41 \xB0C" }
      ],
      answer: "C",
      hint: "Find the mass of air first, then use Q = mc\u0394T."
    },
    {
      id: "heat-q04",
      section: "heat-internal-energy",
      difficulty: "Standard",
      stem: "An immersion heater of power 150 W is switched on for 2 minutes. How much energy is given out by the heater?",
      options: [
        { key: "A", text: "150 J" },
        { key: "B", text: "300 J" },
        { key: "C", text: "18 kJ" },
        { key: "D", text: "30 kJ" }
      ],
      answer: "C",
      hint: "Energy = power \xD7 time."
    },
    {
      id: "heat-q05",
      section: "heat-internal-energy",
      difficulty: "Foundation",
      stem: "Which of the following substances has the highest specific heat capacity?",
      options: [
        { key: "A", text: "1 kg of water at 95 \xB0C" },
        { key: "B", text: "2 kg of water at 70 \xB0C" },
        { key: "C", text: "3 kg of water at 65 \xB0C" },
        { key: "D", text: "All the substances above have the same specific heat capacity." }
      ],
      answer: "D",
      hint: "Specific heat capacity of water is the same at different temperatures and masses."
    },
    {
      id: "heat-q06",
      section: "heat-internal-energy",
      difficulty: "Applied",
      stem: "Water flows at a rate of 0.5 kg per minute into a tube installed inside a furnace that heats the water uniformly. The temperatures of water at the inlet and outlet of the tube are 20 \xB0C and 98 \xB0C respectively.\n(Specific heat capacity of water = 4200 J kg\u207B\xB9 \xB0C\u207B\xB9)\n\nWhat is the power of the furnace in heating the water?",
      options: [
        { key: "A", text: "1880 W" },
        { key: "B", text: "2730 W" },
        { key: "C", text: "164 000 W" },
        { key: "D", text: "206 000 W" }
      ],
      answer: "B",
      hint: "In 60 s, Pt = mc\u0394T for the water heated in one minute."
    },
    {
      id: "heat-q07",
      section: "heat-internal-energy",
      difficulty: "Standard",
      stem: "Liquids X, Y and Z of equal mass are heated separately with the same power. The graph below shows the variation of the temperatures of the liquids with time. Let cX, cY and cZ be the specific heat capacities of X, Y and Z respectively.\n\nWhich of the following correctly shows the relation between cX, cY and cZ?",
      options: [
        { key: "A", text: "cX = cY > cZ" },
        { key: "B", text: "cX > cY > cZ" },
        { key: "C", text: "cX > cY = cZ" },
        { key: "D", text: "cX < cY = cZ" }
      ],
      answer: "C",
      hint: "For the same power, a smaller slope on the T\u2013t graph means a larger specific heat capacity."
    },
    {
      id: "heat-q08",
      section: "heat-internal-energy",
      difficulty: "Applied",
      stem: "Two identical foam cups, A and B, carry the same amount of water at 20 \xB0C initially. Then, water in cups A and B is heated by electrical heaters of power 2P and P respectively for the same period of time. Assume no energy is lost to the surroundings.\n\nIf the final temperature of the water in cup A is 80 \xB0C, find the final temperature of the water in cup B.",
      options: [
        { key: "A", text: "30 \xB0C" },
        { key: "B", text: "40 \xB0C" },
        { key: "C", text: "50 \xB0C" },
        { key: "D", text: "60 \xB0C" }
      ],
      answer: "C",
      hint: "With the same time, mass and c, \u0394T is proportional to heater power."
    },
    {
      id: "heat-q09",
      section: "heat-internal-energy",
      difficulty: "Applied",
      stem: "Liquid X of mass 2 kg is heated by an immersion heater for 10 minutes. The temperature of X rises from 20 \xB0C to 30 \xB0C. 1000 J of energy is lost to the surroundings in the process. The power of the heater is 100 W. Calculate the specific heat capacity of X.",
      options: [
        { key: "A", text: "2950 J kg\u207B\xB9 \xB0C\u207B\xB9" },
        { key: "B", text: "3000 J kg\u207B\xB9 \xB0C\u207B\xB9" },
        { key: "C", text: "3050 J kg\u207B\xB9 \xB0C\u207B\xB9" },
        { key: "D", text: "5900 J kg\u207B\xB9 \xB0C\u207B\xB9" }
      ],
      answer: "A",
      hint: "Energy supplied by heater = energy gained by liquid + energy lost to surroundings."
    },
    {
      id: "heat-q10",
      section: "heat-internal-energy",
      difficulty: "Standard",
      stem: "A heater is used to heat up a 5-kg metal block. The temperature of the block rises from 25 \xB0C to 35 \xB0C. The heat capacity of the block is 100 J \xB0C\u207B\xB9. Assume that there is no energy loss to the surroundings. How much energy is supplied by the heater?",
      options: [
        { key: "A", text: "100 J" },
        { key: "B", text: "500 J" },
        { key: "C", text: "1000 J" },
        { key: "D", text: "5000 J" }
      ],
      answer: "C",
      hint: "Use Q = C\u0394T."
    },
    {
      id: "cos-q01",
      section: "change-of-state",
      difficulty: "Standard",
      stem: "Two substances X and Y, of equal mass, are heated separately at the same power. They are initially at room temperature. The graph below shows how their temperatures vary with time.\n\nWhich of the following statements is incorrect?",
      options: [
        { key: "A", text: "The melting of X and the boiling of Y happens at the same temperature." },
        { key: "B", text: "When X starts boiling, Y just melts completely." },
        { key: "C", text: "X and Y require the same amount of energy to raise from room temperature to their melting points." },
        { key: "D", text: "The specific heat capacity of X in solid state is higher than that of Y." }
      ],
      answer: "D",
      hint: "Compare the slopes of the heating curves in the solid state before melting begins."
    },
    {
      id: "cos-q02",
      section: "change-of-state",
      difficulty: "Applied",
      stem: "The diagram below shows the apparatus used for finding the specific latent heat of vaporization of a liquid.\n\nThe output of the heater is 200 W. The balance reading decreases by 15 g after the liquid has boiled for 300 s. If the heat lost to the surroundings is negligible, what is the specific latent heat of vaporization of the liquid?",
      options: [
        { key: "A", text: "4 \xD7 10\xB3 J kg\u207B\xB9" },
        { key: "B", text: "1.2 \xD7 10\u2076 J kg\u207B\xB9" },
        { key: "C", text: "4 \xD7 10\u2076 J kg\u207B\xB9" },
        { key: "D", text: "6 \xD7 10\u2076 J kg\u207B\xB9" }
      ],
      answer: "C",
      hint: "Use Pt = m lv with the mass of vapour produced.",
      image: {
        src: "./assets/cos-q02-lv-apparatus.png",
        alt: "Apparatus for finding specific latent heat of vaporization with heater, cup and balance",
        caption: "Fig \xB7 Latent heat of vaporization experiment"
      }
    },
    {
      id: "cos-q03",
      section: "change-of-state",
      difficulty: "Standard",
      stem: "Which of the following quantities can be used to find out the energy released as steam at 100 \xB0C changes to water at 0 \xB0C?\n(1) Heat capacity of water\n(2) Latent heat of vaporization of water\n(3) Latent heat of fusion of ice",
      options: [
        { key: "A", text: "(1) only" },
        { key: "B", text: "(2) only" },
        { key: "C", text: "(1) and (2) only" },
        { key: "D", text: "(1), (2) and (3)" }
      ],
      answer: "C",
      hint: "Condensation uses lv; cooling water from 100 \xB0C to 0 \xB0C uses mc\u0394T or heat capacity."
    },
    {
      id: "cos-q04",
      section: "change-of-state",
      difficulty: "Applied",
      stem: "Ice at \u22125 \xB0C is added to 0.5 kg of hot water at 98 \xB0C. Assume that no energy is lost to the surroundings. If the final temperature of the mixture is 5 \xB0C, what is the mass of ice used?\n(Specific heat capacity of water = 4200 J kg\u207B\xB9 \xB0C\u207B\xB9; specific heat capacity of ice = 2100 J kg\u207B\xB9 \xB0C\u207B\xB9; specific latent heat of fusion of ice = 3.34 \xD7 10\u2075 J kg\u207B\xB9)",
      options: [
        { key: "A", text: "0.47 kg" },
        { key: "B", text: "0.53 kg" },
        { key: "C", text: "0.57 kg" },
        { key: "D", text: "0.62 kg" }
      ],
      answer: "B",
      hint: "Include warming ice to 0 \xB0C, melting, and warming the melt to 5 \xB0C."
    },
    {
      id: "cos-q05",
      section: "change-of-state",
      difficulty: "Applied",
      stem: "A fish of mass 800 g at 20 \xB0C is steamed. After 50 g of steam at 100 \xB0C has condensed on the fish, estimate the temperature of the fish. Assume that the fish only absorbs energy from this mass of steam and its temperature is uniform throughout the process.\n(Specific heat capacity of fish = 3430 J kg\u207B\xB9 \xB0C\u207B\xB9; specific latent heat of vaporization of water = 2.26 \xD7 10\u2076 J kg\u207B\xB9)",
      options: [
        { key: "A", text: "41.2 \xB0C" },
        { key: "B", text: "61.2 \xB0C" },
        { key: "C", text: "63.9 \xB0C" },
        { key: "D", text: "100 \xB0C" }
      ],
      answer: "C",
      hint: "Energy lost by steam = latent heat released + cooling of condensed water."
    },
    {
      id: "cos-q06",
      section: "change-of-state",
      difficulty: "Foundation",
      stem: "A substance is heated continuously and the variation of its temperature over time during the heating process is shown below.\n\nWhich of the following descriptions about the substance from t\u2081 to t\u2082 is/are correct?\n(1) Its temperature remains unchanged.\n(2) Its state of matter remains unchanged.\n(3) Its internal energy remains unchanged.",
      options: [
        { key: "A", text: "(1) only" },
        { key: "B", text: "(1) and (3) only" },
        { key: "C", text: "(2) and (3) only" },
        { key: "D", text: "(1), (2) and (3)" }
      ],
      answer: "A",
      hint: "During a horizontal section of a heating curve, temperature is constant but internal energy still increases."
    },
    {
      id: "cos-q07",
      section: "change-of-state",
      difficulty: "Applied",
      stem: "Melting ice of mass m is added to a glass of coke of mass 3m. The final temperature of the mixture is 4 \xB0C. Assume that no energy is lost to the surroundings. Find the initial temperature of the coke.\n(Specific heat capacity of coke = 5300 J kg\u207B\xB9 \xB0C\u207B\xB9; specific heat capacity of water = 4200 J kg\u207B\xB9 \xB0C\u207B\xB9; specific latent heat of fusion of ice = 3.34 \xD7 10\u2075 J kg\u207B\xB9)",
      options: [
        { key: "A", text: "21.0 \xB0C" },
        { key: "B", text: "22.1 \xB0C" },
        { key: "C", text: "25.0 \xB0C" },
        { key: "D", text: "26.1 \xB0C" }
      ],
      answer: "D",
      hint: "Energy lost by coke = energy to melt ice + warm melt to 4 \xB0C."
    },
    {
      id: "cos-q08",
      section: "change-of-state",
      difficulty: "Standard",
      stem: "The following table shows the specific heat capacity and specific latent heat of fusion of water and copper.\n\n| | Specific heat capacity | Specific latent heat of fusion |\n|---|---|---|\n| Water | 4200 J kg\u207B\xB9 \xB0C\u207B\xB9 | 3.34 \xD7 10\u2075 J kg\u207B\xB9 |\n| Copper | 370 J kg\u207B\xB9 \xB0C\u207B\xB9 | 2.1 \xD7 10\u2075 J kg\u207B\xB9 |\n\nArrange the following in ascending order.\n\nE\u2081 = energy required to melt 1 kg of ice at 0 \xB0C\n\nE\u2082 = energy required to raise the temperature of 1 kg of water by 1 \xB0C\n\nE\u2083 = energy required to melt 1 kg of copper at its melting point\n\nE\u2084 = energy required to raise the temperature of 1 kg of copper by 1 \xB0C",
      options: [
        { key: "A", text: "E\u2083 < E\u2081 < E\u2084 < E\u2082" },
        { key: "B", text: "E\u2083 < E\u2084 < E\u2082 < E\u2081" },
        { key: "C", text: "E\u2084 < E\u2083 < E\u2082 < E\u2081" },
        { key: "D", text: "E\u2084 < E\u2082 < E\u2083 < E\u2081" }
      ],
      answer: "D",
      hint: "Compare mc\u0394T values (1 \xB0C rise) with m lf values for 1 kg."
    },
    {
      id: "cos-q09",
      section: "change-of-state",
      difficulty: "Applied",
      stem: "Ken boils some water with a kettle. The water is heated from 15 \xB0C to 100 \xB0C in 10 minutes. If he forgets to shut it down, how long will it take to vaporize the water completely? Assume the water is heated at a constant power during the process.\n(Specific heat capacity of water = 4200 J kg\u207B\xB9 \xB0C\u207B\xB9; specific latent heat of vaporization of water = 2.26 \xD7 10\u2076 J kg\u207B\xB9)",
      options: [
        { key: "A", text: "About 50 minutes" },
        { key: "B", text: "About 60 minutes" },
        { key: "C", text: "About 70 minutes" },
        { key: "D", text: "Cannot be determined since the mass of water is not given" }
      ],
      answer: "B",
      hint: "Power is the same for both stages; mass cancels when comparing Pt = mc\u0394T and Pt = m lv."
    },
    {
      id: "cos-q10",
      section: "change-of-state",
      difficulty: "Standard",
      stem: "The diagram below shows the apparatus used to find the specific latent heat of vaporization of water.\n\nWhich of the following factors will make the result obtained smaller than the true value?\n(1) Some energy supplied by the heater is lost to the surroundings.\n(2) Some water splashes out of the cup as it boils.\n(3) Some steam condenses and drips back into the cup.",
      options: [
        { key: "A", text: "(1) only" },
        { key: "B", text: "(2) only" },
        { key: "C", text: "(1) and (2) only" },
        { key: "D", text: "(1), (2) and (3)" }
      ],
      answer: "B",
      hint: "Lv = E/\u0394m; an overestimated mass loss gives a smaller calculated lv.",
      image: {
        src: "./assets/cos-q10-lv-apparatus.jpeg",
        alt: "Apparatus with joulemeter, heater and cup on a balance",
        caption: "Fig \xB7 Latent heat of vaporization setup"
      }
    },
    {
      id: "ht-q01",
      section: "heat-transfer",
      difficulty: "Foundation",
      stem: "Which of the following heat transfer processes involve(s) movements of molecules?\n(1) Conduction\n(2) Convection\n(3) Radiation",
      options: [
        { key: "A", text: "(1) only" },
        { key: "B", text: "(2) only" },
        { key: "C", text: "(1) and (2) only" },
        { key: "D", text: "(1), (2) and (3)" }
      ],
      answer: "C",
      hint: "Radiation does not require molecular movement in a medium."
    },
    {
      id: "ht-q02",
      section: "heat-transfer",
      difficulty: "Foundation",
      stem: "Two objects are of different temperatures. Which of the following statements is/are correct?\n(1) There is heat transfer between the two objects when they are put in contact.\n(2) The colder one may have more internal energy.\n(3) The average kinetic energy of the particles in the two objects can be the same.",
      options: [
        { key: "A", text: "(1) only" },
        { key: "B", text: "(1) and (2) only" },
        { key: "C", text: "(2) and (3) only" },
        { key: "D", text: "(1), (2) and (3)" }
      ],
      answer: "B",
      hint: "Temperature measures average kinetic energy; internal energy also depends on mass."
    },
    {
      id: "ht-q03",
      section: "heat-transfer",
      difficulty: "Foundation",
      stem: "In which of the following media can conduction take place?\n(1) Metal\n(2) Glass\n(3) Water",
      options: [
        { key: "A", text: "(1) only" },
        { key: "B", text: "(1) and (2) only" },
        { key: "C", text: "(2) and (3) only" },
        { key: "D", text: "(1), (2) and (3)" }
      ],
      answer: "D",
      hint: "Conduction can occur in solids and fluids."
    },
    {
      id: "ht-q04",
      section: "heat-transfer",
      difficulty: "Foundation",
      stem: "Which of the following transfer processes of heat can take place in a hot fluid?\n(1) Conduction\n(2) Convection\n(3) Radiation",
      options: [
        { key: "A", text: "(1) only" },
        { key: "B", text: "(3) only" },
        { key: "C", text: "(1) and (2) only" },
        { key: "D", text: "(1), (2) and (3)" }
      ],
      answer: "D",
      hint: "All three can occur in a fluid unless radiation is blocked."
    },
    {
      id: "ht-q05",
      section: "heat-transfer",
      difficulty: "Foundation",
      stem: "Which of the following actions cannot increase the rate of heat loss by radiation of a hot object?",
      options: [
        { key: "A", text: "Increase its temperature" },
        { key: "B", text: "Increase its surface area" },
        { key: "C", text: "Paint its surface silvery" },
        { key: "D", text: "Paint its surface dull black" }
      ],
      answer: "C",
      hint: "Silvery surfaces are poor radiators."
    },
    {
      id: "ht-q06",
      section: "heat-transfer",
      difficulty: "Standard",
      stem: "An immersion heater is put in a glass of water. Which of the following diagrams best shows the convection current in the glass?",
      options: [
        { key: "A", text: "Diagram A" },
        { key: "B", text: "Diagram B" },
        { key: "C", text: "Diagram C" },
        { key: "D", text: "Diagram D" }
      ],
      answer: "A",
      hint: "Hot water rises above the heater; cooler water moves in to replace it.",
      image: {
        src: "./assets/ht-q06-convection.png",
        alt: "Four diagrams A\u2013D showing convection currents in a glass of water with an immersion heater",
        caption: "Fig \xB7 Convection in a glass of water"
      }
    },
    {
      id: "ht-q07",
      section: "heat-transfer",
      difficulty: "Foundation",
      stem: "The following picture shows a fan heat sink of a computer that prevents the processor from overheating.\n\nWhich of the following heat transfer processes help cool the processor?\n(1) Conduction\n(2) Convection\n(3) Radiation",
      options: [
        { key: "A", text: "(1) and (2) only" },
        { key: "B", text: "(1) and (3) only" },
        { key: "C", text: "(2) and (3) only" },
        { key: "D", text: "(1), (2) and (3)" }
      ],
      answer: "D",
      hint: "Heat moves through the metal by conduction, then leaves by forced convection and radiation.",
      image: {
        src: "./assets/ht-q07-heatsink.jpeg",
        alt: "CPU heat sink with fan and metal fins",
        caption: "Fig \xB7 Fan heat sink"
      }
    },
    {
      id: "ht-q08",
      section: "heat-transfer",
      difficulty: "Foundation",
      stem: "Which of the following statements about radiation is/are correct?\n(1) Dull black surfaces can slow down the rate of heat loss by radiation.\n(2) Dull black surfaces are good absorbers of radiation.\n(3) Shiny surfaces do not absorb radiation.",
      options: [
        { key: "A", text: "(1) only" },
        { key: "B", text: "(2) only" },
        { key: "C", text: "(1) and (3) only" },
        { key: "D", text: "(2) and (3) only" }
      ],
      answer: "B",
      hint: "Dull black surfaces are good absorbers and good emitters; shiny surfaces are poor absorbers but not zero."
    },
    {
      id: "ht-q09",
      section: "heat-transfer",
      difficulty: "Standard",
      stem: "The following figure shows the structure of a thermos flask.\n\nWhich of the components of the thermos flask is best at:\n\u2022 preventing heat loss by conduction\n\u2022 preventing heat loss by convection\n\u2022 preventing heat loss by radiation",
      options: [
        { key: "A", text: "Vacuum / vacuum / vacuum" },
        { key: "B", text: "Vacuum / plastic stopper / silvery glass walls" },
        { key: "C", text: "Plastic stopper / insulated support / silvery glass walls" },
        { key: "D", text: "Insulated support / vacuum / plastic stopper" }
      ],
      answer: "B",
      hint: "Vacuum stops conduction and convection between the walls; silvery surfaces reduce radiation.",
      image: {
        src: "./assets/ht-q09-thermos.jpeg",
        alt: "Cross-section of a thermos flask showing vacuum, stopper and silvery walls",
        caption: "Fig \xB7 Thermos flask structure"
      }
    },
    {
      id: "ht-q10",
      section: "heat-transfer",
      difficulty: "Foundation",
      stem: "A metal block and a wooden block are at the same temperature of 20 \xB0C. Which of the following statements is/are correct?\n(1) Conduction does not take place when you touch the wooden block.\n(2) The metal block feels colder because it is a better conductor of heat than the wooden block.\n(3) When the blocks are put in contact, heat flows from the wooden block to the metal block.",
      options: [
        { key: "A", text: "(1) only" },
        { key: "B", text: "(2) only" },
        { key: "C", text: "(1) and (2) only" },
        { key: "D", text: "(2) and (3) only" }
      ],
      answer: "B",
      hint: "At the same temperature there is no net heat flow between the blocks."
    }
  ];

  // public/heat-ch1-quiz/js/quizUtils.js
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
  function formatQuizText(text) {
    let s = escHtml(text);
    s = s.replace(/\bc([XYZ])\b/g, "c<sub>$1</sub>");
    s = s.replace(/E([₀₁₂₃₄₅₆₇₈₉])/g, (_, sub) => {
      const map = { "\u2080": "0", "\u2081": "1", "\u2082": "2", "\u2083": "3", "\u2084": "4", "\u2085": "5", "\u2086": "6", "\u2087": "7", "\u2088": "8", "\u2089": "9" };
      return `E<sub>${map[sub] || sub}</sub>`;
    });
    return s;
  }
  function stemParagraphHtml(block) {
    return `<p class="stem-block mb-3 last:mb-0">${block.replace(/\n/g, "<br>")}</p>`;
  }
  function isMarkdownTable(text) {
    const lines = text.trim().split("\n").filter((line) => line.trim());
    return lines.length >= 2 && lines.every((line) => line.includes("|"));
  }
  function markdownTableToHtml(text) {
    const lines = text.trim().split("\n").map((line) => line.trim()).filter((line) => line && !/^\|[\s\-:|]+\|$/.test(line));
    if (!lines.length) return stemParagraphHtml(text);
    const parseRow = (line) => line.split("|").slice(1, -1).map((cell) => cell.trim());
    let html = '<div class="stem-table-wrap overflow-x-auto mb-3"><table class="stem-table w-full max-w-xl text-body-sm border-collapse border border-outline-variant/30">';
    lines.forEach((line, i) => {
      const cells = parseRow(line);
      const tag = i === 0 ? "th" : "td";
      html += `<tr class="${i === 0 ? "bg-surface-container-low" : ""}">`;
      cells.forEach((cell, ci) => {
        const cls = i === 0 ? "px-3 py-2 border border-outline-variant/20 text-left font-label-bold" : ci === 0 ? "px-3 py-2 border border-outline-variant/20 font-label-bold whitespace-nowrap" : "px-3 py-2 border border-outline-variant/20";
        html += `<${tag} class="${cls}">${cell}</${tag}>`;
      });
      html += "</tr>";
    });
    html += "</table></div>";
    return html;
  }
  function expandStemBlocks(block) {
    if (/\(\d+\)/.test(block)) {
      const parts = block.split(/(?=\(\d+\))/).map((part) => part.trim()).filter(Boolean);
      if (parts.length > 1) return parts;
    }
    if (/E(?:<sub>\d<\/sub>|[₀₁₂₃₄₅₆₇₈₉])\s*=/.test(block)) {
      const parts = block.split(/(?=E(?:<sub>\d<\/sub>|[₀₁₂₃₄₅₆₇₈₉])\s*=)/).map((part) => part.trim()).filter(Boolean);
      if (parts.length > 1) return parts;
    }
    return [block];
  }
  function formatStemHtml(text) {
    if (!text) return "";
    const s = formatQuizText(text);
    return s.split(/\n\n+/).map((part) => part.trim()).filter(Boolean).map((section) => {
      if (isMarkdownTable(section)) return markdownTableToHtml(section);
      return expandStemBlocks(section).map(stemParagraphHtml).join("");
    }).join("");
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

  // public/heat-ch1-quiz/js/quizSummary.js
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
      if (st.solved && st.wrong === 0) {
        correct += 1;
        agg.correct += 1;
        firstTry += 1;
        agg.firstTry += 1;
      } else if (st.solved && st.wrong >= 1) {
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

  // public/heat-ch1-quiz/js/quizExport.js
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

  // public/heat-ch1-quiz/js/quizEffects.js
  function animateSplitTextBlock(element, delayOffset = 0) {
    const text = element.textContent?.trim() || "";
    if (!text) return delayOffset;
    element.innerHTML = text.split(/\s+/).map((word, i) => {
      const delay = (delayOffset + i) * 28;
      return `<span class="split-word" style="transition-delay:${delay}ms">${word}</span>`;
    }).join(" ");
    return delayOffset + text.split(/\s+/).length;
  }
  function animateSplitText(element) {
    if (!element) return;
    const blocks = element.querySelectorAll(".stem-block");
    if (blocks.length) {
      element.classList.remove("reveal");
      let offset = 0;
      blocks.forEach((block) => {
        offset = animateSplitTextBlock(block, offset);
      });
      requestAnimationFrame(() => {
        setTimeout(() => element.classList.add("reveal"), 40);
      });
      return;
    }
    const text = element.textContent?.trim() || "";
    if (!text) return;
    element.classList.remove("reveal");
    animateSplitTextBlock(element, 0);
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
        if (v !== null) return v === "1";
      } catch {
      }
      return !window.matchMedia("(max-width: 1100px)").matches;
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

  // public/heat-ch1-quiz/js/quizApp.js
  var UI = {
    en: {
      appSubtitle: "S3 Heat Ch.1 \xB7 Thermometer, internal energy, change of state & heat transfer \xB7 English / \u7E41\u9AD4\u4E2D\u6587 UI",
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
      modelPrefix: "Model answer:",
      printConfirm: "Print ANSWER sheet? (Cancel = questions only)",
      summaryTitle: "Summary",
      summaryScoreLabel: "Score (correct / total)",
      summaryFirstTry: "Correct on first attempt",
      summaryWrongTitle: "Incorrect \u2014 review these",
      summaryNoneWrong: "None \u2014 all questions answered correctly.",
      summaryIncomplete: "Still in progress",
      summaryByTypeTitle: "Correct rate by topic",
      summaryByTypeColType: "Topic",
      summaryByTypeColFraction: "Correct / in topic",
      summaryByTypeColRate: "Rate",
      summaryByTypeColFirst: "First-try / in topic",
      revTitle: "Comments & revision suggestions",
      revBandExcellent: "Overall accuracy is very high. Keep mixing topics so recall stays sharp for HKDSE.",
      revBandGood: "Good result. Use the table above to add a short round on weaker topics.",
      revBandFair: "Mixed performance: re-read weaker Heat Ch.1 topics, then regenerate.",
      revBandLow: "Several concepts need consolidation. Review thermometer, heat capacity, latent heat and heat transfer before the next round.",
      revWeakOne: "Prioritise revision on {type} \u2014 you scored {c}/{t} ({pct}%) in that topic.",
      revStrongOne: "Strength: every {type} item correct ({n} questions).",
      revTwoStrike: "Questions answered incorrectly: study the model answers, then regenerate those topics.",
      revIncomplete: "Finish questions still in progress for a fair measure of strengths and gaps.",
      revFirstTryLow: "Many items were answered incorrectly. Read each stem carefully before answering.",
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
      modelPrefix: "\u53C2\u8003\u7B54\u6848\uFF1A",
      printConfirm: "\u8981\u6253\u5370\u300C\u7B54\u6848\u7248\u300D\u5417\uFF1F\uFF08\u53D6\u6D88 = \u8BD5\u9898\u7248\uFF09",
      summaryTitle: "\u6458\u8981",
      summaryScoreLabel: "\u5F97\u5206\uFF08\u7B54\u5BF9\uFF0F\u603B\u9898\u6570\uFF09",
      summaryFirstTry: "\u9996\u6B21\u5373\u7B54\u5BF9",
      summaryWrongTitle: "\u7B54\u9519 \u2014 \u9700\u91CD\u6E29",
      summaryNoneWrong: "\u6CA1\u6709\u7B54\u9519\u7684\u9898\u76EE\u3002",
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
      revTwoStrike: "\u7B54\u9519\u7684\u9898\u76EE\uFF1A\u8BF7\u7EC6\u8BFB\u53C2\u8003\u7B54\u6848\u540E\u518D\u7EC3\u3002",
      revIncomplete: "\u5C1A\u6709\u672A\u7B54\u5BF9\u9898\u76EE\uFF0C\u5EFA\u8BAE\u5148\u5B8C\u6210\u3002",
      revFirstTryLow: "\u4E0D\u5C11\u9898\u76EE\u7B54\u9519\u3002\u4F5C\u7B54\u524D\u5B9C\u653E\u6162\u9605\u8BFB\u9898\u5E72\u3002",
      revBalanced: "\u9519\u8BEF\u5206\u6563\u5728\u4E0D\u540C\u8BFE\u9898\uFF0C\u5B9C\u5747\u8861\u7EC3\u4E60\u3002",
      hideSettings: "\u9690\u85CF\u8BBE\u5B9A",
      showSettings: "\u663E\u793A\u8BBE\u5B9A"
    },
    "zh-Hant": {
      appSubtitle: "S3 \u71B1\u5B78 Ch.1 \xB7 \u6EAB\u5EA6\u8A08\u3001\u5167\u80FD\u3001\u7269\u614B\u8B8A\u5316\u8207\u71B1\u50B3\u905E \xB7 \u4ECB\u9762\u7E41\u9AD4\u4E2D\u6587",
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
      modelPrefix: "\u53C3\u8003\u7B54\u6848\uFF1A",
      printConfirm: "\u8981\u5217\u5370\u300C\u7B54\u6848\u7248\u300D\u55CE\uFF1F\uFF08\u53D6\u6D88 = \u8A66\u984C\u7248\uFF09",
      summaryTitle: "\u6458\u8981",
      summaryScoreLabel: "\u5F97\u5206\uFF08\u7B54\u5C0D\uFF0F\u7E3D\u984C\u6578\uFF09",
      summaryFirstTry: "\u9996\u6B21\u5373\u7B54\u5C0D",
      summaryWrongTitle: "\u7B54\u932F \u2014 \u9700\u91CD\u6EAB",
      summaryNoneWrong: "\u6C92\u6709\u7B54\u932F\u7684\u984C\u76EE\u3002",
      summaryIncomplete: "\u5C1A\u672A\u7B54\u5C0D",
      summaryByTypeTitle: "\u5404\u8AB2\u984C\u7B54\u5C0D\u7387",
      summaryByTypeColType: "\u8AB2\u984C",
      summaryByTypeColFraction: "\u7B54\u5C0D\uFF0F\u8A72\u8AB2\u984C\u984C\u6578",
      summaryByTypeColRate: "\u7B54\u5C0D\u7387",
      summaryByTypeColFirst: "\u9996\u6B21\u5373\u5C0D\uFF0F\u8A72\u8AB2\u984C\u984C\u6578",
      revTitle: "\u8A55\u8A9E\u8207\u6EAB\u7FD2\u5EFA\u8B70",
      revBandExcellent: "\u6574\u9AD4\u7B54\u5C0D\u7387\u5F88\u9AD8\u3002\u5EFA\u8B70\u6301\u7E8C\u6DF7\u5408\u5404\u8AB2\u984C\u7DF4\u7FD2\u3002",
      revBandGood: "\u6574\u9AD4\u8868\u73FE\u4E0D\u932F\u3002\u53EF\u91DD\u5C0D\u8F03\u5F31\u8AB2\u984C\u52A0\u505A\u4E00\u8F2A\u3002",
      revBandFair: "\u8868\u73FE\u53C3\u5DEE\uFF1A\u8ACB\u91CD\u6EAB\u8F03\u5F31\u5605 Heat Ch.1 \u8AB2\u984C\u5F8C\u518D\u7522\u751F\u984C\u76EE\u3002",
      revBandLow: "\u591A\u500B\u6982\u5FF5\u4ECD\u9700\u978F\u56FA\u3002\u8ACB\u5148\u6EAB\u7FD2\u6EAB\u5EA6\u8A08\u3001\u6BD4\u71B1\u5BB9\u3001\u6F5B\u71B1\u540C\u71B1\u50B3\u905E\u3002",
      revWeakOne: "\u5EFA\u8B70\u512A\u5148\u6EAB\u7FD2\u300C{type}\u300D\uFF1A\u672C\u6B21 {c}/{t}\uFF08{pct}%\uFF09\u3002",
      revStrongOne: "\u5F37\u9805\uFF1A\u300C{type}\u300D\u672C\u6B21\u5168\u5C0D\uFF08\u5171 {n} \u984C\uFF09\u3002",
      revTwoStrike: "\u7B54\u932F\u7684\u984C\u76EE\uFF1A\u8ACB\u7D30\u8B80\u53C3\u8003\u7B54\u6848\u5F8C\u518D\u7DF4\u3002",
      revIncomplete: "\u5C1A\u6709\u672A\u7B54\u5C0D\u984C\u76EE\uFF0C\u5EFA\u8B70\u5148\u5B8C\u6210\u3002",
      revFirstTryLow: "\u4E0D\u5C11\u984C\u76EE\u7B54\u932F\u3002\u4F5C\u7B54\u524D\u5B9C\u653E\u6162\u95B1\u8B80\u984C\u5E79\u3002",
      revBalanced: "\u932F\u8AA4\u5206\u6563\u5728\u4E0D\u540C\u8AB2\u984C\uFF0C\u5B9C\u5747\u8861\u7DF4\u7FD2\u3002",
      hideSettings: "\u96B1\u85CF\u8A2D\u5B9A",
      showSettings: "\u986F\u793A\u8A2D\u5B9A"
    }
  };
  function initQuiz() {
    let lang = resolveQuizLang();
    let lastQuestions = [];
    const attemptMap = /* @__PURE__ */ new Map();

    const QUIZ_META = { subject: "PHY", quizId: "phy-heat-ch1" };
    function reportPhyAttempt(q, isCorrect, state) {
      try {
        const payload = {
          type: "uniplus:quizAnswer",
          subject: QUIZ_META.subject,
          quizId: QUIZ_META.quizId,
          questionId: String(q.id),
          section: q.section || null,
          difficulty: q.difficulty || null,
          stem: q.stem || null,
          selectedAnswer: state.selected !== undefined && state.selected !== null ? String(state.selected) : (state.fillValues ? JSON.stringify(state.fillValues) : null),
          correctAnswer: q.answer !== undefined ? String(q.answer) : null,
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
        if (q.image?.src) {
          const fig = document.createElement("figure");
          fig.className = "quiz-fig mb-4";
          fig.innerHTML = `<img src="${escHtml(q.image.src)}" alt="${escHtml(q.image.alt || "")}" loading="lazy" />
          <figcaption class="text-body-sm text-on-surface-variant mt-2">${escHtml(q.image.caption || "")}</figcaption>`;
          wrap.appendChild(fig);
        }
        const stem = document.createElement("div");
        stem.className = "split-text-target font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1 leading-tight";
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
            text.innerHTML = `${formatQuizText(opt.text)}${opt.textZh ? `<span class="block text-body-sm text-on-surface-variant mt-1">${escHtml(opt.textZh)}</span>` : ""}`;
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
        });
        wrap.appendChild(btn);
        wrap.appendChild(fb);
        if (st.solved && st.wrong >= 1) {
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
