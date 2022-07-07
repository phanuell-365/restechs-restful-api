// jshint esversion:9

"use strict";

const router = require("express").Router();

const middlewares = require("../../controllers/suppliers/middlewares/suppliers.middlewares");

const handlers = require("../../controllers/suppliers/suppliers.controllers");

const CustomError = require("../../error/CustomError.error");

router.use("/api/suppliers", middlewares.checkIfAllSupplierAttributesArePresent);
router.use("/api/suppliers", middlewares.checkForUndefined);
router.use("/api/suppliers", middlewares.checkIfSupplierShareContact);
router.use("/api/suppliers", middlewares.checkIfSupplierShareEmail);
router.use("/api/suppliers", middlewares.extractValidSupplierInfo);

router.route("/api/suppliers")
    .get(handlers.getSuppliers)
    .post(handlers.postSuppliers)
    .delete(handlers.deleteSuppliers);


router.use("/api/suppliers", (err, req, res, next) => {

    console.error(err.stack);


    if (err instanceof CustomError) {
        console.error(err);
        res.status(err.infoObj.status).json(err.infoObj);
    } else {
        console.error(err);
        res.status(500).json(err);
    }

});

module.exports = router;