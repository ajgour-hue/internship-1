    import clothingModel from "../model/clothing.model.js";
    import {
        calculateRecommendationScore
    } from "../utils/recommendation.util.js";

 import { uploadFile } from "../service/storage.service.js";



export const createClothing = async (req, res) => {
    try {

        // ==========================================
        // CHECK FILES
        // ==========================================

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one image",
            });
        }


        // ==========================================
        // UPLOAD IMAGES TO IMAGEKIT
        // ==========================================

        const uploadedImages = await Promise.all(

            req.files.map(async (file, index) => {

                const result = await uploadFile({
                    buffer: file.buffer,

                    fileName:
                        `${Date.now()}-${index}-${file.originalname}`,

                    folder: "fashionkart/clothes",
                });

                return result.url;
            })
        );


        // ==========================================
        // CREATE LOCATION
        // ==========================================

        const location = {
            city: req.body.city.trim(),
            state: req.body.state.trim(),
            pincode: req.body.pincode.trim(),
        };


        // ==========================================
        // CREATE CLOTHING
        // ==========================================

        const clothing = await clothingModel.create({

            owner: req.user._id,

            title: req.body.title.trim(),

            description:
                req.body.description.trim(),

            category:
                req.body.category.trim(),

            brand:
                req.body.brand.trim(),

            size:
                req.body.size.trim(),

            condition:
                req.body.condition.trim(),

            images: uploadedImages,

            estimatedSwapValue:
                Number(req.body.estimatedSwapValue),

            location,
        });


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(201).json({

            success: true,

            message:
                "Clothing listed successfully",

            clothing,
        });


    } catch (error) {

        console.error(
            "Create clothing error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error?.message ||
                "Internal server error",
        });
    }
};
    export const getClothes = async (req, res) => {
        try {
            const {
                search,
                category,
                brand,
                size,
                condition,
                city,
                page = 1,
                limit = 20
            } = req.query;

            const filter = {
                status: "available"
            };

            if (search) {
                filter.$or = [
                    {
                        title: {
                            $regex: search,
                            $options: "i"
                        }
                    },
                    {
                        brand: {
                            $regex: search,
                            $options: "i"
                        }
                    }
                ];
            }

            if (category) {
                filter.category = category;
            }

            if (brand) {
                filter.brand = {
                    $regex: brand,
                    $options: "i"
                };
            }

            if (size) {
                filter.size = size;
            }

            if (condition) {
                filter.condition = condition;
            }

            if (city) {
                filter["location.city"] = {
                    $regex: city,
                    $options: "i"
                };
            }

            const skip = (page - 1) * limit;

            const clothes = await clothingModel
                .find(filter)
                .populate(
                    "owner",
                    "fullname profileImage location.city"
                )
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit));

            const total = await clothingModel.countDocuments(filter);

            return res.status(200).json({
                success: true,
                clothes,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            });

        } catch (error) {
            console.error(
                "Get clothes error:",
                error.message
            );

            return res.status(500).json({
                message: "Internal server error"
            });
        }
    };

    export const getClothingById = async (req, res) => {
        try {

            const clothing = await clothingModel
                .findById(req.params.id)
                .populate(
                    "owner",
                    "fullname profileImage location.city location.state"
                );

            if (!clothing) {
                return res.status(404).json({
                    message: "Clothing not found"
                });
            }

            return res.status(200).json({
                success: true,
                clothing
            });

        } catch (error) {

            console.error(
                "Get clothing error:",
                error.message
            );

            return res.status(500).json({
                message: "Internal server error"
            });
        }
    };




    export const getMyListings = async (req, res) => {
        try {

            const clothes = await clothingModel
                .find({
                    owner: req.user._id
                })
                .sort({
                    createdAt: -1
                });

            return res.status(200).json({
                success: true,
                clothes
            });

        } catch (error) {

            console.error(
                "Get my listings error:",
                error.message
            );

            return res.status(500).json({
                message: "Internal server error"
            });
        }
    };

    export const updateClothing = async (req, res) => {
        try {

            const clothing = await clothingModel.findById(
                req.params.id
            );

            if (!clothing) {
                return res.status(404).json({
                    message: "Clothing not found"
                });
            }

            if (
                clothing.owner.toString() !==
                req.user._id.toString()
            ) {
                return res.status(403).json({
                    message: "You can only edit your own listing"
                });
            }

            const allowedFields = [
                "title",
                "description",
                "category",
                "brand",
                "size",
                "condition",
                "images",
                "estimatedSwapValue",
                "location"
            ];

            allowedFields.forEach((field) => {
                if (req.body[field] !== undefined) {
                    clothing[field] = req.body[field];
                }
            });

            await clothing.save();

            return res.status(200).json({
                success: true,
                message: "Listing updated successfully",
                clothing
            });

        } catch (error) {

            console.error(
                "Update clothing error:",
                error.message
            );

            return res.status(500).json({
                message: "Internal server error"
            });
        }
    };



    export const deleteClothing = async (req, res) => {
        try {

            const clothing =
                await clothingModel.findById(
                    req.params.id
                );


            // Clothing not found
            if (!clothing) {
                return res.status(404).json({
                    message: "Clothing not found"
                });
            }


            // Only owner can delete
            if (
                clothing.owner.toString() !==
                req.user._id.toString()
            ) {
                return res.status(403).json({
                    message:
                        "You can only delete your own listing"
                });
            }


            // Swapped clothing cannot be deleted
            if (
                clothing.status === "swapped"
            ) {
                return res.status(400).json({
                    message:
                        "Swapped clothing cannot be removed"
                });
            }


            // Permanently delete from database
            await clothingModel.findByIdAndDelete(
                req.params.id
            );


            return res.status(200).json({

                success: true,

                message:
                    "Clothing listing removed successfully"
            });


        } catch (error) {

            console.error(
                "Delete clothing error:",
                error.message
            );


            return res.status(500).json({
                message:
                    "Internal server error"
            });
        }
    };

    export const getNearbyClothes = async (req, res) => {
        try {

            const {
                longitude,
                latitude,
                radius = 10
            } = req.query;

            const lng = Number(longitude);
            const lat = Number(latitude);
            const distance = Number(radius);

            if (
                !Number.isFinite(lng) ||
                !Number.isFinite(lat) ||
                !Number.isFinite(distance)
            ) {
                return res.status(400).json({
                    message: "Invalid location parameters"
                });
            }

            if (
                lng < -180 ||
                lng > 180 ||
                lat < -90 ||
                lat > 90
            ) {
                return res.status(400).json({
                    message: "Invalid coordinates"
                });
            }

            const clothes = await clothingModel.find({
                status: "available",

                "location.coordinates": {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [lng, lat]
                        },
                        $maxDistance: distance * 1000
                    }
                }
            })
            .populate(
                "owner",
                "fullname profileImage location"
            )
            .limit(50);

            return res.status(200).json({
                success: true,
                radius: distance,
                count: clothes.length,
                clothes
            });

        } catch (error) {

            console.error(
                "Get nearby clothes error:",
                error.message
            );

            return res.status(500).json({
                message: "Internal server error"
            });
        }
    };



    export const getNearbyClothesForUser = async (req, res) => {
        try {

            const user = req.user;

            const coordinates =
                user.location?.coordinates?.coordinates;

            if (
                !coordinates ||
                coordinates.length !== 2
            ) {
                return res.status(400).json({
                    message: "Please update your location first"
                });
            }

            const [lng, lat] = coordinates;

            const radius = Number(
                req.query.radius || 10
            );

            const clothes = await clothingModel.find({
                status: "available",

                owner: {
                    $ne: user._id
                },

                "location.coordinates": {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [lng, lat]
                        },
                        $maxDistance: radius * 1000
                    }
                }
            })
            .populate(
                "owner",
                "fullname profileImage location"
            )
            .limit(50);

            return res.status(200).json({
                success: true,
                radius,
                count: clothes.length,
                clothes
            });

        } catch (error) {

            console.error(
                "Get nearby user clothes error:",
                error.message
            );

            return res.status(500).json({
                message: "Internal server error"
            });
        }
    };


    export const getClothingRecommendations = async (
        req,
        res
    ) => {

        try {

            const targetClothing =
                await clothingModel.findById(
                    req.params.clothingId
                );

            if (!targetClothing) {
                return res.status(404).json({
                    message: "Clothing not found"
                });
            }


            // Only owner can get recommendations
            // for their own clothing
            if (
                targetClothing.owner.toString() !==
                req.user._id.toString()
            ) {
                return res.status(403).json({
                    message:
                        "You can only get recommendations for your own clothing"
                });
            }


            const coordinates =
                targetClothing
                    .location
                    ?.coordinates
                    ?.coordinates;


            if (
                !coordinates ||
                coordinates.length !== 2
            ) {
                return res.status(400).json({
                    message:
                        "Clothing location is not available"
                });
            }


            const [lng, lat] = coordinates;


            const radius = Number(
                req.query.radius || 10
            );


            if (
                !Number.isFinite(radius) ||
                radius <= 0
            ) {
                return res.status(400).json({
                    message: "Invalid radius"
                });
            }


            const clothes =
                await clothingModel.aggregate([

                    {
                        $geoNear: {
                            near: {
                                type: "Point",
                                coordinates: [lng, lat]
                            },

                            key: "location.coordinates",

                            distanceField:
                                "distanceInMeters",

                            maxDistance:
                                radius * 1000,

                            spherical: true,

                            query: {
                                status: "available",

                                owner: {
                                    $ne: req.user._id
                                }
                            }
                        }
                    },

                    {
                        $limit: 50
                    }
                ]);


            const recommendations =
                clothes.map((clothing) => {

                    const distanceKm =
                        clothing.distanceInMeters / 1000;


                    const recommendation =
                        calculateRecommendationScore({

                            distanceKm,

                            maxDistanceKm:
                                radius,

                            targetValue:
                                targetClothing
                                    .estimatedSwapValue,

                            candidateValue:
                                clothing
                                    .estimatedSwapValue,

                            targetCategory:
                                targetClothing.category,

                            candidateCategory:
                                clothing.category,

                            targetCondition:
                                targetClothing.condition,

                            candidateCondition:
                                clothing.condition
                        });


                    return {
                        ...clothing,

                        distanceKm: Number(
                            distanceKm.toFixed(2)
                        ),

                        recommendation
                    };
                });


            // Highest score first
            recommendations.sort(
                (a, b) =>
                    b.recommendation.score -
                    a.recommendation.score
            );


            return res.status(200).json({

                success: true,

                targetClothing: {
                    id: targetClothing._id,

                    title:
                        targetClothing.title,

                    estimatedSwapValue:
                        targetClothing
                            .estimatedSwapValue
                },

                count:
                    recommendations.length,

                recommendations
            });


        } catch (error) {

            console.error(
                "Clothing recommendation error:",
                error.message
            );

            return res.status(500).json({
                message: "Internal server error"
            });
        }
    };

