const STAGES = ["group stage", "round of 16", "quarterfinals", "semifinal", "final"];
let currentStage = STAGES[0];

const confrontations = {
  "round of 16": [
    [0, 2, 4, 6, 1, 3, 5, 7],
    [1, 3, 5, 7, 0, 2, 4, 6]
  ],
  "quarterfinals": [
    [0, 2, 4, 6],
    [1, 3, 5, 7]
  ],
  "semifinal": [
    [0, 2],
    [1, 3]
  ],
  "final": [
    [0],
    [1]
  ]
};