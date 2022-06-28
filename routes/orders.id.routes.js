// jshint esversion:9

"use strict";

const router = require("express").Router();

const {getOrdersId, putOrdersId, patchOrderId, deleteOrdersId} = require("../controllers/orders.id.controllers");

router.get("/orders/:id", getOrdersId);
router.put("/orders/:id", putOrdersId);
router.patch("/orders/:id", patchOrderId);
router.delete("/orders/:id", deleteOrdersId);

module.exports = router;

