
function Quiz() {
    this.quizzes = new ThemedQuizzes();
    this.quizKey = "Test";
    this.quiz = this.quizzes.createQuiz(this.quizKey);
    this.qIndex = 0;
    this.state = "playing"; // playing | done
    this.perQuestionTimeout = 5000;
    this.perResponseTimeout = 2000;
    this.numCorrect = 0;
    this.resetCountdown();
}
Quiz.prototype.qIndex = 0;
Quiz.prototype.reset = function() {
    this.qIndex = 0;
    this.numCorrect = 0;
    this.resetCountdown();
    this.state = "playing";
    console.log("Quiz.reset this.quiz = ", this.quiz);
    this.quiz.shuffle();
}
Quiz.prototype.createQuiz = function(quizKey) {
    return this.quizzes.createQuiz(quizKey);
}
Quiz.prototype.setQuiz = function(quizKey) {
    if (this.quiz) {
        delete this.quiz;
    }
    this.quiz = {};
    this.quiz = this.createQuiz(quizKey);
}
Quiz.prototype.getQuizSelections = function() {
    results = {};
    results["inputOptions"] = this.quizzes.swalQuizSelect();
    results["inputValue"] = this.quizKey;
    results["inputPlaceholder"] = "Select Quiz";
    return results;
}
Quiz.prototype.resetCountdown = function() {
    this.countdown = this.perQuestionTimeout / 1000;
}
Quiz.prototype.getCountdown = function() {
    return this.countdown;
}
Quiz.prototype.takeTurn = function() {
    if (this.state === "playing") {
        if (!this.isValidQuestionIndex()) {
            this.state = "done";
        }
    }
    return this.state;
}
Quiz.prototype.nextQuestion = function() {
    if (this.quiz.quizItems.length == 0) return false;
    if (this.qIndex < (this.quiz.quizItems.length - 1)) {
        this.qIndex++;
        return true;
    }
    return false;
}
Quiz.prototype.getQuestionText = function() {
    let q = "";
    if (this.isValidQuestionIndex()) {
        q = this.quiz.getQuestionText(this.qIndex);
    } else {
        console.warn("Quiz.getQuestionText: qIndex out of range: ", this.qIndex);
    }
    return q;
}
Quiz.prototype.getChoicesText = function() {
    let results = [];
    if (this.isValidQuestionIndex()) {
        results = this.quiz.getChoicesText(this.qIndex);
    }
    return results;
}
Quiz.prototype.getAnswerText = function() {
    answerText = "";
    let answerIndex = this.getAnswerIndex();
    if (isNaN(answerIndex)) {
        return answerText;
    }
    answerText = this.quiz.quizItems[this.qIndex].choices[answerIndex].text;
    return answerText;
}
Quiz.prototype.getAnswerIndex = function() {
    let answerIndex = NaN;
    if (this.isValidAnswerIndex()) {
        answerIndex = this.quiz.quizItems[this.qIndex].answerIndex;
    }
    return answerIndex;
}
Quiz.prototype.isValidQuestionIndex = function() {
    return (this.qIndex >= 0 && 
            this.qIndex < this.quiz.quizItems.length &&
            this.quiz.quizItems.length >= 1) ? true : false;
}
Quiz.prototype.isValidAnswerIndex = function() {
    let result = false;
    if (this.isValidQuestionIndex()) {
        let answerIndex = this.quiz.quizItems[this.qIndex].answerIndex;
        if (answerIndex >= 0 && 
            answerIndex < this.quiz.quizItems[this.qIndex].choices.length &&
            this.quiz.quizItems[this.qIndex].choices.length >= 1) {
                result = true;
        } else {
            console.warn("Quiz.isValidAnswerIndex answerIndex invalid: ", answerIndex);
        }
    } else {
        console.warn("Quiz.isValidAnswerIndex qIndex invalid: ", this.qIndex);
    }
    return result;
}
Quiz.prototype.isCorrect = function(answerIndex) {
    let correctAnswerIndex = this.getAnswerIndex();
    if (isNaN(correctAnswerIndex)) {
        return false;
    }
    return (answerIndex === correctAnswerIndex);
}
Quiz.prototype.incCorrect = function() {
    if (this.state === "playing") {
        this.numCorrect++;
    }
}
Quiz.prototype.getNumCorrect = function() {
    return this.numCorrect;
}
Quiz.prototype.length = function() { return this.quiz.quizItems.length };
Quiz.prototype.getRandomPraise = function() {
    return this.quiz.getRandomPraise();
}
Quiz.prototype.getResultTimeoutSecs = function() {
    return this.perResponseTimeout;
}
Quiz.prototype.getQuestionTimeoutSecs = function() {
    return this.perQuestionTimeout;
}
Quiz.prototype.getThemeName = function() {
    return this.quiz.quizName;
}
Quiz.prototype.getThemeImgSrc = function() {
    return this.quiz.getImgSrc();
}
  
Quiz.prototype.shuffle = function() {
    this.quiz.shuffle();
}

function UnitTestQuiz() {
    quiz = new Quiz(sampleQuiz);
    console.log("quiz theme: ", quiz.theme);
    console.log("question timeout: ", quiz.getQuestionTimeoutSecs());
    console.log("result timeout: ", quiz.getResultTimeoutSecs());
    while (quiz.state === "playing") {
        let state = quiz.incCorrect();
        if (state === "done") break;
        let q = quiz.getQuestionText();
        console.log("Q: ", q);
        let c = quiz.getChoicesText();
        console.log("C: ", c);
        let ai = quiz.getAnswerIndex();
        console.log("answerIndex: ", ai);
        console.log(quiz.isCorrect(3));
        let atext = quiz.getAnswerText();
        console.log("answerText: ", atext);
        console.log(quiz.getRandomPraise());
        console.log(quiz.getRandomApprobation());
        console.log("-----------------------")
        quiz.nextQuestion();
    }
}