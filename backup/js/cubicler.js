// Cubicler.js | Cubicler Game Engine
// This is the main file for the Cubicler game engine. It contains the main game loop and other important functions.

// Add script to game.html to use the Cubicler game engine.
// Maybe use defer attribute to ensure the script runs after the HTML is fully loaded.

// ---Classes---
// Class for blueprint for all cards with id, name, base, tags, rarity and the text displayed.
class Card {
    constructor(id, name, base, tags, rarity, text) {
    this.id = id;
    this.name = name;
    this.base = base;
    this.tags = tags;
    this.rarity = rarity;
    this.text = text;
    }

    describe() {
        // this method displays the card information. 
        return "Name: " + this.name
        + " |Base: " + this.base
        + " |Tags: " + this.tags
        + " |Rarity: " + this.rarity
        + " |Text: " + this.text;
    }
}

// --Global Variables--
// Code-based variables
var cardPool = []
var hand = []
var shop = []
var bin = []
var round = 0
var level = 0
var money = 0
var lastScore = 0
var score = 0
var bonusScore = 0
var goalScore = 0

// Doc-based variables
const testBtn = document.getElementById('testBtn');

// ---Initialization functions---
// setting up the enviroment with all cards and prints them to console.
function setupEnvironment() {
    console.log("Setting up environment...");
    
    // Full pool of available game cards
    // Changed the declaration to outside of function for globality
    cardPool = [
        new Card("coffee", "Cup of Coffee", 4, "buff", "common", "+1 to all inputs"),
        new Card("energydrink", "Energy Drink", 6, "buff", "rare", "+3 if GPU and CPU are present"),
        new Card("powersmoothie", "Power Smoothie", 5, "buff", "uncommon", "+2 to all inputs if there are two inputs already"),
        new Card("tea", "Cup of Tea", 4, "buff", "common", "+1 for each ergonomic item"),
        new Card("sKeyboard", "Standard Keyboard", 3, "input", "common", "+1 if Standard Mouse is present, +2 if Precision Mouse is present"),
        new Card("mKeyboard", "Mechanical Keyboard", 5, "input", "uncommon", "+2 if Standard Mouse is present, +3 if Precision Mouse is present"),
        new Card("sMouse", "Standard Mouse", 3, "input", "common", "+1 if Standard Keyboard is present, +2 if Mechanical Keyboard is present"),
        new Card("pMouse", "Precision Mouse", 4, "input", "uncommon", "+2 if Standard Keyboard is present, +3 if Mechanical Keyboard is present"),
        new Card("sMonitor", "Standard Monitor", 5, "display", "common", "+2 if CPU is present"),
        new Card("hMonitor", "HD Monitor", 7, "display", "uncommon", "+3 if GPU is present"),
        new Card("dMonitors", "Dual Monitors", 9, "display", "rare", "+3 if GPU is present and CPU is present"),
        new Card("kMonitor", "4K Monitor", 11, "display", "epic", "+4 if CPU is present"),
        new Card("sCPU", "Standard CPU", 6, "compute", "common", "+1 per software"),
        new Card("uCPU", "Upgraded CPU", 8, "compute", "uncommon", "+2 per software"),
        new Card("sGPU", "Standard GPU", 8, "compute", "uncommon", "+2 if HD Monitor is present"),
        new Card("uGPU", "Upgraded GPU", 10, "compute", "rare", "+3 if Dual Monitors are present"),
        new Card("dGPU", "Dual GPU Rig", 12, "compute", "epic", "+4 if 4K Monitor is present"),
        new Card("sApp", "Productivity App", 3, "software", "common", "+1 per input (max +2)"),
        new Card("aApp", "Advanced App", 5, "software", "uncommon", "+2 per input (max +4)"),
        new Card("aiAssist", "AI Assist", 7, "software", "rare", "+3 if CPU or GPU is present"),
        new Card("notetaker", "Smart Notetaker", 6, "software", "uncommon", "+1 per input (max 3)"),
        new Card("cloud", "Cloud Storage", 6, "software", "uncommon", "+2 if Smart Notetaker is present"),
        new Card("whiteboard", "White Board App", 4, "software", "common", "+1 for each software present"),
        new Card("sChair", "Office Chair", 4, "ergonomic", "common", "+1 to all inputs"),
        new Card("eChair", "Ergonomic Chair", 6, "ergonomic", "uncommon", "+2 to inputs and displays"),
        new Card("sDesk", "Standard Desk", 4, "ergonomic", "common", "+1 if Office Chair is present"),
        new Card("eDesk", "Ergonomic Desk", 6, "ergonomic", "uncommon", "+2 if Ergonomic Chair is present"),
        new Card("lamp", "Desk Lamp", 3, "ergonomic", "common", "+1 if Dual Monitors are present"),
        new Card("plant", "Office Plant", 3, "ergonomic", "common", "+1 for each ergonomic item")
    ];

    // Print all cards to console
    console.log("Card Pool:");
    cardPool.forEach(card => console.log(card.describe()));
}

