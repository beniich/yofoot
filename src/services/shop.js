import api from './api';

const MOCK_PRODUCTS = [
    {
        id: '1',
        name: '23/24 Home Jersey',
        price: 85,
        comparePrice: 100,
        images: ['https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&q=80'],
        category: 'JERSEY',
        stock: 50,
        featured: true,
        rating: 4.8,
        reviews: 124
    },
    {
        id: '2',
        name: 'Pro Training Top',
        price: 55,
        images: ['https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&q=80'],
        category: 'TRAINING',
        stock: 30,
        featured: true,
        rating: 4.6,
        reviews: 89
    },
    {
        id: '3',
        name: 'Club Scarf',
        price: 20,
        images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&q=80'],
        category: 'ACCESSORIES',
        stock: 100,
        rating: 4.9,
        reviews: 256
    },
    {
        id: '4',
        name: 'Signed Football',
        price: 150,
        comparePrice: 200,
        images: ['https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=500&q=80'],
        category: 'MEMORABILIA',
        stock: 5,
        rating: 5.0,
        reviews: 45
    },
    {
        id: '5',
        name: 'Away Jersey 23/24',
        price: 85,
        images: ['https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&q=80'],
        category: 'JERSEY',
        stock: 45,
        rating: 4.7,
        reviews: 98
    },
    {
        id: '6',
        name: 'Training Shorts',
        price: 35,
        images: ['https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&q=80'],
        category: 'TRAINING',
        stock: 60,
        rating: 4.5,
        reviews: 67
    }
];

export const getProducts = async () => {
    try {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_PRODUCTS), 600));
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const createOrder = async (cart) => {
    console.log("Creating order for", cart);
    return { success: true, orderId: `ORD-${Date.now()}` };
};
