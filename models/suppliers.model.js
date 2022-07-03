// jshint esversion:9

const {Model, DataTypes} = require("sequelize");

const sequelize = require("../config/config.db");

class Supplier extends Model {

}

Supplier.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Supplier's name cannot be null",
            },
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Supplier's email cannot be null",
            },
            isEmail: {
                args: true,
                msg: "The supplier's email must be valid email",
            }
        }
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Supplier's contact cannot be null",
            },
            contains: {
                args: "0",
                msg: "Invalid supplier contact",
            },
            len: {
                args: [10],
                msg: "Invalid supplier contact",
            }
        }
    },
}, {
    sequelize,
    modelName: "Supplier",
});

module.exports = Supplier;