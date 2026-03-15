import { object, string, number, TypeOf, any } from "zod";

const payload = {
    body: object({
        title: string().min(1, "Title is required"),
        price: string().min(1, "Price is required").or(number().transform(val => val.toString())),
        category: string().min(1, "Category is required"),
        author: string().min(1, "Author is required"),
        color: string().optional(),
        overview: string().optional(),
        highlights: string().optional().or(any().array()).optional(), // Can be JSON string or array
        rating: string().optional().or(number().transform(val => val.toString())).optional(),
        imageSrc: string().optional(),
        google_file_id: string().optional(),
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
