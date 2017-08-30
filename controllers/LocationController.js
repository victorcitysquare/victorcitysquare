/**
 * Created by mujahidmasood on 12.08.17.
 */

function LocationController() {

    var that = this;

    var mongoose = require('mongoose');
    mongoose.set('debug', true);

    var config = require("../maps-config.js");
    var generalResponse = require('./GeneralResponse');
    var locations = require('../models/locationSchema');

    var PlaceSearch = require("googleplaces/lib/PlaceSearch.js");
    var placeSearch = new PlaceSearch(config.apiKey, config.outputFormat);

    var PlaceDetailsRequest = require("googleplaces/lib/PlaceDetailsRequest.js");
    var placeDetailsRequest = new PlaceDetailsRequest(config.apiKey, config.outputFormat);


    var NearBySearch = require("googleplaces/lib/NearBySearch");
    var nearBySearch = new NearBySearch(config.apiKey, config.outputFormat);

    var json = require('../locationdata.json');

    that.getLocation = function (req, res, next) {

        var parameters = {
            location: req.params.location,
            radius: req.params.radius,
            keyword: req.params.keyword
        };

        //TODO search requested location in database

        var query = locations.find(parameters)
        query.exec(function (err, result) {
            if (err) {
                console.log("Error " + err)
                throw  err;
            } else {
                if (result.length > 0) {
                    console.log("present in database "+result)
                    return res.send(result)
                } else {

                    var searchResults = []
                    //TODO if location not available search in google maps
                    nearBySearch(parameters, function (error, response) {
                        if (error) {
                            return res.send(generalResponse.sendFailureResponse(false, 400, error))
                        }
                        for (var key in response) {
                            if (key == 'results') {
                                for (var data in response[key]) {

                                    var locationData = response[key][data]

                                    var place_id = null;
                                    if(locationData.place_id){
                                        place_id = locationData.place_id;
                                    }else {
                                        place_id = locationData.reference;
                                    }

                                    placeSearch({
                                        place_id: place_id
                                    }, function (error, response) {
                                        if (error) throw error;
                                        placeDetailsRequest({reference: response.results[0].reference}, function (error, response) {
                                            if (error) throw error;
                                            log.info(response, "getLocationDeatils() Place details request response status is OK");
                                        });
                                    });
                                    searchResults.push(location)
                                }
                            }
                        }


                        console.log("Search results .length " + searchResults.length)

                        locations.create(
                            searchResults
                            , function (err, result) {
                                if (err) {
                                    console.log("Saving locations in db failed " + err)
                                    return res.send(generalResponse.sendFailureResponse(false, 400, error))
                                }
                                else {
                                    console.log("Saving location in db success " + result)
                                }
                            });


                        return res.send(generalResponse.sendSuccessResponse(true, 200, searchResults))

                    });

                }
            }
        });

    };

    return that;

};

module.exports = new LocationController();
