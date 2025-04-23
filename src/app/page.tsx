"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"

// Define card types
type Suit = "hearts" | "diamonds" | "clubs" | "spades";
type Value = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

interface Card {
  suit: Suit;
  value: Value;
}

type GameStatus = "Welcome to Blackjack!" | "Player's turn. Hit or Stand?" | "Bust! You lose." | "Not enough cards in the deck. Please reset the game." | "No more cards in the deck." | "Dealer busts! You win!" | "Dealer wins!" | "You win!" | "Welcome to Blackjack! Press 'Deal' to start.";



// Define card suits and values explicitly
const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
const values: Value[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

// Card image URLs (replace with actual URLs)
const cardImages: { [key in Suit]: { [key in Value]: string } } = {
  hearts: { A: "./cards/ace_of_hearts.png", "2": "./cards/2_of_hearts.png", "3": "./cards/3_of_hearts.png", "4": "./cards/4_of_hearts.png", "5": "./cards/5_of_hearts.png", "6": "./cards/6_of_hearts.png", "7": "./cards/7_of_hearts.png", "8": "./cards/8_of_hearts.png", "9": "./cards/9_of_hearts.png", "10": "./cards/10_of_hearts.png", "J": "./cards/jack_of_hearts.png", "Q": "./cards/queen_of_hearts.png", "K": "./cards/king_of_hearts.png" },
  diamonds: { A: "./cards/ace_of_diamonds.png", "2": "./cards/2_of_diamonds.png", "3": "./cards/3_of_diamonds.png", "4": "./cards/4_of_diamonds.png", "5": "./cards/5_of_diamonds.png", "6": "./cards/6_of_diamonds.png", "7": "./cards/7_of_diamonds.png", "8": "./cards/8_of_diamonds.png", "9": "./cards/9_of_diamonds.png", "10": "./cards/10_of_diamonds.png", "J": "./cards/jack_of_diamonds.png", "Q": "./cards/queen_of_diamonds.png", "K": "./cards/king_of_diamonds.png" },
  clubs: { A: "./cards/ace_of_clubs.png", "2": "./cards/2_of_clubs.png", "3": "./cards/3_of_clubs.png", "4": "./cards/4_of_clubs.png", "5": "./cards/5_of_clubs.png", "6": "./cards/6_of_clubs.png", "7": "./cards/7_of_clubs.png", "8": "./cards/8_of_clubs.png", "9": "./cards/9_of_clubs.png", "10": "./cards/10_of_clubs.png", "J": "./cards/jack_of_clubs.png", "Q": "./cards/queen_of_clubs.png", "K": "./cards/king_of_clubs.png" },
  spades: { A: "./cards/ace_of_spades.png", "2": "./cards/2_of_spades.png", "3": "./cards/3_of_spades.png", "4": "./cards/4_of_spades.png", "5": "./cards/5_of_spades.png", "6": "./cards/6_of_spades.png", "7": "./cards/7_of_spades.png", "8": "./cards/8_of_spades.png", "9": "./cards/9_of_spades.png", "10": "./cards/10_of_spades.png", "J": "./cards/jack_of_spades.png", "Q": "./cards/queen_of_spades.png", "K": "./cards/king_of_spades.png" },
};

// Function to create a standard 52-card deck
const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value }); // Add explicit type here
    }
  }
  return deck;
};

// Function to shuffle the deck using Fisher-Yates algorithm
const shuffleDeck = (deck: Card[]): Card[] => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]; // Swapped elements should have the correct type
  }
  return deck;
};

// Function to calculate the hand value
const calculateHandValue = (hand: Card[]): number => {
  let hasAce: boolean = false;
  let total: number = 0;
  for (const card of hand) {
    let value: number = parseInt(card.value);
    if (isNaN(value)) {
      if (card.value === "A") {
        hasAce = true;
        value = 11; 
      } else {
        value = 10; 
      }
    }
    total += value;
  }

  // Adjust for Ace if total is over 21
  if (hasAce && total > 21) {
    total -= 10; // Convert Ace to 1
  }
  return total; // Correct return type
};

// Function to get the image URL for a card
const getCardImage = (card: Card): string => {
  return cardImages[card.suit][card.value]; // Use explicit types
};


