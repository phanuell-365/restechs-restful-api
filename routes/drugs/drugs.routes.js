// jshint esversion:9

"use strict";

const router = require("express").Router();

const middlewares = require("../../controllers/drugs/middlewares/drugs.middlewares");

const controllers = require("../../controllers/drugs/drugs.controllers");

const CustomError = require("../../error/CustomError.error");

// middlewares.checkIfDrugExists.apply(middlewares);
router.use("/api/drugs", middlewares.checkIfQuantityAttrPassed);
router.use("/api/drugs", middlewares.checkForUndefined);
router.use("/api/drugs", middlewares.checkIfDrugExists);
router.use("/api/drugs", middlewares.checkIfDrugExistsNearMatch);
router.use("/api/drugs", middlewares.extractValidDrugInfo);
//         router.use("/drugs",
router.route("/api/drugs")
    .get(controllers.getDrugs)
    .post(controllers.postDrugs)
    .delete(controllers.deleteDrugs);

router.use("/api/drugs", (err, req, res, next)=> {
    console.error(err.stack);

    if (err instanceof CustomError) {
        res.status(err.infoObj.status).json(err.infoObj);
    } else {
        res.status(500).json(err);
    }

});


module.exports = router;
