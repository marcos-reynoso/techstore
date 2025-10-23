
const isDev = process.env.NODE_ENV === 'development'

export const logger = {
    error: (message: string, error?: unknown) => {
        if (isDev) {
            console.error(`[ERROR] ${message}`, error)
        }

    },

    info: (message: string, data?: unknown) => {
        if (isDev) {
            console.log(`[INFO] ${message}`, data)
        }
    },

    warn: (message: string, data?: unknown) => {
        if (isDev) {
            console.warn(`[WARN] ${message}`, data)
        }
    },

    debug: (message: string, data?: unknown) => {
        if (isDev) {
            console.debug(`[DEBUG] ${message}`, data)
        }
    }
}
