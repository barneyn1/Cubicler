// Cubicler.js | Cubicler Game Engine
// This is the main file for the Cubicler game engine. It contains the main game loop and other important functions.

// Add script to game.html to use the Cubicler game engine.
// Use defer attribute to ensure the script runs after the HTML is fully loaded.

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
        // This method displays the card information. 
        return "Name: " + this.name
        + " |Base: " + this.base
        + " |Tags: " + this.tags
        + " |Rarity: " + this.rarity
        + " |Text: " + this.text;
    }
}

function createCardInstance(c) {
    return new Card(c.id, c.name, c.base, c.tags, c.rarity, c.text);
}

// -----Global Variables-----
// Code-based variables
var cardPool = [];
var hand = [];
var shop = [];
var bin = [];
var removedFromBin = [];
var removedFromHand = [];
var binDisabled = new Set();
var round = 0;
var level = 0;
var money = 0;
var lastScore = 0;
var score = 0;
var bonusScore = 0;
var goalScore = 0;
var shuffles = 0;
var lastAddedCard = null;
var synergyLabel;
var Shop_Slot_Count = 5;
var shopSold = [];

// Doc-based variables
const testBtn = document.getElementById("testBtn");
const resetBtn = document.getElementById("resetBtn");
const playBtn = document.getElementById("playBtn");
const undoBtn = document.getElementById("undoBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const rerollBtn = document.getElementById("rerollBtn");
const winPopup = document.createElement("div");
const losePopup = document.createElement("div");

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
        new Card("kMonitor", "4K Monitor", 10, "display", "epic", "+4 if CPU is present"), // Was 11
        new Card("sCPU", "Standard CPU", 6, "compute", "common", "+1 per software"),
        new Card("uCPU", "Upgraded CPU", 8, "compute", "uncommon", "+2 per software"),
        new Card("sGPU", "Standard GPU", 8, "compute", "uncommon", "+2 if HD Monitor is present"),
        new Card("uGPU", "Upgraded GPU", 9, "compute", "rare", "+3 if Dual Monitors are present"), // Was 10
        new Card("dGPU", "Dual GPU Rig", 11, "compute", "epic", "+4 if 4K Monitor is present"), // Was 12
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

// Preload images
function loadAssets() {
    console.log("Loading assets...");
    // NOTE: For our current web scope as of M4, this was unneeded. Will be keeping for future usage
}

// Start Game, used for initialization and resetting the game
function startGame() {
    console.log("Starting game...");
    // Set default game variables
    level = 0;
    money = 15;
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

    // Dyanmic label for synergy score, alterations on CSS side
    synergyLabel = document.createElement("div"); 
    synergyLabel.style.position = "absolute"; 
    synergyLabel.style.top = "2px"; 
    synergyLabel.style.right = "95px";
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
    initHoverTooltips();

    // Setting shop count from DOM 
    var rowsInShop = document.querySelectorAll(".left-column .items .item-row");
    if (rowsInShop && rowsInShop.length) {
        Shop_Slot_Count = rowsInShop.length;
    }
}

// New Level
function newLevel() {
    // Increment level & Log
    level++;
    console.log("New Level: " + level);

    // Setting default level variables
    bin = [];
    shop = [];
    hand = [];
    round = 0;
    score = 0;
    lastAddedCard = null;

    // Starting new round at 0 -> +1 in newRound()
    newRound();

    // Initializing bin
    newBin();

    // Initializing shop
    rerollShop();

    // Level Logic, add more FUTURE for completion reloop
    switch (true) {
        case (level == 1):
            console.log("Level 1 Logic");
            goalScore = 25; // Update scorebar default if this gets changed
            break;
        case (level == 2):
            console.log("Level 2 Logic");
            goalScore = 35;
            break;
        case (level == 3):
            console.log("Level 3 Logic");
            goalScore = 45;
            break;
        case (level == 4):
            console.log("Level 4 Logic");
            goalScore = 55;
            break;
        case (level == 5):
            console.log("Level 5 Logic");
            goalScore = 60;
            break;
        case (level > 5):
            console.log("-*-*-* YOU WIN *-*-*-");
            // Win case
            // Make everything within main tag unclickable
            document.querySelector("main").style.pointerEvents = "none";

            // Adds popup for "you win" & reset button
            winPopup.className = "winPopup";
            winPopup.style.pointerEvents = "auto";
            winPopup.innerHTML = `<h1>You Win!</h1><button class="innerResetBtn"id="innerResetBtn">Reset</button>`;
            document.body.appendChild(winPopup);

            // Reset button
            document.getElementById("innerResetBtn").addEventListener("click", function() {
                document.body.removeChild(winPopup);
                document.querySelector("main").style.pointerEvents = "auto";
                startGame();                                                    
            });
            break;
        default:
            console.log("Default Level Logic");
    }
    refreshDisplay(); // Refresh display
}

// New Round
    function newRound() {
        // Increment round & Log
        round++;
        console.log("New Round: " + round);

        // Set default round variables
        lastScore = 0;
        shuffles = 3;

        // Lose case
        if (round >= 7) {
            // Make everything within main tag unclickable
            document.querySelector("main").style.pointerEvents = "none";

            // Adds popup for "you lose" & reset button
            losePopup.className = "losePopup";
            losePopup.style.pointerEvents = "auto";
            losePopup.innerHTML = `<h1>You Lose!</h1><button class="innerResetBtn"id="innerResetBtn">Reset</button>`;
            document.body.appendChild(losePopup);

            // Reset button
            document.getElementById("innerResetBtn").addEventListener("click", function() {
                document.body.removeChild(losePopup);
                document.querySelector("main").style.pointerEvents = "auto";
                startGame();                                                    
            });
        }
        

        refreshDisplay(); // Refresh display
    }

// New Bin, used for initialization and new levels
function newBin() {
    console.log("Creating New Bin...");
    // Add 4 random cards to the player's bin
    for (let i = 0; i < 4; i++) {
        let randomIndex = Math.floor(Math.random() * cardPool.length);
        bin.push(createCardInstance(cardPool[randomIndex]));
    }
    // Print the player's bin to the console
    console.log("Initial Bin Order:");
    bin.forEach(card => console.log(card.describe()));

    refreshDisplay(); // Refresh display 
}

// -----Calculation functions-----
// Synergy, used in calculateBonusScore
function synergy() {
    console.log("Calculating Synergy...");
    let synergy = 0;

    let names = hand.map(card => card.id); // Gets all cards from hand

    // Buff cards synergies
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

    // Input cards synergies
    if (names.includes("sKeyboard") && names.includes("sMouse")) synergy += 1;
    if (names.includes("sKeyboard") && names.includes("pMouse")) synergy += 2;
    if (names.includes("mKeyboard") && names.includes("sMouse")) synergy += 2;
    if (names.includes("mKeyboard") && names.includes("pMouse")) synergy += 3;

    // Display cards synergies
    if (names.includes("sMonitor") && names.includes("sCPU")) synergy += 2;
    if (names.includes("hMonitor") && names.includes("sGPU")) synergy += 3;
    if (names.includes("dMonitors") && names.includes("uGPU") && names.includes("sCPU")) synergy += 3;
    if (names.includes("kMonitor") && names.includes("sCPU")) synergy += 4;

    // Compute cards synergies
    if (names.includes("sGPU") && names.includes("hMonitor")) synergy += 2;
    if (names.includes("uGPU") && names.includes("dMonitors")) synergy += 3;
    if (names.includes("dGPU") && names.includes("kMonitor")) synergy += 4;

    // Software synergies
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

    // Ergonomics synergies
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

    // Fixed CPU synergy didnt have it before
    if (names.includes("sCPU")) {
    let software = hand.filter(c => c.tags == "software").length;
    synergy += software * 1;
    }

if (names.includes("uCPU")) {
    let software = hand.filter(c => c.tags == "software").length;
    synergy += software * 2;
    }

    // Show synergy in console and update UI label
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
    // Calculating money based on score
    var addMoney = 0;
    if (score <= 0) {
        addMoney = 0;
    } else if (score > 0 & score <= 3) {
        addMoney += 1;
    } else if (score > 3) {
        addMoney += (Math.floor(score / 2));
    }
    console.log("Money to Add: " + addMoney);
    return addMoney;
}

// Calculate Score, used in playRound
function calculateScore() {
    console.log("Calculating Score...");
    // Calculate the player's score
    lastScore = score;
    // Default score = 0, set to a higher value to test wins
    score = 0;
    // Adding the base value of each card in the player's hand to the score
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

    refreshDisplay(); // Refresh display 
}

// -----Interaction functions-----
// Helper function to know if there are any cards on the shop 
function shopHasAny() {
    for (var i = 0; i < shop.length; i++) {
        if (shop[i] && !shopSold[i]) return true;
    }
    return false;
}

// Shuffle Bin, used for rerolling the bin
function shuffleBin() {
    console.log("Shuffling Bin...");

    const sameRef = (a, b) => a === b;

    // Remove all occurrences of a card object from bin
    function removeAllFromBin(card) {
        bin = bin.filter(c => !sameRef(c, card));
    }

    // Preventing duplicate insertions in bin
    function dedupeOneInBin(card) {
        let seen = false;
        bin = bin.filter(c => {
            if (!sameRef(c, card)) return true;
            if (!seen) { seen = true; return true; } // Keep the first encounter
            return false; // Drop extras
        });
    }

    const undoneSet = new Set(removedFromHand); // Object identity set

    for (const card of removedFromBin) {
        if (undoneSet.has(card)) {
            // Undone: make sure card is in bin only once
            dedupeOneInBin(card);
            undoneSet.delete(card); // Prevent double-processing
        } else {
            // Not undone: remove its disabled presence from bin
            removeAllFromBin(card);
        }
    }

    // Clearing removedFromBin and removedFromHand arrays
    binDisabled.clear();
    //attachDragStarts();
    markDraggable();
    removedFromBin = [];
    removedFromHand = [];

    // -1 shuffles
    shuffles -= 1;

    // Shuffle the player's bin
    bin.sort(() => Math.random() - 0.5);

    // Print the player's bin to the console
    console.log("New Bin Order:");
    bin.forEach(card => console.log(card.describe()));

    refreshDisplay(); // Refresh display 
}

// Reroll Shop function
function rerollShop() {
    console.log("Rerolling Shop...");
    // If shop is already empty, reroll for free
    if (shopHasAny()) {
        if (money < 5) {
            console.log("Not Enough Money For Reroll! Current Money: $" + money);
            return;
        } else {
            console.log("Rerolling Shop for 5 dollars");
            money -= 5;
        }
    } else {
        console.log("Shop is empty, rerolling for free");
    }

    // Bilding a fixed size shop so rows don't move around
    shop = [];
    for (var i = 0; i < Shop_Slot_Count; i++) {
        var r = Math.floor(Math.random() * cardPool.length);
        shop.push(createCardInstance(cardPool[r]));
    }
    shopSold = new Array(Shop_Slot_Count).fill(false);

    // Print the player's shop to the console
    console.log("New Shop Contents:");
    shop.forEach(card => console.log(card.describe()));

    // Re-enabling clickabiliy of all shop buttons, undarkening them
    const rows = document.querySelectorAll(".left-column .items .item-row");
    rows.forEach(row => {
        row.classList.remove("darkened");
        const btn = row.querySelector(".buy");
        if (btn) { btn.disabled = false; btn.classList.remove("darkened"); }
    }); 
    
    refreshDisplay(); // Refresh display
}

// Add to Hand from Bin
function addToHand(card, index = hand.length) { // Default index = end
    console.log("Adding card to hand...");
    // Add the card to the player's hand
    removedFromBin.push(card);
    console.log("Adding", card.name, "to removedFromBin list...");
    console.log("Removed From Bin:", removedFromBin);
    hand.splice(index, 0, card);
    // Track the last added card
    lastAddedCard = card;
    // Keep the card in the bin array but disable its HTML div (no click/drag)
    binDisabled.add(card);
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

    refreshDisplay(); // Refresh display 
}

// Remove from Hand, used in undoSelection
function removeFromHand(card) {
    console.log("Removing card from hand...");
    // Remove the card from the player's hand
    removedFromHand.push(card);
    console.log("Adding", card.name, "to removedFromHand list...");
    console.log("Removed From Hand:", removedFromHand);
    hand.splice(hand.indexOf(card), 1);
    // Add the card to the player's bin
    addToBin(card);
    binDisabled.delete(card); // Makes the card clickable again immediately

    // Print the player's hand to the console
    console.log("New Hand Contents:");
    hand.forEach(card => console.log(card.describe()));

    refreshDisplay(); // Refresh display 
}

// Buy From Shop
function buyFromShop(card) {
    console.log("Buying card from shop...");
    var i = shop.indexOf(card);
    // Determining if card can be bought
    if (i === -1) {
        console.log("Card not found in shop.");
        return;
    }
    if (money < card.base) {
        console.log("Not enough money to buy this card.");
        return;
    }
    
    // Adding card to bin
    money -= card.base;
    addToBin(card);
    shopSold[i] = true; 
    console.log("New Shop Contents:");
    shop.forEach(card => console.log(card.describe()));

    // Print the player's money to the console
    console.log("Money after Purchase: " + money);

    refreshDisplay(); // Refresh display
}

// Play Round
function playRound() {
    console.log("Playing round...");
    // Calculate the player's score
    calculateScore();

    refreshDisplay(); // Refresh display
}

// Undo Bin to Hand Selection
// Questions for a FUTURE date: How should bin undo work? Refund card to bin or just remove from hand? 
// Should this be overhauled to discard drag & drop zone? Would need to address bin -> undo drag bug.
// We may get around to this when we migrate the code post M4 I'll keep this around
function undoSelection() {
    console.log("Undoing selection...");
    // Checking if there is a card to undo
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
        scoreProgress.max = goalScore || 100;
        scoreLabel.textContent = score + "/" + (goalScore || 100);
    }

    // Round section
    const roundText = document.querySelector(".right-column p:nth-of-type(1)");
    if (roundText) {
        roundText.textContent = round + " of 6";
    }

    // Level section
    const levelText = document.querySelector(".right-column .bottom");
    if (levelText) {
        levelText.textContent = level + " of 5";
    }

    // Money section
    const moneyText = document.querySelector(".right-column .money");
    if (moneyText) {
        moneyText.textContent = "$" + money;
    }

    // Plays section
    const playText = document.querySelector(".right-column .plays-remaining");
    if (playText) {
        playText.textContent = (7 - round) + (round === 6 ?" Play remaining!" : " Plays remaining!");
    }

    // Shop items
    const shopItems = document.querySelectorAll(".left-column .vert-container:first-of-type .items .item");
    shopItems.forEach((item, index) => {
        if (shop[index]) {
            item.textContent = shop[index].name;
            // Name fitting logic
            switch(shop[index].name){
                case "Standard Keyboard":
                    item.textContent = "Std. Keyboard";
                    break;
                case "Mechanical Keyboard":
                    item.textContent = "Mech Keyboard";
                    break;
                case "Standard Monitor":
                    item.textContent = "Std. Monitor";
                    break;
                case "Smart Notetaker":
                    item.textContent = "Smart Notetaker";
                    item.style.fontSize = "11pt";
                    break;
            }
        } else {
            item.textContent = "Empty";
        }
    });

    // Shop buttons
    const shopBtns = document.querySelectorAll(".left-column .vert-container:first-of-type .items .item-row .buy");
    shopBtns.forEach((item, index) => {
        if (shop[index]) {
            item.textContent = "Buy $" + shop[index].base;
        }
    });

    // Bin items
    const binItems = document.querySelectorAll(".left-column .vert-container:nth-of-type(2) .item");
    binItems.forEach((item, index) => {
        if (bin[index]) {
            item.textContent = bin[index].name;
            // Name fitting logic
            switch(bin[index].name){
                case "Standard Keyboard":
                    item.textContent = "Std. Keyboard";
                    break;
                case "Mechanical Keyboard":
                    item.textContent = "Mech Keyboard";
                    break;
                case "Standard Monitor":
                    item.textContent = "Std. Monitor";
                    break;
                case "Smart Notetaker":
                    item.textContent = "Smart Notetaker";
                    item.style.fontSize = "11pt";
                    break;
            }
        } else {
            item.textContent = "Empty";
        }
    });

    // Shuffle button
    const shuffleBtn = document.querySelector(".left-column .vert-container:nth-of-type(2) .shuffle .num");
    if (shuffleBtn) {
        shuffleBtn.textContent = shuffles;
    }

    // Hand cards
    const handCards = document.querySelectorAll(".play-space .card");
    handCards.forEach((card, index) => {
        if (hand[index]) {
            card.textContent = hand[index].name;
        } else {
            card.textContent = "";
        }
    });
    updateRerollButtonStatus(); // Updates reroll button status 
}

