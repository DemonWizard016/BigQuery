import express from 'express';
import bigQuery from '../big_query.js';
import * as dotenv from 'dotenv';

// .env config
dotenv.config();

const router = express.Router();
const projectId = process.env.PROJECTID;

// PostalCode Pattern
const postalCodeExpr = /^[a-zA-Z]\d[a-zA-Z]\d[a-zA-Z]\d$/;

router.get('/:postalCode', async (req, res, next) => {

    const { postalCode } = req.params;

    // Postal Code must be set
    if (postalCode === undefined) {
        res.status(200).send({
            success: false,
            error: "Postal-code is not set."
        });
        return;
    }

    // Post Code must be exact format
    if (!postalCodeExpr.test(postalCode)) {
        res.status(200).send({
            success: false,
            error: "Format is not correct"
        });
        return;
    }

    const query = `
        SELECT * from \`${projectId}.AddressDataset.Address\`
        WHERE Province_Code='${postalCode}'
    `;

    const options = {
        query,
        location: process.env.LOCATION
    };

    try {
        const [job] = await bigQuery.createQueryJob(options);
        const [rows] = await job.getQueryResults();

        // There is no such address.
        if (rows.length === 0) {
            res.status(200).send({
                success: false,
                error: "Address was not found"
            });
            return;
        }

        //There are two many data.
        if (rows.length > 50) {
            res.status(200).send({
                success: false,
                error: "Payload is too Large to Handle "
            });
            return;
        }

        res.status(200).send(rows);

    } catch (err) {
        res.status(200).send({
            success: false,
            error: err
        });
    }

});

router.get('/:streetNumber/:postalCode', async (req, res, next) => {

    const { streetNumber, postalCode } = req.params;

    // Must set streetNumber and postalCode
    if (postalCode === undefined || streetNumber === undefined) {
        res.status(200).send({
            success: false,
            error: "Postal-Code or Street-Number's missing"
        });
        return;
    }

    // streetNumber should be at least 1
    if (streetNumber < 1) {
        res.status(200).send({
            success: false,
            error: "Street-Number must be equal or greater than 1"
        });
        return;
    }

    // Post Code must be exact format
    if (!postalCodeExpr.test(postalCode)) {
        res.status(200).send({
            success: false,
            error: "Format is not correct"
        });
        return;
    }

    const query = `
        SELECT * from \`${projectId}.AddressDataset.Address\`
        WHERE Province_Code='${postalCode}' AND Street_Address_From_Number=${streetNumber}
    `;

    const options = {
        query,
        location: process.env.LOCATION
    };

    try {
        const [job] = await bigQuery.createQueryJob(options);
        const [rows] = await job.getQueryResults();

        // There is no such address.
        if (rows.length === 0) {
            res.status(200).send({
                success: false,
                error: "Address was not found"
            });
            return;
        }

        //There are two many data.
        if (rows.length > 50) {
            res.status(200).send({
                success: false,
                error: "Payload is too Large to Handle "
            });
            return;
        }

        res.status(200).send(rows);

    } catch (err) {
        res.status(200).send({
            success: false,
            error: err
        });
    }

});

export default router;