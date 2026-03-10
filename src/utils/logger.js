/**
 * Custom Logger Utility
 * Works only in development environment (NODE_ENV=development)
 */

// Load environment variables
require('dotenv').config();

class Logger {
    constructor() {
        // Check if NODE_ENV is development, default to development if not set
        this.isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

        // ANSI color codes for better visibility
        this.colors = {
            reset: '\x1b[0m',
            bright: '\x1b[1m',
            red: '\x1b[31m',
            yellow: '\x1b[33m',
            blue: '\x1b[34m',
            cyan: '\x1b[36m',
            gray: '\x1b[90m',
            green: '\x1b[32m'
        };
    }

    /**
     * Get formatted timestamp
     */
    getTimestamp() {
        const now = new Date();
        return now.toISOString();
    }

    /**
     * Format log message
     */
    formatMessage(level, message, data = null) {
        const timestamp = this.getTimestamp();
        let logMessage = `[${timestamp}] [${level}]`;

        if (typeof message === 'object') {
            logMessage += `\n${JSON.stringify(message, null, 2)}`;
        } else {
            logMessage += ` ${message}`;
        }

        if (data) {
            logMessage += `\n${JSON.stringify(data, null, 2)}`;
        }

        return logMessage;
    }

    /**
     * Info level logging (development only)
     */
    info(message, data = null) {
        if (!this.isDevelopment) return;

        const formattedMsg = this.formatMessage('INFO', message, data);
        console.log(`${this.colors.cyan}${formattedMsg}${this.colors.reset}`);
    }

    /**
     * Warning level logging (development only)
     */
    warn(message, data = null) {
        if (!this.isDevelopment) return;

        const formattedMsg = this.formatMessage('WARN', message, data);
        console.warn(`${this.colors.yellow}${formattedMsg}${this.colors.reset}`);
    }

    /**
     * Error level logging (development only)
     */
    error(message, error = null) {
        if (!this.isDevelopment) return;

        let errorData = null;

        if (error instanceof Error) {
            errorData = {
                message: error.message,
                stack: error.stack,
                name: error.name
            };
        } else if (error) {
            errorData = error;
        }

        const formattedMsg = this.formatMessage('ERROR', message, errorData);
        console.error(`${this.colors.red}${formattedMsg}${this.colors.reset}`);
    }

    /**
     * Success level logging (development only)
     */
    success(message, data = null) {
        if (!this.isDevelopment) return;

        const formattedMsg = this.formatMessage('SUCCESS', message, data);
        console.log(`${this.colors.green}${formattedMsg}${this.colors.reset}`);
    }

    /**
     * Debug level logging (development only)
     */
    debug(message, data = null) {
        if (!this.isDevelopment) return;

        const formattedMsg = this.formatMessage('DEBUG', message, data);
        console.log(`${this.colors.gray}${formattedMsg}${this.colors.reset}`);
    }

    /**
     * HTTP request logging (development only)
     */
    http(method, url, statusCode, duration = null) {
        if (!this.isDevelopment) return;

        const durationText = duration ? ` - ${duration}ms` : '';
        const message = `${method} ${url} ${statusCode}${durationText}`;
        const formattedMsg = this.formatMessage('HTTP', message);

        const color = statusCode >= 500 ? this.colors.red
            : statusCode >= 400 ? this.colors.yellow
                : this.colors.green;

        console.log(`${color}${formattedMsg}${this.colors.reset}`);
    }
}

// Export singleton instance
module.exports = new Logger();