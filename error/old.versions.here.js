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
