// function randomDiceNumber(){
//     var randomNumber = Math.floor((Math.random() * 6) + 1)
//     return randomNumber
// }

// function imageFileNameCreator(randomNumber){
//     var imageFile = "images/dice"+ randomNumber + ".png"
//     return imageFile
// }

// leftDieNumber = randomDiceNumber()
// rightDieNumber = randomDiceNumber()


// var doct1 = document.querySelector(".img1").setAttribute("src", imageFileNameCreator(leftDieNumber));
// // console.log(doct1)

// var doct2 = document.querySelector(".img2").setAttribute("src", imageFileNameCreator(rightDieNumber));

// // var title = document.getElementsByTagName("h1")[0].innerHTML
// var title = document.querySelector("h1")

// if (rightDieNumber > leftDieNumber){
//     title.textContent = "Player 2 Wins!"
//     console.log(title)
// } else if(leftDieNumber > rightDieNumber){
//     title.textContent = "Player 1 Wins!"
//     console.log(title)
// } else{
//     title.textContent = "Draw. Manuts"
//     console.log(title)
// }
// console.log(title)






// Function to generate a random dice number (1-6)
function randomDiceNumber() {
    var randomNumber = Math.floor((Math.random() * 6) + 1);
    return randomNumber;
}

// Function to create the image file path
function imageFileNameCreator(randomNumber) {
    var imageFile = "images/dice" + randomNumber + ".png";
    return imageFile;
}

// Main function to roll dice and determine winner.
// All the logic that used to run on refresh will now be in this function.
function rollAndDetermineWinner() {
    // Generate numbers for both dice
    var leftDieNumber = randomDiceNumber();
    var rightDieNumber = randomDiceNumber();

    // Update the dice images based on the random numbers
    document.querySelector(".img1").setAttribute("src", imageFileNameCreator(leftDieNumber));
    document.querySelector(".img2").setAttribute("src", imageFileNameCreator(rightDieNumber));

    // Determine and display the winner in the h1 element
    var title = document.querySelector("h1");

    if (rightDieNumber > leftDieNumber) {
        title.textContent = "Player 2 Wins!";
    } else if (leftDieNumber > rightDieNumber) {
        title.textContent = "Player 1 Wins!";
    } else {
        // title.textContent = "Draw. Manuts";
        title.textContent = "Draw. Roll again for a winner :{";
    }
}

// Add an event listener to the "Roll Dice" button.
// The DOMContentLoaded event ensures the button exists before we try to access it.
document.addEventListener('DOMContentLoaded', function() {
    var rollButton = document.getElementById("rollButton");
    
    // Check if the button exists before adding the event listener
    if (rollButton) {
        rollButton.addEventListener("click", rollAndDetermineWinner);
    }

    // Optional: Call the function once when the page loads
    // This keeps the initial "refresh to roll" behavior, but now it's explicit.
    //rollAndDetermineWinner();
});





