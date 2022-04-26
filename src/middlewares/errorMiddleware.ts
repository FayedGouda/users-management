import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../helpers/errorHandler';
const errorMiddleWare = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (!errorHandler.isTrustedError(err)) {
        return res.status(500).send('Something failed on the server!');
        // errorHandler.handleError(err);
    }
    errorHandler.handleError(err);
}
export default errorMiddleWare;