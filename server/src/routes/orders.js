import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Member from '../models/Member.js';

const router = express.Router();

// GET /api/orders - Get all orders
router.get('/', async (req, res) => {
    try {
        const {
            memberId,
            status,
            paymentStatus,
            page = 1,
            limit = 10
        } = req.query;

        const query = {};

        if (memberId) query.member = memberId;
        if (status) query.status = status;
        if (paymentStatus) query.paymentStatus = paymentStatus;

        const orders = await Order.find(query)
            .populate('member', 'firstName lastName email phone')
            .populate('items.product', 'name mainImage')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Order.countDocuments(query);

        res.json({
            orders,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('member')
            .populate('items.product');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
    try {
        const { memberId, items, shippingAddress, shippingMethod } = req.body;

        // Vérifier le membre
        const member = await Member.findById(memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Calculer les totaux et vérifier le stock
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    message: `Product ${item.productId} not found`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}`
                });
            }

            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;

            orderItems.push({
                product: product._id,
                productSnapshot: {
                    name: product.name,
                    price: product.price,
                    image: product.mainImage || product.images[0],
                },
                quantity: item.quantity,
                price: product.price,
                variant: item.variant,
            });

            // Décrémenter le stock
            product.stock -= item.quantity;
            product.salesCount += item.quantity;
            await product.save();
        }

        // Calculer les frais
        const tax = subtotal * 0.1; // 10% TVA
        const shipping = shippingMethod === 'Express' ? 50 :
            shippingMethod === 'Standard' ? 25 : 0;
        const total = subtotal + tax + shipping;

        // Créer la commande
        const order = new Order({
            member: memberId,
            items: orderItems,
            subtotal,
            tax,
            shipping,
            total,
            shippingAddress,
            shippingMethod,
        });

        const newOrder = await order.save();

        // Mettre à jour les références du membre
        await Member.findByIdAndUpdate(memberId, {
            $push: { orders: newOrder._id },
        });

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PATCH /api/orders/:id/status - Update order status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PATCH /api/orders/:id/payment - Update payment status
router.patch('/:id/payment', async (req, res) => {
    try {
        const { paymentStatus, paymentMethod } = req.body;

        const updateData = { paymentStatus };
        if (paymentMethod) updateData.paymentMethod = paymentMethod;
        if (paymentStatus === 'Completed') updateData.paidAt = new Date();

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/orders/:id - Cancel order
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'Pending' && order.status !== 'Confirmed') {
            return res.status(400).json({
                message: 'Cannot cancel order in current status'
            });
        }

        // Restaurer le stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: {
                    stock: item.quantity,
                    salesCount: -item.quantity
                },
            });
        }

        order.status = 'Cancelled';
        await order.save();

        res.json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
