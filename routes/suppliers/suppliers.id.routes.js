// jshint esversion:9

"use strict";

const router = require("express").Router();

const middlewares = require("../../controllers/suppliers/middlewares/suppliers.id.middlewares");

const handlers = require("../../controllers/suppliers/suppliers.id.controllers");

router.use("/api/suppliers/:id", middlewares.checkIfIdAttrPassed);
router.use("/api/suppliers/:id", middlewares.checkIfAllSupplierInfoPresent);
router.use("/api/suppliers/:id", middlewares.checkForUndefined);
router.use("/api/suppliers/:id", middlewares.checkIfSupplierShareContact);
router.use("/api/suppliers/:id", middlewares.checkIfSupplierShareEmail);
router.use("/api/suppliers/:id", middlewares.extractValidSupplierInfo);

router.route("/api/suppliers/:id")
    .get(handlers.getSupplierById)
    .put(handlers.putSupplierById)
    .patch(handlers.patchSupplierById)
    .delete(handlers.deleteSupplierById);

module.exports = router;

