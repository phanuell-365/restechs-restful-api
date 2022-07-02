// jshint esversion:9

"use strict";

const CustomError = require("../error/CustomError.error");

class ErrHandler {
    constructor(errObj) {
        this.errObj = errObj;

        throw new CustomError({
            description: "Error! Propagation Trial",
        }, "Error! Propagation Trial!");
    }

    handler(res) {

        if (this.errObj) {
            res.status(this.errObj.status).json(this.errObj);
        } else {
            throw new CustomError({
                description: "Error! The error object is not set",
                flagStatus: false,
                status: 500,
            }, "Error! The error object is not set");
        }

    }
}

module.exports = ErrHandler;