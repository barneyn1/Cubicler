// Cubicler.js | Cubicler Game Engine
// This is the main file for the Cubicler game engine. It contains the main game loop and other important functions.

// Add script to game.html to use the Cubicler game engine.
// Maybe use defer attribute to ensure the script runs after the HTML is fully loaded.

// -----Classes-----
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

// -----Global Variables-----
// Code-based variables
var cardPool = [];
var hand = [];
var shop = [];
var bin = [];
var round = 0;
var level = 0;
var money = 0;
var lastScore = 0;
var score = 0;
var bonusScore = 0;
var goalScore = 0;
var lastAddedCard = null;
var synergyLabel;


// Doc-based variables
const testBtn = document.getElementById("testBtn");
const playBtn = document.getElementById("playBtn");
const undoBtn = document.getElementById("undoBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const rerollBtn = document.getElementById("rerollBtn");

// -----Initialization functions-----
// Setting up the enviroment with all cards and prints them to console.
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

// FUTURE: preload images
function loadAssets() {
    console.log("Loading assets..."); 
}

// Start Game, used for initialization and resetting the game
function startGame() {
    console.log("Starting game...");
    // Set default game variables
    level = 0;
    money = 5;
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

    // dyanmic label for synergy score FUTURE CHANGE
    synergyLabel = document.createElement("div"); 
    synergyLabel.style.position = "absolute"; 
    synergyLabel.style.top = "2px"; 
    synergyLabel.style.right = "50px";
    synergyLabel.style.background = "#222";
    synergyLabel.style.color = "#00ff00";
    synergyLabel.style.padding = "6px"; 
    synergyLabel.style.borderRadius = "4px"; 
    synergyLabel.style.fontFamily = "Arial, sans-serif"; 
    synergyLabel.innerText = "Synergy: 0";
    document.body.appendChild(synergyLabel);
    initDisplay();
    initImages();
    initDragAndDrop();
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
    lastAddedCard = null;

    // Starting new round at 0 -> +1 in newRound()
    newRound();

    // Initializing bin
    newBin();

    // Initializing shop
    rerollShop();

    // Level Logic, add more FUTURE
    switch (level) {
        case 1:
            console.log("Level 1 Logic");
            goalScore = 25; //TEMP FUTURE CHANGE
            break;
        case 2:
            console.log("Level 2 Logic");
            goalScore = 35; //TEMP FUTURE CHANGE
            break;
        case 3:
            console.log("Level 3 Logic");
            break;
        default:
            console.log("Default Level Logic");
    }
    refreshDisplay(); // refresh display
}

// New Round
    function newRound() {
        // Increment round & Log
        round++;
        console.log("New Round: " + round);

        // Set default round variables
        lastScore = 0;

        refreshDisplay(); // refresh display
    }

// New Bin, used for initialization and new levels
function newBin() {
    console.log("Creating New Bin...");
    // Add 4 random cards to the player's bin
    for (let i = 0; i < 4; i++) {
        let randomIndex = Math.floor(Math.random() * cardPool.length);
        bin.push(cardPool[randomIndex]);
    }
    // Print the player's bin to the console
    console.log("Initial Bin Order:");
    bin.forEach(card => console.log(card.describe()));

    refreshDisplay(); // refresh display 
}

// -----Calculation functions-----
// Synergy, used in calculateBonusScore
function synergy() {
    console.log("Calculating Synergy...");
    let synergy = 0;

    let names = hand.map(card => card.id); // gets all cards from hand

    // buff cards synergies
    if (names.includes("coffee")) {
        let inputs = hand.filter(c => c.tags == "input").length;
        synergy += inputs;
    }

    if (names.includes("energydrink") && names.includes("sGPU") && names.includes("sCPU")) {
        synergy += 3; 
    }
    if (names.includes("powersmoothie")) {
        let inputs = hand.filter(c => c.tags == "input").length;
        if (inputs >= 2) { synergy += 2; }
    }
    if (names.includes("tea")) {
        let ergo = hand.filter(c => c.tags == "ergonomic").length;
        synergy += ergo;
    }

    // input cards synergies
    if (names.includes("sKeyboard") && names.includes("sMouse")) synergy += 1;
    if (names.includes("sKeyboard") && names.includes("pMouse")) synergy += 2;
    if (names.includes("mKeyboard") && names.includes("sMouse")) synergy += 2;
    if (names.includes("mKeyboard") && names.includes("pMouse")) synergy += 3;

    // display cards synergies
    if (names.includes("sMonitor") && names.includes("sCPU")) synergy += 2;
    if (names.includes("hMonitor") && names.includes("sGPU")) synergy += 3;
    if (names.includes("dMonitors") && names.includes("uGPU") && names.includes("sCPU")) synergy += 3;
    if (names.includes("kMonitor") && names.includes("sCPU")) synergy += 4;

    // compute cards synergies
    if (names.includes("sGPU") && names.includes("hMonitor")) synergy += 2;
    if (names.includes("uGPU") && names.includes("dMonitors")) synergy += 3;
    if (names.includes("dGPU") && names.includes("kMonitor")) synergy += 4;

    // software synergies
    if (names.includes("sApp")) {
        let inputs = hand.filter(c => c.tags == "input").length;
        synergy += Math.min(inputs * 1, 2);
    }
    if (names.includes("aApp")) {
        let inputs = hand.filter(c => c.tags == "input").length;
        synergy += Math.min(inputs * 2, 4);
    }
    if (names.includes("aiAssist") && (names.includes("sCPU") || names.includes("sGPU") || names.includes("uCPU") || names.includes("uGPU"))) {
        synergy += 3;
    }
    if (names.includes("notetaker")) {
        let inputs = hand.filter(c => c.tags == "input").length;
        synergy += Math.min(inputs * 1, 3);
    }
    if (names.includes("cloud") && names.includes("notetaker")) synergy += 2;
    if (names.includes("whiteboard")) {
        let software = hand.filter(c => c.tags == "software").length;
        synergy += software;
    }

    // ergonomics synergies
    if (names.includes("sChair")) {
        let inputs = hand.filter(c => c.tags == "input").length;
        synergy += inputs;
    }
    if (names.includes("eChair")) {
        let inputs = hand.filter(c => c.tags == "input").length;
        let displays = hand.filter(c => c.tags == "display").length;
        synergy += (inputs + displays) * 2;
    }
    if (names.includes("sDesk") && names.includes("sChair")) synergy += 1;
    if (names.includes("eDesk") && names.includes("eChair")) synergy += 2;
    if (names.includes("lamp") && names.includes("dMonitors")) synergy += 1;
    if (names.includes("plant")) {
        let ergo = hand.filter(c => c.tags == "ergonomic").length;
        synergy += ergo;
    }

    // show synergy in console and update UI label
    console.log("Synergy: " + synergy);
    if (synergyLabel) {
        synergyLabel.innerText = "Synergy: " + synergy;
    }
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
    var addMoney = 0;
    if (score > 0 & score <= 3) {
        addMoney += score;
    } else if (score > 3 & score <= 6) {
        addMoney += (Math.floor(score / 2) + 1);
    } else {
        addMoney += 0;
    }
    console.log("Money to Add: " + addMoney);
    return addMoney;
}

// Calculate Score, used in playRound
function calculateScore() {
    console.log("Calculating Score...");
    // Calculate the player's score
    lastScore = score;
    // Testing score = 25 TEMP FUTURE CHANGE THIS
    score = 25;
    // Add the base value of each card in the player's hand to the score
    hand.forEach(card => score += card.base);
    console.log("Base Score: " + score);
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
        newLevel();  
    } else {
        console.log("Round Lost!");
        newRound();
    }

    refreshDisplay(); // refresh display 
}

