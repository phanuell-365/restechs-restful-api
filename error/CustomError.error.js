// jshint esversion:9

"use strict";

/**
 * @example {
 *     description : "Some error occurred",
 *     status: 400,
 * }
 */
class CustomError extends Error {

    /**
     * Constructs a CustomError with errInfoObj being an object that describe more about the error.
     *
     * @param {Object} errInfoObj An object that describes more about the error that occurred.
     * The description and the status need to be set during its construction
     * @param params Other params including the error message describing what caused the error.
     * @example {
     *     description : "Some error occurred",
     *     status: 400,
     * }
     */
    constructor(errInfoObj, ...params) {
        super(...params);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }

        this.name = "CustomError";
        this.infoObj = errInfoObj;
        // this.date = new Date();

    }

}

module.exports = CustomError;