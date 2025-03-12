import pino from 'pino';

// export const logger = pino({
//   level: 'info',
//   transport: {
//     target: 'pino-pretty', // for development (console prettifying)
//     options: { colorize: true }
//   }
// });
export const logger = pino({ level: 'info' });
