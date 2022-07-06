// jshint esversion:9

"use strict";

const router = require("express").Router();

// const drugsMiddlewares = require("../../controllers/drugs/middlewares/drugs.middlewares");
const middlewares = require("../../controllers/drugs/middlewares/drugs.id.middlewares");

const handlers = require("../../controllers/drugs/drugs.id.controllers");
const CustomError = require("../../error/CustomError.error");

router.use("/api/drugs/:id", middlewares.checkIfAllAttrArePresent);
router.use("/api/drugs/:id", middlewares.checkIfQuantityAttrPassed);
router.use("/api/drugs/:id", middlewares.checkIfIdAttrPassed);
router.use("/api/drugs/:id", middlewares.checkForUndefined);
router.use("/api/drugs/:id", middlewares.extractValidDrugInfo);
router.use("/api/drugs/:id", middlewares.checkForDuplicateDrugData);

router.route("/api/drugs/:id")
    .get(handlers.getDrugById)
    .put(handlers.putDrugById)
    .patch(handlers.patchDrugsId)
    .delete(handlers.deleteDrugsId);

router.use("/api/drugs/:id", (err, req, res, next) => {
    console.error(err.stack);

    if (err instanceof CustomError) {
        res.status(err.infoObj.status).json(err.infoObj);
    } else {
        res.status(500).json(err);
    }

});

module.exports = router;