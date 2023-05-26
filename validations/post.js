import { body } from 'express-validator';

export const postCreateValidation = [
    body('title').isLength({ min: 3 }).isString(),
    body('text').isLength({ min: 5 }).isString(),
    body('tags').optional().isArray(),
    body('imageUrl').optional().isString()
];
export const postUpdateValidation = [
    body('title').optional().isLength({ min: 3 }).isString(),
    body('text').optional().isLength({ min: 5 }).isString(),
    body('tags').optional().isArray(),
    body('imageUrl').optional().isString()
];