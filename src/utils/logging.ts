// src/utils/logging.ts

export { logging };

/*

    logging.info
    logging.warn

*/

const logging = {
  info: function (message: string) {
    if (
      !process.env.NODE_ENV ||
      ["development", "staging"].includes(process.env.NODE_ENV) ||
      process.env.OSDATAHUB_FORCE_LOGGING
    ) {
      console.log(`[ osdatahub ] ${message}`);
    }
  },

  warn: function (message: string) {
    if (
      !process.env.NODE_ENV ||
      ["production", "staging"].includes(process.env.NODE_ENV) ||
      process.env.OSDATAHUB_FORCE_LOGGING
    ) {
      console.warn(`[ osdatahub ] ${message}`);
    }
  },
};
