document.addEventListener('DOMContentLoaded', function() {
    const topicButtons = document.querySelectorAll('.topic-selector button');
    const difficultySelector = document.getElementById('difficulty');
    const exerciseText = document.getElementById('exercise-text');
    const inputArea = document.getElementById('input-area');
    const checkButton = document.getElementById('check-button');
    const resultText = document.getElementById('result');
    const correctCountDisplay = document.getElementById('correct-count');
    const totalCountDisplay = document.getElementById('total-count');
    const canvas = document.getElementById('triangleCanvas');
    const ctx = canvas.getContext('2d');

    let currentTopic = null;
    let currentDifficulty = 'easy';
    let exerciseData = null;
    let correctCount = 0;
    let totalCount = 0;

    // Загружаем статистику из localStorage
    loadStatistics();

    topicButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentTopic = this.dataset.topic;
             generateExercise();
        });
    });

    difficultySelector.addEventListener('change', function() {
        currentDifficulty = this.value;
        if (currentTopic) {
          generateExercise();
        }
    });

    checkButton.addEventListener('click', checkAnswer);

    function generateExercise() {
         if (currentTopic === 'pythagorean') {
            exerciseData = generatePythagoreanExercise();
         } else if (currentTopic === 'cosine') {
             exerciseData = generateCosineExercise();
        }

          if(exerciseData) {
            exerciseText.textContent = exerciseData.text;
            inputArea.innerHTML = exerciseData.inputs;
            checkButton.style.display = 'block';
            resultText.textContent = '';
            drawTriangle(exerciseData.triangleData);
          }

    }

   function generatePythagoreanExercise() {
       let a, b, c, text, inputs, correct;
            switch (currentDifficulty) {
                case 'easy':
                  a = Math.floor(Math.random() * 8) + 3;
                  b = Math.floor(Math.random() * 8) + 3;
                  text = `Дан треугольник ABC с прямым углом C. Сторона a = ${a}, сторона b = ${b}. Найдите сторону c.`;
                  inputs = `<input type="number" id="answer" placeholder="Введите длину c">`;
                  correct = Math.sqrt(a*a + b*b);
                 return {
                    text,
                    inputs,
                    correct,
                   triangleData: { type: 'pythagorean', a, b }
                 };

                  case 'medium':
                     a = Math.floor(Math.random() * 10) + 5;
                     c = Math.floor(Math.random() * 10) + 10;
                    text = `Дан треугольник ABC с прямым углом C. Сторона a = ${a}, сторона c = ${c}. Найдите сторону b.`;
                     inputs = `<input type="number" id="answer" placeholder="Введите длину b">`;
                    correct = Math.sqrt(c*c - a*a);
                     return {
                        text,
                        inputs,
                        correct,
                        triangleData: { type: 'pythagorean', a, c }
                     };

                 case 'hard':
                     a = Math.floor(Math.random() * 10) + 5;
                     c = Math.floor(Math.random() * 10) + 10;
                    const angleA =  Math.floor(Math.random() * 80) + 10;
                     text = `Дан треугольник ABC с прямым углом C. Сторона a = ${a}, угол A = ${angleA}. Найдите сторону c.`;
                      inputs = `<input type="number" id="answer" placeholder="Введите длину c">`;
                    correct = a / Math.sin(angleA * Math.PI/180);

                     return {
                        text,
                        inputs,
                        correct,
                       triangleData: { type: 'pythagorean', a, angleA }
                     };
            }

   }


   function generateCosineExercise() {
            let a, b, angle, text, inputs, correct;
               switch (currentDifficulty) {
                  case 'easy':
                     a = Math.floor(Math.random() * 8) + 3;
                     b = Math.floor(Math.random() * 8) + 3;
                    angle = Math.floor(Math.random() * 70) + 30;
                       text = `Дан треугольник ABC. Сторона a = ${a}, сторона b = ${b}, угол между ними равен ${angle} градусов. Найдите сторону c.`;
                      inputs = `<input type="number" id="answer" placeholder="Введите длину c">`;
                        const angleRad = angle * Math.PI / 180;
                      correct = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(angleRad));
                       return {
                             text,
                             inputs,
                            correct,
                           triangleData: { type: 'cosine', a, b, angle }
                         };

                   case 'medium':
                        a = Math.floor(Math.random() * 10) + 5;
                        c = Math.floor(Math.random() * 10) + 10;
                        angle =  Math.floor(Math.random() * 70) + 30;
                       text = `Дан треугольник ABC. Сторона a = ${a}, сторона c = ${c}, угол между ними равен ${angle} градусов. Найдите сторону b.`;
                       inputs = `<input type="number" id="answer" placeholder="Введите длину b">`;
                    const angleRadMedium = angle * Math.PI / 180;
                     correct = Math.sqrt(a * a + c * c - 2 * a * c * Math.cos(angleRadMedium));
                       return {
                        text,
                        inputs,
                        correct,
                        triangleData: { type: 'cosine', a, c, angle }
                     };

                      case 'hard':
                     a = Math.floor(Math.random() * 10) + 5;
                     b = Math.floor(Math.random() * 10) + 5;
                     c = Math.floor(Math.random() * 10) + 10;
                    text = `Дан треугольник ABC. Сторона a = ${a}, сторона b = ${b}, сторона c = ${c}. Найдите угол между сторонами a и b`;
                    inputs = `<input type="number" id="answer" placeholder="Введите угол">`;
                    correct = Math.acos((a * a + b * b - c * c) / (2 * a * b)) * 180 / Math.PI;
                    return {
                            text,
                            inputs,
                            correct,
                          triangleData: { type: 'cosine', a, b, c }
                       };
              }
    }

    function checkAnswer() {
         const userAnswer = parseFloat(document.getElementById('answer').value);

         if(exerciseData){
               totalCount++;

                if (Math.abs(userAnswer - exerciseData.correct) < 0.1) {
                    resultText.textContent = 'Правильно!';
                    resultText.style.color = 'green';
                    correctCount++;
                } else {
                    resultText.textContent = `Неправильно! Правильный ответ: ${exerciseData.correct.toFixed(2)}`;
                    resultText.style.color = 'red';
                }
            updateStatistics();
          }
    }

    function drawTriangle(triangleData) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();

        if (triangleData.type === 'pythagorean') {
           const {a, b, c, angleA} = triangleData;

              if (a && b) {
                ctx.moveTo(20, 120);
                 ctx.lineTo(20, 120 - b * 10);
                 ctx.lineTo(20 + a * 10, 120 - b * 10);
               }  else if (a && c) {
                   ctx.moveTo(20, 120);
                  const angle = Math.acos(a/c) * 180/ Math.PI;

                 const x = Math.cos(angle * Math.PI/180) * c * 10
                 const y = Math.sin(angle * Math.PI/180) * c * 10
                   ctx.lineTo(20 + x, 120 - y);
                    ctx.lineTo(20,120 - y);
                } else if(a && angleA) {
                ctx.moveTo(20,120)
                const c = a/ Math.sin(angleA * Math.PI/180);
                 const x = Math.cos(angleA * Math.PI/180) * c * 10
                 const y = Math.sin(angleA * Math.PI/180) * c * 10

                 ctx.lineTo(20 + x, 120 - y);
                 ctx.lineTo(20,120 - y);
                }



        } else if (triangleData.type === 'cosine') {
          const {a, b, c, angle} = triangleData;
          if (a && b && angle) {

               const angleRad = angle * Math.PI/ 180;
               const x = Math.cos(angleRad) * b * 10;
               const y = Math.sin(angleRad) * b * 10;
               ctx.moveTo(20, 120);
                ctx.lineTo(20 + b* 10, 120);
                ctx.lineTo(20 + x, 120 - y );
              } else if (a && c && angle) {
                 const angleRad = angle * Math.PI/ 180;
                  const x = Math.cos(angleRad) * c * 10;
                 const y = Math.sin(angleRad) * c * 10;
                 ctx.moveTo(20,120)
                 ctx.lineTo(20 + x,120 - y)
                 ctx.lineTo(20+ a* 10 , 120);

              } else if(a && b && c) {
                  const angle =  Math.acos((a * a + b * b - c * c) / (2 * a * b)) * 180 / Math.PI;
                    const x = Math.cos(angle * Math.PI/180) * b * 10;
                   const y = Math.sin(angle * Math.PI/180) * b * 10;
                   ctx.moveTo(20, 120);
                    ctx.lineTo(20 + b* 10, 120);
                   ctx.lineTo(20 + x, 120 - y );
              }

        }
         ctx.closePath();
         ctx.stroke();
    }

    function updateStatistics() {
        correctCountDisplay.textContent = correctCount;
        totalCountDisplay.textContent = totalCount;
        saveStatistics();
    }

    function saveStatistics() {
       localStorage.setItem('correctCount', correctCount);
        localStorage.setItem('totalCount', totalCount);
    }

    function loadStatistics() {
        const savedCorrectCount = localStorage.getItem('correctCount');
         const savedTotalCount = localStorage.getItem('totalCount');

           if (savedCorrectCount !== null && savedTotalCount !== null) {
            correctCount = parseInt(savedCorrectCount);
            totalCount = parseInt(savedTotalCount);
            updateStatistics();
        }
    }
});