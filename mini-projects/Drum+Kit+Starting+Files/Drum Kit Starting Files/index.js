// alert("ACTIVE SHOOTER IN THE BUILDING")
alert("Welcome to DrumKit :)")

function buttonOrKeyPressed(clickedButton){
    switch (clickedButton) {
        case "w":
        case "W":
                var crashSound = new Audio("sounds/crash.mp3");
                crashSound.play();
            break;

        case "a":
        case "A":
                var kickSound = new Audio("sounds/kick-bass.mp3");
                kickSound.play();
            break;

        case "s":
        case "S":
                var snareSound = new Audio("sounds/snare.mp3");
                snareSound.play();
            break;

        case "d":
        case "D":
                var tom1Sound = new Audio("sounds/tom-1.mp3");
                tom1Sound.play();
            break;

        case "j":
        case "J":
                var tom2Sound = new Audio("sounds/tom-2.mp3");
                tom2Sound.play();
            break;

        case "k":
        case "K":
                var tom3Sound = new Audio("sounds/tom-3.mp3");
                tom3Sound.play();
            break;

        case "l":
        case "L":
                var tom4Sound = new Audio("sounds/tom-4.mp3");
                tom4Sound.play();
            break;

    
        default:
            console.log(clickedButton)
            break;
    }
}

function buttonAnimation(keyPressed){
    // var activeButton = document.querySelector("." + keyPressed);
    var activeButton = document.querySelector("." + keyPressed.toLowerCase());
    activeButton.classList.add("pressed");
    setTimeout(function(){activeButton.classList.remove("pressed")}, 0)


}

var buttons = document.querySelectorAll(".drum")

for (var button of buttons){
    button.addEventListener("click", function(){
    
        // this.style.color = "white"
        clickedButton = this.textContent   
        buttonOrKeyPressed(clickedButton)
        buttonAnimation(clickedButton)
             

        // alert("I got clicked!!!");
        // var drumSound = new Audio("sounds/tom-1.mp3");
        // drumSound.play();

});

    

}

document.addEventListener("keydown", function (event){
    
        console.log(event)

        buttonOrKeyPressed(event.key)
        buttonAnimation(event.key)
})

