const readline = require('readline');
const UUID = require('uuid/v4');

const { JID } = require('../resources/JID');
const Endpoints = require('../resources/Endpoints');

/**
 * Checks if `value` is a valid username.
 * @param {string} value The parameter to validate
 * @returns {boolean} `true | false`
 */
module.exports.isDisplayName = value => value && typeof value === 'string' && value.length >= 3 && value.length <= 16;

/**
 * Make a promt request to console, and wait for repsonse before resolving it
 */
module.exports.consolePrompt = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, (ans) => {
    rl.close();
    resolve(ans);
  }));
};

/**
 * Convert a users accountId to a JID which we can use for communicator
 */
module.exports.makeJID = accountId => new JID(`${accountId}@${Endpoints.EPIC_PROD_ENV}`);

/**
 * Generate a UUID
 * @return {string} String uppercase GUID without "-" inside of it.
 */
module.exports.generateUUID = () => UUID().replace(/-/g, '').toUpperCase();

/**
 * Wait and resolve for a specific event
 * @param {instance} instance - Which instance to listen for events on
 * @param {string} event - Which event to wait for
 * @param {number} time - Maximum waiting time
 * @param {expression} filter - Expression to filter incoming events on
 */
module.exports.resolveEvent = (instance, event, time, filter) => {
  const timeout = typeof time === 'number' ? time : 5000;
  return new Promise((resolve, reject) => {
    instance.on(event, (...args) => {
      if (filter && !filter(...args)) return;
      resolve(...args);
    });
    setTimeout(() => reject(new Error(`Waiting for event timeout exceeded: ${timeout} ms`)), timeout);
  });
};
