/**
 * Created by mujahidmasood on 12.08.17.
 */

function FileController() {

    var that = this;
    var generalResponse = require('./GeneralResponse');
    var request = require('request').defaults({encoding: null});
    var cloudinary = require('cloudinary');
    var users = require('../models/usersSchema');


    cloudinary.config({
        cloud_name: 'dsmd1d21f',
        api_key: '653619854882521',
        api_secret: 'dGA40Lvs8MSEN3Mefegs9OYmNuI'
    });

    that.download = function (req, res, next) {

        request.get(req.params.url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
                console.log(data);
                return res.send(generalResponse.sendSuccessResponse(true, 200, data))
            } else {
                console.error("Error inside download ", error);
                return res.send(generalResponse.sendFailureResponse(false, 400, error))
            }
        });
    }

    that.uploadImage = function (req, res, next) {

        var email = req.body.email;

        console.log("FileController.upload() email request ",req.body.email);

        cloudinary.uploader.upload(req.body.imageData, {timeout:600000}, function (error, result) {
            if (error) {
                console.log("FileController.upload() error ocurred", error);
                res.send(generalResponse.sendFailureResponse(error,error,"Error occured"));
            }
            else {
                if(result != null){
                    if(result.url.length > 1 || result.secure_url.length > 1){

                        console.log("result of upload \n", result.secure_url, "\n insecure url: \n", result.url);
                        res.send(generalResponse.sendSuccessResponse("true","200",result.url))

                        users.findOneAndUpdate({email:req.body.email}, { imageURL:result.url}, function (err, data) {
                            if (err) {
                                console.log("FileController.upload() Error",err);
                                return res.send(generalResponse.sendFailureResponse("FileController.upload()Error Occured while saving imageURL  in database", 400, error));
                            }
                            else if (data) {
                                console.log("FileController.upload() success",err);
                                return res.send(generalResponse.sendSuccessResponse("Image saved successfully in database!", 200, data));
                            }

                            else {

                                console.log("FileController.upload() something went wrong");
                                return res.send(generalResponse.sendFailureResponse(" FileController.upload() something went wrong", 200, null));
                            }
                        });

                    }
                }
            }
        });


    }

    return that;

};

module.exports = new FileController();
