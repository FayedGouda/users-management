import { errorHandler } from '../helpers/errorHandler';

const errors = function () {
    process.on('uncaughtException', (ex) => {
        errorHandler.handleError(ex);
        process.exit(1);

    });
    process.on('unhandledRejection', (ex) => {
        throw ex

    });
}
export default errors;