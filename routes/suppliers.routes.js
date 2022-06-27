// jshint esversion:9

"use strict";

const router = require("express").Router();

const {getSuppliers, postSuppliers, deleteSuppliers} = require("../controllers/suppliers.controllers");

router.get("/suppliers", getSuppliers);
router.post("/suppliers", postSuppliers);
router.delete("/suppliers", deleteSuppliers);

module.exports = router;