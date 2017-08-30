module.exports = function (app) {
    var user = require('./controllers/UserController');
    var location = require('./controllers/LocationController');
    var fileController = require('./controllers/FileController');
    var friend = require('./controllers/FriendController');


    app.get('/', function (req, res, next) {
        return res.send("WELCOME TO Victor City Rest services");
    });

    app.post('/register', user.register); //Register User
    app.post('/login', user.login);  // Authenticate User
    app.get('/users/:email', user.getUserByEmail);  // Get User Profile By email
    app.get('/forgotpassword/:email', user.forgotPassword);  // send forgot password at user email
    app.post('/resetpassword', user.resetPassword);  // resets password via verification code
    app.post('/updatepassword', user.changePassword);  // change password,provide old password,new password,email
    //app.get('/users', user.getUserList);  // Get User List
    app.post('/updateprofile', user.updateUserProfile);  // Update  User Profile
    app.del('/users/:email', user.deleteUserByEmail);  // Delete  User By Email


    app.get('/location', location.getLocation);  // Get Location

    app.post('/uploadImage', fileController.uploadImage);
    app.get('/download', fileController.download);

    app.post('/addfriend', friend.addFriend);
    app.post('/unfriend', friend.unFriend);
    app.get('/friends/:email', friend.getFriendListByEmail);
    app.get('/friendlist/:email', friend.searchFriend);





};

//TODO Test changes password
//TODO Test forget password
//TODO Test update profile
//TODO Test on Nexus 5
//TODO Fix location issue
//TODO Image Upload
//TODO sqlite update user when profile update
//TODO Fetch the data on search screen
//TODO Add filters
//TODO fetch comments list
//TODO Add comment
//TODO delete comment
//TODO Chat
//TODO History
//TODO Add friend (screen)
//TODO Search Friend (screen)
//TODO Delete friend (screen)
//TODO Get friend list of user
