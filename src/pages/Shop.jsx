import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import Button, { Card, Badge, Input, EmptyState } from '../components/UI';
import { shopService } from '../services/shop';

const Shop = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await shopService.getAllProducts();
                // Handle direct array or wrapped object
                const productList = Array.isArray(data) ? data : (data.products || []);

                // Keep UI compatibility
                const adaptedProducts = productList.map(p => ({
                    ...p,
                    id: p.id || p._id,
                    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.mainImage || 'https://via.placeholder.com/300'],
                    reviews: p.reviews || Math.floor(Math.random() * 200) + 10 // Mock reviews if missing
                }));

                setProducts(adaptedProducts);
            } catch (err) {
                console.error("Failed to load products", err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (selectedCategory === 'all') return matchesSearch;
        return matchesSearch && product.category === selectedCategory;
    });

    const addToCart = (product) => {
        const productId = product.id || product._id;
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            setCart(cart.map(item =>
                item.id === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, id: productId, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity === 0) {
            removeFromCart(productId);
        } else {
            setCart(cart.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            ));
        }
    };

    const handleCheckout = async () => {
        try {
            const orderData = {
                member: 'MOCK_USER_ID', // Replace with real ID
                items: cart.map(item => ({
                    product: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                subtotal: cartTotal,
                total: cartTotal // Add tax/shipping logic if needed
            };

            const result = await shopService.createOrder(orderData);
            if (result.success || result.order) {
                alert(`Order placed successfully! Order ID: ${result.order?.orderNumber || result.orderId}`);
                setCart([]);
                setShowCart(false);
            } else {
                alert('Failed to place order. Please try again.');
            }
        } catch (err) {
            console.error(err);
            alert('Error during checkout. Is the backend running?');
        }
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="min-h-screen bg-charcoal text-white pb-20">
            <Header />

            {/* Page Header */}
            <div className="sticky top-[73px] z-40 bg-charcoal/95 backdrop-blur-xl border-b border-white/5 px-4 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold gold-text-gradient">Official Store</h1>
                        <p className="text-sm text-white/60 mt-1">Premium club merchandise</p>
                    </div>
                    <button
                        onClick={() => setShowCart(true)}
                        className="relative flex items-center justify-center rounded-full h-12 w-12 bg-gradient-to-br from-gold to-gold-light text-charcoal shadow-lg shadow-gold/20 hover:shadow-gold/40 transition-all hover:scale-105 active:scale-95"
                    >
                        <span className="material-symbols-outlined font-bold text-2xl">shopping_bag</span>
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center border-2 border-charcoal">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <main className="px-4 pb-4">
                {/* Search */}
                <div className="py-4">
                    <Input
                        icon="search"
                        placeholder="Search for kits, gifts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Categories */}
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {[
                        { id: 'all', label: 'All', icon: 'grid_view' },
                        { id: 'JERSEY', label: 'Jerseys', icon: 'checkroom' },
                        { id: 'TRAINING', label: 'Training', icon: 'fitness_center' },
                        { id: 'ACCESSORIES', label: 'Accessories', icon: 'shopping_bag' },
                        { id: 'MEMORABILIA', label: 'Memorabilia', icon: 'workspace_premium' }
                    ].map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex h-9 shrink-0 items-center justify-center gap-2 rounded-full px-4 transition-all ${selectedCategory === cat.id
                                ? 'bg-gradient-to-r from-gold to-gold-light text-charcoal font-bold shadow-lg shadow-gold/20'
                                : 'bg-surface-dark border border-white/10 text-white/70 hover:bg-surface-dark/80'
                                }`}
                        >
                            <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                            <span className="text-sm font-medium">{cat.label}</span>
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {loading ? (
                        [...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] rounded-xl bg-white/5 animate-pulse" />
                        ))
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <Card
                                key={product.id}
                                variant="elevated"
                                className="group cursor-pointer hover:shadow-2xl hover:shadow-gold/10 transition-all"
                            >
                                {/* Product Image */}
                                <div className="relative aspect-[3/4] overflow-hidden bg-surface-dark">
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />

                                    {/* Badges */}
                                    <div className="absolute top-2 left-2 flex flex-col gap-2">
                                        {product.featured && (
                                            <Badge variant="warning" className="text-[10px]">
                                                Best Seller
                                            </Badge>
                                        )}
                                        {product.comparePrice && (
                                            <Badge variant="danger" className="text-[10px]">
                                                -{Math.round((1 - product.price / product.comparePrice) * 100)}%
                                            </Badge>
                                        )}
                                        {product.stock < 10 && (
                                            <Badge variant="danger" className="text-[10px]">
                                                Only {product.stock} left
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="absolute bottom-3 right-3 h-10 w-10 bg-gold rounded-full flex items-center justify-center shadow-lg hover:bg-gold-light transition-all hover:scale-110 active:scale-95"
                                    >
                                        <span className="material-symbols-outlined text-charcoal text-xl">add</span>
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="p-3">
                                    <h3 className="text-sm font-bold text-white line-clamp-2 mb-2">
                                        {product.name}
                                    </h3>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-2">
                                        <span className="material-symbols-outlined text-gold text-sm">star</span>
                                        <span className="text-xs text-white/80">{product.rating}</span>
                                        <span className="text-xs text-white/40">({product.reviews})</span>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-gold font-bold text-base">${product.price}</p>
                                        {product.comparePrice && (
                                            <p className="text-xs text-white/40 line-through">
                                                ${product.comparePrice}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-2">
                            <EmptyState
                                icon="shopping_bag"
                                title="No products found"
                                description="Try adjusting your search or filters"
                                action={
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedCategory('all');
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                }
                            />
                        </div>
                    )}
                </div>
            </main>

            {/* Cart Sidebar */}
            {showCart && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-md bg-charcoal h-full overflow-y-auto shadow-2xl">
                        {/* Cart Header */}
                        <div className="sticky top-0 z-10 bg-charcoal/95 backdrop-blur-xl border-b border-white/10 p-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold gold-text-gradient">Shopping Cart</h2>
                                <button
                                    onClick={() => setShowCart(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <p className="text-sm text-white/60 mt-1">{cartCount} items</p>
                        </div>

                        {/* Cart Items */}
                        <div className="p-4">
                            {cart.length > 0 ? (
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <Card key={item.id} variant="glass" className="p-4">
                                            <div className="flex gap-3">
                                                <img
                                                    src={item.images[0]}
                                                    alt={item.name}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-sm mb-1 line-clamp-2">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-gold font-bold mb-2">${item.price}</p>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">remove</span>
                                                        </button>
                                                        <span className="text-sm font-bold w-8 text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">add</span>
                                                        </button>
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="ml-auto h-8 w-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-sm text-red-400">delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon="shopping_cart"
                                    title="Your cart is empty"
                                    description="Add some products to get started"
                                />
                            )}
                        </div>

                        {/* Cart Footer */}
                        {cart.length > 0 && (
                            <div className="sticky bottom-0 bg-charcoal/95 backdrop-blur-xl border-t border-white/10 p-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-white/60">Subtotal</span>
                                    <span className="text-2xl font-bold gold-text-gradient">
                                        ${cartTotal.toFixed(2)}
                                    </span>
                                </div>
                                <Button variant="primary" className="w-full" onClick={handleCheckout}>
                                    <span className="material-symbols-outlined">shopping_cart_checkout</span>
                                    Proceed to Checkout
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <BottomNavigation />
        </div>
    );
};

export default Shop;
