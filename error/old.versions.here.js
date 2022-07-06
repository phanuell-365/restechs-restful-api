// // construct an error object, this makes it readable.
// const data = require("../data/drugs/drugs.data");
// const errorObject = {
//     description: `The issue unit should be at least on of ${data.validIssueUnits.toString()}`,
//     flagStatus: false,
//     status: 400,
// };
//
// // convert the error object into a string
// const errObjStr = Drug.errObjToErrMsgArr(errorObject);
//
// // now hydrate the error message to obtain the correct format for error handling and debugging.
// const hydratedErrorMessage = Drug.hydrateErrorMessage(errObjStr);
//
// console.error("Validation Error: ", errorObject.description);
// // now pass the hydrated error message as the error message for the validation error
// throw new Error(hydratedErrorMessage);

//
// /**
//  * Converts the error object carrying the error information into a string
//  * @param errObj The error object carrying the error information
//  * @returns {any[]} A string of split error information, in the format {description, flagStatus, status}
//  */
// static errObjToErrMsgArr(errObj) {
//
//     return Object.values(errObj);
// }
//
// /**
//  * Hydrates the error messages inside the passed array by concatenating them with the string (...)
//  * which is to be used during the dehydration
//  * @param errMsgArr This array should consist of
//  * @example{
//  * description : "The error description",
//  * flagStatus : "true | false",
//  * status : "The server response status '200 | 400 ... '"
//  * }
//  * @returns {String} A string holding the new concatenated string ready for dehydration.
//  */
// static hydrateErrorMessage(errMsgArr) {
//
//     // create a cache for the new error message
//     let newErrStr;
//
//     // for each error message passed into 'hydrateErrorMessage()'
//     errMsgArr.forEach((errMsg) => {
//
//         // fast check if the previous value of newErrStr is undefined
//         // and assign to it the fast value in the array
//         if (newErrStr === undefined) {
//
//             newErrStr = errMsg;
//
//         } else {
//             // else add to whatever was inside the array, while adding the "..." delimiter.
//             newErrStr = newErrStr + "--" + errMsg;
//         }
//
//     });
//
//     newErrStr = String(newErrStr);
//
//     return newErrStr;
// }
//
// /**
//  * It dehydrates the hydratedErrMsg... It converts the string into an object having the key value pair of
//  * @example {
//  *     description : "The error's description",
//  *     flagStatus : "true | false",
//  *     status : "the server response status '200 | 400 | ...'
//  * }
//  * @param hydratedErrMsg The string holding the hydrated error message.
//  * @returns {{flagStatus: boolean, description: string, status: number}} An object that is used to handle any errors
//  * thrown in the API
//  */
// static dehydrateErrorMessage(hydratedErrMsg) {
//
//     const dehydratedArrStr = hydratedErrMsg.split("--");
//
//     const [description, flagStatus, status] = dehydratedArrStr;
//
//     return {
//         description: String(description),
//         flagStatus: flagStatus === "true",
//         status: parseInt(status)
//     };
// }
//
// const Drug = require("../models/drugs.model");
// static fetchDrugIds(req, res, next) {
//
//     return Drug.findAll()
//
//         .then((allDrugs) => {
//
//             res.locals.drugIds = [];
//
//             allDrugs.forEach((drug) => {
//                 res.locals.drugIds.push(drug.id);
//             });
//
//             next();
//         })
//         .catch(next);
//
// }
//
//
// /**
//  * @description Check if a drug is already present in the database
//  * @returns  A promise object containing the description,
//  * flagStatus being true if the drug already exists and status
//  * @param req
//  * @param res
//  * @param next
//  */
// static checkIfDrugExists(req, res, next) {
//
//
//     if (req.method !== "GET") {
//
//         console.log("Checking if the drug info inside the request body match a drug that exists ...");
//
//         Drug.findAll({
//             where: {
//                 name: req.body.name,
//                 doseForm: req.body.doseForm,
//                 strength: req.body.strength,
//                 levelOfUse: req.body.levelOfUse,
//                 therapeuticCategory: req.body.therapeuticCategory,
//                 issueUnit: req.body.issueUnit,
//                 issueUnitPrice: req.body.issueUnitPrice,
//                 expiryDate: req.body.expiryDate,
//             }
//
//         }).then((drugs) => {
//
//             // add the found drugs into res.locals
//
//             res.locals.existentDrugs = Array(drugs);
//
//             console.log("Printing res.locals.existentDrugs ->", drugs);
//
//             console.log("Printing found drugs -> ", drugs);
//
//             if (drugs.length) {
//
//                 res.locals.drugExists = true;
//
//             } else {
//
//                 res.locals.drugExists = false;
//                 next();
//             }
//
//         }).catch(next);
//     } else {
//         next();
//     }
//
//
// }
//
// static checkIfDrugExistsNearMatch(req, res, next) {
//
//     console.log("Checking if the drug info inside the request body nearly matches a drug that exists ...");
//
//     if (res.req.method !== "GET") {
//         Drug.findAll({
//             where: {
//                 name: req.body.name,
//                 doseForm: req.body.doseForm,
//                 strength: req.body.strength,
//                 issueUnit: req.body.issueUnit,
//                 expiryDate: req.body.expiryDate,
//             }
//         }).then((drugs) => {
//             if (drugs.length) {
//
//                 res.locals.drugExists = true;
//                 next();
//
//             } else {
//
//                 res.locals.drugExists = false;
//
//                 next();
//
//             }
//         }).catch(next);
//     } else {
//         next();
//     }
//
// }
//


// static checkIfSupplierExists(req, res, next) {
//
//     if (res.req.method !== "GET") {
//
//         console.log("Checking if the supplier info inside the request body match a supplier that exists ...");
//
//         Supplier.findAll({
//             where: {
//                 name: req.body.name,
//                 email: req.body.email,
//                 contact: req.body.contact,
//             }
//         })
//             .then((suppliers) => {
//
//                 if (suppliers.length) {
//
//                     res.locals.supplierExists = true;
//
//                     throw new CustomError({
//                         description: `The supplier info entered already matches an existing one${JSON.stringify(suppliers[0].toJSON())}`,
//                         status: 400,
//                     }, `The supplier info entered already matches an existing one \n${suppliers[0].toJSON()}`);
//
//                 } else {
//
//                     res.locals.supplierExists = false;
//                     next();
//                 }
//             })
//             .catch(next);
//
//     } else {
//
//         next();
//
//     }
// }

// const supplierId = req.params.id;
//
// Supplier.findByPk(supplierId).then((supplier) => {
//
//     const {name, email, contact} = req.body;
//
//     if (!name || !email || !contact) {
//         res.json({
//             errMsg: "Error! Not all fields were filled",
//             body: req.body,
//         });
//     } else {
//         supplier.update({
//             name, email, contact
//         }).then((supplier) => {
//             return supplier.save();
//         }).then((supplier) => {
//             res.json({
//                 msg: "Successfully updated the supplier data",
//                 supplier
//             });
//         }).catch((err) => {
//             res.json({
//                 errMsg: "Error! Failed to update the supplier's data",
//                 err,
//             });
//         });
//     }
// }).catch((err) => {
//     res.json({
//         errMsg: "Error! Failed to update the supplier's data",
//         err,
//     });
// });
