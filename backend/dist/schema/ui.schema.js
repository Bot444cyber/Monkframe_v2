"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUiSchema = exports.updateUiSchema = exports.createUiSchema = void 0;
const zod_1 = require("zod");
const payload = {
    body: (0, zod_1.object)({
        title: (0, zod_1.string)().min(1, "Title is required"),
        category: (0, zod_1.string)().min(1, "Category is required"),
        // author is now "Additional Information" — optional
        author: (0, zod_1.string)().optional().default(''),
        // overview maps to Description
        overview: (0, zod_1.string)().nullable().optional(),
        // price, color, rating, highlights, specifications are no longer submitted by the form
        // but kept here as optional for backward-compat / edit flows
        price: (0, zod_1.string)().nullable().optional(),
        color: (0, zod_1.string)().nullable().optional(),
        highlights: (0, zod_1.string)().nullable().optional().or((0, zod_1.any)().array()).optional(),
        rating: (0, zod_1.string)().nullable().optional().or((0, zod_1.number)().transform(val => val.toString())).optional(),
        imageSrc: (0, zod_1.string)().nullable().optional(),
        google_file_id: (0, zod_1.string)().nullable().optional(),
        specifications: (0, zod_1.any)().optional(),
    }),
};
const params = {
    params: (0, zod_1.object)({
        id: (0, zod_1.string)().min(1, "UI ID is required"),
    }),
};
exports.createUiSchema = (0, zod_1.object)(Object.assign({}, payload));
exports.updateUiSchema = (0, zod_1.object)(Object.assign(Object.assign({}, params), { body: payload.body.partial() }));
exports.getUiSchema = (0, zod_1.object)(Object.assign({}, params));
