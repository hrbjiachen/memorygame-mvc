const init = () => {
  new Audio("../sound/score_count.wav").play();
  let scoreDiv = document.getElementById("score_info");
  if (score_info) {
    const score = scoreDiv.getAttribute("score")
      ? scoreDiv.getAttribute("score")
      : 0;
    animateScore(0, score, scoreDiv);
  }
};

const animateScore = (curScore, actualScore, scoreDiv) => {
  if (curScore < actualScore) {
    setTimeout(() => {
      scoreDiv.innerText = `Score: ${curScore + 1}`;
      animateScore(curScore + 1, actualScore, scoreDiv);
    }, 100);
  }
};

const restartGame = () => {
  window.location.replace(window.location.origin);
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

const submitScore = async () => {
  const name = document.getElementById("name").value;
  if (!name || 0 === name.trim().length) {
    showToastMessage("Name field is required!");
  } else {
    const response = await callServer("saveGameScore", "POST", { name });
    window.location.replace(
      `${window.location.origin}/leaderboard/${response.userId}`
    );
  }
};

const showToastMessage = msg => {
  let toastMessage = document.getElementById("snackbar");
  toastMessage.innerText = msg;

  toastMessage.classList.add("show");
  setTimeout(() => {
    toastMessage.classList.remove("show");
  }, 2000);
};
