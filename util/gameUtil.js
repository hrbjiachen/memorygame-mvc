const updateTrailOption = (options, isError) => {
  let newOptions = [...options];

  shuffle = array => array.sort(() => Math.random() - 0.5);
  const maxOption = [7, 7, 10];
  const minOption = [5, 5, 3];
  let indices = shuffle([0, 1, 2]);

  for (let i = 0; i < indices.length; i++) {
    if (!isError) {
      if (newOptions[indices[i]] + 1 >= maxOption[indices[i]]) {
        continue;
      }
      newOptions[indices[i]] += 1;
      break;
    } else {
      if (newOptions[indices[i]] - 1 <= minOption[indices[i]]) {
        continue;
      }
      newOptions[indices[i]] -= 1;
      break;
    }
  }

  return newOptions;
};

const generateBoard = options => {
  const [row, col, secretNum] = options;
  let secretArray = [];
  if (secretNum > row * col) {
    return;
  }

  for (let i = 0; i < row * col; i++) {
    secretArray[i] = 0;
  }

  for (let j = 0; j < secretNum; j++) {
    let randomNum = Math.floor(Math.random() * row * col);
    if (secretArray[randomNum] == 0) {
      secretArray[randomNum] = 1;
    } else {
      j--;
    }
  }

  let outArray = [];
  for (let k = 0; k < row; k++) {
    outArray.push(secretArray.slice(k * col, (k + 1) * col));
  }

  return outArray;
};

module.exports = { updateTrailOption, generateBoard };
