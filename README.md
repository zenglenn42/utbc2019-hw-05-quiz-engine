# [Quiz Time ⏰ (demo)](https://zenglenn42.github.io/utbc2019-hw-05-quiz-engine/)

This week I'm working on a timer-based quiz engine I'm calling Quiz Time ⏰.

Users answer a series of multiple choice questions in the presence of a count-down timer. Results are presented at the end with the option to replay the quiz.

# Implementation Details

## Release 1.0 (MVP)

Here's what the final layout looks like on mobile:

![alt tag](docs/img/qt-mobile.png)

User's select from a variety of quizzes ...

![alt tag](docs/img/qt-select.png)

and then are presented a sequence of timed questions.  If they take too long, a times-up message displays followed by orange highlighting of the correct answer.

![alt tag](docs/img/qt-play.png)

Questions are statically pulled from the [Open Trivia Database](https://opentdb.com/) for several categories and integrated to the model through a chunk of [JSON](https://github.com/zenglenn42/utbc2019-hw-05-quiz-engine/blob/13f8a9893b81a2488b788bb229757c30ad51c5a9/assets/js/quiz-factory.js#L1524).  As a future enhancement, questions could be pulled live from the endpoint when internet is present.

![alt tag](docs/img/opentdb-log.png)

## Can we talk?

![alt tag](docs/img/can-we-talk.jpg)

So I got the basic MVP behavior working with my warm-puppy, quiz item [test schema](https://github.com/zenglenn42/utbc2019-hw-05-quiz-engine/blob/13f8a9893b81a2488b788bb229757c30ad51c5a9/assets/js/quiz-factory.js#L1478). But when I went to scale up with some [real input data](https://github.com/zenglenn42/utbc2019-hw-05-quiz-engine/blob/13f8a9893b81a2488b788bb229757c30ad51c5a9/assets/js/quiz-factory.js#L8) from the OpenTDB, the controller code started fighting me. [He talked a good game](https://github.com/zenglenn42/utbc2019-hw-05-quiz-engine/blob/220d4e9b134c6b671c09e8105af3495c250b8671/assets/js/controller.js#L1), but he buckled under the pressure of scale. I want an expedient badass, but he's gotta be able to wear a tuxedo too.  Oddly, I had a couple different code paths to the 'replay' state depending if the last question timed-out or the user clicked a response.  It just didn't feel right.

![alt tag](docs/img/tuxedo.jpg)
[QuizController 3.0](https://github.com/zenglenn42/utbc2019-hw-05-quiz-engine/blob/cc089c2eff0fa4fa75beb6bc6d6c6315c2d88bd8/assets/js/controller.js#L1)

The falt is all mine. Truth be told, I shot from the hip rather than breaking the controller task down into a cohesive set of user stories. I'm not saying I've learned the error of my ways, but I have distilled the controller down to a pretty defensible UML activity diagram. With that in mind, I'm gonna take another run at the controller. [Third time's the charm.](https://github.com/zenglenn42/utbc2019-hw-05-quiz-engine/blob/cc089c2eff0fa4fa75beb6bc6d6c6315c2d88bd8/assets/js/controller.js#L1) ;-)

![alt tag](docs/img/qt-act-dg.png)

I've got a responsive UI plugged in, leveraged from the last couple projects.

![alt tag](docs/img/qt-ui.png)

I've [refactored the model](https://github.com/zenglenn42/utbc2019-hw-05-quiz-engine/commit/13f8a9893b81a2488b788bb229757c30ad51c5a9) to cleanly support OpenTDB (and other schemas going forward). But this requires me to rework the controller a bit.

I did some googling and discovered there is indeed an endpoint called the [Open Trivia Database](https://opentdb.com) (OpenTDB) which serves up trivia questions in 24 categories as arrays of downloadable json. A typical ajax queryUrl for 40 multiple choice questions in the 'Comics' category looks like this:

```
https://opentdb.com/api.php?amount=40&category=29&type=multiple
```

with a typical json response looking like this:

```javascript
{
    "response_code": 0,
    "results": [
        {
            "category": "Entertainment: Comics",
            "correct_answer": "Bruce Wayne",
            "difficulty": "easy",
            "incorrect_answers": [
                "Clark Kent",
                "Barry Allen",
                "Tony Stark"
            ],
            "question": "Who is Batman?",
            "type": "multiple"
        },
        ...
    ]
}
```

The schema is a bit different from what I crafted on my own:

```javascript
{
    "theme": {
        "name": "Test Theme",
        "imgSrc": "assets/img/default-theme",
        ...
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
        ...
    ]
}
```

but I could normalize the OpenTDB content to work with my format ... or just support OpenTDB natively and abandon my schema. I'll sleep on it. But the good news is I have vetted data to drive my quiz engine. Ideally, I would wrapper the categories with my frontend and make ajax requests to the endpoint to harvest all that quiz data, but I'm mindful of limits on time. For MVP, I think just supporting the OpenTDB json format would be a big win and I can simply pull down 2 or 3 sets of questions locally and serve those up statically without much fuss. I'd still be exceeding the problem specification. For a follow-on release, I could tap into the entire OpenTDB dataset when internet is available. I do still have a gui to knock out and I would like to play with Material UI Lite. Can I do all this and be done in two days? :-)

Oh, the other thing I did today was start playing with UML to document my class diagrams. I'm using [StarUML](http://staruml.io/) which is pretty straight forward. I doc'd up mw [3rd homework](https://github.com/zenglenn42/utbc2019-hw-03-wordgame/blob/master/docs/img/ws-uml.png) assignment and will try to add UML for homeworks [4](https://github.com/zenglenn42/utbc2019-hw-04-crystal-collector/blob/master/docs/img/cc-uml.png) and 5 shortly.

I knocked out the guts of the quiz [json](https://github.com/zenglenn42/utbc2019-hw-05-quiz-engine/blob/7d374a4b17eee2ca725413aefdeb9055ce41fc12/assets/js/model.js#L1), [model](https://github.com/zenglenn42/utbc2019-hw-05-quiz-engine/blob/7d374a4b17eee2ca725413aefdeb9055ce41fc12/assets/js/model.js#L74) and [controller](https://github.com/zenglenn42/utbc2019-hw-05-quiz-engine/blob/7d374a4b17eee2ca725413aefdeb9055ce41fc12/assets/js/controller.js#L1) in a day. The models come pretty easily for me and are a natural starting point. I don't need any other pieces to get it going other than some wafer thin html and a console log:

![alt tag](docs/img/model-unit-test.png)

The controller was another story. It felt more like a street fight and had a ton of callbacks to manage both input clicks and various interval timers. First I stood up a primitive user interface:

![alt tag](docs/img/skeleton-ui.png)

and worked to get the controller to pull in quiz questions from the json in the model. I also add clickability to the response text. Once I got that going I started layering in the timer intervals. I dropped out of flow state a couple times and felt like I was atop some high-rise contruction project. I restarted by just focusing on the interval that brings up a new quiz item every 10 seconds, iterating over a short quiz of 3 questions for starters. Then I added the 1-second interval timer that drives the countdown timer. The count itself resides in the quiz model, but I provide methods to mutate it. Several times, I forgot to actually /invoke/ the closure that returns the callback reference as an argument to setInterval, killing the expected periodic behavior. I also got tripped up by the whole msec versus secs thing and would introduce what I thought was a 1 second timeout, only to have it fire in 1 msec with stuff happening in rapid succession. It was a beautiful thing to finally see questions advancing and the countdown timer at the top of the page decrementing:

![alt tag](docs/img/count-down.png)

For the longest time, I was unable to get the silly results to display until I realized I somehow had /two/ methods by the same name and I was mutating the one that wasn't firing! I guess this is the price I pay for javascript's permissive and relaxed feel versus the more hawkish forrays I've had with compiled languages like C++:

![alt tag](docs/img/bug-duplicate-methods.png)

The time invested with sweetalerts in a previous project allowed me to leverage the promise-based syntax nicely with action blocking in the replay scenario (sans the annoying behavior of native alerts that often render before some other prior DOM updates have rendered).

![alt tag](docs/img/replay.png)

# Designer's Log

## UML Class Diagram

![alt tag](docs/img/qt-cd.png)

## Blue Sky

As with my [Word Stop](https://github.com/zenglenn42/utbc2019-hw-03-wordgame/blob/fb11d26422f2a119c03826527539e3fdb5661f91/assets/js/lexicon.js#L36) game, I see all sorts of potential for a data-driven design, supporting various quizzes with unique visual and audio themes.

Given that I'm learning about ajax and api endpoints, I wonder if there are [json or xml standards already out](https://quizlet.com/api/2.0/docs) there for this kind of data? Perhaps my little quiz engine could be designed to tap into a wealth of content already out there.

![alt tag](docs/img/blue-sky.jpg)
[Image](https://flic.kr/p/24B2fo9) courtesy Gary Campbell-Hall, CC BY 2.0

The other blue sky thought is how fun it would be to introduce some of the cool learning models out there that look at memory attenuation and how mastery and learning efficiency can be improved by repeating a question just at the point we have to struggle a little bit to recall it.

I've played with some of these so called '[spaced repetition systems](https://en.wikipedia.org/wiki/Spaced_repetition)' but have always felt disappointment at the lack of curation for the quiz decks that drive them and that get thrown up on the web. There's no way to gauage the quality of 3rd party content, to easily flag errors, to see a history of changes over time, to contribute suggestions such that the content becomes better and more authoratative over time.

Coming up with a good deck of cards is very time consuming and really good decks should rise above the others and be evangelized and possibly opened sourced for community maintenance. Fortunately a well understood model exists for this ... up-and-down voting, likes, and stars on social media.

💡 So before I come back down to earth and knock this assignment out, I'm thinking a very cool project would be a mashup of an SRS engine with github-backed curation. I know github's api provides all sorts of discovery features, so basic consumers of the quiz data could have a nice frontend that distills things down to star-ranked content. Make it easy for a user to open feature requests or report bugs or problems with content through a streamlined frontend. I've even seen chat integration in Visual Studio Code that leverages github authentication, so there's all sorts of potential for social integration.

## Terra Firma

I'm happy with the basic frontend design offered up in the problem spec, though I'll probably restyle it a bit:

![alt tag](docs/img/ui-spec.jpg)

Stacking the choices vertically maximizes horizontal screen usage and opens up our choices for longer text. It also works nicely equally well on desktop and mobile.

For the backend data design, I'll go with a relatively simple structure, though I'll probably use some objects to allow for future support of responses that include images and other attributes besides just straight text. I'll probably wedge in /some/ basic thematic meta data along with the quiz questions, now that I've been through this routine with [Word Stop](https://github.com/zenglenn42/utbc2019-hw-03-wordgame/blob/fb11d26422f2a119c03826527539e3fdb5661f91/assets/js/lexicon.js#L36).

I'm really liking promised-based [sweetalerts](https://sweetalert.js.org/), so they will likely make an appearance in my user interface. They also support timeout behavior that would be natural to leverage when reporting the correct answer before automatically proceeding to the next question.

The whole MVC decomposition is becoming very natural for me. I enjoy working on the model, then controller, then view. Standing up a controller usually requires adding a very clunky and skeletal user interface at first, but it's cool to go back and transform that bit of dry html into something pleasing with CSS. 🦋

![alt tag](docs/img/mvc.png)
([Image](https://developer.chrome.com/apps/app_frameworks) courtesy Google, CC BY 3.0)

This is kinda how I'm currently thinking about MVC. I have seen diagrams where the model directly notifies the /view/, but my models really know nothing about the view from a behavior perspective. Perhaps that will change once I get into more sohpisticated frameworks that perform data binding between model and view. Most of the model interaction amounts to controller calls or controller instantiation of a model object. The controller is also in the eye of the storm, responding to user input events.
