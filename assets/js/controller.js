function QuizController(themeNameId, timeRemainingId, questionId, choicesId, responseId, resultsId) {
    this.themeNameId = document.getElementById(themeNameId);
    this.timeRemainingId = document.getElementById(timeRemainingId);
    this.questionId = document.getElementById(questionId);
    this.choicesId = document.getElementById(choicesId);
    this.responseId = document.getElementById(responseId);
    this.resultsId = document.getElementById(resultsId);
    this.quiz = new Quiz(sampleQuiz);
    this.choiceListenerCallback = undefined;
    this.nextQuestionInterval = undefined;
    this.countdownInterval = undefined;
}
QuizController.prototype.play = function(bannerText, buttonText = "Play") {
    this.reset();
    swal({
        text: bannerText,
        buttons: [true, buttonText]
    }).then((yesPlay) => {
        if (yesPlay) {
            this.showQuizItem();

            // Give user a limited amount of time per question.
            let timeout = this.quiz.perQuestionTimeout;
            this.nextQuestionInterval = setInterval(this.getNextQuestionCallback(), timeout);
        
            // Configure a 1-second interval to drive a count down timer.
            this.countdownInterval = setInterval(this.getCountdownIntervalCallback(), 1000);
        } else {
            trl = document.getElementById("tr-label");
            trl.style.visibility = "hidden";
        }
    });
}
QuizController.prototype.getNextQuestionCallback = function() {
    let that = this;
    function nextQuestionCallback() {
        let responseCB = that.getResponseCallback();
        swal({
            text: "Time's Up!\nAnswer: " + that.quiz.getAnswerText(),
            icon: "error",
            timer: that.quiz.perResponseTimeout
        }).then(function() {
            clearTimeout(that.nextQuestionInterval);
            clearTimeout(that.countdownInterval);
            that.showTimeRemaining(); // display final '0' at end of quiz
            that.quiz.resetCountdown();
            responseCB();
        });
    }
    return nextQuestionCallback;
}
QuizController.prototype.getCountdownIntervalCallback = function() {
    let that = this;
    function countdownIntervalCallback() {
        console.log("tick");
        that.showTimeRemaining();
        that.quiz.countdown--
    }
    return countdownIntervalCallback;
}
QuizController.prototype.showQuizItem = function() {
    this.showQuestion();
    this.showChoices();
}
QuizController.prototype.reset = function() {
    this.quiz.reset();
    this.displayReset();
}
QuizController.prototype.displayReset = function() {
    this.timeRemainingId.innerHTML = this.quiz.perQuestionTimeout / 1000;
    this.questionId.innerHTML = "";
    this.choicesId.innerHTML = "";
    this.responseId.innerHTML = "";
    this.resultsId.innerHTML = "";
}
QuizController.prototype.showTimeRemaining = function() {
    this.timeRemainingId.textContent = this.quiz.countdown;
}
QuizController.prototype.showQuestion = function() {
    let q = this.quiz.getQuestionText();
    console.log("q = ", q);
    this.questionId.textContent = q;
}
QuizController.prototype.showChoices = function() {
    let choices = this.quiz.getChoicesText();
    this.choicesId.innerHTML = "";
    for (let i in choices) {
        console.log("choice = ", choices[i]);
        childId = document.createElement('p');
        childId.setAttribute("class", "choice");
        childId.textContent = choices[i];
        childId.setAttribute("data-index", i);
        this.choicesId.append(childId);
    }
    this.choiceListenerCallback = this.getChoiceListenerCallback();
    $(document).on('click', ".choice", this.choiceListenerCallback);
}
QuizController.prototype.getChoiceListenerCallback = function() {
    let that = this;
    function choiceListenerCallback() {
        console.log("choiceListenerCallback");
        clearTimeout(that.nextQuestionInterval);
        clearTimeout(that.countdownInterval);
        that.quiz.resetCountdown();
        let answerIndex = parseInt(this.getAttribute("data-index"));
        let responseCB = that.getResponseCallback();
        if (that.quiz.isCorrect(answerIndex)) {
            swal({
                text: that.quiz.getRandomPraise(),
                icon: "success",
                timer: that.quiz.perResponseTimeout
            }).then(function() { 
                that.quiz.incCorrect();
                responseCB();
            });
        } else {
            swal({
                text: "Answer: " + that.quiz.getAnswerText(),
                icon: "error",
                timer: that.quiz.perResponseTimeout
            }).then(function() {
                responseCB();
            });
        }
        // Allow only one answer to be selected

        // Sadly, the following doesn't seem to remove the click listener on the
        // choices.  
        //
        // els = document.querySelectorAll(".choice");
        // for (let el of els) {
        //     console.log("removing el = ", el);
        //     el.removeEventListener('click', that.choiceListenerCallback, false);
        // }
        //
        // So I'm just gonna wipeout the innerHTML for now.
        //
        that.choicesId.innerHTML = "";
    }
    return choiceListenerCallback;
}
QuizController.prototype.getResponseCallback = function() {
    let that = this;
    function responseCallback() {
        console.log("responseCallback");
        if (that.quiz.nextQuestion()) {
            that.displayReset();
            that.showQuizItem();
            // Give user a limited amount of time per question.
            let timeout = that.quiz.perQuestionTimeout;
            that.nextQuestionInterval = setInterval(that.getNextQuestionCallback(), timeout);
            // Configure a 1-second interval to drive a count down timer.
            that.countdownInterval = setInterval(that.getCountdownIntervalCallback(), 1000);
        } else {
            console.log("thanks for playing");
            that.showResults();
        }
    }
    return responseCallback;
}
QuizController.prototype.showResults = function() {
    this.displayReset();
    let resultsStr = `You scored ${this.quiz.numCorrect} out of ${this.quiz.length()}.`;
    this.resultsId.textContent = resultsStr;
    this.resultsId.style.visibility = "visible";
    let bannerText = `Thanks for playing Quiz Time ⏰!\n${resultsStr}`;
    this.play(bannerText, buttonText = "Replay");
}
QuizController.prototype.showResponse = function(text) {
    this.responseId.textContent = text;
    this.responseId.style.visibility = "visible";
}