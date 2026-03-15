"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const validateResource = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (e) {
        if (e instanceof zod_1.ZodError) {
            return res.status(400).send(e.errors);
        }
        return res.status(400).send(e.errors);
    }
};
exports.default = validateResource;
