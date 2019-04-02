let sampleQuiz = {
    "theme": {
        imgSrc: "assets/img/default-theme",
        sound: {
            thinking: "",
            right: "",
            wrong: "",
            results: ""
        }
    },
    "questions": [
        {
            "question": {"text": "Who's on first?"},
            "choices": [
                {"text": "Who"},
                {"text": "What"},
                {"text": "Idunno"}
            ],
            "answerIndex": 0
        },
        {
            "question": {"text": "What's your favorite color?"},
            "choices": [
                {"text": "yellow"},
                {"text": "no, blue!"},
                {"text": "possibly indigo"},
                {"text": "teal, really"}
            ],
            "answerIndex": 3
        }
    ]
};

function Quiz(quizQuestions) {
    this.questions = quizQuestions.questions;
    this.theme = quizQuestions.theme;
    this.qIndex = 0;
    this.state = "playing"; // playing | done
}
Quiz.prototype.questions = {};
Quiz.prototype.timeoutSecs = 10;
Quiz.prototype.reset = function() {
    this.qIndex = 0;
    this.state = "playing"
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
    this.qIndex++;
}
Quiz.prototype.getQuestionText = function() {
    let q = "";
    if (this.isValidQuestionIndex()) {
        q = this.questions[this.qIndex].question.text;
    } else {
        console.warn("Quiz.getQuestionText: qIndex out of range: ", this.qIndex);
    }
    return q;
}
Quiz.prototype.getChoicesText = function() {
    let results = [];
    if (this.isValidQuestionIndex()) {
        let choices = this.questions[this.qIndex].choices;
        for (let choice of choices) {
            results.push(choice.text);
        }
    }
    return results;
}
Quiz.prototype.getAnswerText = function() {
    answerText = "";
    let answerIndex = this.getAnswerIndex();
    if (isNaN(answerIndex)) {
        return answerText;
    }
    answerText = this.questions[this.qIndex].choices[answerIndex].text;
    return answerText;
}
Quiz.prototype.getAnswerIndex = function() {
    let answerIndex = NaN;
    if (this.isValidAnswerIndex()) {
        answerIndex = this.questions[this.qIndex].answerIndex;
    }
    return answerIndex;
}
Quiz.prototype.isValidQuestionIndex = function() {
    return (this.qIndex >= 0 && 
            this.qIndex < this.questions.length &&
            this.questions.length >= 1) ? true : false;
}
Quiz.prototype.isValidAnswerIndex = function() {
    let result = false;
    if (this.isValidQuestionIndex()) {
        let answerIndex = this.questions[this.qIndex].answerIndex;
        if (answerIndex >= 0 && 
            answerIndex < this.questions[this.qIndex].choices.length &&
            this.questions[this.qIndex].choices.length >= 1) {
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
Quiz.prototype.length = function() { return this.questions.length };

function UnitTestQuiz() {
    quiz = new Quiz(sampleQuiz);
    console.log("quiz theme: ", quiz.theme);
    while (quiz.state === "playing") {
        let state = quiz.takeTurn();
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
        console.log("-----------------------")
        quiz.nextQuestion();
    }
}