/**
 * Created by mujahidmasood on 12.08.17.
 */

module.exports = (function locationSchema() {

    var mongoose = require('../db').mongoose;

    var schema = {
        location: {type: [String]}, // [Long, Lat]
        radius: {type: String},
        keyword: {type: String},
        opennow: {type: String},
        geometry: {type: Object},
        language: {type: String},
        icon: {type: Object},
        id: {type: String},
        name: {type: String},
        opening_hours: {type: Object},
        photos: {type: Object},
        place_id: {type: String},
        price_level: {type: String},
        rating: {type: String},
        reference: {type: String},
        scope: {type: String},
        types: {type: Array},
        vicinity: {type: String}
    };

    // schema.index({location: '2dsphere'});

    var collectionName = 'locations';
    var locationSchema = mongoose.Schema(schema);
    var locations = mongoose.model(collectionName, locationSchema);


    return locations;
})();