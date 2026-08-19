import { body, validationResult } from "express-validator";


function validateRequest(req, res, next) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    next();
}


export const validateClothing = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required"),

    body("brand")
        .trim()
        .notEmpty()
        .withMessage("Brand is required"),

    body("size")
        .trim()
        .notEmpty()
        .withMessage("Size is required"),

    body("condition")
        .trim()
        .notEmpty()
        .withMessage("Condition is required"),

    body("estimatedSwapValue")
        .isFloat({ min: 0 })
        .withMessage("Invalid estimated swap value"),

    body("city")
        .trim()
        .notEmpty()
        .withMessage("City is required"),

    body("state")
        .trim()
        .notEmpty()
        .withMessage("State is required"),

    body("pincode")
        .trim()
        .notEmpty()
        .withMessage("Pincode is required"),

    body("pincode")
        .matches(/^\d{6}$/)
        .withMessage("Pincode must be 6 digits"),

    validateRequest,
];