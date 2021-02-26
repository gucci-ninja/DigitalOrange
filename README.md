# DigitalOrange
:tangerine: Decentralized mobile app that tracks where your produce is coming from


## To get started you need the following
- Node version 10.16.0
- Docker-compose
- ganache CLI
- add truffle package through yarn or npm
- an Android phone or emulator

## To run the application
1. `react-native start` in your terminal
2. `ganache-cli -b 3` in another terminal
3. `truffle compile && truffle migrate`
4. `adb reverse tcp:8545 tcp:8545` if using Android
5. `react-native run-android`

## To sync to blockchain
1. `cd` into `elastic` directory
2. run `docker-compose up --buid`
3. `node index.js` 

Now your blockchain should start syncing with elastic! Go to localhost:5601 to see
