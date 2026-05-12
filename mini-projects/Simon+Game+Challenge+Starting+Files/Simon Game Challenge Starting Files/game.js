// alert("SIMON WHERE ARE YOU")
alert("SIMON COMPELS YOU TO REMEMBER")

var gameOn = false

var level = 0

var gamePattern = []

var userClickedPattern = []

var buttonColours = ["red", "blue", "green", "yellow"]

var inProgress = false; // To prevent multiple nextSequence calls

var sessionMaxLevel = 0; // Initialize a variable to hold the session's max level
const SESSION_MAX_LEVEL_KEY = "simonMaxLevel"; // Key for sessionStorage

function updateSessionScore() {
    if (level > sessionMaxLevel) {
        sessionMaxLevel = level;
        sessionStorage.setItem(SESSION_MAX_LEVEL_KEY, sessionMaxLevel);
    }
    $("#session-score").text(`Session Max Level: ${sessionMaxLevel}`);
}

function nextSequence(){
    inProgress = true;
    var randomNumber = (Math.floor(Math.random() * 4))
    randomChosenColour = buttonColours[randomNumber]
    $(`.${randomChosenColour}`).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColour)
    gamePattern.push(randomChosenColour)
    console.log("gamePattern: ", gamePattern)

    level++
    $("h1").text(`Level ${level}`)
    updateSessionScore(); // Update and display session score after level increment
    inProgress = false;
}


function playSound(name){
    var audio = new Audio(`sounds/${name}.mp3`)
    switch (name) {
        case "yellow":
            audio.play()
            break;
        case "blue":
            audio.play()
            break;
        case "green":
            audio.play()
            break;
        case "red":
            audio.play()
            break;

        default:
            audio = new Audio(`sounds/wrong.mp3`)
            audio.play()
            break;

    }
}

function animatePress(currentColour){
    $(`.${currentColour}`).addClass("pressed")
    setTimeout(function(){$(`.${currentColour}`).removeClass("pressed")}, 100)
}

function checkAnswer(currentLevel){
    if (gamePattern[currentLevel] !== userClickedPattern[currentLevel]){
        $("h1").text(`Failed at Level ${level}. Press any key to play again`)
        console.log("wrong")
        playSound("WRONG")

        $("body").addClass("game-over")
        setTimeout(function(){$("body").removeClass("game-over")}, 200)

        game_over()

    } else if (currentLevel === level-1){
        console.log("cL === l")
        setTimeout(nextSequence, 1000)
        userClickedPattern = []

    } else if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        console.log("success")
        console.log("level", level)
        console.log("currentLevel", currentLevel)
        console.log("userClickedPattern: ", userClickedPattern)

    }
}

function game_over(){
    gameOn = false
    userClickedPattern = []
    gamePattern = []
}


$(document).ready(function (){
    const storedMaxLevel = sessionStorage.getItem(SESSION_MAX_LEVEL_KEY);
    if (storedMaxLevel !== null) {
        sessionMaxLevel = parseInt(storedMaxLevel, 10);
    }
    // Changed from $('body').prepend() to $('.container').after()
    $('.container').after('<p id="session-score"></p>'); // Removed inline style
    updateSessionScore(); // Display initial session score

    $(document).keydown(function(event){
        if (event.key && gameOn === false){
            gameOn = true
            level = 0
            userClickedPattern = []
            gamePattern = []
            console.log("mdn")
            nextSequence()
        }

        $(".btn").off("click").click(function (){
            var userChosenColour = this.id
            userClickedPattern.push(userChosenColour)

            console.log("userChosenColour: ", userChosenColour)
            console.log("userClickedPattern: ", userClickedPattern)
            console.log("gamePattern: ", gamePattern)

            animatePress(userChosenColour)
            playSound(userChosenColour)
            checkAnswer(userClickedPattern.length-1)
        })
    })
})