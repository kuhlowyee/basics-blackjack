var gameMode = 'game start'
var playerHand = [];
var dealerHand = [];
var gameDeck = '';

var makeDeck = function () {
  var cardDeck = [];
  var suits = ['diamonds', 'hearts', 'clubs', 'spades'];

  // Loop over the suits array
  var suitIndex = 0;
  while (suitIndex < suits.length) {
    // Store the current suit in a variable
    var currentSuit = suits[suitIndex];

    // Loop from 1 to 13 to create all cards for a given suit
    // Notice rankCounter starts at 1 and not 0, and ends at 13 and not 12.
    var rankCounter = 1;
    while (rankCounter <= 13) {
      // By default, the card name is the same as rankCounter
      var cardName = rankCounter;

      if (cardName == 1) {
        cardName = 'ace';
      } else if (cardName == 11) {
        cardName = 'jack';
      } else if (cardName == 12) {
        cardName = 'queen';
      } else if (cardName == 13) {
        cardName = 'king';
      }

      // Create a new card with the current name, suit, and rank
      var card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      // Add the new card to the deck
      cardDeck.push(card);
      rankCounter += 1;
    }

    suitIndex += 1;
  }

  return cardDeck;
};

// Get a random index ranging from 0 (inclusive) to max (exclusive).
var getRandomIndex = function (max) {
  return Math.floor(Math.random() * max);
};

var shuffleCards = function (cardDeck) {
  // Loop over the card deck array once
  var currentIndex = 0;
  while (currentIndex < cardDeck.length) {
    var randomIndex = getRandomIndex(cardDeck.length);
    var randomCard = cardDeck[randomIndex];
    var currentCard = cardDeck[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cardDeck[currentIndex] = randomCard;
    cardDeck[randomIndex] = currentCard;
    currentIndex = currentIndex + 1;
  }
  return cardDeck;
};

var createNewDeck = function () {
  var newDeck = makeDeck();
  var shuffledDeck = shuffleCards(newDeck);
  return shuffledDeck;
};

var checkForBlackjack = function (handArray) {
  var playerCardOne = handArray[0];
  var playerCardTwo = handArray[1];
  var blackjack = false;

  if (
    (playerCardOne.name == 'ace' && playerCardTwo.rank >= 10) ||
    (playerCardOne.rank >= 10 && playerCardTwo.name == 'ace')
  ) {
    blackjack = true;
  }

  return blackjack;
}

var calculateCardsValue = function (handArray) {
  var totalCardsValue = 0;
  var index = 0;
  var aceCounter = 0;
  while (index < handArray.length) {
    var currentCard = handArray[index];
    if (currentCard.name == 'jack' || currentCard.name == 'queen' || currentCard.name == 'king') {
      totalCardsValue += 10;
    } else if (currentCard.name == 'ace') {
      // the value of ace is assumed to be 11 by default
      totalCardsValue += 11;
      aceCounter += 1;
    } else {
      totalCardsValue = totalCardsValue + currentCard.rank;
    }
    index += 1;
  }

  index = 0;
  while (index < aceCounter) {
    if (totalCardsValue > 21) {
      totalCardsValue = totalCardsValue - 10;
    }
    index += 1;
  }
  return totalCardsValue;
}

var displayBothHands = function (playerHandArray, dealerHandArray) {
  var playerMessage = 'Player Hand: <br> ';
  var index = 0;
  while (index < playerHandArray.length) {
    playerMessage = playerMessage + '-' + playerHandArray[index].name + ' of ' + playerHandArray[index].suit + '<br>';
    index += 1;
  };

  index = 0;
  var dealerMessage = "Dealer Hand: <br>";
  while (index < dealerHandArray.length) {
    dealerMessage = dealerMessage + '-' + dealerHandArray[index].name + ' of ' + dealerHandArray[index].suit + '<br>';
    index += 1;
  }

  return playerMessage + '<br>' + dealerMessage;
};

var displayHandTotalValues = function (playerHandValue, dealerHandValue) {
  var totalHandValueMessage = '<br>Player total hand value: ' + playerHandValue + '<br>Dealer total hand value: ' + dealerHandValue;
  return totalHandValueMessage;
};


var main = function (input) {
  var outputMessage = '';
  if (gameMode == 'game start') {
    gameDeck = createNewDeck();
    // Remove 2 cards from the top of the deck and push into player and dealer's hands
    playerHand.push(gameDeck.pop());
    playerHand.push(gameDeck.pop());
    dealerHand.push(gameDeck.pop());
    dealerHand.push(gameDeck.pop());
    gameMode = 'compare cards';
    outputMessage = 'Your cards have been dealt. Click submit to evaluate your cards!'
  } else if (gameMode == 'compare cards') {
    var playerBlackjack = checkForBlackjack(playerHand);
    var dealerBlackjack = checkForBlackjack(dealerHand);

    if (playerBlackjack == true || dealerBlackjack == true) {
      if (playerBlackjack == true && dealerBlackjack == true) {
        outputMessage = displayBothHands(playerHand, dealerHand) + "Both you and the dealer got blackjack! It's a tie!"
      } else if (playerBlackjack == true && dealerBlackjack == false) {
        outputMessage = displayBothHands(playerHand, dealerHand) + " You got a blackjack! You win!"
      } else if (playerBlackjack == false && dealerBlackjack == true) {
        outputMessage = displayBothHands(playerHand, dealerHand) + " The dealer got a blackjack! You lose!"
      }
    } else {
      outputMessage = displayBothHands(playerHand, dealerHand) + "There is no blackjack!";
      gameMode = 'hit or stand';
    }
  } else if (gameMode == 'hit or stand') {
    if (input == 'hit') {
      playerHand.push(gameDeck.pop());
      outputMessage = displayBothHands(playerHand, dealerHand) + '<br> You drew another card. <br> Please input "hit" or "stand".'
    } else if (input == 'stand') {
      var playerHandTotalValue = calculateCardsValue(playerHand);
      var dealerHandTotalValue = calculateCardsValue(dealerHand);
      // dealer has to hit if total cards value is below 17
      while (dealerHandTotalValue < 17) {
        dealerHand.push(gameDeck.pop());
        dealerHandTotalValue = calculateCardsValue(dealerHand);
      }

      if ((playerHandTotalValue == dealerHandTotalValue) || (playerHandTotalValue > 21 && dealerHandTotalValue > 21)) {
        outputMessage = displayBothHands(playerHand, dealerHand) + "<br> It's a tie!" + displayHandTotalValues(playerHandTotalValue, dealerHandTotalValue);
      } else if ((playerHandTotalValue > dealerHandTotalValue && playerHandTotalValue <= 21) ||
        (playerHandTotalValue <= 21 && dealerHandTotalValue > 21)) {
        outputMessage = displayPlayerAndDealerHands(playerHand, dealerHand) + "<br>Player wins!" + displayHandTotalValues(playerHandTotalValue, dealerHandTotalValue);
      } else {
        outputMessage = displayPlayerAndDealerHands(playerHand, dealerHand) + "<br>Dealer wins!" + displayHandTotalValues(playerHandTotalValue, dealerHandTotalValue);
      }
    } else {
      outputMessage = 'wrong input... only "hit" or "stand" are valid.<br><br>' + displayPlayerAndDealerHands(playerHand, dealerHand);
    }
  }
  return outputMessage;
}
