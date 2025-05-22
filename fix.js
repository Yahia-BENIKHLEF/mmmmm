
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
      const welcomeScreen = document.getElementById("welcome-screen");
      const characterMonsterScreen = document.getElementById("character-monster-screen");
      const statsScreen = document.getElementById("stats-screen");
      const outcomeScreen = document.getElementById("outcome-screen");
      const characterSelectButtons = document.querySelectorAll('[data-character]');
      const characterGIF = document.getElementById("character-gif");
      const outcomeTitle = document.getElementById("outcome-title");
      const outcomeMessage = document.getElementById("outcome-message");
      const scoreDetails = document.getElementById("score-details");
      const playerNameDisplay = document.getElementById("player-name-display");
      const gradesForm = document.getElementById("grades-form");
      const gradeInputsContainer = document.getElementById("grade-inputs-container");
      const statsButton = document.getElementById("stats-button");
      const rewardButton = document.getElementById("reward-button");
      const retryButton = document.getElementById("retry-button");
      const addGradeButton = document.getElementById("add-grade-button");
      const playerNameInput = document.getElementById("player-name");
      const instructionPopup = document.getElementById("instruction-popup");
      const gotItButton = document.getElementById("got-it-button");

      let characterType = "";
      let playerName = "";
      let numberOfGrades = 0;
      
      // Check if browser supports required features
      function checkCompatibility() {
        // Check for modern JavaScript features
        if (typeof Promise === 'undefined' || 
            typeof Object.assign === 'undefined' || 
            typeof Array.from === 'undefined') {
          alert("Your browser is outdated. Please update to the latest version for the best experience.");
          return false;
        }
        
        // Check for CSS features
        const style = document.createElement('div').style;
        if (!('flex' in style) || !('backdropFilter' in style) && !('webkitBackdropFilter' in style)) {
          alert("Some visual effects may not display properly on your browser. Consider updating.");
          return true; // Continue but with potential visual differences
        }
        
        return true;
      }

      // Initialize the game
      function initGame() {
        if (!checkCompatibility()) {
          return;
        }
        
        welcomeScreen.classList.remove("hidden");
        characterMonsterScreen.classList.add("hidden");
        statsScreen.classList.add("hidden");
        outcomeScreen.classList.add("hidden");
        instructionPopup.classList.add("hidden");
        playerNameInput.value = "";
        gradeInputsContainer.innerHTML = `
          <div class="mb-4">
            <label for="average-s1" class="block text-gray-700 text-sm font-bold mb-2">Average of S1:</label>
            <input type="number" id="average-s1" name="average-s1" placeholder="Average of S1"
              class="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              step="any" inputmode="decimal">
          </div>
        `;
        numberOfGrades = 0;
      }

      // Gender selection
      characterSelectButtons.forEach(button => {
        button.addEventListener('click', function() {
          characterType = this.getAttribute('data-character');
          updateCharacter(characterType);
          playerName = playerNameInput.value || "Brave Hero";
          playerNameDisplay.textContent = playerName;
          welcomeScreen.classList.add("hidden");
          characterMonsterScreen.classList.remove("hidden");
          
          // Show the instruction popup
          instructionPopup.classList.remove("hidden");
        });
      });

      // Got it button closes the popup
      gotItButton.addEventListener("click", () => {
        instructionPopup.classList.add("hidden");
      });

      // Update character GIF based on selection
      function updateCharacter(type) {
        if (type === "male") {
          characterGIF.src = "https://i.pinimg.com/originals/08/03/8e/08038e1f8e29bf85e7454cfebd939e70.gif";
        } else if (type === "female") {
          characterGIF.src = "https://i.pinimg.com/originals/f1/47/49/f147490c3913e730356e735a5ce77ecc.gif";
        }
        
        // Preload the images
        const img = new Image();
        img.src = characterGIF.src;
      }

      // Stats button
      statsButton.addEventListener("click", () => {
        characterMonsterScreen.classList.add("hidden");
        statsScreen.classList.remove("hidden");
        gradeInputsContainer.innerHTML = `
          <div class="mb-4">
            <label for="average-s1" class="block text-gray-700 text-sm font-bold mb-2">Average of S1:</label>
            <input type="number" id="average-s1" name="average-s1" placeholder="Average of S1"
              class="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              step="any" inputmode="decimal">
          </div>
        `;
        numberOfGrades = 0;
        
        // Focus on the first input field for better mobile UX
        setTimeout(() => {
          document.getElementById('average-s1').focus();
        }, 100);
      });

      // Add grade button
      addGradeButton.addEventListener('click', () => {
        numberOfGrades++;
        const div = document.createElement('div');
        div.innerHTML = `
          <label class="block text-gray-700 text-sm font-bold mb-2">Grade ${numberOfGrades}:</label>
          <div class="flex space-x-4 mb-4">
            <input type="number" id="exam${numberOfGrades}" placeholder="Exam (max 20)" max="20" step="any" inputmode="decimal"
              class="shadow border rounded w-1/3 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline">
            <input type="number" id="td${numberOfGrades}" placeholder="TD (max 20)" max="20" step="any" inputmode="decimal"
              class="shadow border rounded w-1/3 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline">
            <input type="number" id="coef${numberOfGrades}" placeholder="Coef" inputmode="numeric"
              class="shadow border rounded w-1/3 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline">
          </div>
        `;
        gradeInputsContainer.appendChild(div);
        
        // Focus on the first new input field
        setTimeout(() => {
          document.getElementById(`exam${numberOfGrades}`).focus();
        }, 100);
      });

      // Grades form submission
      gradesForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const s2Grades = [];
        let totalCoef = 0;
        let averageS1 = parseFloat(document.getElementById('average-s1').value) || 0;
        let s2Average = 0;

        for (let i = 1; i <= numberOfGrades; i++) {
          const exam = parseFloat(document.getElementById(`exam${i}`).value) || 0;
          const td = parseFloat(document.getElementById(`td${i}`).value) || 0;
          const coef = parseInt(document.getElementById(`coef${i}`).value) || 0;

          if (exam > 20 || td > 20) {
            alert("Grades must be 20 or less.");
            return;
          }
          
          if (coef > 0) {
            const grade = 0.6 * exam + 0.4 * td;
            s2Grades.push(grade * coef);
            totalCoef += coef;
          }
        }

        if (totalCoef === 0 && averageS1 === 0) {
          alert("Please enter at least one grade or the S1 average.");
          return;
        }

        if (s2Grades.length > 0 && totalCoef > 0) {
          s2Average = s2Grades.reduce((a, b) => a + b, 0) / totalCoef;
        }

        const finalGrade = averageS1 > 0 ? (averageS1 + s2Average) / 2 : s2Average;
        const outcome = finalGrade >= 10 ? "win" : "lose";
        displayOutcome(outcome, averageS1, s2Average, finalGrade);
        statsScreen.classList.add("hidden");
        outcomeScreen.classList.remove("hidden");
      });

      // Display outcome
      function displayOutcome(outcome, s1Average, s2Average, finalGrade) {
        // Clear previous visual elements
        const oldVisual = outcomeScreen.querySelector('.grade-mark, .outcome-medal');
        if (oldVisual) oldVisual.remove();

        // Set score details
        scoreDetails.innerHTML = `
          <h3 class="text-xl font-semibold text-gray-800">YOUR SCORE: ${finalGrade.toFixed(2)}</h3>
          <p class="text-gray-700">
            - s1 average: ${s1Average.toFixed(2)}<br>
            - s2 average: ${s2Average.toFixed(2)}
          </p>
        `;

        if (outcome === "win") {
          // WIN OUTCOME
          // Play win sound with user interaction fallback
          const winSound = new Audio('./sounds/win.mp3');
          winSound.play().catch(e => {
            console.log("Audio play failed, will play on button click");
          });

          // Confetti celebration
          try {
            confetti({
              particleCount: 200,
              spread: 100,
              colors: ['#FFD700', '#C0C0C0', '#CD7F32'] // Gold, Silver, Bronze
            });
          } catch (e) {
            console.log("Confetti animation failed");
          }

          // Add appropriate medal
          const medal = document.createElement('img');
          medal.className = 'outcome-medal';
          medal.alt = 'Achievement medal';
          
          if (finalGrade >= 15) {
            medal.src = 'https://i.pinimg.com/736x/c6/94/9c/c6949c9baf41972384f54d865a5aaab5.jpg';
            medal.title = 'Gold Medal (15+ Score)';
          } else if (finalGrade >= 13) {
            medal.src = 'https://i.pinimg.com/736x/33/e3/32/33e332285b421814c02b417d178e6339.jpg';
            medal.title = 'Silver Medal (13-14.99)';
          } else {
            medal.src = 'https://i.pinimg.com/736x/a8/ef/2c/a8ef2c3cc5752418d569b906cd065256.jpg';
            medal.title = 'Bronze Medal (10-12.99)';
          }
          
          // Preload the medal image
          const preloadMedal = new Image();
          preloadMedal.src = medal.src;
          
          document.querySelector('.outcome-content').appendChild(medal);

          outcomeTitle.innerHTML = `<h2 class="text-2xl font-bold text-green-600 mb-2">You Did It!</h2>`;
          outcomeMessage.textContent = "Great job!! You have defeated the monster. Your efforts were not wasted, now you will move to the next level. Good luck on your journey, hero!";
          rewardButton.textContent = "Claim your reward";
          rewardButton.className = "bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded";
          rewardButton.onclick = () => {
            winSound.play().catch(e => console.log("Audio play failed"));
            window.location.href = "https://youtu.be/TDJUot9OBLc?si=8cVIpRIcICq3j4hS";
          };
          
        } else {
          // LOSE OUTCOME
          // Play lose sound with user interaction fallback
          const loseSound = new Audio('./sounds/lose.mp3');
          loseSound.volume = 0.7;
          loseSound.play().catch(e => {
            console.log("Audio play failed, will play on button click");
          });

          // Add grade mark
          const gradeMark = document.createElement('img');
          gradeMark.src = 'https://i.pinimg.com/736x/ea/bd/ed/eabded250a91f0b48515acc635d26674.jpg';
          gradeMark.className = 'grade-mark';
          gradeMark.alt = 'Bad grade mark';
          
          // Preload the grade mark image
          const preloadMark = new Image();
          preloadMark.src = gradeMark.src;
          
          document.querySelector('.outcome-content').appendChild(gradeMark);

          outcomeTitle.innerHTML = `<h2 class="text-2xl font-bold text-red-600 mb-2">Game Over</h2>`;
          outcomeMessage.textContent = "Sadly the monster ate you, good luck on the retake. Keep fighting warrior!!! Never give up.";
          rewardButton.textContent = "Claim Encouragement";
          rewardButton.className = "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded";
          rewardButton.onclick = () => {
            loseSound.play().catch(e => console.log("Audio play failed"));
            window.location.href = "https://youtu.be/RdKZeXfvmJM?si=w6nR7IelUq5MBuuj&t=10";
          };
        }
      }

      // Retry button
      retryButton.addEventListener("click", () => {
        initGame();
      });

      // Initialize the game
      initGame();
    });
