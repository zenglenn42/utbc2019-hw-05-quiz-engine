function QuizController(themeNameId, timeRemainingId, questionId, choicesId, responseId, resultsId) {
    this.themeNameId = document.getElementById(themeNameId);
    this.timeRemainingId = document.getElementById(timeRemainingId);
    this.questionId = document.getElementById(questionId);
    this.choicesId = document.getElementById(choicesId);
    this.responseId = document.getElementById(responseId);
    this.resultsId = document.getElementById(resultsId);
    this.qm = new QuizModel();
    // this.choiceListenerCallback = undefined;
    // this.nextQuestionInterval = undefined;
    // this.countdownInterval = undefined;
    this.addMenuEventListeners();
}

QuizController.prototype.addMenuEventListeners = function() {
    
    // let hintId = document.getElementById("navbar-btn");
    // hintId.addEventListener('click', this.getHintMenuEventCallback(), false);

    // let statsId = document.getElementById("stats-link");
    // statsId.addEventListener('click', this.getStatsMenuEventCallback(),false);

    let helpId = document.getElementById("help-link");
    helpId.addEventListener('click', this.getHelpMenuEventCallback(), false);
}

QuizController.prototype.getHelpMenuEventCallback = function() {
    let that = this;
    function menuCallback(e) {
        let helpTitle = `${that.qm.name}`;
        let helpStr = that.qm.helpText;
        swal(helpTitle, helpStr).then(function() {
            // that.setFocus();
        });
    }
    return menuCallback;
}