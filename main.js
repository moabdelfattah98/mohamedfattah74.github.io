let countSpan = document.querySelector(".count span");
let currentIndex = 0;
let qContainer = document.querySelector(".quiz-area");
let answerContainer = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsCotainer = document.querySelector(".results");
let rightAnswers = 0;
let countInterval;
let bulletsContainer = document.querySelector(".bullets");

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.status === 200 && this.readyState === 4) {
      // console.log(this.responseText);

      let myQuestionsObject = JSON.parse(this.responseText);

      qCount = myQuestionsObject.length;

      createBullets(qCount);

      addData(myQuestionsObject[currentIndex], qCount);

      countDown( 2 , qCount);

      submitButton.onclick = function () {
        let rightAnswer = myQuestionsObject[currentIndex].right_answer;

        currentIndex++;

        checkAnswer(rightAnswer, qCount);

        answerContainer.innerHTML = "";

        qContainer.innerHTML = "";

        addData(myQuestionsObject[currentIndex], qCount);

        handleBullets();

        showResult(qCount);

        clearInterval(countInterval)

        countDown( 2 , qCount);

      };
    }
  };

  myRequest.open("get", "HTML_Questions.json", true);
  myRequest.send();
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  for (i = 0; i < num; i++) {
    let bulletSpan = document.createElement("span");
    document.querySelector(".spans").appendChild(bulletSpan);
    if (i === 0) {
      bulletSpan.className = "on";
    }
  }
}

function addData(obj, count) {
  if (currentIndex < count) {
    let qTitle = document.createElement("h2");
    let qText = document.createTextNode(obj.title);
    qTitle.appendChild(qText);
    qContainer.appendChild(qTitle);

    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.classList.add("answer");
      let input = document.createElement("input");

      input.name = "questions";
      input.type = "radio";
      input.id = `answer_${i}`;
      input.dataset.answer = obj[`answer_${i}`];

      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;

      labelText = document.createTextNode(obj[`answer_${i}`]);
      label.appendChild(labelText);

      mainDiv.appendChild(input);
      mainDiv.appendChild(label);

      answerContainer.appendChild(mainDiv);

      if (i === 1) {
        input.checked = true;
      }
    }
  }
}

function checkAnswer(rAns, count) {
  let answers = document.getElementsByName("questions");
  let choosenAnswer;

  for (i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenAnswer = answers[i].dataset.answer;
    }

    if (rAns === choosenAnswer) {
      rightAnswers++;
      console.log("FPerfect");
    }
  }
}

let handleBullets = () => {
  let bulletSpans = document.querySelectorAll(".bullets .spans span");

  bulletSpans.forEach((s, i) => {
    if (i === currentIndex) {
      s.classList.add("on");
    }
  });
};

let showResult = (count) => {
  let results;

  if (currentIndex === count) {
    console.log("hahaha");
    answerContainer.remove();
    qContainer.remove();
    bulletsContainer.remove();

    submitButton.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      results = `<span class="good">Good</span> YOU GOT ${rightAnswers} OUT Of ${count}`;
    } else if (rightAnswers === count) {
      results = `<span class="perfect">Perfect</span> YOU GOT ${rightAnswers} OUT OF ${count}`;
    } else {
      results = `<span class="bad">Good Luck Next Time</span> YOU GOT ${rightAnswers} OUT OF ${count}`;
    }
    resultsCotainer.innerHTML = results;
    resultsCotainer.style.padding = "10px";
    resultsCotainer.style.backgroundColor = "white";
    resultsCotainer.style.marginTop = "10px";
  }
};

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes , seconds;
    countInterval = setInterval(function(){
      minutes = parseInt(duration/60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;


      document.querySelector('.count-down').innerHTML =`${minutes}:${seconds}`

      if(--duration < 0){
        clearInterval(countInterval);
        console.log('finished');
        submitButton.click();
      }

    },1000)
  }
}
