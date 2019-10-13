const startGame = async () => {
  try {
    const url = `${window.location.origin}/start`;
    const response = await fetch(url, { method: "POST" });
    if (response.redirected) {
      window.location.href = response.url;
    }
  } catch (e) {
    return e;
  }
};

const init = () => {};
