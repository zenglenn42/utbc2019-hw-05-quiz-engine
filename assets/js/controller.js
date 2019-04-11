function QuizController(timeRemainingId, questionId, choicesId, responseId, resultsId) {
    // this.themeNameId = document.getElementById(themeNameId);
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
    this.setTimeRemaining();
    this.addQuizSelection();
}

QuizController.prototype.reset = function() {
    // ... other controller reset things here!
    this.setQuizBackground();
    this.qm.reset();
}

QuizController.prototype.setTimeRemaining = function() {
    this.timeRemainingId.textContent = this.qm.getCountdown();
}

QuizController.prototype.addMenuEventListeners = function() {
    let playId = document.getElementById("navbar-btn");
    playId.addEventListener('click', this.getPlayMenuEventCallback(), false);

    let helpId = document.getElementById("help-link");
    helpId.addEventListener('click', this.getHelpMenuEventCallback(), false);
}

QuizController.prototype.getPlayMenuEventCallback = function() {
    let that = this;
    function menuCallback(e) {
        while (that.qm.quiz.hasMoreItems()) {
            let qi = that.qm.quiz.getNextItem();

            let qHtml = that.qm.quiz.getQuestionHtml(qi);
            that.questionId.innerHTML = qHtml;

            let cHtml = that.qm.quiz.getChoicesHtml(qi);
            that.choicesId.innerHTML = cHtml;
        }
    }
    return menuCallback;
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

QuizController.prototype.addQuizSelection = function() {
    let pid = document.getElementById("navbar-brand");
    let sid = document.createElement("select");
    sid.setAttribute("id", "quiz-select");
    let quizNames = this.qm.factory.getQuizKeys();
    for (let name of quizNames) {
        let oid = document.createElement("option");
        oid.textContent = name;
        sid.appendChild(oid);
    }
    pid.appendChild(sid);
    // Let default model quiz drive the initial display.
    let quizIndex = quizNames.indexOf(this.qm.quiz.quizName);
    sid.selectedIndex = quizIndex;
    this.addQuizSelectionListener();
}

QuizController.prototype.addQuizSelectionListener = function() {
    var that = this;
    // TODO: Change this to vanilla js :)
    $(document).on("change", "#quiz-select", function(e) {
        console.log("cb selecting quiz: ", $(this).val());
        that.qm.setQuiz($(this).val());
        that.reset(); // reset controller and game model
    })
}

QuizController.prototype.setQuizBackground = function() {
    let id = document.getElementById("main");
    let imgSrc = this.qm.quiz.getImgSrc();
    if (id) {
        id.setAttribute("style", 
            `background: url('${imgSrc}') 0 / cover fixed; 
            background-position: center center;`
        );
    }
}