export default function Home(): JSX.Element {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>("Welcome to Blackjack!");
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [dealerScore, setDealerScore] = useState<number>(0);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [shakeScreen, setShakeScreen] = useState<boolean>(false);
  const [winnerEffect, setWinnerEffect] = useState<boolean>(false);

  // Initialize game on mount
  useEffect(() => {
    resetGame();
  }, []);

  // Shake effect
  useEffect(() => {
    if (shakeScreen) {
      const timer: NodeJS.Timeout = setTimeout(() => {
        setShakeScreen(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [shakeScreen]);

  // Winner effect
  useEffect(() => {
    if (winnerEffect) {
      const timer: NodeJS.Timeout = setTimeout(() => {
        setWinnerEffect(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [winnerEffect]);

  // Function to deal initial hands
  const dealInitialHands = (): void => {
    if (deck.length > 3) {
      const newPlayerHand: Card[] = [deck.pop() as Card, deck.pop() as Card];
      const newDealerHand: Card[] = [deck.pop() as Card, deck.pop() as Card];

      setPlayerHand(newPlayerHand); // Update the state with new hands
      setDealerHand(newDealerHand); // Update the state with new hands
      setGameStatus("Player's turn. Hit or Stand?");
      setIsGameActive(true);

      // Calculate initial scores
      setPlayerScore(calculateHandValue(newPlayerHand));
      setDealerScore(calculateHandValue(newDealerHand));
    } else { // Handle case when there are not enough cards
      setGameStatus("Not enough cards in the deck. Please reset the game.");
    }
  };

  // Function to handle player hitting
  const handleHit = (): void => {
    if (!isGameActive) return; // Guard against hitting when game is not active

    if (deck.length > 0) {
      const newCard: Card = deck.pop() as Card;
      const newPlayerHand: Card[] = [...playerHand, newCard];
      setPlayerHand(newPlayerHand);

      const newScore: number = calculateHandValue(newPlayerHand);
      setPlayerScore(newScore);

      if (newScore > 21) {
        setGameStatus("Bust! You lose."); // Update game status
        setIsGameActive(false);
        setShakeScreen(true);
      }
    } else {
      setGameStatus("No more cards in the deck."); // Update game status
    }
  };

  // Function to handle player standing
  const handleStand = (): void => {
    if (!isGameActive) return;

    setIsGameActive(false);

    let newDealerHand: Card[] = [...dealerHand];
    let newDealerScore: number = calculateHandValue(newDealerHand);

    // Dealer AI: Dealer draws cards until hand value is 17 or more
    while (newDealerScore < 17 && deck.length > 0) {
      const newCard: Card = deck.pop() as Card;
      newDealerHand = [...newDealerHand, newCard]; // Add the new card to dealer's hand
      newDealerScore = calculateHandValue(newDealerHand); // Recalculate dealer's hand value
      setDealerHand(newDealerHand);
      setDealerScore(newDealerScore);
    }

    setDealerHand(newDealerHand);
    setDealerScore(newDealerScore); // Update the dealer's score

    // Determine the winner
    if (newDealerScore > 21) {
      setGameStatus("Dealer busts! You win!"); // Dealer busts, player wins
      setWinnerEffect(true);
    } else if (newDealerScore >= playerScore) {
      setGameStatus("Dealer wins!"); // Dealer wins or ties
      setShakeScreen(true);
    } else {
      setGameStatus("You win!"); // Player wins
      setWinnerEffect(true);
    }
    setIsGameActive(false);
  };

  // Function to reset the game
  const resetGame = (): void => {
    const newDeck: Card[] = shuffleDeck(createDeck());
    setDeck(newDeck);
    setPlayerHand([]);
    setDealerHand([]);
    setGameStatus("Welcome to Blackjack! Press 'Deal' to start.");
    setPlayerScore(0);
    setDealerScore(0);
    setIsGameActive(false);
  };

  return (
    <main className={`flex flex-col min-h-screen bg-[url('/background.jpg')] bg-cover bg-center text-white p-4 items-center ${shakeScreen ? 'shake' : ''}`}> {/* Dynamic class based on shakeScreen */}
      
        <div className="fireworks absolute inset-0 z-1 pointer-events-none">
          {[...Array(100)].map((_, i: number) => (
            <div key={i} className="firework"></div>
          ))} {/* Create 100 firework divs */}
        </div>
      
      <h1 className="text-4xl font-bold mb-4 text-[#FFD700]">Blackjack Ace</h1>

      <div className="mb-4">
        <p className="text-lg">Status: {gameStatus}</p>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full mb-4">
        {/* Player Hand */}
        <div className="mb-4">
          <h2 className="text-xl mb-2">Player Hand ({playerScore}):</h2>
          <div className="flex"> {/* Container for player's cards */}
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

        {/* Dealer Hand */}
        <div>
          <h2 className="text-xl mb-2">Dealer Hand ({dealerScore}):</h2>
          <div className="flex"> {/* Container for dealer's cards */}
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

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 relative z-10"> {/* Action button container */}
        <Button variant="secondary" className="deal-button hover:scale-105 transition-transform duration-200" onClick={dealInitialHands} disabled={isGameActive}>Deal</Button>
        <Button className="hit-button hover:scale-105 transition-transform duration-200" onClick={handleHit} disabled={!isGameActive}>Hit</Button>
        <Button className="stand-button hover:scale-105 transition-transform duration-200" onClick={handleStand} disabled={!isGameActive}>Stand</Button>
        <Button variant="destructive" className="reset-button hover:scale-105 transition-transform duration-200" onClick={resetGame}>Reset</Button>
      </div>
    </main>
  );
}
