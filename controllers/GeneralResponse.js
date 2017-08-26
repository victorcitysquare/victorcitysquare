//for general response
var response ={
        sendSuccessResponse: function (message,code,data) {
        var    successResponse = {
                res: "true",
                response: message,
                token: "",
                sessionid: "",
                responseData: data
            };
            return successResponse;
        },
    sendFailureResponse:function (error,code,data) {
      var  failureResponse=
        {
            res:"false",
            response:error,
            token:"",
            sessionid:"",
            responseData:data
        };
      return failureResponse;
    }

}
module.exports=response;