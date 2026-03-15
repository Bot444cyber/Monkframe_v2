"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUiSchema = exports.updateUiSchema = exports.createUiSchema = void 0;
const zod_1 = require("zod");
const payload = {
    body: (0, zod_1.object)({
        title: (0, zod_1.string)().min(1, "Title is required"),
        price: (0, zod_1.string)().min(1, "Price is required").or((0, zod_1.number)().transform(val => val.toString())),
        category: (0, zod_1.string)().min(1, "Category is required"),
        author: (0, zod_1.string)().min(1, "Author is required"),
        color: (0, zod_1.string)().optional(),
        overview: (0, zod_1.string)().optional(),
        highlights: (0, zod_1.string)().optional().or((0, zod_1.any)().array()).optional(), // Can be JSON string or array
        rating: (0, zod_1.string)().optional().or((0, zod_1.number)().transform(val => val.toString())).optional(),
        imageSrc: (0, zod_1.string)().optional(),
        google_file_id: (0, zod_1.string)().optional(),
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
