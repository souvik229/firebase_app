"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"

// Define card suits and values
const suits = ["hearts", "diamonds", "clubs", "spades"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

// Card image URLs (replace with actual URLs)
const cardImages = {
  "hearts": {
    "A": "/cards/ace_of_hearts.png", "2": "/cards/2_of_hearts.png", "3": "/cards/3_of_hearts.png", "4": "/cards/4_of_hearts.png", "5": "/cards/5_of_hearts.png",
    "6": "/cards/6_of_hearts.png", "7": "/cards/7_of_hearts.png", "8": "/cards/8_of_hearts.png", "9": "/cards/9_of_hearts.png", "10": "/cards/10_of_hearts.png",
    "J": "/cards/jack_of_hearts.png", "Q": "/cards/queen_of_hearts.png", "K": "/cards/king_of_hearts.png",
  },
  "diamonds": {
    "A": "/cards/ace_of_diamonds.png", "2": "/cards/2_of_diamonds.png", "3": "/cards/3_of_diamonds.png", "4": "/cards/4_of_diamonds.png", "5": "/cards/5_of_diamonds.png",
    "6": "/cards/6_of_diamonds.png", "7": "/cards/7_of_diamonds.png", "8": "/cards/8_of_diamonds.png", "9": "/cards/9_of_diamonds.png", "10": "/cards/10_of_diamonds.png",
    "J": "/cards/jack_of_diamonds.png", "Q": "/cards/queen_of_diamonds.png", "K": "/cards/king_of_diamonds.png",
  },
  "clubs": {
    "A": "/cards/ace_of_clubs.png", "2": "/cards/2_of_clubs.png", "3": "/cards/3_of_clubs.png", "4": "/cards/4_of_clubs.png", "5": "/cards/5_of_clubs.png",
    "6": "/cards/6_of_clubs.png", "7": "/cards/7_of_clubs.png", "8": "/cards/8_of_clubs.png", "9": "/cards/9_of_clubs.png", "10": "/cards/10_of_clubs.png",
    "J": "/cards/jack_of_clubs.png", "Q": "/cards/queen_of_clubs.png", "K": "/cards/king_of_clubs.png",
  },
  "spades": {
    "A": "/cards/ace_of_spades.png", "2": "/cards/2_of_spades.png", "3": "/cards/3_of_spades.png", "4": "/cards/4_of_spades.png", "5": "/cards/5_of_spades.png",
    "6": "/cards/6_of_spades.png", "7": "/cards/7_of_spades.png", "8": "/cards/8_of_spades.png", "9": "/cards/9_of_spades.png", "10": "/cards/10_of_spades.png",
    "J": "/cards/jack_of_spades.png", "Q": "/cards/queen_of_spades.png", "K": "/cards/king_of_spades.png",
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
    } else {
      value = value;
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
  const [shakeScreen, setShakeScreen] = useState(false);
  const [winnerEffect, setWinnerEffect] = useState(false);


  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    if (shakeScreen) {
      const timer = setTimeout(() => {
        setShakeScreen(false);
      }, 500); // Duration of the shake effect
      return () => clearTimeout(timer);
    }
  }, [shakeScreen]);

    useEffect(() => {
    if (winnerEffect) {
      const timer = setTimeout(() => {
        setWinnerEffect(false);
      }, 3000); // Duration of the winner effect
      return () => clearTimeout(timer);
    }
  }, [winnerEffect]);

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
        setShakeScreen(true);
      }
    } else {
      setGameStatus("No more cards in the deck.");
    }
  };

  // Function to handle player standing
  const handleStand = () => {
    if (!isGameActive) return; // Prevent standing when game is not active

    setIsGameActive(false); // Player is done, so the game is no longer active for the player

    let newDealerHand = [...dealerHand];
    let newDealerScore = calculateHandValue(newDealerHand);

    // Dealer AI: Dealer hits until hand value is 17 or more
    while (newDealerScore < 17 && deck.length > 0) {
      const newCard = deck.pop();
      newDealerHand = [...newDealerHand, newCard];
      newDealerScore = calculateHandValue(newDealerHand);
      setDealerHand(newDealerHand);
      setDealerScore(newDealerScore);
    }

    setDealerHand(newDealerHand);
    setDealerScore(newDealerScore);

    // Determine the winner
    if (newDealerScore > 21) {
      setGameStatus("Dealer busts! You win!");
      setWinnerEffect(true);
    } else if (newDealerScore >= playerScore) {
      setGameStatus("Dealer wins!");
      setShakeScreen(true);
    } else {
      setGameStatus("You win!");
      setWinnerEffect(true);
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
    <main className={`flex flex-col min-h-screen bg-[url('/background.jpg')] bg-cover bg-center text-white p-4 items-center ${shakeScreen ? 'shake' : ''}`}>
      
        <div className="fireworks absolute inset-0 z-1 pointer-events-none">
          {[...Array(100)].map((_, i) => (
            <div key={i} className="firework"></div>
          ))}
        </div>
      
      <h1 className="text-4xl font-bold mb-4 text-[#FFD700]">Blackjack Ace</h1>

      <div className="mb-4">
        <p className="text-lg">Status: {gameStatus}</p>
      </div>

      <div className="flex justify-around w-full mb-4 relative z-10">
        <div>
          <h2 className="text-xl mb-2">Player Hand ({playerScore}):</h2>
          <div className="flex">
            {playerHand.map((card, index) => (
              <img
                key={index}
                src={getCardImage(card)}
                alt={`${card.value} of ${card.suit}`}
                className="mr-2 h-32 rounded-md"
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
                className="mr-2 h-32 rounded-md"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4 relative z-10">
        <Button variant="secondary" className="hover:bg-secondary/80 transition-colors duration-200" onClick={dealInitialHands} disabled={isGameActive}>Deal</Button>
        <Button className="hover:bg-primary/80 transition-colors duration-200" onClick={handleHit} disabled={!isGameActive}>Hit</Button>
        <Button className="hover:bg-primary/80 transition-colors duration-200" onClick={handleStand} disabled={!isGameActive}>Stand</Button>
        <Button variant="destructive" className="hover:bg-destructive/80 transition-colors duration-200" onClick={resetGame}>Reset</Button>
      </div>
    </main>
  );
}
