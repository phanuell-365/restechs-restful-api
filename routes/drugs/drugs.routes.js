// jshint esversion:9

const router = require("express").Router();

// const nodeFetch = require("node-fetch");

const drugs = require("../../controllers/drugs/drugs.controllers");

router.get("/drugs", drugs.get);
router.delete("/drugs", drugs.delete);
router.post("/drugs", drugs.post);

module.exports = router;