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

    // the number of drugs sold
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    // the total value of the drugs sold
    //! This is a computed attribute
    total: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },

    // the status of the sale, could either be sold or cancelled,
    // and when cancelled, the drugs that were once sold are returned
    // into the inventory.
    //! This is a computed attribute
    status:{
        type : Sequelize.STRING,
        allowNull : false,
    }
}, {
    sequelize,
    modelName: "Sale",
});

module.exports = Sale;