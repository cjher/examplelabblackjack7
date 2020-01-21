//
// Blackjack Game
//
let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
let values = ['Ace', 'King', 'Queen', 'Jack', 'Ten', 'Nine', 'Eight', 
                'Seven', 'Six', 'Five', 'Four', 'Three', 'Two'];

// Grab DOM elements
let textArea = document.getElementById('textArea');
let newGameButton = document.getElementById("newGameButton");
let hitButton = document.getElementById('hitButton');
let stayButton = document.getElementById('stayButton');	

// Game variables to manage game flow/status
let gameStarted = false,
    gameOver = false,
    playerWon = false,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [];

// Hide hit/stay buttons at beginning of game
hitButton.style.display = 'none'; 
stayButton.style.display = 'none';	

showStatus(); // function to display the status of the game…will be called 
              // multiple times

// Add click event listener to new game button
newGameButton.addEventListener('click', function() {
  // Set up initial game variable values…
  gameStarted = true;
  gameOver = false;
  playerWon = false;

  // Set up the initial deck…
  deck = createDeck();

  // Shuffle the deck of cards
  shuffleDeck(deck);

  // deal out the cards to the dealer and player
  dealerCards = [getNextCard(), getNextCard()];
  playerCards = [getNextCard(), getNextCard()];

  // Change button views
  newGameButton.style.display = 'none';
  hitButton.style.display = 'inline';
  stayButton.style.display = 'inline';

  showStatus();
});

// Add listener to hit button to get a card
hitButton.addEventListener('click', function() {
  playerCards.push(getNextCard());
  checkForEndOfGame();
  showStatus();
});

// Add listener to stay button to stop the game
stayButton.addEventListener('click', function() {
  gameOver = true;
  checkForEndOfGame();
  showStatus();
});

function createDeck() {
    let deck = []; // creates empty deck
    // Loop to create the deck
    for (let suitIndex = 0; suitIndex < suits.length; suitIndex++) {
        for (let valueIndex = 0; valueIndex < values.length; valueIndex ++) {
            let card = {
                suit: suits[suitIndex],
                value: values[valueIndex]
            };
            deck.push( card );
        }
    }
    return deck;
}

// Shuffle the deck of cards so it is not always in the same order from createDeck
function shuffleDeck(deck) {
  for (let i = 0; i < deck.length; i++) {
    let swapIndex = Math.trunc(Math.random() * deck.length);
    let temp = deck[swapIndex];
    deck[swapIndex] = deck[i];
    deck[i] = temp;
  }
}

function getCard(card) {
    return card.value + ' of ' + card.suit; 
};

// Function draws next card from the deck.
function getNextCard() {
    return deck.shift(); // Array shift method grabs the first item in the array and 
  }                      // moves the remaining        
                         // items up in the array

// Get values to count blackjack
function getCardNumericValue(card) {
  switch(card.value) {
    case 'Ace':
      return 1;
    case 'Two':
      return 2;
    case 'Three':
      return 3;
    case 'Four':
      return 4;
    case 'Five': 
      return 5;
    case 'Six':
      return 6;
    case 'Seven':
      return 7;
    case 'Eight':
      return 8;
    case 'Nine':
      return 9;
    default:
      return 10;
  }
}

// Grab the score for the dealer and player
function getScore(cardArray) {
  let score = 0;
  let hasAce = false;
  for (let i = 0; i < cardArray.length; i++) {
    let card = cardArray[i];
    score += getCardNumericValue(card);
    if (card.value === 'Ace') {
      hasAce = true;
    }
  }
  if (hasAce && score + 10 <= 21) {
    return score + 10;
  }
  return score;
}

//Update dealer and player scores
function updateScores() {
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

// Check if the dealer or player won
function checkForEndOfGame() {
  updateScores();
  if (gameOver) {
    // Let dealer take cards
    while(dealerScore < playerScore 
          && playerScore <= 21 
          && dealerScore <= 21) {
      dealerCards.push(getNextCard());
      updateScores();
    }
  }
  
  if (playerScore > 21) {
    playerWon = false;
    gameOver = true;
  }
  else if (dealerScore > 21) {
    playerWon = true;
    gameOver = true;
  }
  else if (gameOver) {
    if (playerScore > dealerScore) {
      playerWon = true;
    }
    else {
      playerWon = false;
    }
  }
}

// Show the status of the game
function showStatus() {
  if (!gameStarted) {
    textArea.innerText = 'Welcome to Blackjack!';
    return;
  }
  
  let dealerCardString = '';
  for (let i=0; i < dealerCards.length; i++) {
    dealerCardString += getCard(dealerCards[i]) + '\n';
  }
  
  let playerCardString = '';
  for (let i=0; i < playerCards.length; i++) {
    playerCardString += getCard(playerCards[i]) + '\n';
  }

  updateScores();
  
textArea.innerText = 
    'Dealer has:\n' +
    dealerCardString + 
    '(score: '+ dealerScore  + ')\n\n' +
    'Player has:\n' +
    playerCardString +
    '(score: '+ playerScore  + ')\n\n';
  if (gameOver) {
    if (playerWon) {
      textArea.innerText += "YOU WIN!";
    }
    else {
      textArea.innerText += "DEALER WINS";
    }
    newGameButton.style.display = 'inline';
    hitButton.style.display = 'none';
    stayButton.style.display = 'none';
  }
}
