//jshint esversion:9

const {Model, DataTypes} = require("sequelize");

const sequelize = require("../config/config.db");

class Order extends Model {

}

Order.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        // autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        comment : "The order's id",
    },

    // for example a pack size could be a box, bottle ...
    packSize: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    // for example, how many drug boxes are being ordered?
    packSizeQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // this could either be pending, partial, delivered or cancelled
    //! This is a calculated field
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending"
    },

}, {
    sequelize,
    modelName: "Order"
});

module.exports = Order;