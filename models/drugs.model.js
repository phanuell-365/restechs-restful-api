//jshint esversion:9

const {Model, DataTypes} = require("sequelize");

const sequelize = require("../config/config.db");

const _ = require("lodash");

/**
 *
 */
class Drug extends Model {

    /**
     * @description Checks if the level of use has a valid value, if below zero or not a number
     * @returns {{flagStatus: boolean, description: string, status: number}}
     * @param levelOfUse The drug's level of use
     */
    static validateLevelOfUse(levelOfUse) {

        const intLevelOfUse = _.toInteger(levelOfUse);

        if (intLevelOfUse <= 0 || isNaN(intLevelOfUse)) {

            const description = `The drug level of use cannot be ${intLevelOfUse}`;

            return {description, flagStatus: false, status: 400};

        } else if (intLevelOfUse > 10) {
            return {
                description: `The drug level of use cannot be ${intLevelOfUse}`,
                flagStatus: false,
                status: 400,
            };
        } else {

            return {description: "success", flagStatus: true, status: 200};
        }
    }

    /**
     * @desc Checks if the issue unit price has a valid value, if it's below zero or not a number
     * @returns {{flagStatus: boolean, description: string, status: number}}
     * @param issueUnitPrice The drug's issue unit price
     */
    static validateIssueUnitPrice(issueUnitPrice) {

        const doubleIssueUnitPrice = _.toNumber(issueUnitPrice);

        if (doubleIssueUnitPrice <= 0 || isNaN(doubleIssueUnitPrice)) {

            if (isNaN(doubleIssueUnitPrice)) {

                return {
                    description: `The drug issue unit price cannot be ${issueUnitPrice}`,
                    flagStatus: false,
                    status: 400,
                };
            } else {
                return {
                    description: `The drug issue unit price cannot be ${doubleIssueUnitPrice}`,
                    flagStatus: false,
                    status: 400,
                };
            }
        } else {
            return {
                description: `success`,
                flagStatus: true,
                status: 200,
            };
        }
    }

    // static validateDoseForm(drugInfo) {
    //
    // }

    /**
     * @desc Checks to see whether the dose form matches the issue unit
     * @returns {{flagStatus: boolean, description: string, status: number}}
     * @param doseForm The drug's dose form, for example "Tablet", "Capsule", "Injection" ...
     * @param issueUnit The drug's issue unit, for example "TAB for Tablet", "INJ for Injection", "CAP for Capsule"
     */
    static validateDoseFormAndIssueUnit(doseForm, issueUnit) {

        let doseFormVal = String(doseForm);

        let issueUnitVal = doseFormVal.slice(0, 3);

        if (issueUnitVal.toUpperCase() === issueUnit) {
            return {
                description: "success",
                flagStatus: true,
                status: 200,
            };
        } else {
            return {
                description: "The dose form and the issue unit must match",
                flagStatus: false,
                status: 400,
            };
        }
    }

}

Drug
    .init({
        // Model attributes definition
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            // autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },

        // the name of the drug, for example amoxicillin
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        // for example a tablet, capsule, injection ...
        doseForm: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        // for example 6mg (as sodium phosphate)1mL amp
        strength: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        // for example 3, 5, 4, 2
        levelOfUse: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        // for example antidotes
        therapeuticCategory: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        // for example TAB=tablet, INJ=injection, CAP=capsule
        issueUnit: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        // the price of one TAB or CAP or INJ
        issueUnitPrice: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },

        // the total number of drugs in stock
        //! This is a computed attribute
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'The total quantity of drugs in stock'
        },

        // the drug's expiry date
        expiryDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

    }, {
        sequelize,
        modelName: "Drug"
    });

module
    .exports = Drug;