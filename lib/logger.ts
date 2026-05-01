// HoshClinic/lib/logger.ts

// Define a minimal interface that matches what we use
interface BaseLogger {
  info: (obj: object, msg?: string) => void;
  error: (obj: object, msg?: string) => void;
  warn: (obj: object, msg?: string) => void;
  debug: (obj: object, msg?: string) => void;
}

let logger: BaseLogger;

if (process.env.NEXT_RUNTIME === 'edge') {
  // Edge runtime doesn't support Pino's Node.js dependencies
  logger = {
    info: (obj, msg) => console.log(JSON.stringify({ level: 'info', ...obj, message: msg })),
    error: (obj, msg) => console.error(JSON.stringify({ level: 'error', ...obj, message: msg })),
    warn: (obj, msg) => console.warn(JSON.stringify({ level: 'warn', ...obj, message: msg })),
    debug: (obj, msg) => console.log(JSON.stringify({ level: 'debug', ...obj, message: msg })),
  };
} else {
  // Standard Node.js runtime - use require to avoid top-level import issues in Edge
  const pino = require('pino');
  
  logger = pino({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: process.env.NODE_ENV !== 'production' ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    } : undefined,
    base: {
      pid: typeof process !== 'undefined' ? process.pid : undefined,
    },
    messageKey: 'message',
  });
}

export default logger;
