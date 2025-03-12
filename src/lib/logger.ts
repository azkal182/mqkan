import winston from 'winston';

// Tentukan apakah mode produksi atau tidak
const isProduction = process.env.NODE_ENV === 'production';

// Format log custom
const customFormat = winston.format.printf(
  ({ level, message, label, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}] ${label ? `[${label}] ` : ''}${message}`;
  }
);

// Konfigurasi transport untuk development & production
const transports: winston.transport[] = [];

if (isProduction) {
  transports.push(
    new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
  );
} else {
  transports.push(new winston.transports.Console());
}

// Buat logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  ),
  transports
});

// **Override metode log agar mendukung label**
type LogMethod = (label: string, message?: unknown) => void;

// Loop untuk override metode bawaan Winston
(['info', 'warn', 'error', 'debug'] as const).forEach((level) => {
  const original = logger[level].bind(logger);

  (logger as any)[level] = ((label: string, message?: unknown) => {
    if (typeof message === 'undefined') {
      original(label); // Jika hanya satu argumen, log sebagai pesan biasa
    } else {
      // Jika objek dan dalam mode development, stringify agar terbaca di console
      const formattedMessage =
        typeof message === 'object' && !isProduction
          ? JSON.stringify(message, null, 2)
          : message;

      original({ label, message: formattedMessage });
    }
  }) as LogMethod;
});

export { logger };
