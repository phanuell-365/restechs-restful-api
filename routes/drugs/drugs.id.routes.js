// jshint esversion:9

"use strict";

const router = require("express").Router();

const drugsMiddlewares = require("../../controllers/drugs/middlewares/drugs.middlewares");

const controllers = require("../../controllers/drugs/drugs.id.controllers");

router.use("/api/drugs/:id", drugsMiddlewares.checkIfQuantityAttrPassed);
router.use("/api/drugs/:id", drugsMiddlewares.checkForUndefined);


router.route("/api/drugs/:id")
    .get(controllers.getDrugsId)
    .put(controllers.putDrugsId)
    .patch(controllers.patchDrugsId)
    .delete(controllers.deleteDrugsId);

module.exports = router;