function refreshDisplay() {
    clearDragStyles();
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
        roundText.textContent = round + " of 6";
    }

    // Level section
    const levelText = document.querySelector(".right-column .bottom");
    if (levelText) {
        levelText.textContent = level + " of 5";
    }

    // Money section
    const moneyText = document.querySelector(".right-column .money");
    if (moneyText) {
        moneyText.textContent = "$" + money;
    }

    // Plays section
    const playText = document.querySelector(".right-column .plays-remaining");
    if (playText) {
        playText.textContent = (7 - round) + (round === 6 ?" Play remaining!" : " Plays remaining!");
    }

    // Shop items
    const shopItems = document.querySelectorAll(".left-column .vert-container:first-of-type .items .item");
    shopItems.forEach((item, index) => {
        if (shop[index]) {
            item.textContent = shop[index].name;
            // Name fitting logic
            switch(shop[index].name){
                case "Standard Keyboard":
                    item.textContent = "Std. Keyboard";
                    break;
                case "Mechanical Keyboard":
                    item.textContent = "Mech Keyboard";
                    break;
                case "Standard Monitor":
                    item.textContent = "Std. Monitor";
                    break;
                case "Smart Notetaker":
                    item.textContent = "Smart Notetaker";
                    item.style.fontSize = "11pt";
                    break;
            }
        } else {
            item.textContent = "Empty";
        }
    });

    // Shop buttons
    const shopBtns = document.querySelectorAll(".left-column .vert-container:first-of-type .items .item-row .buy");
    shopBtns.forEach((item, index) => {
        if (shop[index]) {
            item.textContent = "Buy $" + shop[index].base;
        }
    });

    // Bin items
    const binItems = document.querySelectorAll(".left-column .vert-container:nth-of-type(2) .item");
    binItems.forEach((item, index) => {
        if (bin[index]) {
            item.textContent = bin[index].name;
            // Name fitting logic
            switch(bin[index].name){
                case "Standard Keyboard":
                    item.textContent = "Std. Keyboard";
                    break;
                case "Mechanical Keyboard":
                    item.textContent = "Mech Keyboard";
                    break;
                case "Standard Monitor":
                    item.textContent = "Std. Monitor";
                    break;
                case "Smart Notetaker":
                    item.textContent = "Smart Notetaker";
                    item.style.fontSize = "11pt";
                    break;
            }
        } else {
            item.textContent = "Empty";
        }
    });

    // Shuffle button
    const shuffleBtn = document.querySelector(".left-column .vert-container:nth-of-type(2) .shuffle .num");
    if (shuffleBtn) {
        shuffleBtn.textContent = shuffles;
    }

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
    updateRerollButtonStatus();
    updateShuffleButtonStatus();
    updatePlayButtonStatus();
}

