// jshint esversion:9

"use strict";

const router = require("express").Router();

const {getDrugsId, putDrugsId, patchDrugsId, deleteDrugsId} = require("../controllers/drugs.id.controllers");

router.get("/drugs/:id", getDrugsId);
router.put("/drugs/:id", putDrugsId);
router.patch("/drugs/:id", patchDrugsId);
router.delete("/drugs/:id", deleteDrugsId);

module.exports = router;