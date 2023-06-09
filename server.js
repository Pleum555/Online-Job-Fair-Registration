const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

//Route files
const auth = require('./routes/auth');
const companies = require('./routes/companies');
const interviewSessionBookings = require('./routes/interviewSessionBookings');

//Load env vars
dotenv.config({path:'./config/config.env'});

//Connect to database
connectDB();

const app = express();

//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Rate Limiting
const limiter=rateLimit({
    windowsMs:10*60*1000,//10 mins
    max: 100
    });
app.use(limiter);

//Prevent http param pollutions
app.use(hpp());

//Enable CORS
app.use(cors());

//Mount routers
app.use('/api/Online-Job-Fair/auth', auth);
app.use('/api/Online-Job-Fair/companies', companies);
app.use('/api/Online-Job-Fair/interviewsessionbookings', interviewSessionBookings);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, 'mode on port ', PORT));

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //Close server & exit process
    server.close(() => process.exit(1));
});