// Adding art images dynamically to shop and hand areas
function initImages() {
    console.log("Adding images...");
    // Shop images
    const shopItems = document.querySelectorAll(".left-column .vert-container:first-of-type .items .item");
    shopItems.forEach((item, index) => {
        // If the item doesn't already have an image
        if (!item.querySelector("img")) {
            const img = document.createElement("img");
            img.src = `../assets/cards/${shop[index].id}.png`;
            //img.src = "../assets/pics/placeholder.png";
            img.alt = "Card";
            img.width = 40;   // We can change this
            img.height = 40;
            img.style.display = "block";
            img.style.margin = "5px auto 2px auto";
            item.prepend(img);
        }
    });

    // Bin images
    const binItems = document.querySelectorAll(".left-column .vert-container:nth-of-type(2) .item");
    binItems.forEach((item, index) => {
        // If the item doesn't already have an image
        if (!item.querySelector("img")) {
            const img = document.createElement("img");
            img.src = `../assets/cards/${bin[index].id}.png`;
            //img.src = "../assets/pics/placeholder.png";
            img.alt = "Card";
            img.width = 40;   // We can change this
            img.height = 40;
            img.style.display = "block";
            img.style.margin = "5px auto 2px auto";
            item.prepend(img);
        }
    });

    // Level image
    const levelImg = document.querySelectorAll(".play-space .desk .levelImg");
    levelImg.forEach((item) => {
        // If the item doesn't already have an image
        if (!item.querySelector("img")) {
            const img = document.createElement("img");
            // Img level logic, keeping in init for later implementations (ex. start at level 2)
            switch (level) {
                case 1:
                    img.src = "../assets/levels/sheetStar.png";
                    break;
                case 2:
                    img.src = "../assets/levels/VOIP.png";
                    break;
                case 3:
                    img.src = "../assets/levels/email.png";
                    break;
                case 4:
                    img.src = "../assets/levels/database.png";
                    break;
                case 5:
                    img.src = "../assets/levels/bossCall.png";
                    break;
                default:
                    img.src = "../assets/pics/placeholder.png";
                    break;
            }
            item.prepend(img);
        }      
    });
    

    // Hand images
    const handCards = document.querySelectorAll(".play-space .cards .card");
    handCards.forEach(card => {
        if (!card.querySelector("img")) {
            const img = document.createElement("img");
            img.src = "../assets/pics/placeholder.png"; // Hand starts with empty placeholders
            img.alt = "Card placeholder";
            img.width = 80;  // We can change this
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
    const shopItems = document.querySelectorAll(".left-column .vert-container:first-of-type .items .item");
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
            img.src = `../assets/cards/${shop[index].id}.png`;
            //img.src = "../assets/pics/placeholder.png";
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
            const card = bin[index];
            img.src = `../assets/cards/${bin[index].id}.png`;
            //img.src = "../assets/pics/placeholder.png";
            img.alt = card.name;
            // Enable/disable interactivity per-instance (object identity)
            const isDisabled = binDisabled.has(card);
            item.classList.toggle("disabled", isDisabled);
            item.style.pointerEvents = isDisabled ? "none" : "";
            item.setAttribute("draggable", isDisabled ? "false" : "true");
        } else {
            img.src = "../assets/pics/placeholder.png";
            img.alt = "Empty slot";
            item.classList.add("disabled", "darkened");
            item.style.pointerEvents = "none";
            item.setAttribute("draggable", "false");
        }
    });

    // Level image
    const levelImg = document.querySelectorAll(".play-space .desk .levelImg");
    levelImg.forEach((item) => {
        let img = item.querySelector("img");
        // If there is no image element created yet
        if (!img) {
            img = document.createElement("img");
            item.prepend(img);
        }
        // Refreshing image based on current level
        switch (level) {
                case 1:
                    img.src = "../assets/levels/sheetStar.png";
                    break;
                case 2:
                    img.src = "../assets/levels/VOIP.png";
                    break;
                case 3:
                    img.src = "../assets/levels/email.png";
                    break;
                case 4:
                    img.src = "../assets/levels/database.png";
                    break;
                case 5:
                    img.src = "../assets/levels/bossCall.png";
                    break;
                default:
                    img.src = "";
                    break;
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
            img.src = `../assets/cards/${hand[index].id}.png`;
            //img.src = "../assets/pics/placeholder.png";
            img.alt = hand[index].name;
            card.classList.remove("disabled", "darkened", "empty");
            card.setAttribute("draggable", "true");
            card.style.pointerEvents = "";
        } else {
            img.src = "../assets/pics/placeholder.png";
            img.alt = "Empty slot";
            card.classList.add("disabled", "darkened", "empty");
            card.setAttribute("draggable", "false");
            card.style.pointerEvents = "none";
        }
    });
}

