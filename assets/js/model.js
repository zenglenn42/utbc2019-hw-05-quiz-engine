
function QuizModel(quizKey = "Test") {
    this.factory = new QuizFactory();
    this.quiz = this.factory.createQuiz(quizKey);
    this.questionTimeoutMsec = 5000;
    this.responseTimeoutMsec = 2000;
    this.numCorrect = 0;
    this.reset();
}
QuizModel.prototype.reset = function() {
    this.numCorrect = 0;
    this.quiz.reset();
    this.countdown = this.getQuestionTimeoutSec();
    this.state = "playing";
}
QuizModel.prototype.getQuizSelections = function() {
    results = {};
    results["inputOptions"] = this.factory.swalQuizSelect();
    results["inputValue"] = this.quiz.getName();
    results["inputPlaceholder"] = "Select Quiz";
    return results;
}
QuizModel.prototype.getCountdown = function() {
    return this.countdown;
}
QuizModel.prototype.resetCountdown = function() {
    this.countdown = this.getQuestionTimeoutSec();
}
QuizModel.prototype.takeTurn = function() {
    if (this.state === "playing") {
        if (!this.quiz.hasMoreItems()) {
            this.state = "done";
        }
    }
    return this.state;
}
QuizModel.prototype.incCorrect = function() {
    if (this.state === "playing") {
        this.numCorrect++;
    }
}
QuizModel.prototype.getNumCorrect = function() {
    return this.numCorrect;
}
QuizModel.prototype.getResponseTimeoutMsec = function() {
    return this.responseTimeoutMsec;
}
QuizModel.prototype.getQuestionTimeoutSec = function() {
    return this.questionTimeoutMsec / 1000;
}
QuizModel.prototype.getQuestionTimeoutMsec = function() {
    return this.questionTimeoutMsec;
}

function UnitTestQuiz() {
    qm = new QuizModel("Test");
    console.log("quiz name: ", qm.quiz.getName());
    console.log("question timeout sec: ", qm.getQuestionTimeoutSec());
    console.log("question timeout msec: ", qm.getQuestionTimeoutMsec());
    console.log("response timeout msec: ", qm.getResponseTimeoutMsec());
    console.log("getCountdown: ", qm.getCountdown());
    let img = qm.quiz.getImgSrc();
    console.log("img = ", img);
    while (qm.quiz.hasMoreItems()) {
        let qi = qm.quiz.getNextItem();
        let qHtml = qm.quiz.getQuestionHtml(qi);
        let cHtml = qm.quiz.getChoicesHtml(qi);
        // console.log("quiz item: ", qi);
        console.log("question html: ", qHtml);
        console.log("choices html: ", cHtml);
    }
    qm.quiz.shuffleItems();
    while (qm.quiz.hasMoreItems()) {
        let qi = qm.quiz.getNextItem();
        let qHtml = qm.quiz.getQuestionHtml(qi);
        let cHtml = qm.quiz.getChoicesHtml(qi);
        // console.log("quiz item: ", qi);
        console.log("question html: ", qHtml);
        console.log("choices html: ", cHtml);
    }
    delete qm.quiz;
    qm.quiz = qm.factory.createQuiz("Movies", 4);
    while (qm.quiz.hasMoreItems()) {
        let qi = qm.quiz.getNextItem();
        let qHtml = qm.quiz.getQuestionHtml(qi);
        let cHtml = qm.quiz.getChoicesHtml(qi);
        // console.log("quiz item: ", qi);
        console.log("question html: ", qHtml);
        console.log("choices html: ", cHtml);
    }
    img = qm.quiz.getImgSrc();
    console.log("img = ", img);
}