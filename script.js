function quizGame(){
    // Define variables to store questions, time, score, all-time score
    // -- See questions.js for variable being used to store the questions
    let time = 0;
    const defaultTime = (15*questions.length);
    const penaltyTime = 15;
    let currentQuestion = 0;
    timeDisplayEl = document.getElementById("time-display")


    // Create code to start the game.
    // -- This was done with HTML. No need to dynamically generate ... currently
    function firstButtons() {
        document.getElementById("start-btn").addEventListener("click", function(){
            document.getElementById("main-container").innerHTML = "";
            currentQuestion = 0;
            renderQuestion();
            timer();
        });
        document.getElementById("view-highscore-btn").addEventListener("click", function(){
            handleHighscore();
        });
        
    }
    firstButtons();
    // Start a timer and display countdown
    function timer() {
        time = defaultTime;
        // Creates an interval that runs every 1000 ms or 1 second.
        // Referenced instructors example for creating a timer.
        mainInterval = setInterval(function(){
            // Used to calculate the current time. The interval runs every second. Therefore, 1 second is subtracted every interation.
            time = time - 1;

            // Changes the inner html of the element that displays the time remaining ever interval, ie every second.
            timeDisplayEl.innerHTML = time;

            if (time <= 0){
                // Causes mainInterval to end
                clearInterval(mainInterval);
                // Due to the time subtraction, sometimes the final time is less than 0. This causes the display to be 00 when the clock runs out.
                timeDisplayEl.innerHTML = "00";
                // Only used for testing.
                renderEndGame();
            }
        }, 1000);

    }
    
    let containerEl = document.getElementById("main-container");
    
    function createRow(rowTotal, content) {
        
        for (let i = 0; i < rowTotal; i++){
            //Creates a div with class row
            const rowEl = document.createElement("div");
            rowEl.setAttribute("class", "row")
            // Creates a div with class col            
            const colEl = document.createElement("div");
            colEl.setAttribute("class", "col");
            // Appends content to the column
            // content is passed into the function
            colEl.append(content);
            // Appends column to the row
            rowEl.append(colEl);
            // Appends the row, which now includes everything created, to the container El, which is the main container
            containerEl.append(rowEl);
            
        }
        
    }
    
    //  -- to generate html for questions
    //  -- -- Following insctructors example to start building function
    //  -- -- currentQuestion should be moved up to other variables at some point.
    function renderQuestion() {
        // Used to clear start button at beginning and clear previous question;
        containerEl.innerHTML = "";
        const questionEl = document.createElement("h3");
        questionEl.innerHTML = questions[currentQuestion].title;
        
        createRow(1, questionEl);

        let answerEl = "";
        
        // Create a lopp to add a button for every question
        // Must have let i=0; instead of i=0; if I want event listner to be able to use i.
        for(let i=0; i < questions[currentQuestion].choices.length; i++){
       
            answerEl = document.createElement("button");
            answerEl.setAttribute("class", "btn btn-secondary m-1");
            answerEl.innerHTML = questions[currentQuestion].choices[i];
            createRow(1, answerEl)

            answerEl.addEventListener("click", function(){
                questions[currentQuestion].userAnswer = questions[currentQuestion].choices[i];
                answerCheck();
                switchQuestion();
            })
        }
        // Used to append container, which is all of the html, to the body
        // document.body.append(containerEl);
    }
    // Get user answer
    // Check if user answer is correct
    function answerCheck () {
      
        if (questions[currentQuestion].answer === questions[currentQuestion].userAnswer)
        {
            questions[currentQuestion].outcome = true;
            questions[currentQuestion].time = time;
            // Displays outcome of the user answering the question, when the user is correct
            document.getElementById("outcomeDisplay").innerHTML = "Correct!";
            setTimeout(function(){
                document.getElementById("outcomeDisplay").innerHTML = "";
            }, 1500);
            
        } else {
            subtractTime()
            questions[currentQuestion].outcome = false;
            // Displays outcome of the user answering the question, when the user is wrong
            document.getElementById("outcomeDisplay").innerHTML = "Wrong!";
            setTimeout(function(){
                document.getElementById("outcomeDisplay").innerHTML = "";
            }, 1500);
            
        }
    }
    
    // Decide if time should be subtracted
    function subtractTime() {
            // Subtracts
            time = time - penaltyTime;
    }
    

    // Update variable to store if answer was right or wrong
    // Change to next question
    function switchQuestion() {
        if(currentQuestion <= (questions.length-2)){
            currentQuestion = currentQuestion + 1;
            renderQuestion();
        } else {
            time=0;
            // renderEndGame();
        }   
    }
    
    // Calculate final score
    function calcFinalScore() {
        let finalScore = 0;
        for(let i = 0; i < questions.length; i++){
            if(questions[i].outcome){
                finalScore = finalScore + questions[i].time;
            }
            else {
                // Nothing
            }
        }
        return finalScore; 
    }
    // Display Score
    // Collect User Initials and store score
    function renderEndGame() {
        
        containerEl.innerHTML = "";
        
        // Used to  create an element to display to user that the game is over
        const endGameMessageEl = document.createElement('div');
        endGameMessageEl.setAttribute('class', 'display-3');
        endGameMessageEl.innerText = "All done!";
        
        // Used to create an element to display the user's score
        const userScoreMessageEl = document.createElement('h4');
        userScoreMessageEl.innerHTML = "Your score was: "+ calcFinalScore();
        endGameMessageEl.append(userScoreMessageEl);
        
        // Used to request the user to input their initials to store their score.
        const initialMessageEl = document.createElement('div');
        initialMessageEl.setAttribute('class', 'user-input');
        initialMessageEl.innerHTML = "Enter your intials: <input type='text' id='initial-input'></input>"
        endGameMessageEl.append(initialMessageEl);
        
        // Used to create a button to trigger adding the users high score and intials to the high score board
        const addHighScoreBtnEl = document.createElement('button');
        addHighScoreBtnEl.setAttribute('class','btn btn-success');
        addHighScoreBtnEl.setAttribute('id', 'submit-btn');
        addHighScoreBtnEl.innerText = "Submit Highscore";
        endGameMessageEl.append(addHighScoreBtnEl);
        
        // Used to display all of the created elements on the page
        createRow(1, endGameMessageEl);
        
        addHighScoreBtnEl.addEventListener("click", function(){
            // took basis of code used to do local storage from instructor example.
            let highscores = [];
            if(localStorage.getItem('localHighscores')){
                highscores = localStorage.getItem('localHighscores');
                https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
                highscores = JSON.parse(highscores);
            }   else{
                let highscores = [];
            }
            const userInitial = document.getElementById('initial-input').value;
            const userScore = calcFinalScore();
            highscores[(highscores.length)] = {
                initial: userInitial,
                score: userScore
            }
            // Sorts highscores based on the best score in the array. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
            highscores.sort(function(a, b) {
                return b.score - a.score;
            })
            
            // Got code for JSON.stringify at https://blog.logrocket.com/the-complete-guide-to-using-localstorage-in-javascript-apps-ba44edb53a36/
            window.localStorage.setItem('localHighscores', JSON.stringify(highscores));
            
            handleHighscore(highscores);
        });
    }
    
    // Make code restart and be able to erase highscores
    // Render highscore view
    function handleHighscore(highscores) {
        
        if(localStorage.getItem('localHighscores')){
            highscores = localStorage.getItem('localHighscores');
            https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
            highscores = JSON.parse(highscores);
        }   else{
            highscores = [];
        }

        // Clears all content from view
        document.body.innerHTML = "";
        
        // Creates container to display all the highscores
        const highscoreContainerEl = document.createElement('div');
        highscoreContainerEl.setAttribute('class','container');
        
        // Creates title for highscore page
        const highscoreTitleEl = document.createElement('div');
        highscoreTitleEl.setAttribute('class', 'display-2 text-center mb-3')
        highscoreTitleEl.innerHTML = "Highscores";
        highscoreContainerEl.append(highscoreTitleEl);
        
        // Creates element for each highscore and appends them to the container.
        for (let i=0; i < highscores.length; i++){
            let highscoreDisplayEl = document.createElement('div');
            highscoreDisplayEl.setAttribute('class','m-1 bg-secondary text-white p-1')
            highscoreDisplayEl.innerText = (i+1)+". "+highscores[i].initial+" - "+highscores[i].score;
            highscoreContainerEl.append(highscoreDisplayEl);
        }
        
        //Creates restart button
        restartBtnEl = document.createElement('button');
        restartBtnEl.setAttribute('class', 'btn btn-success m-1');
        restartBtnEl.innerText = 'Restart Quiz';
        highscoreContainerEl.append(restartBtnEl);
        restartBtnEl.addEventListener('click', function(){
            document.location.reload()
        });
        //Creates clear highscores button
        clearScoresBtnEl = document.createElement('button');
        clearScoresBtnEl.setAttribute('class', 'btn btn-danger m-1');
        clearScoresBtnEl.innerText = 'Clear Highscores';
        highscoreContainerEl.append(clearScoresBtnEl);
        clearScoresBtnEl.addEventListener('click', function(){
            window.localStorage.removeItem('localHighscores');
            handleHighscore();
        });
        // Appends highscore content to body so it is viewable.
        document.body.append(highscoreContainerEl);

    }
}
quizGame()