// -----Interaction functions-----
// Shuffle Bin, used for rerolling the bin, add code for -1 shuffles remaining
function shuffleBin() {
    console.log("Shuffling Bin...");
    // Shuffle the player's bin
    bin.sort(() => Math.random() - 0.5);
    // Print the player's bin to the console
    console.log("New Bin Order:");
    bin.forEach(card => console.log(card.describe()));

    refreshDisplay(); // refresh display 
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
    console.log("New Shop Contents:");
    shop.forEach(card => console.log(card.describe()));

    refreshDisplay(); // refresh display
}

// Add to Hand from Bin
function addToHand(card, index = hand.length) { // default index = end
    console.log("Adding card to hand...");
    // Add the card to the player's hand
    hand.splice(index, 0, card);
    // Track the last added card
    lastAddedCard = card;
    // Remove the card from the player's bin
    bin.splice(bin.indexOf(card), 1);
    // Print the player's hand to the console
    console.log("New Hand Contents:");
    hand.forEach(card => console.log(card.describe()));

    refreshDisplay(); // refresh display 
}

// Add to Bin, used in removeFromHand and buyFromShop
function addToBin(card) {
    console.log("Adding card to bin...");
    // Add the card to the player's bin
    bin.push(card);
    // Print the player's bin to the console
    console.log("New Bin Contents:");
    bin.forEach(card => console.log(card.describe()));

    refreshDisplay(); // refresh display 
}

