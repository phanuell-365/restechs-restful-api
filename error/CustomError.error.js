// jshint esversion:9

"use strict";

/**
 *
 */
class CustomError extends Error{

    /**
     * Constructs a CustomError with errInfoObj being an object that describe more about the error
     * @param errInfoObj An object that describes more about the error that occurred
     * @param params Other params including the error message describing what caused the error.
     */
    constructor(errInfoObj, ...params) {
        super(...params);

        if (Error.captureStackTrace){
            Error.captureStackTrace(this, CustomError);
        }

        this.name = "CustomError";
        this.infoObj = errInfoObj;
        // this.date = new Date();

    }

}

module.exports = CustomError;