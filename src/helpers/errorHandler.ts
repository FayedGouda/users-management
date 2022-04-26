import { logger } from '../helpers/logger';
abstract class BaseError extends Error {
    public readonly name: string;
    public readonly isOperational: boolean;

    constructor(name: string, description: string, isOperational: boolean) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = name;
        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }
}
class ErrorHandler {
    public async handleError(err: Error): Promise<void> {
        await logger.error(
            'ErrorHander: ',
            err,
        );
        //   await sendMailToAdminIfCritical();
        //   await sendEventsToSentry();
    }
    public isTrustedError(error: Error) {
        if (error instanceof BaseError) 
            return error.isOperational;
        return false;
    }
}
export const errorHandler = new ErrorHandler();