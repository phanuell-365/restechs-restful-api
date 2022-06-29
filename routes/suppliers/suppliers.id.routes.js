// jshint esversion:9

"use strict";

const router = require("express").Router();

const {
    getSuppliersId,
    putSuppliersId,
    patchSuppliersId,
    deleteSuppliersId
} = require("../../controllers/suppliers/suppliers.id.controllers");

router.get("/suppliers/:id", getSuppliersId);
router.put("/suppliers/:id", putSuppliersId);
router.patch("/suppliers/:id", patchSuppliersId);
router.delete("/suppliers/:id", deleteSuppliersId);

module.exports = router;

