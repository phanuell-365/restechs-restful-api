// jshint esversion:9

"use strict";

const {Model, DataTypes} = require("sequelize");

const sequelize = require("../config/config.db");

class Delivery extends Model {

}

Delivery.init({

    // the delivery id
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        // autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    // the drug's issue unit per pack size
    // if the issue unit is a TAB, then (how many tabs are they there in
    // a pack size, for example if the pack size is a box, then
    // , how many tablets were there in the delivered box)
    issueUnitPerPackSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    // the delivered drug's pack size quantity -> if pack size is
    // a box, then this will be (how many boxes were delivered)...
    packSizeQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    // the total cost of a box, box being interpreted as the pack size
    packSizeCost: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },

    // the total price of the pack sizes (boxes) delivered, without any discount
    //! This is a computed attribute
    packSizeTotalPrice: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },

    // the discount per every pack size (box) if any
    discountPerPackSize: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },

    // the net cost of the delivered pack sizes (boxes) after deducting the discount
    //! This is a computed attribute
    packSizeTotalCost: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },

}, {
    sequelize, modelName: "Delivery"
});

module.exports = Delivery;