// jshint esversion:9

"use strict";

const Drug = require("../../models/drugs.model");
const _ = require("lodash");

module.exports = {

    /**
     * @description Checks if all the valid requested fields by the user are present in the request body
     * @param requiredArray Holds the valid field names for a request
     * @param requestBody The request body from the user's request.
     * @returns {{flagStatus: boolean, description: string, status: number}}
     */
    checkFieldsArePresent(requiredArray, requestBody) {

        const requiredArr = [...requiredArray];
        const responseArr = [...Object.keys(requestBody)];

        // sort the arrays
        requiredArr.sort();
        responseArr.sort();

        const absentValuesArr = _.difference(requiredArr, responseArr);
        //
        // console.log("absentValuesArr", absentValuesArr);
        // console.log("responseArr", responseArr);
        // console.log("requiredArr", requiredArr);

        // if true, it means that some the values weren't passed
        if (absentValuesArr.length !== 0) {

            // we need to trap for the quantity attribute of the Drug model
            // it shouldn't be set since it is a computed attribute.

            if (absentValuesArr.every((attribute) => {

                return attribute === "quantity";

            })) {
                const description = `Error! The field quantity is a computed attribute, thus it should not be set`;
                return {description, flagStatus: false, status: 400};
            }

            const description = `Error! The field(s) ${absentValuesArr.toString()} are not set`;

            return {description, flagStatus: false, status: 400};

        } else {

            return {description: "success", flagStatus: true, status: 200};

        }
    },

    /**
     * @description Checks if the valid requested fields from the user contain any null values
     * @param requestBody The request body from the user's request
     * @returns {{flagStatus: boolean, description: string, status: number}}
     */
    checkIfFieldsAreNull(requestBody) {

        const fieldMap = new Map(Object.entries(requestBody));

        let obj;

        for (const [fieldMapKey, fieldMapValue] of fieldMap) {

            const value = String(fieldMapValue);

            if (value === '') {

                const description = `Error! The value of ${fieldMapKey} cannot be null`;

                obj = {description, flagStatus: false, status: 400};

                break;

            } else {
                obj = {description: "Successful!", flagStatus: true, status: 200};
            }

        }

        return obj;
    },

    /**
     * @description Check if a drug is already present in the database
     * @param drugInfo The drug information to be used in the checking.
     * @returns {Promise<*>} A promise object containing the description,
     * flagStatus being true if the drug already exists and status
     */
    async checkIfDrugExists(drugInfo) {

        let retStatus;

        try {
            const drugs = await Drug.findAll({

                where: {
                    name: drugInfo.name,
                    doseForm: drugInfo.doseForm,
                    strength: drugInfo.strength,
                    levelOfUse: drugInfo.levelOfUse,
                    issueUnit: drugInfo.issueUnit,
                    issueUnitPrice: drugInfo.issueUnitPrice,
                    expiryDate: drugInfo.expiryDate,
                }

            });

            // console.log("found drugs ->", drugs);

            if (!_.isEmpty(drugs)) {

                retStatus = {
                    description: "Error! The drug already exists",
                    flagStatus: true,
                    status: 400,
                };
            } else {
                // the description is success since it didn't find any drug with the same drug info
                // hence the flag status' value and the status
                retStatus = {
                    description: "success",
                    flagStatus: false,
                    status: 200,
                };
            }
        } catch (err) {

            console.log(err);

            retStatus = {
                description: "Error! Failed to check all drugs in the database",
                flagStatus: false,
                status: 500,
            };
        }
        // console.log("retStatus => ", retStatus);
        return retStatus;
    },

    /**
     * @desc Increments the drug quantities for the specified drug ids
     * @param drugIds The drug ids to perform incrementation on
     * @param val The value for which to add to the current drug's quantity.
     */
    incrementDrugQuantity(drugIds, val) {

        drugIds.forEach(async (drug) => {

            try {
                const foundDrug = await Drug.findByPk(drug);

                let currentQuantity = drug.quantity;

                currentQuantity += val;

                foundDrug.update({quantity: currentQuantity}).catch((err) => {

                    console.error("Error! Failed to increment the drug's quantity", err);

                });

            } catch (err) {
                console.error(err);
            }

        });
    },

    async checkIfDrugExistsNearMatch(drugInfo) {

        let retObject;

        try {
            const drugExistsResult = await this.checkIfDrugExists(drugInfo);
            // then(async (drugExitsResult) => {

            if (!drugExistsResult.flagStatus) {

                try {
                    const drugs = await Drug.findAll({
                        where: {
                            name: drugInfo.name,
                            doseForm: drugInfo.doseForm,
                            strength: drugInfo.strength,
                            issueUnit: drugInfo.issueUnit,
                            expiryDate: drugInfo.expiryDate,
                        }
                    });

                    if (!_.isEmpty(drugs)) {

                        retObject = {
                            description: "Error! The drug already exists!" +
                                " The drug details match a drug in the database except for the level" +
                                " of use and unit price.",
                            flagStatus: true,
                            status: 400,
                        };

                        return retObject;
                    } else {
                        // the description is success since it didn't find any drug with the same drug info
                        // hence the flag status' value and the status
                        retObject = {
                            description: "success",
                            flagStatus: false,
                            status: 200,
                        };

                        return retObject;
                    }
                } catch (e) {
                    console.error(e);

                    retObject = {
                        description: "Error! Failed to collect all the drugs from the database",
                        flagStatus: false,
                        status: 500,
                    };
                    return retObject;
                }
            } else if (drugExistsResult.flagStatus) {
                retObject = drugExistsResult;

                return retObject;
            } else {

                retObject = {
                    description: "success",
                    flagStatus: true,
                    status: 200,
                };

                return retObject;
            }
        } catch (err) {
            console.error(err);

            retObject = {
                description: "Error! Failed to load resource 'checkIfDrugExists()'",
                flagStatus: false,
                status: 500,
            };

            return retObject;
        }
    },

};