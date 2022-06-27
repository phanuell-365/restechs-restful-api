// jshint esversion:9

"use strict";

const router = require("express").Router();

const {getOrders, postOrders, deleteOrders} = require("../controllers/orders.controllers");

router.get("/orders", getOrders);
router.post("/orders", postOrders);
router.delete("/orders", deleteOrders);

module.exports = router;