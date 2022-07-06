//jshint esversion:9

"use strict";

const {Model, DataTypes} = require("sequelize");

const sequelize = require("../config/config.db");

const data = require("../data/drugs/drugs.data");

// const sources = require("../src/drugs/drugs.src");
/**
 *
 */
class Drug extends Model {

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
            validate: {
                notNull: {
                    msg: "The name of the drug cannot be null",
                }
            }
        },

        // for example a tablet, capsule, injection ...
        doseForm: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "The dose form of the drug cannot be null",
                },
                // isIn: {
                //     args: data.validDrugForms,
                //     msg: (function () {
                //
                //         return `The dose form can only be one of these (${data.validDrugForms.toString()})`;
                //     })()
                // },
                isDoseFormValid(value) {

                    const newDoseFormValue = String(value).toLowerCase();

                    const newValidDoseFormsArr = [];

                    const validDrugForms = [...data.validDrugForms];

                    let foundDoseForm = false;

                    validDrugForms.forEach((doseForm) => {
                        newValidDoseFormsArr.push(doseForm.toLowerCase());
                    });

                    if (!newValidDoseFormsArr.includes(newDoseFormValue)) {

                        for (const newDoseForm of newValidDoseFormsArr) {
                            if (newDoseFormValue.includes(newDoseForm)) {
                                foundDoseForm = true;
                                break;
                            }
                        }

                        if (!foundDoseForm) {
                            throw new Error(`The dose form can only be one of these (${data.validDrugForms.toString()})`);
                        }

                    }
                }
            }
        },

        // for example 6mg (as sodium phosphate)1mL amp
        strength: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isContaining(value) {

                    const newVal = String(value);

                    if (!data.validDrugStrengthMeasurements.find((drugStrengthMeasurement) => {

                        return newVal.includes(drugStrengthMeasurement);

                    })) {

                        const errorDescription = `The drug strength must contain at least one measurement of type (${data.validDrugStrengthMeasurements.toString()})`;

                        throw new Error(errorDescription);
                    }
                },
                notNull: {
                    msg: "The drug strength should not be null",
                }
            }
        },

        // for example 3, 5, 4, 2
        levelOfUse: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "The drug level of use should not be null"
                },
                isInt: {
                    args: true,
                    msg: "The drug level of use should be an integer"
                },
                max: {
                    args: 6,
                    msg: "The drug level of use should not be more than 6",
                },
                min: {
                    args: 1,
                    msg: "The drug level of use should not be less than 1",
                }
            }
        },

        // for example antidotes
        therapeuticCategory: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "The drug's therapeutic category should not be null",
                },
                makeCapital (value){


                }
                // TODO: Add all the drug therapeutic categories
            }
        },

        // for example TAB=tablet, INJ=injection, CAP=capsule
        issueUnit: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "The drug's issue unit should not be null",
                },
                isValidIssueUnit(value) {

                    const newVal = String(value);

                    if (!data.validIssueUnits.find(validIssueUnit => validIssueUnit === newVal)) {

                        const errorDescription = `The issue unit should be at least on of ${data.validIssueUnits.toString()}`;

                        throw new Error(errorDescription);
                    } else {

                        const purifiedDoseForm = ((doseForm) => {

                            const newDoseForm = String(doseForm);

                            const escapeCharPos = newDoseForm.indexOf("-");

                            return newDoseForm.slice(escapeCharPos, 1);
                        })(this.doseForm);

                        const estimatedIssueUnit = String(purifiedDoseForm).slice(0, 4).toLowerCase();

                        if (!newVal.toLowerCase().includes(estimatedIssueUnit)) {

                            const errorDescription = `The issue unit should at least match the dose form ${this.doseForm}, The estimated issue unit ${estimatedIssueUnit}`;

                            throw new Error(errorDescription);
                        }
                    }
                }
            }
        },

        // the price of one TAB or CAP or INJ
        issueUnitPrice: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "The drug's issue unit price should not be null",
                },
                isFloat: {
                    msg: "The drug's issue unit price can only be a number of a float",
                }
            }
        },

        // the total number of drugs in stock
        //! This is a computed attribute
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: "The total quantity of drugs in stock",
            validate: {
                isNumeric: {
                    msg: "The quantity should be an integer",
                },
                notNull: "The quantity should not be null"
            }
        },

        // the drug's expiry date
        expiryDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "The value of date cannot be null"
                }, isBefore: {
                    args: "2028-01-01",
                    msg: (function () {
                        let thisYear = new Date().getFullYear();
                        thisYear += 5;
                        return `The year should be after ${thisYear}`;
                    })()
                },
                isAfter: {
                    args: (function () {
                        return new Date().toString();
                    })(),
                    msg: "The drug's expiry date has already reached.",
                }
            }
        },

    }, {
        sequelize,
        modelName: "Drug"
    });

module.exports = Drug;