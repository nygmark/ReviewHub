let flashcards = [];
let currentCard = 0;
let isFlipped = false;
let timerInterval = null;
let timeRemaining = 0;
let skippedCount = 0;
let timerPaused = false;

const card = document.getElementById('flashcard');
const front = document.getElementById('card-front');
const back = document.getElementById('card-back');
const timerDisplay = document.getElementById('timer-display');
const progressDisplay = document.getElementById('progress-display');
const skippedDisplay = document.getElementById('skipped-display');
const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');

function toggleTimerInput() {
  const mode = document.getElementById('mode').value;
  document.getElementById('timer-settings').style.display = mode === 'hard' ? 'block' : 'none';
}

function generateInputs() {
  const count = parseInt(document.getElementById('card-count').value);
  const inputDiv = document.getElementById('card-inputs');
  inputDiv.innerHTML = '';

  if (count > 0 && count <= 20) {
    for (let i = 0; i < count; i++) {
      inputDiv.innerHTML += `
        <div>
          <input type="text" placeholder="Question ${i + 1}" id="q${i}" required />
          <input type="text" placeholder="Answer ${i + 1}" id="a${i}" required />
        </div>
      `;
    }
    document.getElementById('start-button').style.display = 'inline-block';
  } else {
    alert("Please enter a number between 1 and 20.");
  }
}

function startFlashcards() {
  const count = parseInt(document.getElementById('card-count').value);
  const mode = document.getElementById('mode').value;

  flashcards = [];
  skippedCount = 0;
  updateSkippedDisplay();

  for (let i = 0; i < count; i++) {
    const question = document.getElementById(`q${i}`).value.trim();
    const answer = document.getElementById(`a${i}`).value.trim();
    if (!question || !answer) {
      alert("Please fill in all questions and answers.");
      return;
    }
    flashcards.push({ question, answer });
  }

  document.getElementById('setup-container').style.display = 'none';
  document.getElementById('flashcard-container').style.display = 'block';
  currentCard = 0;

  loadCard(currentCard);

  if (mode === 'hard') {
    pauseBtn.style.display = 'inline-block';
    resumeBtn.style.display = 'none';
  } else {
    pauseBtn.style.display = 'none';
    resumeBtn.style.display = 'none';
  }
}

function loadCard(index) {
  const { question, answer } = flashcards[index];
  front.textContent = question;
  back.textContent = answer;
  card.classList.remove('flipped');
  isFlipped = false;

  updateProgressDisplay();
  resetTimerIfNeeded();
}

function flipCard() {
  card.classList.toggle('flipped');
  isFlipped = !isFlipped;

  if (!isFlipped) {
    // Flipped back to question side
    restartTimerIfNeeded();
  } else {
    // Flipped to answer side
    clearInterval(timerInterval);
    timerDisplay.textContent = '';
    showPauseResumeButtons(false);
  }
}

function nextCard() {
  currentCard = (currentCard + 1) % flashcards.length;
  loadCard(currentCard);
}

function prevCard() {
  currentCard = (currentCard - 1 + flashcards.length) % flashcards.length;
  loadCard(currentCard);
}

function skipCard() {
  skippedCount++;
  updateSkippedDisplay();
  nextCard();
}

function updateProgressDisplay() {
  progressDisplay.textContent = `Card ${currentCard + 1} of ${flashcards.length}`;
}

function updateSkippedDisplay() {
  skippedDisplay.textContent = `Skipped: ${skippedCount}`;
}

function startTimer(seconds) {
  timeRemaining = seconds;
  timerPaused = false;
  timerDisplay.textContent = `⏱️ Time Left: ${timeRemaining}s`;
  showPauseResumeButtons(true);

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!timerPaused) {
      timeRemaining--;
      timerDisplay.textContent = `⏱️ Time Left: ${timeRemaining}s`;

      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        timerDisplay.textContent = `⏱️ Time Left: 0s`;

        if (!isFlipped) {
          flipCard(); // Auto flip on timeout
        }
        // Timer stops here, waits for user to flip back
        showPauseResumeButtons(false);
      }
    }
  }, 1000);
}

function pauseTimer() {
  timerPaused = true;
  showPauseResumeButtons(false);
}

function resumeTimer() {
  timerPaused = false;
  showPauseResumeButtons(true);
}

function showPauseResumeButtons(showPause) {
  if (showPause) {
    pauseBtn.style.display = 'inline-block';
    resumeBtn.style.display = 'none';
  } else {
    pauseBtn.style.display = 'none';
    resumeBtn.style.display = 'inline-block';
  }
}

function restartTimerIfNeeded() {
  const mode = document.getElementById('mode').value;
  const timerValue = parseInt(document.getElementById('timer').value);

  if (mode === 'hard') {
    clearInterval(timerInterval);
    startTimer(timerValue);
  }
}

function resetTimerIfNeeded() {
  const mode = document.getElementById('mode').value;
  const timerValue = parseInt(document.getElementById('timer').value);

  clearInterval(timerInterval);
  timerDisplay.textContent = '';
  showPauseResumeButtons(false);

  if (mode === 'hard') {
    startTimer(timerValue);
  }
}

card.addEventListener('click', flipCard);
