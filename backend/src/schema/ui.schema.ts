import { object, string, number, TypeOf, any } from "zod";

const payload = {
    body: object({
        title: string().min(1, "Title is required"),
        category: string().min(1, "Category is required"),
        // author is now "Additional Information" — optional
        author: string().optional().default(''),
        // overview maps to Description
        overview: string().nullable().optional(),
        // price, color, rating, highlights, specifications are no longer submitted by the form
        // but kept here as optional for backward-compat / edit flows
        price: string().nullable().optional(),
        color: string().nullable().optional(),
        highlights: string().nullable().optional().or(any().array()).optional(),
        rating: string().nullable().optional().or(number().transform(val => val.toString())).optional(),
        imageSrc: string().nullable().optional(),
        google_file_id: string().nullable().optional(),
        specifications: any().optional(),
    }),
};

const params = {
    params: object({
        id: string().min(1, "UI ID is required"),
    }),
};

export const createUiSchema = object({
    ...payload,
});

export const updateUiSchema = object({
    ...params,
    body: payload.body.partial(),
});

export const getUiSchema = object({
    ...params,
});

export type CreateUiInput = TypeOf<typeof createUiSchema>;
export type UpdateUiInput = TypeOf<typeof updateUiSchema>;
export type GetUiInput = TypeOf<typeof getUiSchema>;
