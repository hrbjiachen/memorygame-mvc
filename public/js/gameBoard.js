let rotateAudio = new Audio("/sound/rotate.wav");
let goodAudio = new Audio("/sound/good_click.mp3");
let badAudio = new Audio("/sound/bad_click.wav");
let flipAudio = new Audio("/sound/flip.mp3");
let nextAudio = new Audio("/sound/next_trail.mp3");

class CustomConfirm {
  constructor(url) {
    this.redirectURL = url;
  }

  render = dialog => {
    let winW = window.innerWidth;
    let winH = window.innerHeight;
    let dialog_overlay = document.getElementById("dialog_overlay");
    let dialog_box = document.getElementById("dialog_box");
    dialog_overlay.style.display = "block";
    dialog_overlay.style.height = winH + "px";
    dialog_box.style.left = winW / 2 - 550 * 0.5 + "px";
    dialog_box.style.top = "30%";
    dialog_box.style.display = "block";
    document.getElementById("dialog_box_body").innerText = dialog;
    document.getElementById("yesBtn").addEventListener("click", this.yes);
    document.getElementById("noBtn").addEventListener("click", this.no);
  };
  yes = () => {
    window.location.replace(this.redirectURL);
    document.getElementById("dialog_box").style.display = "none";
    document.getElementById("dialog_overlay").style.display = "none";
  };
  no = () => {
    document.getElementById("dialog_box").style.display = "none";
    document.getElementById("dialog_overlay").style.display = "none";
  };
}

const TerminateConfirm = new CustomConfirm(`${window.location.origin}/summary`);
const GameOverConfirm = new CustomConfirm(`${window.location.origin}`);

const init = async () => {
  const status = await checkGameStatus();
  const { initAnimationRequired, actions } = status;

  if (initAnimationRequired) {
    showSecret(2000);
    updateAnimationStatus();
  } else {
    doActions(actions);
  }
};

const showSecret = time => {
  setTimeout(() => {
    flipDiv(true);
    flipAudio.play();
    setTimeout(() => {
      flipDiv(false);
    }, time);

    setTimeout(() => {
      rotateAudio.play();
      document.querySelector("div#board_div").classList.add("rotated");
      addHoverEffectToSquare();
      addClickListenerToSquare();
    }, time + 1000);
  }, 2000);
};

const flipDiv = open => {
  const secretDivs = document.querySelectorAll(".secret_square_div");
  Array.from(secretDivs).forEach(d => {
    if (open) {
      d.classList.add("flip_div");
    } else {
      d.classList.remove("flip_div");
    }
  });
};

const addHoverEffectToSquare = () => {
  let squares = document.querySelectorAll("div.front, div.square_div");

  Array.from(squares).forEach(d => {
    d.classList.add("hover_div");
  });
};

const removeHoverEffectToSquare = () => {
  let squares = document.querySelectorAll("div.front, div.square_div");

  Array.from(squares).forEach(d => {
    d.classList.remove("hover_div");
  });
};

const addClickListenerToSquare = () => {
  let allSquares = document.querySelectorAll(
    "div.secret_square_div, div.square_div"
  );

  Array.from(allSquares).forEach(d => {
    d.addEventListener("click", clickSquare);
  });
};

const removeClickListenerToSquare = () => {
  let allSquares = document.querySelectorAll(
    "div.secret_square_div, div.square_div"
  );

  Array.from(allSquares).forEach(d => {
    d.classList.remove("hover_div");
    d.removeEventListener("click", clickSquare);
  });
};

const clickSquare = async e => {
  const row = e.target.getAttribute("row")
    ? e.target.getAttribute("row")
    : e.target.parentElement.getAttribute("row");
  const col = e.target.getAttribute("col")
    ? e.target.getAttribute("col")
    : e.target.parentElement.getAttribute("col");

  const result = await callServer("action", "POST", { row, col });

  if (result.status === "Game Over") {
    GameOverConfirm.render("Game Over! Do you want to restart game?");
    return;
  }

  const { success, newScore, clickLeft, isError } = result;
  updateScore(newScore);

  if (isError && clickLeft > 0) {
    showInfoDiv(`Keep clicking. You can uncover ${clickLeft} more tiles.`);
  } else {
    hideInfoDiv();
  }

  if (success) {
    if (!clickLeft) {
      e.target.parentElement
        .querySelector(".back")
        .style.setProperty("background-image", "url('/image/check.png')");
    }
    e.target.parentElement.classList.add("flip_div_Y");
    playGoodAudio();
  } else {
    e.target.style.setProperty("background-color", "red");
    playBadAudio();
  }

  e.target.parentElement.removeEventListener("click", clickSquare);

  if (!clickLeft) {
    removeClickListenerToSquare();
    removeHoverEffectToSquare();
    if (isError) {
      flipDiv(true);
      setTimeout(() => {
        animateBoard();
      }, 2000);
    } else {
      setTimeout(() => {
        animateBoard();
      }, 1000);
    }
  }
};

const doActions = actions => {
  document.querySelector("div#board_div").classList.add("rotated");

  setTimeout(() => {
    actions.forEach(({ row, col, success }) => {
      let div;
      if (success) {
        div = Array.from(document.querySelectorAll(".secret_square_div")).find(
          a => a.getAttribute("row") == row && a.getAttribute("col") == col
        );

        if (div) {
          div.classList.add("flip_div_Y");
        }
      } else {
        div = Array.from(document.querySelectorAll(".square_div")).find(
          a => a.getAttribute("row") == row && a.getAttribute("col") == col
        );

        if (div) {
          div.style.setProperty("background-color", "red");
        }
      }
    });
    addHoverEffectToSquare();
    addClickListenerToSquare();
  }, 1000);
};

const animateBoard = () => {
  let div = document.querySelector("div#board_div");

  if (div.classList.contains("show_div")) {
    div.classList.remove("show_div");
  }
  div.classList.add("hide_div");
  nextAudio.play();

  nextTrail();
};

const updateScore = newScore =>
  (document.getElementById("scoreInfo").innerText = `SCORE: ${
    newScore ? newScore : 0
  }`);

const nextTrail = async () => {
  await callServer("nextTrail", "POST", {});
  setTimeout(() => {
    window.location.reload();
  }, 1500);
};

const callServer = async (path, method, data) => {
  try {
    let url = `${window.location.origin}/${path}`;

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    return await response.json();
  } catch (e) {
    return e;
  }
};

const checkGameStatus = async () => await callServer("gameStatus", "POST", {});

const updateAnimationStatus = async () =>
  await callServer("animationStatus", "POST", { initAnimationRequired: false });

const playGoodAudio = () => {
  if (goodAudio.paused) {
    goodAudio.play();
  } else {
    goodAudio.currentTime = 0;
  }
};

const playBadAudio = () => {
  if (badAudio.paused) {
    badAudio.play();
  } else {
    badAudio.currentTime = 0;
  }
};

const showInfoDiv = msg => {
  let infoDiv = document.querySelector("#info_div");
  if (infoDiv) {
    infoDiv.style.display = "block";
    infoDiv.innerText = msg;
  }
};

const hideInfoDiv = () => {
  document.querySelector("#info_div").style.display = "none";
};

const stopGame = () => {
  TerminateConfirm.render("Are you sure you want to terminate?");
};
