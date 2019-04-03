# utbc2019-hw-05-quiz-engine

This week I'm working on an interval timer-based quiz game I'm calling Quiz Time ⏰.

Users answer a series of multiple choice questions, hopefully respond before a count-down timer expires and advances to the next question.

# Implementation Details

I knocked out the guts of the model and controller in a day.
# Designer's Log

## Blue Sky

As with my Word Stop ✋ game, I see all sorts of potential for a data-driven design, supporting various quizzes with unique visual and audio themes.  

Given that I'm learning about ajax and api endpoints, I wonder if there are json or xml standards already out there for this kind of data?  Perhaps my little quiz engine could be designed to tap into a wealth of content already out there.

![alt tag](docs/img/ui-spec.png)
([Image](https://flic.kr/p/24B2fo9) courtesy Gary Campbell-Hall, CC BY 2.0)

The other blue sky thought is how fun it would be to introduce some of the cool learning models out there that look at memory attenuation and how mastery and learning efficiency can be improved by repeating a question just at the point we have to struggle a little bit to recall it.

I've played with some of these so called 'spaced repetition systems' but have always felt disappointment at the lack of curation for the quiz decks that drive them and that get thrown up on the web.  There's no way to gauage the quality of 3rd party content, to easily flag errors, to see a history of changes over time, to contribute suggestions such that the content becomes better and more authoratative over time.

Coming up with a good deck of cards is very time consuming and really good decks should rise above the others and be evangelized and possibly opened sourced for community maintenance.  Fortunately a well understood model exists for this ... up-and-down voting, likes, and stars on social media.

💡 So before I come back down to earth and knock this assignment out, I'm thinking a very cool project would be a mashup of an SRS engine with github-backed curation. I know github's api provides all sorts of discovery features, so basic consumers of the quiz data could have a nice frontend that distills things down to star-ranked content.  Make it easy for a user to open feature requests or report bugs or problems with content through a streamlined frontend.  I've even seen chat integration in Visual Studio Code that leverages github authentication, so there's all sorts of potential for social integration.

## Terra Firma

I'm happy with the basic frontend design offered up in the problem spec, though I'll probably restyle it a bit:

![alt tag](docs/img/ui-spec.png)

Stacking the choices vertically maximizes horizontal screen usage and opens up our choices for longer text.  It also works nicely equally well on desktop and mobile.

For the backend data design, I'll go with a relatively simple structure, though I'll probably use some objects to allow for future support of responses that include images and other attributes besides just straight text.  I'll probably wedge in /some/ basic thematic meta data along with the quiz questions, now that I've been through this routine with Word Stop ✋.

I'm really liking promised-based [sweetalerts](https://sweetalert.js.org/), so they will likely make an appearance in my user interface.  They also support timeout behavior that would be natural to leverage when reporting the correct answer before automatically proceeding to the next question.

The whole MVC decomposition is becoming very natural for me.  I enjoy working on the model, then controller, then view.  Standing up a controller usually requires adding a very clunky and skeletal user interface at first, but it's cool to go back and transform that bit of dry html into something pleasing with CSS. 🦋

![alt tag](docs/img/mvc.png)
([Image](https://developer.chrome.com/apps/app_frameworks) courtesy Google, CC BY 3.0)


