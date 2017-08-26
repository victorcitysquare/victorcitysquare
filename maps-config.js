/**
 * Created by mujahidmasood on 13.08.17.
 */

(function () {
    "use strict";

    exports.apiKey = process.env.GOOGLE_PLACES_API_KEY || "AIzaSyBAV4yytb3REVB7YKTaDmVEkSAPsxeLeoE";
    exports.outputFormat = process.env.GOOGLE_PLACES_OUTPUT_FORMAT || "json";

})();