// updateShopButtonStatus, currently called in refreshDisplay
function updateShopButtonStatus() {
    console.log("Updating shop button status...");

    // Select the buy buttons
    const rows = document.querySelectorAll(".left-column .items .item-row");
    const buttons = document.querySelectorAll(".left-column .items .item-row .buy");

    buttons.forEach((button, i) => {
        const item = shop[i];
        const cost = item ? item.base : 0;
        const cash = money;

        const sold = !!shopSold[i];
        
        // If the item is already sold, insufficient cost, or doesnt exist: disable item interactivity and darken
        var disable;
        if (!item || sold) {
            disable = true;
        } else {
            disable = !(Number.isFinite(cost) && Number.isFinite(cash) && cash >= cost);
        }

        button.disabled = disable;
        button.classList.toggle("disabled", disable);
        button.classList.toggle("darkened", disable);

        if (rows[i]) {
            rows[i].classList.toggle("darkened", !item || sold);
        }
    });
}

// Make reroll button unclickable if money is insufficient
function updateRerollButtonStatus() {
    if (!rerollBtn) return;
    // Reroll is free when the shop is empty
    const blocked = shopHasAny() && money < 5; // Works with helper function 
    rerollBtn.disabled = blocked;
    rerollBtn.classList.toggle("disabled", blocked);
    rerollBtn.classList.toggle("darkened", blocked);
    rerollBtn.title = blocked ? "Need $5 to reroll" : "Reroll the shop";
}

