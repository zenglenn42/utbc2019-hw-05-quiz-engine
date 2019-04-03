let sampleQuiz = {
    "theme": {
        "name": "Test Theme",
        "imgSrc": "assets/img/default-theme",
        "sound": {
            thinking: "",
            right: "",
            wrong: "",
            results: ""
        },
        "praise": [
            {"text": "Nice job."},
            {"text": "Like a boss."},
            {"text": "You're so money."},
            {"text": "And you're sooo good looking."},
            {"text": "Sweet"},
            {"text": "You make this look easy."},
            {"text": "Correct"},
            {"text": "Chuck Norris thinks you're a badass."},
            {"text": "Whoa, dude :-)"},
            {"text": "So good."},
            {"text": "Right"}
        ],
        "approbation": [
            {"text": "Sorry"},
            {"text": "Better luck next time."},
            {"text": "Whoa, dude :-|"},
            {"text": "Denied"},
            {"text": "Don't quit your day job."},
            {"text": "Your mother still loves you."},
            {"text": "Nope"},
            {"text": "The light's on but nobody's home."},
            {"text": "Fail"},
            {"text": "Wrong"}
        ]
    },
    "timeouts": { // all units are in msecs.
        "perQuestion": 5000,
        "perResponse": 2000
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
        },
        {
            "question": {"text": "Some question?"},
            "choices": [
                {"text": "answer 1"},
                {"text": "answer b"},
                {"text": "answer red"},
                {"text": "answer pizza"}
            ],
            "answerIndex": 2
        }
    ],
};

function Quiz(quizQuestions) {
    this.questions = quizQuestions.questions;
    this.theme = quizQuestions.theme;
    this.qIndex = 0;
    this.state = "playing"; // playing | done
    this.perQuestionTimeout = quizQuestions.timeouts.perQuestion;
    this.perResponseTimeout = quizQuestions.timeouts.perResponse;
    this.numCorrect = 0;
    this.resetCountdown();
}
Quiz.prototype.qIndex = 0;
Quiz.prototype.questions = {};
Quiz.prototype.reset = function() {
    this.qIndex = 0;
    this.numCorrect = 0;
    this.resetCountdown();
    this.state = "playing"
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
    if (this.questions.length == 0) return false;
    if (this.qIndex < (this.questions.length - 1)) {
        this.qIndex++;
        return true;
    }
    return false;
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
Quiz.prototype.incCorrect = function() {
    this.numCorrect++;
}
Quiz.prototype.getNumCorrect = function() {
    return this.numCorrect;
}
Quiz.prototype.length = function() { return this.questions.length };
Quiz.prototype.getRandomPraise = function() {
    let i = Math.floor(Math.random() * this.theme.praise.length);
    return this.theme.praise[i].text;
}
Quiz.prototype.getRandomApprobation = function() {
    let i = Math.floor(Math.random() * this.theme.approbation.length);
    return this.theme.approbation[i].text;
}
Quiz.prototype.getResultTimeoutSecs = function() {
    return this.perResponseTimeout;
}
Quiz.prototype.getQuestionTimeoutSecs = function() {
    return this.perQuestionTimeout;
}
Quiz.prototype.getThemeName = function() {
    return this.theme.name;
}
Quiz.prototype.getThemeImgSrc = function() {
    return this.theme.imgSrc;
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