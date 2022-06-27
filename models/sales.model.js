// jshint esversion:9

const {Sequelize, Model} = require("sequelize");

const sequelize = require("../config/config.db");

class Sale extends Model {

}

Sale.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    total: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: "Sale",
});

module.exports = Sale;