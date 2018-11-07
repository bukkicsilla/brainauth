//https://stackoverflow.com/questions/49586368/how-to-export-mlab-online-database-to-file

var mongoose = require('mongoose');

//var dbURI = 'mongodb://localhost:27017/Brain';
var dbURI = 'mongodb://lunasaturni:vorce166@ds143451.mlab.com:43451/brainmlab'

//var dbURI = 'mongodb://localhost/Brain';

if (process.env.NODE_ENV === 'production'){
      dbURI = process.env.MONGODB_URI;
      //dbURI = process.env.MONGOLAB_TEAL_URI;
    //dbURI = 'mongodb://heroku_l1zxvgh6:2tvfgoopgt9fhq8imhgfkjo7cj@ds123399.mlab.com:23399/heroku_l1zxvgh6';
}
//NODE_ENV=production MONGODB_URI=mongodb://heroku_l1zxvgh6:2tvfgoopgt9fhq8imhgfkjo7cj@ds123399.mlab.com:23399/heroku_l1zxvgh6 nodemon start
mongoose.connect(dbURI);


mongoose.connection.on('connected', function(){
    console.log('Moongose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err){
    console.log('Moongose connection error: ' + err);
});
mongoose.connection.on('disconnected', function(){
    console.log('Moongose disconnected');
});
// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function() {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};
// For nodemon restarts
process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', function() {
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});
// For Heroku app termination
process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app termination', function() {
        process.exit(0);
    });
});

require('./brainparts');


