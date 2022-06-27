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
    status: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    value: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: "Order"
});

module.exports = Order;