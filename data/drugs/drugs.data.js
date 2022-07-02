// jshint esversion:9

"use strict";

module.exports = {

    validDrugForms: [
        ["Tablet", "Capsule", "PFI", "Oral Liquid", "Implant", "Injection",
            "SODF", "Concentrate", "Solution", "Solution for Injection", "Granules", "Oral Powder",
            "Oral Pellets", "Vaginal Tablet", "Oromucosal solution", "Rectal Gel", "Cream",
            "Ointment", "Lotion", "Paste", "Tropical Application", "Eye drops", "Test Strip",
            "Gel", "Injection(IV)"]
    ],

    validDrugStrengthMeasurements: ["mg", "mL", "g", "%", "vial", "IU vial", "mL vial", "as HCI"],

    validIssueUnits: [
        "TAB", "CAP", "PFI", "OR Liq", "IMP", "INJ",
        "SODF", "CONC", "SOL", "Sol INJ", "GRA", "OR Pow",
        "OR Pel", "VAG Tab", "ORO Sol", "REC Gel", "CRE",
        "OIN", "LOT", "PAS", "Tro APP", "EYE Dro", "Tes STR",
        "GEL", "INJ (IV)"
    ]

};