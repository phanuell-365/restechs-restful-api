//jshint esversion:9

const {Sequelize, Model} = require("sequelize");

const sequelize = require("../config/config.db");

class Order extends Model {

}

Order.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    // for example a pack size could be a box, bottle ...
    packSize : {
        type : Sequelize.STRING,
        allowNull : false,
    },

    // for example, how many drug boxes are being ordered?
    packSizeQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    // this could either be pending, partial, delivered or cancelled
    //! This is a calculated field
    status: {
        type: Sequelize.STRING,
        allowNull: false,
    },

}, {
    sequelize,
    modelName: "Order"
});

module.exports = Order;