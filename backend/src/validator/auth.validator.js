import { body, validationResult } from "express-validator";


function validateRequest(req, res, next) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    next();
}


export const validateRegisterUser = [

    body("email")
        .trim()
        .isEmail()
        .withMessage("Invalid email format")
        .normalizeEmail(),

    body("contact")
        .optional()
        .matches(/^\d{10}$/)
        .withMessage("Contact must be a 10-digit number"),

    body("password")
        .isLength({ min: 6 })
        .withMessage(
            "Password must be at least 6 characters long"
        ),

    body("fullname")
        .trim()
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ min: 3 })
        .withMessage(
            "Full name must be at least 3 characters long"
        ),

    validateRequest
];


export const validateLoginUser = [

    body("email")
        .trim()
        .isEmail()
        .withMessage("Invalid email format")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),

    validateRequest
];