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
    this.playRound();
}
QuizController.prototype.playRound = function() {
    console.log("playRound");
    this.reset();
    this.showQuizItem();

    // Give user a limited amount of time per question.
    let timeout = this.quiz.perQuestionTimeout;
    this.nextQuestionInterval = setInterval(this.getNextQuestionCallback(), timeout);

    // Configure a 1-second interval to drive a count down timer.
    this.countdownInterval = setInterval(this.getCountdownIntervalCallback(), 1000);
}
QuizController.prototype.getNextQuestionCallback = function() {
    let that = this;
    function nextQuestionCallback() {
        if (that.quiz.nextQuestion()) {
            that.quiz.countdown = that.quiz.perQuestionTimeout / 1000;
            that.showQuizItem()
        } else {
            // out of questions
            console.log("clearing timeouts...");
            clearTimeout(that.nextQuestionInterval);
            clearTimeout(that.countdownInterval);
            that.showTimeRemaining(); // display final '0' at end of quiz
        }
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
        // this.choiceListenerCallback = this.getChoiceListener();
        // $(document).on('click', ".choice", this.choiceListenerCallback);
    }
}
QuizController.prototype.showResponse = function(text) {
    this.responseId.textContent = text;
    this.responseId.style.visibility = "visible";
}
QuizController.prototype.showResults = function(text) {
    this.resultsId.textContent = text;
    this.resultsId.style.visibility = "visible";
}