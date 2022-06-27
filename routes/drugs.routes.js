// jshint esversion:9

const router = require("express").Router();

const {getDrugs, deleteDrugs, postDrugs} = require("../controllers/drugs.controllers");

router.get("/drugs", getDrugs);
router.delete("/drugs", deleteDrugs);
router.post("/drugs", postDrugs);

module.exports = router;