// Make shuffle button unclickable if shuffles < 1
function updateShuffleButtonStatus() {
  if (!shuffleBtn) return;
  const blocked = shuffles < 1;
  shuffleBtn.disabled = blocked;
  shuffleBtn.classList.toggle("disabled", blocked);
  shuffleBtn.classList.toggle("darkened", blocked);
  shuffleBtn.title = blocked ? "No shuffles remaining" : "Shuffle your bin";
}

// Make play button unclickable if hand is empty
function updatePlayButtonStatus() {
    if (!playBtn) return;
    const blocked = hand.length < 1;
    playBtn.disabled = blocked;
    playBtn.classList.toggle("disabled", blocked);
    playBtn.classList.toggle("darkened", blocked);
    playBtn.title = blocked ? "Add cards to your hand to play" : "Play your hand";
}

// -----Interaction events-----
// Click events
// Clicking the reset button -> startGame()
if (resetBtn) {
    resetBtn.addEventListener("click", function() {
        console.log("*-*-*-Reset Button Clicked-*-*-*");
        // Win and Lose Popup Fixes
        if (winPopup && document.body.contains(winPopup)) {
        document.body.removeChild(winPopup);
        }
        if (losePopup && document.body.contains(losePopup)) {
        document.body.removeChild(losePopup);
        }
        document.querySelector("main").style.pointerEvents = "auto";
        startGame();
    });
}

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
if (rerollBtn) {
    rerollBtn.addEventListener("click", function() {
        console.log("*-*-*-Reroll Button Clicked-*-*-*");
        if (shopHasAny() && money < 5) {
            console.log("Click ignored: Need $5 to reroll.");
            return;
        }
        rerollShop();
        updateRerollButtonStatus();
    });
}

