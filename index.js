const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config');
const winston = require('winston');
const app = express();
const cors = require('cors');

// Express MW
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['http://www.wager.com.ng', 'http://localhost:4200'],
    credentials: true
}));

// create winston logger
const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize({ all: true }))
        }),
        new winston.transports.File({ filename: './logger/logs.log', level: 'error' })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: './logger/exceptions.log' })
    ]
})

// Routes MW
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/lay', require('./routes/lay'));
app.use('/api/deposit', require('./routes/deposit'));
app.use('/api/withdraw', require('./routes/withdraw'));

// Connect to database
mongoose.connect(`mongodb+srv://${config.server.username}:${config.server.password}@cluster0.dqc6b.mongodb.net/${config.server.database}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    logger.info(`info`, `Database connected`)
}).catch((error) => {
    logger.error(`error`, error)
})

// Start server
app.listen(config.server.port, () => {
    logger.info(`Server started: ${config.server.hostname}:${config.server.port}`)
})