// Remove from Hand, used in undoSelection
function removeFromHand(card) {
    console.log("Removing card from hand...");
    // Remove the card from the player's hand
    hand.splice(hand.indexOf(card), 1);
    // Add the card to the player's bin
    addToBin(card);
    // Print the player's hand to the console
    console.log("New Hand Contents:");
    hand.forEach(card => console.log(card.describe()));

    refreshDisplay(); // refresh display 
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
    console.log("New Shop Contents:");

    refreshDisplay(); // refresh display
}

// Play Round
function playRound() {
    console.log("Playing round...");
    // Calculate the player's score
    calculateScore();

    refreshDisplay(); // refresh display
}

// Undo Bin to Hand Selection
// Questions for a later date: How should bin undo work? Refund card to bin or just remove from hand? 
// Should this be overhauled to discard drag & drop zone? Would need to address bin -> undo drag bug.
function undoSelection() {
    console.log("Undoing selection...");
    // Add code for undoing selection
    // Protection check
    if (!lastAddedCard) {
        console.log("No recent card to undo.");
        return;
    }
    // Remove last added card from hand
    removeFromHand(lastAddedCard);

    // Clear tracking after undo
    lastAddedCard = null;
}

// -----Object state functions-----
// Functions to initialize the display of the bin, hand, and shop & update for when values change
function initDisplay() {
    console.log("Initializing display...");

    // Score section
    const scoreProgress = document.querySelector(".progress-wrapper progress");
    const scoreLabel = document.querySelector(".progress-wrapper .progress-label");
    if (scoreProgress && scoreLabel) {
        scoreProgress.value = 0;
        scoreProgress.max = 100;
        scoreLabel.textContent = "0/100";
    }

    // Round section
    const roundText = document.querySelector(".right-column p:nth-of-type(1)");
    if (roundText) {
        roundText.textContent = round + " of 8";
    }

    // Level section
    const levelText = document.querySelector(".right-column .bottom");
    if (levelText) {
        levelText.textContent = level + " of 4";
    }

    // Money section
    const moneyText = document.querySelector(".right-column .money");
    if (moneyText) {
        moneyText.textContent = "$" + money;
    }

    // Plays section
    const playText = document.querySelector(".right-column .plays-remaining");
    if (playText) {
        playText.textContent = (9 - round) + " Play(s) remaining !";
    }

    // Shop items
    const shopItems = document.querySelectorAll(".left-column .title + .items .item");
    shopItems.forEach((item, index) => {
        if (shop[index]) {
            item.textContent = shop[index].name;
        } else {
            item.textContent = "Empty";
        }
    });

    // Bin items
    const binItems = document.querySelectorAll(".left-column .vert-container:nth-of-type(2) .item");
    binItems.forEach((item, index) => {
        if (bin[index]) {
            item.textContent = bin[index].name;
        } else {
            item.textContent = "Empty";
        }
    });

    // Hand cards
    const handCards = document.querySelectorAll(".play-space .card");
    handCards.forEach((card, index) => {
        if (hand[index]) {
            card.textContent = hand[index].name;
        } else {
            card.textContent = "";
        }
    });
}

function refreshDisplay() {
    console.log("Refreshing display...");

    // Score section
    const scoreProgress = document.querySelector(".progress-wrapper progress");
    const scoreLabel = document.querySelector(".progress-wrapper .progress-label");
    if (scoreProgress && scoreLabel) {
        scoreProgress.value = score;
        scoreProgress.max = goalScore || 100;
        scoreLabel.textContent = score + "/" + (goalScore || 100);
    }

    // Round section
    const roundText = document.querySelector(".right-column p:nth-of-type(1)");
    if (roundText) {
        roundText.textContent = round + " of 8";
    }

    // Level section
    const levelText = document.querySelector(".right-column .bottom");
    if (levelText) {
        levelText.textContent = level + " of 4";
    }

    // Money section
    const moneyText = document.querySelector(".right-column .money");
    if (moneyText) {
        moneyText.textContent = "$" + money
    }

    // Plays section
    const playText = document.querySelector(".right-column .plays-remaining");
    if (playText) {
        playText.textContent = (9 - round) + " Play(s) remaining !";
    }

    // Shop items
    const shopItems = document.querySelectorAll(".left-column .title + .items .item");
    shopItems.forEach((item, index) => {
        if (shop[index]) {
            item.textContent = shop[index].name;
        } else {
            item.textContent = "Empty";
        }
    });

    // Bin items
    const binItems = document.querySelectorAll(".left-column .vert-container:nth-of-type(2) .item");
    binItems.forEach((item, index) => {
        if (bin[index]) {
            item.textContent = bin[index].name;
        } else {
            item.textContent = "Empty";
        }
    });

    // Hand cards
    const handCards = document.querySelectorAll(".play-space .card");
    handCards.forEach((card, index) => {
        if (hand[index]) {
            card.textContent = hand[index].name;
        } else {
            card.textContent = "";
        }
    });

    refreshImages();
    updateShopButtonStatus();
}

