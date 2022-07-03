// jshint esversion:9

"use strict";

const router = require("express").Router();

const middlewares = require("../../controllers/suppliers/middlewares/suppliers.middlewares");

const controllers = require("../../controllers/suppliers/suppliers.controllers");

const CustomError = require("../../error/CustomError.error");


router.use("/api/suppliers", middlewares.checkForUndefined);
router.use("/api/suppliers", middlewares.checkIfSupplierExists);
router.use("/api/suppliers", middlewares.checkIfSupplierShareContact);
router.use("/api/suppliers", middlewares.checkIfSupplierShareEmail);
router.use("/api/suppliers", middlewares.extractValidSupplierInfo);
// router.use("/api/suppliers", middlewares);

router.route("/api/suppliers")
    .get(controllers.getSuppliers)
    .post(controllers.postSuppliers)
    .delete(controllers.deleteSuppliers);


router.use("/api/suppliers", (err, req, res, next) => {

    console.error(err.stack);


    if (err instanceof CustomError) {
        res.status(err.infoObj.status).json(err.infoObj);
    } else {
        res.status(500).json(err);
    }

});

module.exports = router;