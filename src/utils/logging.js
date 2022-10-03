// src/utils/logging.js

export { logging };

/*

    logging.info
    logging.warn

*/

const logging = {
  info: (message) => {
    if (
      !process.env.NODE_ENV ||
      ["development", "staging"].includes(process.env.NODE_ENV) ||
      process.env.OSFETCH_FORCE_LOGGING
    ) {
      console.log(`[ osfetch ] ${message}`);
    }
  },

  warn: (message) => {
    if (
      !process.env.NODE_ENV ||
      ["production", "staging"].includes(process.env.NODE_ENV) ||
      process.env.OSFETCH_FORCE_LOGGING
    ) {
      console.warn(`[ osfetch ] ${message}`);
    }
  },
};