// Adding art images dynamically to shop and hand areas
// FUTURE: Currently using placeholders, Alter code so image matches card, might want to edit into initDisplay code
function initImages() {
    console.log("Adding images...");
    // Shop images
    const shopItems = document.querySelectorAll(".left-column .items .item");
    shopItems.forEach(item => {
        // If the item doesn't already have an image
        if (!item.querySelector("img")) {
            const img = document.createElement("img");
            // In the future, replace placeholder with card-specific art:
            // img.src = `../assets/cards/${shop[index].id}.png`;
            img.src = "../assets/pics/placeholder.png";
            img.alt = "Card placeholder";
            img.width = 40;   // we can change this
            img.height = 40;
            img.style.display = "block";
            img.style.margin = "5px auto 2px auto";
            item.prepend(img);
        }
    });

    // Bin images
    const binItems = document.querySelectorAll(".left-column .vert-container:nth-of-type(2) .item");
    binItems.forEach(item => {
        // If the item doesn't already have an image
        if (!item.querySelector("img")) {
            const img = document.createElement("img");
            img.src = "../assets/pics/placeholder.png";
            img.alt = "Card placeholder";
            img.width = 40;   // we can change this
            img.height = 40;
            img.style.display = "block";
            img.style.margin = "5px auto 2px auto";
            item.prepend(img);
        }
    });

    // Hand images
    const handCards = document.querySelectorAll(".play-space .cards .card");
    handCards.forEach(card => {
        if (!card.querySelector("img")) {
            const img = document.createElement("img");
            img.src = "../assets/pics/placeholder.png";
            img.alt = "Card placeholder";
            img.width = 80;  // we can change this
            img.height = 80;
            img.style.display = "block";
            img.style.margin = "5px auto 2px auto";
            card.prepend(img);
        }
    });
}

// Refreshes images for shop, bin, and hand when contents update
// Currently called in refreshDisplay
function refreshImages() {
    console.log("Refreshing images...");

    // Shop images
    const shopItems = document.querySelectorAll(".left-column .items .item");
    shopItems.forEach((item, index) => {
        let img = item.querySelector("img");
        if (!img) {
            img = document.createElement("img");
            img.style.display = "block";
            img.style.margin = "5px auto 2px auto";
            img.width = 40;
            img.height = 40;
            item.prepend(img);
        }

        if (shop[index]) {
            // FUTURE, replace placeholder with card-specific art:
            // img.src = `../assets/cards/${shop[index].id}.png`;
            img.src = "../assets/pics/placeholder.png";
            img.alt = shop[index].name;
        } else {
            img.src = "../assets/pics/placeholder.png";
            img.alt = "Empty slot";
        }
    });

    // Bin images
    const binItems = document.querySelectorAll(".left-column .vert-container:nth-of-type(2) .item");
    binItems.forEach((item, index) => {
        let img = item.querySelector("img");
        if (!img) {
            img = document.createElement("img");
            img.style.display = "block";
            img.style.margin = "5px auto 2px auto";
            img.width = 40;
            img.height = 40;
            item.prepend(img);
        }

        if (bin[index]) {
            img.src = "../assets/pics/placeholder.png";
            img.alt = bin[index].name;
        } else {
            img.src = "../assets/pics/placeholder.png";
            img.alt = "Empty slot";
        }
    });

    // Hand images
    const handCards = document.querySelectorAll(".play-space .cards .card");
    handCards.forEach((card, index) => {
        let img = card.querySelector("img");
        if (!img) {
            img = document.createElement("img");
            img.style.display = "block";
            img.style.margin = "5px auto 2px auto";
            img.width = 80;
            img.height = 80;
            card.prepend(img);
        }

        if (hand[index]) {
            img.src = "../assets/pics/placeholder.png";
            img.alt = hand[index].name;
        } else {
            img.src = "../assets/pics/placeholder.png";
            img.alt = "Empty slot";
        }
    });
}


// Making a function to make shop buy buttons unclickable if money is insufficient
// Currently called in refreshDisplay
function updateShopButtonStatus() {
    console.log("Updating shop button status...");

    // Select the actual Buy buttons
    const buttons = document.querySelectorAll('.left-column .items .item-row .buy');

    buttons.forEach((button, i) => {
        const item = shop[i];
        const cost = item ? item.base : 0;
        const cash = money;
        // Check if the player has enough money to buy the item, also accounts for anomalies
        const disable = !(Number.isFinite(cost) && Number.isFinite(cash) && cash >= cost);
        // Dynamically disable buttons based on money
        button.disabled = disable;
        button.classList.toggle("disabled", disable); //Add a class to style dark disabled buttons
    });
}