// Clicking the shuffle button -> shuffleBin()
if (shuffleBtn) {
    shuffleBtn.addEventListener("click", function() {
        console.log("*-*-*-Shuffle Button Clicked-*-*-*");
        if (shuffles < 1) {
            console.log("Click ignored: No shuffles remaining.");
            return;
        }
        shuffleBin();
        updateShuffleButtonStatus();
    });
}

// Clicking a card's buy button in shop -> buyFromShop(card)
document.querySelectorAll(".left-column .items .item-row .buy")
    .forEach((buyButton, index) => {
        buyButton.addEventListener("click", () => {
            console.log(`*-*-*-Buy Button ${index + 1} Clicked-*-*-*`);
            buyFromShop(shop[index]);

            // Mark the bought item as unavailable until next reroll
            const itemRow = buyButton.closest(".item-row");
            itemRow.classList.add("darkened");
            buyButton.disabled = true;
            buyButton.classList.add("darkened");
        });
    });

// Drag & Drop events
// Drag card from bin to hand -> addToHand(card) 
// It also lets you add the card back to the bin

let draggedFrom = null;
// Helper to remove any stuck dragged classes
function clearDragStyles() {
  document.querySelectorAll(".is-dragging").forEach(function(el){
    el.classList.remove("is-dragging");
  });
}
let draggedCardIndex = null;
let dndBound = false;
const handArea = document.querySelector(".play-space .cards");
const binArea  = document.querySelector(".left-column .vert-container:nth-of-type(2) .items");

