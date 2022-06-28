// jshint esversion:9

"use strict";

const router = require("express").Router();

const {getSales, postSales, deleteSales} = require("../controllers/sales.controllers");

router.get("/sales", getSales);
router.post("/sales", postSales);
router.delete("/sales", deleteSales);

module.exports = router;