// Making a function to make reroll button unclickable if money is insufficient

// Write code to make shuffle unclickable if 3 shuffles done

// Write code to make play button unclickable if hand is empty

// Write code to make a shop item unclickable if it gets bought

// -----Interaction events-----
// Click events
// Clicking the play button -> playRound()
if (playBtn) {
    playBtn.addEventListener("click", function() {
        console.log("*-*-*-Play Button Clicked-*-*-*");
        playRound();
    });
}

// Clicking the undo button -> undoSelection()
if (undoBtn) {
    undoBtn.addEventListener("click", function() {
        console.log("*-*-*-Undo Button Clicked-*-*-*");
        undoSelection();
    });
}

// Clicking the reroll button -> rerollShop()

// Clicking the shuffle button -> shuffleBin()

// Clicking a card's buy button in shop -> buyFromShop(card)
//need to do more coding before buyFromShop call is implemented
const shopItems = document.querySelectorAll(".left-column .items .item-row .buy")
    .forEach((buyButton, index) => {
        buyButton.addEventListener("click", () => {
            console.log(`*-*-*-Buy Button ${index + 1} Clicked-*-*-*`);
            //buyFromShop(shop[index]);
        });
    });

// Drag & Drop events
// Drag card from bin to hand -> addToHand(card) 
// it also lets you add the card back to the bin

let draggedFrom = null;
let draggedCardIndex = null;
let dndBound = false;

function initDragAndDrop() {
    if (dndBound) return;
    dndBound = true;

    console.log("Initializing drag and drop...");

    const handArea = document.querySelector(".play-space .cards");
    const binArea  = document.querySelector(".left-column .vert-container:nth-of-type(2) .items");

    function markDraggable() {
        const binItems  = document.querySelectorAll(".left-column .vert-container:nth-of-type(2) .item");
        const handCards = document.querySelectorAll(".play-space .cards .card");
        binItems.forEach((el, i) => { el.setAttribute("draggable", "true"); el.dataset.index = i; });
        handCards.forEach((el, i) => { el.setAttribute("draggable", "true"); el.dataset.index = i; });
    }

    function attachDragStarts() {
        binArea.addEventListener("dragstart", (e) => {
            const el = e.target.closest(".item");
            if (!el) return;
            draggedFrom = "bin";
            draggedCardIndex = parseInt(el.dataset.index, 10);
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", "x");
            el.style.opacity = "0.5";
        }, true);

        handArea.addEventListener("dragstart", (e) => {
            const el = e.target.closest(".card");
            if (!el) return;
            draggedFrom = "hand";
            draggedCardIndex = parseInt(el.dataset.index, 10);
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", "x");
            el.style.opacity = "0.5";
        }, true);

        document.addEventListener("dragend", (e) => {
            const el = e.target;
            if (el && el.style) el.style.opacity = "";
            draggedFrom = null;
            draggedCardIndex = null;
        }, true);
    }

    function handleDrop(targetArea) {
        if (draggedCardIndex === null || !draggedFrom) return;

        const from = draggedFrom;
        const index = draggedCardIndex;

        draggedFrom = null;
        draggedCardIndex = null;

        if (from === "bin" && targetArea === "hand") {
            const card = bin[index];
            if (card) addToHand(card);
        } else if (from === "hand" && targetArea === "bin") {
            const card = hand[index];
            if (card) removeFromHand(card);
        }

        setTimeout(() => {
            originalRefresh();
        }, 0);
    }

    function allowDrop(area) {
        area.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
        });
    }

    function originalRefresh() {
        if (!initDragAndDrop._wrapped) {
            const _refresh = refreshDisplay;
            refreshDisplay = function() {
                _refresh();
                markDraggable();
            };
            initDragAndDrop._wrapped = true;
        }
        refreshDisplay();
    }

    allowDrop(handArea);
    allowDrop(binArea);

    handArea.addEventListener("drop", (e) => {
        e.preventDefault();
        handleDrop("hand");
    });

    binArea.addEventListener("drop", (e) => {
        e.preventDefault();
        handleDrop("bin");
    });

    attachDragStarts();
    markDraggable();
}

// ---Main (keep below functions and events)---
// Call the initialization function to start the engine
document.addEventListener('DOMContentLoaded', (event) => {
    initializeGameEngine();
});