let allQuestions = [];

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function generateQuiz() {
  const text = document.getElementById("reviewerText").value.trim();
  const type = document.getElementById("questionType").value;
  const count = Math.min(parseInt(document.getElementById("questionCount").value), 30);
  if (!text || count <= 0) {
    alert("Please provide valid text and number.");
    return;
  }

  const sentences = text.match(/[^.!?]+[.!?]/g) || [];
  if (sentences.length < count) {
    alert("Not enough content to generate that many questions.");
    return;
  }

  allQuestions = [];

  for (let i = 0; i < count; i++) {
    const sentence = sentences[i % sentences.length].trim();
    if (type === "mcq") {
      const words = Array.from(new Set(text.split(/\s+/).map(word => word.replace(/[.,!?"]/g, "")).filter(w => w.length > 2 && isNaN(w))));
      const answer = sentence.split(" ")[0].replace(/[.,!?"]/g, "");
      let distractors = shuffle(words.filter(w => w !== answer)).slice(0, 3);
      const choices = shuffle([answer, ...distractors]);
      allQuestions.push({
        type: "mcq",
        question: `What word starts this sentence: "${sentence}"`,
        choices,
        answer
      });
    } else if (type === "tf") {
      const isTrue = Math.random() > 0.5;
      let questionText = sentence;
      if (!isTrue) {
        const words = sentence.split(" ");
        const indexToModify = Math.floor(Math.random() * words.length);
        const original = words[indexToModify];
        words[indexToModify] = original.length > 3 ? original.slice(0, -1) + "z" : "xyz";
        questionText = words.join(" ");
      }
      allQuestions.push({
        type: "tf",
        question: `True or False: ${questionText}`,
        answer: isTrue ? "true" : "false"
      });
    } else if (type === "id") {
      const keyWord = sentence.split(" ")[2] || "Unknown";
      allQuestions.push({
        type: "id",
        question: `What is the missing word: "${sentence.replace(keyWord, '___')}"?`,
        answer: keyWord
      });
    }
  }

  displayQuiz();
}

function displayQuiz() {
  const quizDiv = document.getElementById("quiz");
  quizDiv.innerHTML = "<h3>📝 Answer the questions:</h3>";
  quizDiv.classList.add("fade-in");

  allQuestions.forEach((q, i) => {
    if (q.type === "mcq") {
      quizDiv.innerHTML += `
        <div class="question">
          <p>Q${i + 1} of ${allQuestions.length}: ${q.question}</p>
          ${q.choices.map(c => `<label><input type="radio" name="q${i}" value="${c}"> ${c}</label><br>`).join("")}
        </div>
      `;
    } else if (q.type === "tf") {
      quizDiv.innerHTML += `
        <div class="question">
          <p>Q${i + 1} of ${allQuestions.length}: ${q.question}</p>
          <label><input type="radio" name="q${i}" value="true"> True</label>
          <label><input type="radio" name="q${i}" value="false"> False</label>
        </div>
      `;
    } else if (q.type === "id") {
      quizDiv.innerHTML += `
        <div class="question">
          <p>Q${i + 1} of ${allQuestions.length}: ${q.question}</p>
          <input type="text" name="q${i}" placeholder="Your answer">
        </div>
      `;
    }
  });

  quizDiv.innerHTML += `
    <button onclick="showResults()"><span>✅</span>Submit Answers</button>
    <button onclick="repeatQuiz()"><span>🔁</span>Repeat Quiz</button>
  `;

  quizDiv.style.display = "block";
  document.getElementById("result").style.display = "none";
  document.getElementById("progressBarContainer").style.display = "block";
  updateProgress(0);
}

function showResults() {
  let correctCount = 0;
  let result = "<h3>📊 Results:</h3><ul>";

  allQuestions.forEach((q, i) => {
    let userAnswer;
    if (q.type === "id") {
      userAnswer = document.querySelector(`input[name="q${i}"]`).value.trim();
    } else {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      userAnswer = selected ? selected.value : "(No answer)";
    }

    const isCorrect = userAnswer.toLowerCase() === q.answer.toLowerCase();
    if (isCorrect) correctCount++;
    result += `<li><strong>Q${i + 1}</strong>: ${isCorrect ? "✅" : "❌"} Your Answer: ${userAnswer} — Correct: ${q.answer}</li>`;
    updateProgress(((i + 1) / allQuestions.length) * 100);
  });

  result += `</ul><strong>Total Score: ${correctCount}/${allQuestions.length}</strong>`;
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = result;
  resultDiv.style.display = "block";
}

function repeatQuiz() {
  displayQuiz();
}

function updateProgress(percent) {
  document.getElementById("progressBar").style.width = percent + "%";
}
