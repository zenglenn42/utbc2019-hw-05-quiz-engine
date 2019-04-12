
function QuizModel(quizKey = "Test", numItems = 3) {
    this.name = "Quiz Time ⏰";
    this.factory = new QuizFactory();
    this.questionTimeoutMsec = 5000;
    this.responseTimeoutMsec = 2000;    // Must come before setQuiz()!
    this.setQuiz(quizKey, numItems);    // Establishes this.quiz
}
QuizModel.prototype.helpText = "\
Match your wits against the clock in this timed trivia game.\
<br><hr>\
Select a quiz category above and press Play";
QuizModel.prototype.setQuiz = function(quizKey, numItems) {
    if (this.quiz) delete this.quiz;    // garbage collection
    this.quiz = this.factory.createQuiz(quizKey, numItems);
    this.reset();
}
QuizModel.prototype.getNumItems = function() {
    return this.quiz.numItems;
}
QuizModel.prototype.reset = function() {
    this.numCorrect = 0;
    if (this.quiz) this.quiz.reset();
    this.countdown = this.getQuestionTimeoutSec();
    this.state = "playing";
}
QuizModel.prototype.getSwalQuizSelections = function() {
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
QuizModel.prototype.incNumCorrect = function() {
        this.numCorrect++;
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

function UnitTestQuizModel() {
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
    console.log("Testing shuffling of quiz items ...");
    qm.quiz.shuffleItems();
    while (qm.quiz.hasMoreItems()) {
        let qi = qm.quiz.getNextItem();
        let qHtml = qm.quiz.getQuestionHtml(qi);
        let cHtml = qm.quiz.getChoicesHtml(qi);
        // console.log("quiz item: ", qi);
        console.log("question html: ", qHtml);
        console.log("choices html: ", cHtml);
    }
    qm.setQuiz("Movies", 4);
    while (qm.quiz.hasMoreItems()) {
        let qi = qm.quiz.getNextItem();
        let qHtml = qm.quiz.getQuestionHtml(qi);
        let cHtml = qm.quiz.getChoicesHtml(qi);
        // console.log("quiz item: ", qi);
        console.log("question html: ", qHtml);
        console.log("choices html: ", cHtml);
    }
    img = qm.quiz.getImgSrc();
    console.log("img: ", img);
    console.log("sweetalert select box input: ", qm.getSwalQuizSelections());
}