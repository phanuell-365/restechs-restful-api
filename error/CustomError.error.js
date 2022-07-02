// jshint esversion:9

"use strict";

class CustomError extends Error{

    constructor(errObj, ...params) {
        super(...params);

        if (Error.captureStackTrace){
            Error.captureStackTrace(this, CustomError);
        }

        this.name = "CustomError";
        this.errObj = errObj;
        this.date = new Date();
        this.cause = errObj;

    }

}

module.exports = CustomError;