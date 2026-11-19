/* =========================================================
   Cronômetro com voltas
   Seções: 1 Estado | 2 Elementos | 3 Utilitários | 4 Som
           5 Ações | 6 Renderização | 7 Eventos | 8 Início
   ========================================================= */

// ---------- 1. Estado ----------
// Toda informação que muda vive aqui. A tela só "desenha" este objeto.
const INITIAL_STATE = {
  running: false,
  intervalId: null,
  startedAt: 0,      // instante (performance.now) em que começou a rodar
  elapsedBefore: 0,  // tempo acumulado antes da última pausa
  lastLapAt: 0,      // tempo total no momento da última volta
  laps: [],          // [{ split, total }]
};

const state = { ...INITIAL_STATE };

const TICK_MS = 10;

// ---------- 2. Elementos ----------
const totalEl = document.getElementById("total");
const currentEl = document.getElementById("current");
const toggleBtn = document.getElementById("toggle");
const lapBtn = document.getElementById("lap");
const resetBtn = document.getElementById("reset");
const soundInput = document.getElementById("sound");
const countEl = document.getElementById("count");
const lapsHeadEl = document.getElementById("laps-head");
const emptyEl = document.getElementById("empty");
const lapsEl = document.getElementById("laps");

// ---------- 3. Utilitários ----------
function getElapsed() {
  if (!state.running) return state.elapsedBefore;
  return state.elapsedBefore + (performance.now() - state.startedAt);
}

function pad(number) {
  return String(number).padStart(2, "0");
}

// 83450 ms -> "01:23.45"
function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor(ms / 1000) % 60;
  const centiseconds = Math.floor(ms / 10) % 100;
  return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
}

function formatLapCount(count) {
  return count === 1 ? "1 volta" : `${count} voltas`;
}

// ---------- 4. Som ----------
let audioContext = null;

function beep(frequency = 660, duration = 0.08) {
  if (!soundInput.checked) return;

  try {
    // O navegador só libera áudio depois de um clique, por isso criamos aqui.
    audioContext = audioContext || new AudioContext();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;

    oscillator.type = "square";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(now + duration);
  } catch (error) {
    console.warn("Áudio indisponível:", error);
  }
}

// ---------- 5. Ações ----------
function start() {
  state.startedAt = performance.now();
  state.running = true;
  state.intervalId = setInterval(renderTime, TICK_MS);

  toggleBtn.textContent = "Pausar";
  lapBtn.disabled = false;
  resetBtn.disabled = false;
  beep(740);
}

function pause() {
  clearInterval(state.intervalId);
  state.elapsedBefore = getElapsed(); // calcula antes de marcar como parado
  state.running = false;
  state.intervalId = null;

  toggleBtn.textContent = "Continuar";
  lapBtn.disabled = true;
  renderTime();
  beep(440);
}

function toggle() {
  if (state.running) {
    pause();
  } else {
    start();
  }
}

function addLap() {
  if (!state.running) return;

  const total = getElapsed();
  state.laps.push({ split: total - state.lastLapAt, total });
  state.lastLapAt = total;

  renderLaps({ animateNewest: true });
  beep(988, 0.06);
}

function reset() {
  clearInterval(state.intervalId);
  Object.assign(state, INITIAL_STATE, { laps: [] }); // novo array, sem reaproveitar o antigo

  toggleBtn.textContent = "Iniciar";
  lapBtn.disabled = true;
  resetBtn.disabled = true;
  renderTime();
  renderLaps();
  beep(330, 0.12);
}

// ---------- 6. Renderização ----------
function renderTime() {
  const total = getElapsed();
  totalEl.textContent = formatTime(total);
  currentEl.textContent = `Volta atual ${formatTime(total - state.lastLapAt)}`;
}

// Descobre qual é a volta mais rápida e a mais lenta (só com 2+ voltas diferentes)
function getLapExtremes(laps) {
  const splits = laps.map((lap) => lap.split);
  const fastest = Math.min(...splits);
  const slowest = Math.max(...splits);
  const canCompare = laps.length >= 2 && fastest !== slowest;
  return { fastest, slowest, canCompare };
}

function createLapItem(lap, index, extremes, isNewest) {
  const item = document.createElement("li");
  item.className = "lap lap-row";

  const number = document.createElement("span");
  number.className = "lap__number";
  number.textContent = `#${index + 1}`;

  const split = document.createElement("span");
  split.textContent = formatTime(lap.split);

  const total = document.createElement("span");
  total.className = "lap__total";
  total.textContent = formatTime(lap.total);

  const tag = document.createElement("span");
  tag.className = "lap__tag";

  if (extremes.canCompare && lap.split === extremes.fastest) {
    item.classList.add("lap--fast");
    tag.textContent = "mais rápida";
  }
  if (extremes.canCompare && lap.split === extremes.slowest) {
    item.classList.add("lap--slow");
    tag.textContent = "mais lenta";
  }
  if (isNewest) {
    item.classList.add("lap--new");
  }

  item.append(number, split, total, tag);
  return item;
}

function renderLaps({ animateNewest = false } = {}) {
  const { laps } = state;
  const hasLaps = laps.length > 0;
  const extremes = hasLaps ? getLapExtremes(laps) : null;

  lapsEl.replaceChildren();
  emptyEl.hidden = hasLaps;
  lapsHeadEl.hidden = !hasLaps;
  countEl.textContent = formatLapCount(laps.length);

  // Do fim para o começo: a volta mais recente aparece no topo
  for (let index = laps.length - 1; index >= 0; index--) {
    const isNewest = animateNewest && index === laps.length - 1;
    lapsEl.append(createLapItem(laps[index], index, extremes, isNewest));
  }
}

// ---------- 7. Eventos ----------
toggleBtn.addEventListener("click", toggle);
lapBtn.addEventListener("click", addLap);
resetBtn.addEventListener("click", reset);

document.addEventListener("keydown", (event) => {
  if (event.repeat || event.target.tagName === "INPUT") return;

  const key = event.key.toLowerCase();

  if (event.code === "Space") {
    event.preventDefault();
    toggle();
  } else if (key === "l") {
    addLap();
  } else if (key === "r" && !resetBtn.disabled) {
    reset();
  }
});

// ---------- 8. Início ----------
renderTime();
renderLaps(); 