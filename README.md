# RPS-WEB3

RPS-WEB3 is a decentralized Rock-Paper-Scissors-Lizard-Spock (Extended RPS) game built using modern web technologies. This project leverages **Vite + React** for the frontend and **Wagmi** for interacting with Ethereum-based smart contracts. The game allows players to compete in a trustless and transparent manner on the blockchain.

---

## Live Demo

Check out the live demo of [RPS-WEB3](https://rps-web3.onrender.com/)

> It might take the integrated BE a minute to cold start (free tier instance)

---

## Technologies Used

- **Vite**: A fast and modern build tool for frontend development.
- **React**: A JavaScript library for building user interfaces.
- **Wagmi**: A collection of React hooks for working with Ethereum, enabling seamless interaction with smart contracts and wallets like MetaMask.
- **Socket.io Client**: Real-time event delegation library to relay messsages to server

---

## How to Play the Game

1. **Connect Your Wallet**:

   - Click the "Connect Wallet" button to connect your Ethereum wallet (e.g., MetaMask).
   - Ensure you are on a supported network (Currently only **Sepolia** is Supported).

2. **Place Your Bet**:

   - Choose your move: Rock, Paper, Scissors, Lizard or Spock.
   - Enter the player's wallet address with whom you want to play
   - Enter the amount of ETH you want to bet and confirm the transaction.

3. **Wait for Opponent**:

   - Once your bet is placed, wait for another player to join and make their move.

4. **Reveal the Winner**:

   - After both players have made their moves, solve the game and smart contract will distribute the funds accordingly.

5. **Claim Your Winnings**:
   - If you win, you can claim your winnings directly from the game interface.

---

## Future Improvements

- **Leaderboard**: Implement a leaderboard to track top players and their scores.
- **Mobile Support**: Improve the UI/UX for mobile devices to make the game more accessible.
- **Improved Real Time Notifications**: Implement robust event delegation to make the game resolve itself rather than requiring user input

---
