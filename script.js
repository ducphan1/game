const animals = ["bau", "cua", "tom", "ca", "nai", "ga"];
const slots = ["slot1", "slot2", "slot3"];

let betScores = {
  bau: 0,
  cua: 0,
  tom: 0,
  ca: 0,
  nai: 0,
  ga: 0,
};

let totalBet = 0;
let isSpinning = false;

const spinButton = document.querySelector("#spin");
const resetButton = document.querySelector("#reset");
const resultDiv = document.querySelector("#result");
const betOptions = document.querySelectorAll(".bet-option");
const slotsDOM = document.querySelectorAll(".slot");

function disableButtons() {
  spinButton.disabled = true;
  resetButton.disabled = true;
  betOptions.forEach((option) =>
    option.removeEventListener("click", handleBet)
  );
}

function enableButtons() {
  spinButton.disabled = false;
  resetButton.disabled = false;
  betOptions.forEach((option) => option.addEventListener("click", handleBet));
}

function handleBet(event) {
  const animal = event.currentTarget.dataset.animal;

  if (totalBet < 3 && betScores[animal] < 3) {
    betScores[animal]++;
    totalBet++;
    event.currentTarget.querySelector(".bet-score").innerHTML =
      betScores[animal];
  } else if (betScores[animal] >= 3) {
    alert(`Bạn đã cược tối đa cho ${animal}.`);
  } else {
    alert("Bạn chỉ có thể đặt cược tối đa 3 hình.");
  }
}

resetButton.addEventListener("click", function () {
  totalBet = 0;
  for (let animal in betScores) {
    betScores[animal] = 0;
  }
  betOptions.forEach(
    (option) => (option.querySelector(".bet-score").innerHTML = 0)
  );
  resultDiv.innerHTML = "";
  enableButtons();
});

spinButton.addEventListener("click", function () {
  if (totalBet < 3) {
    alert("Bạn cần đặt cược ít nhất 3 hình trước khi quay!");
    return;
  }

  if (isSpinning) return;
  isSpinning = true;
  disableButtons();

  const spinIntervals = [];
  slots.forEach((slot, index) => {
    let count = 0;
    spinIntervals[index] = setInterval(() => {
      const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

      const slotElement = document.querySelector(`#${slot}`);
      slotElement.innerHTML = "";
      const imgElement = document.createElement("img");
      imgElement.src = `./image/${randomAnimal}.png`;
      imgElement.alt = randomAnimal;
      imgElement.style.width = "60px";
      imgElement.style.height = "60px";
      slotElement.appendChild(imgElement);

      count++;
      if (count >= 100) {
        clearInterval(spinIntervals[index]);
        if (index === slots.length - 1) {
          isSpinning = false;
          enableButtons();
          checkResult();
        }
      }
    }, 50);
  });
});

function checkResult() {
  const result = Array.from(slotsDOM).map(
    (slot) => slot.querySelector("img").alt
  );

  let allCorrect = true;

  for (let animal in betScores) {
    if (
      betScores[animal] > 0 &&
      result.filter((r) => r === animal).length !== betScores[animal]
    ) {
      allCorrect = false;
      break;
    }
  }

  if (allCorrect) {
    resultDiv.innerHTML = `Bạn đã đoán đúng với kết quả: ${result.join(", ")}`;
  } else {
    resultDiv.innerHTML = `Bạn đã đoán sai với kết quả: ${result.join(", ")}`;
  }
}

enableButtons();