// later: preload images
function loadAssets() {
    console.log("Loading assets..."); 
}

//Start Game, used for initialization and resetting the game
function startGame() {
    console.log("Starting game...");
    // Set default game variables
    level = 0;
    money = 0;
    // Starting new level at 0 -> +1 in newLevel()
    newLevel();
}

// Initialize the game engine
function initializeGameEngine() {
    // Set up the game environment
    setupEnvironment();
    // Load assets
    loadAssets();
    // Start the game loop
    startGame();
}

// New Level
function newLevel() {
    // Increment level & Log
    level++;
    console.log("New Level: " + level);
    
    // Set default level variables
    bin = [];
    shop = [];
    round = 0;
    score = 0;
    
    // Starting new round at 0 -> +1 in newRound()
    newRound();
    newBin();

    // Initializing shop
    rerollShop(); //If shop is empty, reroll for free

    // Level Logic, add more later
    switch (level) {
        case 1:
            console.log("Level 1 Logic");
            goalScore = 25;
            break;
        case 2:
            console.log("Level 2 Logic");
            goalScore = 35;
            break;
        case 3:
            console.log("Level 3 Logic");
            break;
        default:
            console.log("Default Level Logic");
    }
}

// New Round
    function newRound() {
        // Increment round & Log
        round++;
        console.log("New Round: " + round);
        
        // Set default round variables
        lastScore = 0;
    }

// New Bin, used for initialization and new levels
function newBin() {
    console.log("Creating New Bin...");
    // Add 5 random cards to the player's bin
    for (let i = 0; i < 5; i++) {
        let randomIndex = Math.floor(Math.random() * cardPool.length);
        bin.push(cardPool[randomIndex]);
    }
    // Print the player's bin to the console
    console.log("Initial Bin Order:")
    bin.forEach(card => console.log(card.describe()));
}

// ---Calculation functions---
// Synergy, used in calculateBonusScore
function synergy() {
    console.log("Calculating Synergy...");
    let synergy = 0;
    // Need to add code for synergies first, will assess hand array for synergies and add bonus score

    console.log("Synergy: " + synergy);
    return synergy;
}

// Calculate Bonus Score, used in calculateScore
function calculateBonusScore() {
    console.log("Calculating Bonus Score...");
    let bonus = 0;
    // Determining synergies and adding to bonus score
    bonus = synergy();
    // Print the bonus score to the console
    console.log("Bonus Score: " + bonusScore);
    return bonus;
}

// Calculate Money, used in calculateScore
function calculateMoney(){
    console.log("Calculating Money...");
    // Determining money to add to player's money based on score
    console.log("Money before Addition: " + money);
    // Add code for money calculation based on score
    if (score > 0 & score <= 3) {
        money += score;
    } else if (score > 3 & score <= 6) {
        money += (Math.floor(score / 2) + 1);
    } else {
        money += 0;
    }
    console.log("Money to Add: " + money);
    return money;
}

