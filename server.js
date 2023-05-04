const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

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