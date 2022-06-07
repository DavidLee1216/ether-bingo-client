import { BingoActionTypes } from "../actions/bingoActions";

// function matrix_init(rows, cols, defaultValue) {
//   var arr = [];

//   // Creates all lines:
//   for (var i = 0; i < rows; i++) {
//     // Creates an empty line
//     arr.push([]);

//     // Adds cols to the empty line:
//     arr[i].push(new Array(cols));

//     for (var j = 0; j < cols; j++) {
//       // Initializes:
//       arr[i][j] = defaultValue;
//     }
//   }

//   return arr;
// }

// function combination(n, k, idx, depth, matrix, row_count, colNumbers) {
//   if (k == depth) {
//     for (let i = 0; i < k; i++) {
//       matrix[row_count][i] = colNumbers[i];
//     }
//     row_count++;
//   }
//   for (let i = idx; i < n; i++) {
//     colNumbers[depth] = i;
//     combination(n, k, i + 1, depth + 1);
//   }
// }

const BINGO_INITIAL_STATE = {
  bingo: {
    credits: 0,
  },
};

export const BingoReducer = (states = BINGO_INITIAL_STATE, action) => {
  switch (action.type) {
    case BingoActionTypes.CHECK_CREDIT:
      return {
        ...states,
        bingo: {
          credits: action.credits,
        },
      };
    default:
      // var matrix = matrix_init(200, 9, 0);
      // var row_count = 0;
      // var colNumbers = new Array(9).fill(0);
      // combination(9, 5, 0, 0, matrix, row_count, colNumbers);
      return states;
  }
};
