/**
 * Created by mujahidmasood on 12.08.17.
 */

function FileController() {

    var that = this;
    var generalResponse = require('./GeneralResponse');
    var request = require('request').defaults({encoding: null});
    var cloudinary = require('cloudinary');


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

    that.upload = function (req, res, next) {

        var email = req.body.email

        cloudinary.v2.uploader.upload(req.body.imageData, {timeout:600000}, function (error, result) {
            if (error) {
                console.log("error ocurred", error);
                res.send(generalResponse.sendFailureResponse(error,error,"Error occured"));
            }
            else {
                if(result != null){
                    if(result.url.length > 1 || result.secure_url.length > 1){
                        //TODO save in database.
                        console.log("result of upload \n", result.secure_url, "\n insecure url: \n", result.url);
                        res.send(generalResponse.sendSuccessResponse("true","200",result.url))
                    }
                }
            }
        });


    }

    return that;

};

module.exports = new FileController();
