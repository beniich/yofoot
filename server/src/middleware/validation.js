import Joi from 'joi';

// Validate request body against schema
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors,
            });
        }

        req.validatedBody = value;
        next();
    };
};

// Common validation schemas
const schemas = {
    register: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        phone: Joi.string().optional(),
        country: Joi.string().optional(),
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),

    createMember: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().optional(),
        role: Joi.string().valid('Player', 'Staff', 'Fan', 'Admin').default('Fan'),
        tier: Joi.string().valid('VIP', 'Elite', 'Standard').default('Standard'),
    }),

    createEvent: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().optional(),
        category: Joi.string().valid('Match', 'Training', 'Tournament', 'Meeting', 'Other').required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().optional(),
        venue: Joi.object({
            name: Joi.string().required(),
            address: Joi.string().optional(),
            city: Joi.string().optional(),
            capacity: Joi.number().optional(),
        }).optional(),
        capacity: Joi.number().optional(),
        ticketPrice: Joi.number().optional(),
    }),

    createProduct: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().optional(),
        category: Joi.string().valid('Jersey', 'Training', 'Accessories', 'Memorabilia', 'Equipment').required(),
        price: Joi.number().min(0).required(),
        stock: Joi.number().min(0).default(0),
        images: Joi.array().items(Joi.string()).optional(),
    }),

    createOrder: Joi.object({
        memberId: Joi.string().required(),
        items: Joi.array().items(
            Joi.object({
                productId: Joi.string().required(),
                quantity: Joi.number().min(1).required(),
                size: Joi.string().optional(),
                color: Joi.string().optional(),
            })
        ).min(1).required(),
        shippingAddress: Joi.object({
            fullName: Joi.string().required(),
            phone: Joi.string().required(),
            address: Joi.string().required(),
            city: Joi.string().required(),
            postalCode: Joi.string().required(),
            country: Joi.string().required(),
        }).required(),
        paymentMethod: Joi.string().required(),
    }),
};

export {
    validate,
    schemas,
};
