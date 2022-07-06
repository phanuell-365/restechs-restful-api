// jshint esversion:9

"use strict";

const router = require("express").Router();

const middlewares = require("../../controllers/drugs/middlewares/drugs.middlewares");

const handlers = require("../../controllers/drugs/drugs.controllers");

const CustomError = require("../../error/CustomError.error");

router.use("/api/drugs", middlewares.checkIfQuantityAttrPassed);
router.use("/api/drugs", middlewares.checkForUndefined);
router.use("/api/drugs", middlewares.extractValidDrugInfo);

router.route("/api/drugs")
    .get(handlers.getDrugs)
    .post(handlers.postDrugs)
    .delete(handlers.deleteDrugs);

router.use("/api/drugs", (err, req, res, next)=> {
    console.error(err.stack);

    if (err instanceof CustomError) {
        res.status(err.infoObj.status).json(err.infoObj);
    } else {
        res.status(500).json(err);
    }

});


module.exports = router;
