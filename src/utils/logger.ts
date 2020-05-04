import Log4js from 'log4js';

const loggerLevel = process.env.LOGGER_LEVEL ? process.env.LOGGER_LEVEL : 'info';

Log4js.configure({
  appenders: { console: { type: 'console' } },
  categories: { default: { appenders: ['console'], level: loggerLevel } },
});

const Logger = Log4js.getLogger();

export default Logger;
