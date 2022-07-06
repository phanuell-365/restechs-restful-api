// jshint esversion:9

"use strict";

const Delivery = require("../../models/deliveries.model");

module.exports = {

    getDeliveries(req, res, next) {

        Delivery.findAll()
            .then((deliveries) => {

                console.log(res.locals);

                deliveries.forEach(delivery => console.log(delivery.toJSON()));

                res.status(200).json(deliveries);

            })
            .catch(next);

    },

    postDeliveries(req, res, next) {

        if (res.locals.validDeliveryInfo) {

            const validDeliveryInfo = res.locals.validDeliveryInfo;

            console.log(validDeliveryInfo);

            Delivery.findOrCreate({
                where: {
                    name: req.body.name,
                },
                defaults:validDeliveryInfo,
            })
                .then(([delivery, created]) => {

                    if (created) {
                        console.log("Successfully created the delivery ->", delivery.toJSON());
                        res.status(201).json({
                            description: "Successfully added the delivery into the database",
                        });
                    } else {
                        res.status(400).json({
                            description: "The delivery already exists.",
                        });
                    }
                    })
                .catch(next);
                }
    }

};