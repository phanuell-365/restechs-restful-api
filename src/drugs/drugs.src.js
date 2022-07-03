// jshint esversion:9

"use strict";

const Drug = require("../../models/drugs.model");

const CustomError = require("../../error/CustomError.error");

const _ = require("lodash");

module.exports = {

    getDrugAttributes() {
        const drugAttributes = Object.entries(Drug.getAttributes());

        const drugAttr = [];

        drugAttributes.forEach((drugAttribute) => {
            drugAttr.push(drugAttribute[0]);
        });

        return drugAttr;
    },

    async checkForUndefined(obj) {

        const newObj = Object(obj);

        Object.entries(newObj).forEach(([key, value]) => {

            if (value === undefined || value === null || !value) {

                throw new CustomError({
                    description: `Error! The value of ${key} is undefined`,
                    status: 400,
                }, `Error! The value of ${key} is ${value}`);

            }
        });
    },

    async validateRequestBody(reqBody) {

        const bodyMap = new Map(Object.entries(reqBody));

        const drugAttributes = ["name", "doseForm", "strength", "levelOfUse", "therapeuticCategory", "issueUnit", "issueUnitPrice", "expiryDate"];
        const lastElement = drugAttributes[drugAttributes.length - 1];

        bodyMap.forEach((value, key) => {

            if (drugAttributes.includes(key)) {

                const pos = drugAttributes.indexOf(key);

                drugAttributes.splice(pos, 1);

            }
        });

        if (drugAttributes.length && !drugAttributes.includes(lastElement)) {
            throw new CustomError({
                description: `The attribute(s) ${drugAttributes.toString()} have the value(s) of undefined`,
                status: 400,
            });
        }
    },

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

        if (!this.trapQuantityAttribute(requestBody).flagStatus) {
            return this.trapQuantityAttribute(requestBody);
        }

        // if true, it means that some the values weren't passed
        if (absentValuesArr.length !== 0) {

            // we need to trap for the quantity attribute of the Drug model
            // it shouldn't be set since it is a computed attribute.


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

            if (value === "") {

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
     * @returns  A promise object containing the description,
     * flagStatus being true if the drug already exists and status
     */
    async checkIfDrugExists(drugInfo) {

        let retStatus;

        console.log("In here");

        try {

            this.validateRequestBody(drugInfo);

            this.checkForUndefined(drugInfo).then(() => {

                console.log("In here");


                console.error("Athi River 1");

                Drug.findAll({

                    where: {
                        name: drugInfo.name,
                        doseForm: drugInfo.doseForm,
                        strength: drugInfo.strength,
                        levelOfUse: drugInfo.levelOfUse,
                        issueUnit: drugInfo.issueUnit,
                        issueUnitPrice: drugInfo.issueUnitPrice,
                        expiryDate: drugInfo.expiryDate,
                    }

                }).then((drugs) => {

                    console.error("Athi River 2");
                    if (drugs.length) {

                        console.error("Athi River 3");
                        throw new CustomError({
                            description: `Error! The drug with the data ${Object.values(drugInfo)} already exists`,
                            status: 400,
                        });
                    } else {
                        console.error("Athi River 4");

                        retStatus = {
                            status: 200,
                        };
                    }


                }).catch((err) => {

                    console.error("Athi River 5");
                    if (err instanceof CustomError) {
                        console.error(err);

                        console.error("Athi River 6");
                        return err.infoObj;
                    } else {
                        console.error(err);

                        retStatus = {
                            description: `Error! Failed to look up the drug in the database`,
                            status: 500,
                        };
                    }

                });

            }).catch((err) => {
                if (err instanceof CustomError) {

                    retStatus = err.infoObj;

                    console.error(err);
                } else {
                    console.error(err);

                    retStatus = {
                        description: `Error! Failed to load the resource ${this.checkForUndefined.name}`,
                        status: 500,
                    };
                }
            });

            console.error("returning => ", retStatus);
            return (async () => {
                return retStatus;
            })();


        } catch (err) {

            console.error("Athi River 7");
            if (err instanceof CustomError) {
                console.error(err);
                // console.error(err.date)

                console.error("Athi River 8");
                retStatus = err.infoObj;

            } else {
                console.error("Athi River 9");
                console.log(err);

                retStatus = {
                    description: "Error! Failed to check all drugs in the database",
                    status: 500,
                };
            }

            return retStatus;

        }
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

    checkIfDrugExistsNearMatch(drugInfo) {

        let retObject;

        const drugExistsResult = (async () => {
            return await this.checkIfDrugExists(drugInfo);
        })();
        // then((drugExistsResult) => {
        console.error("The value of drugExists -> ",drugExistsResult);

        console.log("out here");

        if (!(async () => {
            return (drugExistsResult.status >= 200 || drugExistsResult.status <= 399);
        })()
        ) {

            Drug.findAll({
                where: {
                    name: drugInfo.name,
                    doseForm: drugInfo.doseForm,
                    strength: drugInfo.strength,
                    issueUnit: drugInfo.issueUnit,
                    expiryDate: drugInfo.expiryDate,
                }
            }).then((drugs) => {
                if (drugs.length) {

                    console.error(drugs);
                    retObject = {
                        description: "Error! The drug already exists!" +
                            " The drug details match a drug in the database except for the level" +
                            " of use and unit price.",
                        status: 400,
                    };

                    return retObject;
                } else {
                    // the description is success since it didn't find any drug with the same drug info
                    // hence the flag status' value and the status
                    retObject = drugExistsResult;

                    return retObject;
                }
            }).catch((err) => {
                console.error(err);

                retObject = {
                    description: "Error! Failed to collect all the drugs from the database",
                    flagStatus: false,
                    status: 500,
                };
                return retObject;
            });
        } else if (drugExistsResult.status >= 200 || drugExistsResult.status <= 399) {
            retObject = drugExistsResult;

            return retObject;
        } else {

            retObject = {
                description: "success",
                status: 200,
            };

            return retObject;
        }
//     }
// ).
// catch((err) => {
//     console.error(err);
//
//     retObject = {
//         description: "Error! Failed to load resource 'checkIfDrugExists()'",
//         flagStatus: false,
//         status: 500,
//     };

        return retObject;
// });
    },

    trapQuantityAttribute(requestBody) {

        const responseAttrArr = [...Object.keys(requestBody)];

        if (responseAttrArr.includes("quantity")) {

            const description = `Error! The field quantity is a computed attribute, thus it should not be set`;
            return {description, flagStatus: false, status: 400};
        } else {
            const description = "success";
            return {description, flagStatus: true, status: 200};
        }
    }

}
;
