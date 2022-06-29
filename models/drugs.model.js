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

    // the name of the drug, for example amoxicillin
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    // for example a tablet, capsule, injection ...
    doseForm: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    // for example 6mg (as sodium phosphate)1mL amp
    strength: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    // for example 3, 5, 4, 2
    levelOfUse: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    // for example antidotes
    therapeuticCategory: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    // for example TAB=tablet, INJ=injection, CAP=capsule
    issueUnit: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    // the price of one TAB or CAP or INJ
    issueUnitPrice: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },

    // the total number of drugs in stock
    //! This is a computed attribute
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    // the drug's expiry date
    expiryDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },

}, {
    sequelize,
    modelName: "Drug"
});

module.exports = Drug;