function QuizController(mainContainerId, timeRemainingId, questionId, choicesId, responseId, resultsId) {
    this.mainContainerId = document.getElementById(mainContainerId);
    this.timeRemainingId = document.getElementById(timeRemainingId);
    this.questionId = document.getElementById(questionId);
    this.choicesId = document.getElementById(choicesId);
    this.responseId = document.getElementById(responseId);
    this.resultsId = document.getElementById(resultsId);
    this.qm = new QuizModel();
    // this.countdownInterval = undefined;
    this.addMenuEventListeners();
    this.addQuizSelectionList();
    this.reset();
    this.showHelp();  // First time through, show help popup.
    this.clickCallback = this.getClickCallback();
    this.pauseCallback = this.getPauseCallback();
    this.showAnswerPauseCallback = this.getShowAnswerPauseCallback();
}

QuizController.prototype.reset = function() {
    // ... other controller reset things here!
    this.setQuizBackground();
    this.qm.reset();
    this.setTimeRemaining();
    this.hideDisplay();
    this.respondingToAnswer = false;
}

QuizController.prototype.hideDisplay = function() {
    this.mainContainerId.style.visibility = "hidden";
}

QuizController.prototype.unhideDisplay = function() {
    this.mainContainerId.style.visibility = "visible";
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
        that.reset();
        that.unhideDisplay();
        if (that.qm.quiz.hasMoreItems() && !that.respondingToAnswer) {
            let qi = that.qm.quiz.getNextItem();
            that.displayQuizItem(qi);
            that.respondingToAnswer = true;
            that.enableClicksAndTimers();
        }
    }
    return menuCallback;
}

QuizController.prototype.displayQuizItem = function(quizItem) {
    let qHtml = this.qm.quiz.getQuestionHtml(quizItem);
    this.questionId.innerHTML = qHtml;

    let cHtml = this.qm.quiz.getChoicesHtml(quizItem);
    this.choicesId.innerHTML = cHtml;
}

QuizController.prototype.getClickCallback = function() {
    let that = this;
    function innerCallback(e) {
        that.respondingToAnswer = true;

        console.log("click");
        console.log("this = ", this);   // button
        console.log("that = ", that);   // quiz controller

        // Once an answer button is clicked, we want to stop
        // the countdown timers and lock in the player's choice by
        // disabling other button clicks until the next question
        // is displayed.

        that.disableClicksAndTimers();
        if (this.getAttribute('id') == "answer") {
            that.congratulate();
            that.qm.incNumCorrect();
        } else {
            console.log("wrong");
            that.castigate();
        }
    }
    return innerCallback;
}

QuizController.prototype.getPauseCallback = function() {
    let that = this;
    function innerCallback(e) {
        console.log("that = ", that);
        // Enable the next quiz item to be fetched back in
        // the 'Play' callback.
        that.respondingToAnswer = false;
        console.log("getPauseCallback: enabling loop");
        if (that.qm.quiz.hasMoreItems() && !that.respondingToAnswer) {
            let qi = that.qm.quiz.getNextItem();
            that.displayQuizItem(qi);
            that.respondingToAnswer = true;
            that.enableClicksAndTimers();
        } else {
            that.hideDisplay();
            swal({
                type: 'success',
                html: `You got ${that.qm.getNumCorrect()} of ${that.qm.getNumItems()} correct.`,
                timer: 5000
            }).then(this.pauseCallback);
        }
    }
    return innerCallback;
}

QuizController.prototype.getShowAnswerPauseCallback = function() {
    let that = this;
    function innerCallback(e) {
        console.log("that = ", that);
        // Pause for an addition period to let player view
        // highlighted correct answer after alert has disappeared.
        setTimeout(that.pauseCallback, 2500);
    }
    return innerCallback;
}

QuizController.prototype.congratulate = function() {
    let praise = this.qm.quiz.getRandomPraise();
    console.log(praise);
    swal({
        type: 'success',
        html: praise,
        timer: 2000
    }).then(this.pauseCallback);
}

QuizController.prototype.castigate = function(bannerText) {
    let text = bannerText;
    this.showAnswer();
    console.log("castigate text: ", text);
    swal({
        type: 'error',
        html: text,
        timer: 1500
    }).then(this.showAnswerPauseCallback);
}

QuizController.prototype.enableClicksAndTimers = function() {
    console.log("enabling clicks");
    $(document).on('click', '.btn-choice', this.clickCallback);
    this.enableTimers();
}

QuizController.prototype.disableClicksAndTimers = function() {
    console.log("disabling clicks");
    this.disableClicks();
    this.disableTimers();
}

QuizController.prototype.disableClicks = function() {
    $(document).off('click', '.btn-choice', this.clickCallback);
}

QuizController.prototype.oneSecTimerCallback = function() {
    console.log("1 sec");
}

QuizController.prototype.questionTimerCallback = function() {
    console.log("question timeout");
    this.respondingToAnswer = true;
    // If player takes too long to answer, then suspend
    // play so the correct answer can be displayed.
    this.disableClicksAndTimers();
    this.castigate("Time's Up ⏰");
}

QuizController.prototype.enableTimers = function() {
    this.oneSecInterval = setInterval(this.oneSecTimerCallback.bind(this), 1000);
    this.questionInterval = setInterval(this.questionTimerCallback.bind(this), 5000);
}

QuizController.prototype.disableTimers = function() {
    clearInterval(this.oneSecInterval);
    clearInterval(this.questionInterval);
}

QuizController.prototype.showAnswer = function() {
    let answerID = document.getElementById("answer");
    answerID.setAttribute("style", "border: 7px solid orange");
}

QuizController.prototype.showHelp = function() {
    let helpTitle = `${this.qm.name}`;
    let helpStr = this.qm.helpText;
    swal(helpTitle, helpStr).then(function() {
        // TODO: Configure to allow dismissal outside modal.
        //       Otherwise throws a benign (but annoying)
        //       uncaught exception.
    });
}

QuizController.prototype.getHelpMenuEventCallback = function() {
    let that = this;
    function menuCallback(e) {
        that.showHelp();
    }
    return menuCallback;
}

QuizController.prototype.addQuizSelectionList = function() {
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
    this.addQuizSelectionListListener();
}

QuizController.prototype.addQuizSelectionListListener = function() {
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