// Calculate Score, used in playRound
function calculateScore() {
    console.log("Calculating Score...");
    // Calculate the player's score
    lastScore = score;
    //Testing score = 25
    score = 25;
    // Add the base value of each card in the player's hand to the score
    hand.forEach(card => score += card.base);
    console.log("Base Score: " + score)
    // Determining synergies and adding bonus score
    bonusScore = calculateBonusScore();
    score += bonusScore;
    // Print the player's score to the console
    console.log("Total Score: " + score);
    // Adding money to player's money
    money += calculateMoney();
    console.log("Money after Addition: " + money);
    // Determining if the player has won the round
    if (score >= goalScore) {
        console.log("Level Won!");
        newLevel()    
    } else {
        console.log("Round Lost!");
        newRound();
    }
}

// ---Interaction functions---
// Shuffle Bin, used for rerolling the bin, add code for -1 shuffles remaining
function shuffleBin() {
    console.log("Shuffling Bin...");
    // Shuffle the player's bin
    bin.sort(() => Math.random() - 0.5);
    // Print the player's bin to the console
    console.log("New Bin Order:")
    bin.forEach(card => console.log(card.describe()));
}

// Reroll Shop, will need code to make reroll button unclickable if money is insufficient
function rerollShop() {
    console.log("Rerolling Shop...");
    //If shop is already empty, reroll for free
    if (shop.length === 0) {
        console.log("Shop is empty, rerolling for free");
    } else {
        console.log("Rerolling Shop for 5 dollars");
        money -= 5;
    }
    // Clear the shop
    shop = [];
    // Add 5 random cards to the player's shop
    for (let i = 0; i < 5; i++) {
        let randomIndex = Math.floor(Math.random() * cardPool.length);
        shop.push(cardPool[randomIndex]);
    }
    // Print the player's shop to the console
    console.log("New Shop Contents:")
    shop.forEach(card => console.log(card.describe()));
}

// Add to Hand from Bin
function addToHand(card) {
    console.log("Adding card to hand...");
    // Add the card to the player's hand
    hand.push(card);
    // Remove the card from the player's bin
    bin.splice(bin.indexOf(card), 1);
    // Print the player's hand to the console
    console.log("New Hand Contents:")
    hand.forEach(card => console.log(card.describe()));
}

//Add to Bin, used in removeFromHand and buyFromShop
function addToBin(card) {
    console.log("Adding card to bin...");
    // Add the card to the player's bin
    bin.push(card);
    // Print the player's bin to the console
    console.log("New Bin Contents:")
    bin.forEach(card => console.log(card.describe()));
}

// Remove from Hand
function removeFromHand(card) {
    console.log("Removing card from hand...");
    // Remove the card from the player's hand
    hand.splice(hand.indexOf(card), 1);
    // Add the card to the player's bin
    addToBin(card);
    // Print the player's hand to the console
    console.log("New Hand Contents:")
    hand.forEach(card => console.log(card.describe()));
}

// Buy From Shop
function buyFromShop(card) {
    console.log("Buying card from shop...");
    // Remove the card from the player's shop
    shop.splice(shop.indexOf(card), 1);
    // Subtract the card's base value from the player's money
    money -= card.base;
    // Add the card to the player's bin
    addToBin(card);
    // Print the player's shop to the console
    console.log("New Shop Contents:")
}

// Play Round
function playRound() {
    console.log("Playing round...");
    // Calculate the player's score
    calculateScore();
}

// ---Object state functions---
// Making a function to update the display of the bin, hand, and shop

// Making a function to make shop items unclickable if money is insufficient

// Making a function to make reroll button unclickable if money is insufficient

//Making a function to make play button unclickable if hand is empty

//Making a function to make a shop item unclickable if it gets bought

// ---Interaction events---
// Testing Button
if (testBtn) {
    testBtn.addEventListener('click', function() {
        console.log('*-*-*-Test Button Clicked-*-*-*');
        playRound();
    });
}

// ---Main (keep below functions and events)---
// Call the initialization function to start the engine
document.addEventListener('DOMContentLoaded', (event) => {
    initializeGameEngine();
});