module.exports = function (app) {
    var user = require('./controllers/UserController');


    app.get('/', function (req, res, next) {
        return res.send("WELCOME TO Victor City Rest services");
    });

    app.post('/register', user.register); //Register User
    app.post('/login', user.login);  // Authenticate User
    app.get('/users/:email', user.getUserByEmail);  // Get User Profile By email
    app.get('/forgotpassword/:email', user.forgotPassword);  // send forgot password at user email
    app.post('/resetpassword', user.resetPassword);  // resets password via verification code
    //app.get('/users', user.getUserList);  // Get User List
    app.post('/updateprofile', user.updateUserProfile);  // Update  User Profile
    app.del('/users/:email', user.deleteUserByEmail);  // Delete  User By Email

    var location = require('./controllers/LocationController');
    app.get('/location', location.getLocation);  // Get Location

    var fileController = require('./controllers/FileController');
    app.get('/download', fileController.download);
    app.post('/upload', fileController.upload);



};