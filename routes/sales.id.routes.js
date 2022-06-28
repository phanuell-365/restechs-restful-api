// jshint esversion:9

"use strict";

const router = require("express").Router();

const {getSalesId, putSalesId, patchSalesId, deleteSalesId} = require("../controllers/sales.id.controllers");

router.get("/sales/:id", getSalesId);
router.put("/sales/:id", putSalesId);
router.patch("/sales/:id", patchSalesId);
router.delete("/sales/:id", deleteSalesId);

module.exports = router;