"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"

// Define card suits and values
const suits = ["hearts", "diamonds", "clubs", "spades"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

// Card image URLs (replace with actual URLs)
const cardImages = {
  "hearts": {
    "A": "/cards/hearts_A.png", "2": "/cards/hearts_2.png", "3": "/cards/hearts_3.png", "4": "/cards/hearts_4.png", "5": "/cards/hearts_5.png",
    "6": "/cards/hearts_6.png", "7": "/cards/hearts_7.png", "8": "/cards/hearts_8.png", "9": "/cards/hearts_9.png", "10": "/cards/hearts_10.png",
    "J": "/cards/hearts_J.png", "Q": "/cards/hearts_Q.png", "K": "/cards/hearts_K.png",
  },
  "diamonds": {
    "A": "/cards/diamonds_A.png", "2": "/cards/diamonds_2.png", "3": "/cards/diamonds_3.png", "4": "/cards/diamonds_4.png", "5": "/cards/diamonds_5.png",
    "6": "/cards/diamonds_6.png", "7": "/cards/diamonds_7.png", "8": "/cards/diamonds_8.png", "9": "/cards/diamonds_9.png", "10": "/cards/diamonds_10.png",
    "J": "/cards/diamonds_J.png", "Q": "/cards/diamonds_Q.png", "K": "/cards/diamonds_K.png",
  },
  "clubs": {
    "A": "/cards/clubs_A.png", "2": "/cards/clubs_2.png", "3": "/cards/clubs_3.png", "4": "/cards/clubs_4.png", "5": "/cards/clubs_5.png",
    "6": "/cards/clubs_6.png", "7": "/cards/clubs_7.png", "8": "/cards/clubs_8.png", "9": "/cards/clubs_9.png", "10": "/cards/clubs_10.png",
    "J": "/cards/clubs_J.png", "Q": "/cards/clubs_Q.png", "K": "/cards/clubs_K.png",
  },
  "spades": {
    "A": "/cards/spades_A.png", "2": "/cards/spades_2.png", "3": "/cards/spades_3.png", "4": "/cards/spades_4.png", "5": "/cards/spades_5.png",
    "6": "/cards/spades_6.png", "7": "/cards/spades_7.png", "8": "/cards/spades_8.png", "9": "/cards/spades_9.png", "10": "/cards/spades_10.png",
    "J": "/cards/spades_J.png", "Q": "/cards/spades_Q.png", "K": "/cards/spades_K.png",
  },
};


// Function to create a standard 52-card deck
const createDeck = () => {
  const deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  return deck;
};

// Function to shuffle the deck using Fisher-Yates algorithm
const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

// Function to calculate the hand value
const calculateHandValue = (hand) => {
  let hasAce = false;
  let total = 0;
  for (let card of hand) {
    let value = parseInt(card.value);
    if (isNaN(value)) {
      if (card.value === "A") {
        hasAce = true;
        value = 11; // Start with Ace as 11
      } else {
        value = 10; // Face cards are 10
      }
    }
    total += value;
  }

  // Adjust for Ace if total is over 21
  if (hasAce && total > 21) {
    total -= 10; // Convert Ace to 1
  }
  return total;
};

// Function to get the image URL for a card
const getCardImage = (card) => {
  return cardImages[card.suit][card.value];
};


export default function Home() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameStatus, setGameStatus] = useState("Welcome to Blackjack!");
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false); // Track if a game is currently active

  useEffect(() => {
    resetGame();
  }, []);

  // Function to deal initial hands
  const dealInitialHands = () => {
    if (deck.length > 3) {
      const newPlayerHand = [deck.pop(), deck.pop()];
      const newDealerHand = [deck.pop(), deck.pop()];

      setPlayerHand(newPlayerHand);
      setDealerHand(newDealerHand);
      setGameStatus("Player's turn. Hit or Stand?");
      setIsGameActive(true);

      // Calculate initial scores
      setPlayerScore(calculateHandValue(newPlayerHand));
      setDealerScore(calculateHandValue(newDealerHand));
    } else {
      setGameStatus("Not enough cards in the deck. Please reset the game.");
    }
  };

  // Function to handle player hitting
  const handleHit = () => {
    if (!isGameActive) return; // Prevent hitting when game is not active

    if (deck.length > 0) {
      const newCard = deck.pop();
      const newPlayerHand = [...playerHand, newCard];
      setPlayerHand(newPlayerHand);

      const newScore = calculateHandValue(newPlayerHand);
      setPlayerScore(newScore);

      if (newScore > 21) {
        setGameStatus("Bust! You lose.");
        setIsGameActive(false);
      }
    } else {
      setGameStatus("No more cards in the deck.");
    }
  };

  // Function to handle player standing
  const handleStand = () => {
    if (!isGameActive) return; // Prevent standing when game is not active

    let newDealerHand = [...dealerHand];
    let newDealerScore = dealerScore;

    // Dealer AI: Dealer hits until hand value is 17 or more
    while (newDealerScore < 17 && deck.length > 0) {
      const newCard = deck.pop();
      newDealerHand = [...newDealerHand, newCard];
      newDealerScore = calculateHandValue(newDealerHand);
    }

    setDealerHand(newDealerHand);
    setDealerScore(newDealerScore);

    // Determine the winner
    if (newDealerScore > 21) {
      setGameStatus("Dealer busts! You win!");
    } else if (newDealerScore >= playerScore) {
      setGameStatus("Dealer wins!");
    } else {
      setGameStatus("You win!");
    }
    setIsGameActive(false);
  };

  // Function to reset the game
  const resetGame = () => {
    const newDeck = shuffleDeck(createDeck());
    setDeck(newDeck);
    setPlayerHand([]);
    setDealerHand([]);
    setGameStatus("Welcome to Blackjack! Press 'Deal' to start.");
    setPlayerScore(0);
    setDealerScore(0);
    setIsGameActive(false);
  };

  return (
    <main className="flex flex-col min-h-screen bg-[url('/casino-table-background.jpg')] bg-cover bg-center text-white p-4 items-center">
      <h1 className="text-4xl font-bold mb-4 text-[#FFD700]">Blackjack Ace</h1>

      <div className="mb-4">
        <p className="text-lg">Status: {gameStatus}</p>
      </div>

      <div className="flex justify-around w-full mb-4">
        <div>
          <h2 className="text-xl mb-2">Player Hand ({playerScore}):</h2>
          <div className="flex">
            {playerHand.map((card, index) => (
              <img
                key={index}
                src={getCardImage(card)}
                alt={`${card.value} of ${card.suit}`}
                className="mr-2 h-32"
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl mb-2">Dealer Hand ({dealerScore}):</h2>
          <div className="flex">
            {dealerHand.map((card, index) => (
              <img
                key={index}
                src={getCardImage(card)}
                alt={`${card.value} of ${card.suit}`}
                className="mr-2 h-32"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Button variant="secondary" onClick={dealInitialHands} disabled={isGameActive}>Deal</Button>
        <Button onClick={handleHit} disabled={!isGameActive}>Hit</Button>
        <Button onClick={handleStand} disabled={!isGameActive}>Stand</Button>
        <Button variant="destructive" onClick={resetGame}>Reset</Button>
      </div>
    </main>
  );
}
