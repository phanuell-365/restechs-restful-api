//jshint esversion:9

const {Sequelize, Model} = require("sequelize");

const sequelize = require("../config/config.db");

class Drug extends Model {

}

Drug.init({
    // Model attributes definition
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    doseForm: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    strength: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    levelOfUse: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    therapeuticCategory: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    issueUnit: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    issueUnitPrice: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    issueUnitPerPackSize: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    packSize: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    packSizeCost: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    expiryDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },

}, {
    sequelize,
    modelName: "Drug"
});

module.exports = Drug;