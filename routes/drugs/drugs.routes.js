// jshint esversion:9

"use strict";

const router = require("express").Router();

const middlewares = require("../../controllers/drugs/middlewares/drugs.middlewares");

const drugs = require("../../controllers/drugs/drugs.controllers");

const CustomError = require("../../error/CustomError.error");

// middlewares.checkIfDrugExists.apply(middlewares);
router.use("/drugs", middlewares.checkIfQuantityAttrPassed);
router.use("/drugs", middlewares.checkForUndefined);
router.use("/drugs", middlewares.checkIfDrugExists);
router.use("/drugs", middlewares.checkIfDrugExistsNearMatch);
router.use("/drugs", middlewares.extractValidDrugInfo);
//         router.use("/drugs",
router.route("/drugs")
    .get(drugs.get)
    .delete(drugs.delete)
    .post(drugs.post);

router.use("/drugs", function (err, req, res, next) {
    console.error(err.stack);

    if (err instanceof CustomError) {
        res.status(err.infoObj.status).json(err.infoObj);
    } else {
        res.status(500).json(err);
    }

});


module.exports = router;// router.use(function (err, req, res, next) {
//     console.error(err.stack);
//     res.status(500).json('The server encountered an error!');
// });
