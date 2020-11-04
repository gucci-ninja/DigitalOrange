/**
 * @format
 */

import "./shims";
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

import React from "react";
// library to handle some frontend stuff
import { Drizzle, generateStore } from "drizzle";

// Add compiled blockchain contract
import ItemStore from "./build/contracts/ItemStore.json";

const options = {
    contracts: [ItemStore]
};
const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

AppRegistry.registerComponent(appName, () => () => <App drizzle={drizzle} />);
