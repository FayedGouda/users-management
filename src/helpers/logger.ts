import winston from 'winston';


const alignColorsAndTime = winston.format.combine(
    winston.format.colorize({
        colors: {
            'error': 'red',
            'info': 'green',
            'debug': 'blue',
            'warn': 'yallow',

        },
        all: true
    }),
    winston.format.label({
        label: '[Logger]',


    }),
    winston.format.timestamp({
        format: "DD-MM-YY HH:MM:SS"
    }),
    winston.format.printf(
        info => `${info.label}  [ ${info.timestamp} ]  [${info.level}] : ${info.message}`
    )
);
class Logger {

    public logs() {
        return winston.createLogger({
            level: "debug",
            transports: [
                new winston.transports.File({
                    filename: './src/logs/logfile.log',
                    level: 'debug',
                    format: winston.format.combine(
                        // winston.format.label({
                        //     label: '[File-Logger]'
                        // }),
                        winston.format.timestamp({
                            format: "DD-MM-YY HH:MM:SS"
                        }),
                        winston.format.printf(
                            info => ` [${info.level}]  ${info.timestamp}  : ${info.message}`
                        )
                    )
                }),
                new (winston.transports.Console)({
                    format: winston.format.combine(winston.format.colorize(), alignColorsAndTime)
                })
            ],
        });
    }

}

export const logger = new Logger().logs();