// jshint esversion:9

const {Model, DataTypes} = require("sequelize");

const sequelize = require("../config/config.db");

class Supplier extends Model {

}

Supplier.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        // autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: "Supplier",
});

module.exports = Supplier;