// markDraggable, used in initDragAndDrop and shuffleBin
function markDraggable() {
    const binItems  = document.querySelectorAll(".left-column .vert-container:nth-of-type(2) .item");
    const handCards = document.querySelectorAll(".play-space .cards .card");
    binItems.forEach((el, i) => { 
        const card = bin[i];
         el.dataset.index = i;

        if (!card) {
            el.setAttribute("draggable", "false");
            el.classList.add("disabled", "darkened");
            return;
        }

        const isDisabled = binDisabled.has(card);
        el.setAttribute("draggable", isDisabled ? "false" : "true");
        el.classList.toggle("disabled", isDisabled);
        el.classList.toggle("darkened", isDisabled);
    });

    handCards.forEach((el, i) => { 
        el.dataset.index = i;
        if (!hand[i]) {
            el.setAttribute("draggable", "false");
            el.classList.add("disabled", "darkened");
        } else {
            el.setAttribute("draggable", "true");
            el.classList.remove("disabled", "darkened");
        }
    });
}

function initDragAndDrop() {
    if (dndBound) return;
    dndBound = true;

    console.log("Initializing drag and drop...");

    function attachDragStarts() {
    binArea.addEventListener("dragstart", (e) => {
        const el = e.target.closest(".item");
        if (!el) return;
        if (el.classList.contains("disabled")) {
            e.preventDefault();
            return;
        }
        draggedFrom = "bin";
        draggedCardIndex = parseInt(el.dataset.index, 10);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", "x");
        el.classList.add("is-dragging");
    }, true);

    handArea.addEventListener("dragstart", (e) => {
        const el = e.target.closest(".card");
        if (!el) return;
        draggedFrom = "hand";
        draggedCardIndex = parseInt(el.dataset.index, 10);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", "x");
        el.classList.add("is-dragging");
    }, true);

    document.addEventListener("dragend", (e) => {
        const el = e.target;
        if (el && el.classList) el.classList.remove("is-dragging");
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
            clearDragStyles(); 
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

// Show stats of card when hovering over the card
var _tipEl, _tipTarget;

function _makeTip() {
  _tipEl = document.createElement("div");
  _tipEl.style.position = "fixed";
  _tipEl.style.maxWidth = "260px";
  _tipEl.style.padding = "10px 12px";
  _tipEl.style.background = "rgba(18,18,24,.96)";
  _tipEl.style.color = "#fff";
  _tipEl.style.border = "1px solid rgba(255,255,255,.15)";
  _tipEl.style.borderRadius = "10px";
  _tipEl.style.boxShadow = "0 8px 24px rgba(0,0,0,.35)";
  _tipEl.style.font = "500 13px/1.35 system-ui,sans-serif";
  _tipEl.style.zIndex = "9999";
  _tipEl.style.pointerEvents = "none";
  _tipEl.style.display = "none";
  document.body.appendChild(_tipEl);
}

function _showTip(html, x, y){
  _tipEl.innerHTML = html;
  _tipEl.style.display = "block";
  var padding = 12, viewportWidth = window.innerWidth, viewportHeight = window.innerHeight;
  var left = x + padding, top = y + padding;
  var tipRect = _tipEl.getBoundingClientRect();
  if (left + tipRect.width > viewportWidth) left = x - tipRect.width - padding;
  if (top + tipRect.height > viewportHeight) top = y - tipRect.height - padding;
  if (left < 8) left = 8;
  if (top  < 8) top  = 8;
  _tipEl.style.left = left + "px";
  _tipEl.style.top  = top  + "px";
}
function _hideTip(){ if (_tipEl) _tipEl.style.display = "none"; }

function _tipHTML(card){
  var name   = card ? card.name   : "Unknown";
  var base   = card ? card.base   : "-";
  var tags   = card ? card.tags   : "-";
  var rarity = card ? card.rarity : "-";
  var text   = card && card.text ? card.text : "";
  var html = "";
  html += '<div style="font-weight:700;font-size:14px">' + name + '</div>';
  html += '<div style="margin-top:6px;display:flex;justify-content:space-between;gap:12px;opacity:.9"><span style="opacity:.75">Base</span><span>' + base + '</span></div>';
  html += '<div style="margin-top:6px;display:flex;justify-content:space-between;gap:12px;opacity:.9"><span style="opacity:.75">Rarity</span><span>' + rarity + '</span></div>';
  html += '<div style="margin-top:6px;display:flex;justify-content:space-between;gap:12px;opacity:.9"><span style="opacity:.75">Tags</span><span>' + tags + '</span></div>';
  if (text) html += '<div style="margin-top:6px">' + text + '</div>';
  return html;
}

// Resolve a card object from the hovered element using arrays and dom
// We need to know if the element is in the hand, the bin, or the shop.
// Then we use its position to pick the right object from hand/bin/shop.
function _resolveCard(el){
  // If the element is inside the hand area, read its data-index and use that slot in the hand array
  if (el.closest(".play-space .cards")) {
    var handIndex = parseInt(el.dataset.index || "-1", 10);
    return (Array.isArray(hand) && hand[handIndex]) ? hand[handIndex] : null;
  }
  // If the element is inside the bin area, read its data-index and use that slot in the bin array
  if (el.closest(".left-column .vert-container:nth-of-type(2) .items")) {
    var binIndex = parseInt(el.dataset.index || "-1", 10);
    return (Array.isArray(bin) && bin[binIndex]) ? bin[binIndex] : null;
  }

  // Shop items don’t have data index, so to make this work
  // Get the list of shop item elements in order
  // Find which position this element is in that list
  // Use that position to read from the shop array
  var containers = document.querySelectorAll(".left-column .vert-container");
  if (containers.length > 0 && el.closest(".left-column .vert-container:first-of-type .items")) {
    var shopItems = containers[0].querySelectorAll(".items .item");
    var shopIndex = Array.prototype.indexOf.call(shopItems, el);
    return (Array.isArray(shop) && shop[shopIndex]) ? shop[shopIndex] : null;
  }
  // If none match empty card
  return null;
}

function initHoverTooltips(){
  if (_tipEl) return; // Run once
  _makeTip();

  // Helper to check if an element is a card/item we care about
  function isTarget(el){
    return el.matches(".play-space .cards .card") ||
           el.matches(".left-column .vert-container:nth-of-type(2) .items .item") ||
           el.matches(".left-column .vert-container:first-of-type .items .item");
  }
  // Walk up to find the actual target
  function findTarget(el){
    while (el && el !== document.body){
      if (el.nodeType === 1 && isTarget(el)) return el;
      el = el.parentElement;
    }
    return null;
  }

  // Show on hover if there is a real card
  document.addEventListener("mouseover", function(e){
    var targetElement = findTarget(e.target);
    if (!targetElement) return;
    var card = _resolveCard(targetElement);
    if (!card) { // If no card, do not show anything
      _tipTarget = null;
      _hideTip();
      return;
    }
    _tipTarget = targetElement;
    _showTip(_tipHTML(card), e.clientX, e.clientY);
  });

  // Follow the cursor, but do not show during drag/hold, and hide if empty slot
  document.addEventListener("mousemove", function(e){
    // If a mouse button is down (dragging or holding), keep it hidden
    if (e.buttons) {
      _tipTarget = null;
      _hideTip();
      return;
    }
    if (!_tipTarget) return;
    var card = _resolveCard(_tipTarget);
    if (!card) { // If no card under target anymore, hide
      _tipTarget = null;
      _hideTip();
      return;
    }
    _showTip(_tipHTML(card), e.clientX, e.clientY);
  });

  // Hide when leaving the element
  document.addEventListener("mouseout", function(e){
    if (!_tipTarget) return;
    if (!e.relatedTarget || !_tipTarget.contains(e.relatedTarget)){
      _tipTarget = null;
      _hideTip();
    }
  });

  // If user clicks on the card it makes the box dissapear, makes the game run smoother
  document.addEventListener("pointerdown", function(e){
    if (findTarget(e.target)) { 
      _tipTarget = null;
      _hideTip();
    }
  }, true); 

  // Hide when dragging starts
  document.addEventListener("dragstart", function(){
    _tipTarget = null;
    _hideTip();
  }, true);

  // Hide on scroll
  window.addEventListener("scroll", _hideTip, { passive: true });
}

// -----Accessibility functions-----
// Alternate color button
const altTextButton = document.getElementById("alt_color_button")
function changeTextColor() {
    document.body.classList.toggle("alt-colors");
}

altTextButton.addEventListener("click", function (event) {
    event.preventDefault(); // Stops from navigating
    changeTextColor();
});

// Night mode button
const nightModeButton = document.getElementById("night_mode_button")
function activateNightMode() {
    document.body.classList.toggle("night-mode");
}

nightModeButton.addEventListener("click", function (event) {
    event.preventDefault(); // Stops from navigating
    activateNightMode();

    const isNight = document.body.classList.contains("night-mode");

    if (isNight) {
        settingsIcon.src = "../assets/pics/cog_alt.png";
        homeScreenMonitor.src = "../assets/pics/main_monitor_alt.png";
    } else {
        settingsIcon.src = "../assets/pics/cog.png";
        homeScreenMonitor.src = "../assets/pics/main_monitor.png";
    }
});

// Written so toggling each function doesn't affect the other
//document.body.classList.toggle("night-mode");
document.body.classList.toggle("font-large");
//document.body.classList.toggle("alt-colors"); //DON'T ENABLE. This will switch the 

// -----Main (keep below functions and events)-----
// Call the initialization function to start the engine
document.addEventListener("DOMContentLoaded", (event) => {
    initializeGameEngine();
});