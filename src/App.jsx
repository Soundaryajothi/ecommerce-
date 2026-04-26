import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Heart, Search, User, Menu, X, 
  ChevronRight, Star, Truck, ShieldCheck, RefreshCw, 
  CreditCard, Plus, Minus, ArrowRight
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'product'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [PRODUCTS, setPRODUCTS] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then(res => res.json())
      .then(data => console.log("Backend Connection:", data))
      .catch(err => console.error("Connection Failed:", err));

    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setPRODUCTS(data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);
  
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [authFormData, setAuthFormData] = useState({ name: '', email: '', password: '' });
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeColor, setActiveColor] = useState('All');

  // Derived state
  const filteredProducts = PRODUCTS.filter(p => {
    let matchView = true;
    if (currentView === 'new_in') matchView = p.isNew;
    else if (currentView === 'sale') matchView = p.oldPrice !== null;
    else if (currentView === 'shoes') matchView = p.category === 'Shoes';
    else if (currentView === 'accessories') matchView = p.category === 'Accessories';
    else if (currentView === 'clothing') matchView = !['Shoes', 'Accessories'].includes(p.category);
    
    const matchCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchColor = activeColor === 'All' || p.color === activeColor;
    return matchView && matchCategory && matchColor;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Actions
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLoginView ? '/api/login' : '/api/signup';
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authFormData)
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        setIsAccountOpen(false);
        setAuthFormData({ name: '', email: '', password: '' });
      } else {
        alert(data.message || 'Authentication failed');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  const goCategory = (categoryName) => {
    setCurrentView(categoryName.toLowerCase().replace(' ', '_'));
    window.scrollTo(0, 0);
    setIsCartOpen(false);
    setIsSearchOpen(false);
  };
  const addToCart = (product, quantity = 1, size = 'M') => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size);
      if (existing) {
        return prev.map(item => item.id === product.id && item.size === size 
          ? { ...item, quantity: item.quantity + quantity } 
          : item);
      }
      return [...prev, { ...product, quantity, size }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id, size) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id, size, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.size === size) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const toggleWishlist = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  };

  const viewProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setCurrentView('home');
    window.scrollTo(0, 0);
  };

  // UI Components
  const Navbar = () => (
    <nav className="navbar">
      <div className="container nav-container">
        <button className="nav-icon-btn mobile-menu" style={{display: 'none'}}>
          <Menu />
        </button>
        
        <div className="nav-logo" style={{cursor: 'pointer'}} onClick={goHome}>AURA.</div>
        
        <div className="nav-links">
          <a href="#" onClick={(e) => { e.preventDefault(); goCategory('New In'); }}>New In</a>
          <a href="#" onClick={(e) => { e.preventDefault(); goCategory('Clothing'); }}>Clothing</a>
          <a href="#" onClick={(e) => { e.preventDefault(); goCategory('Shoes'); }}>Shoes</a>
          <a href="#" onClick={(e) => { e.preventDefault(); goCategory('Accessories'); }}>Accessories</a>
          <a href="#" onClick={(e) => { e.preventDefault(); goCategory('Sale'); }}>Sale</a>
        </div>
        
        <div className="nav-icons">
          <button className="nav-icon-btn" onClick={() => setIsSearchOpen(true)}>
            <Search size={22} />
          </button>
          <button className="nav-icon-btn" onClick={() => setIsAccountOpen(true)}>
            {currentUser ? (
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{currentUser.name.split(' ')[0]}</span>
            ) : (
              <User size={22} />
            )}
          </button>
          <button className="nav-icon-btn" onClick={() => setIsWishlistOpen(true)}>
            <Heart size={22} />
            {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
          </button>
          <button className="nav-icon-btn" onClick={() => setIsCartOpen(true)}>
            <ShoppingBag size={22} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  );

  const Hero = () => (
    <section className="hero">
      <img src="/images/hero_banner.png" alt="Hero" className="hero-bg" />
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <span className="hero-subtitle">Spring / Summer 2026</span>
        <h1 className="hero-title">Elevate Your Everyday Elegance.</h1>
        <p className="hero-text">Discover our new collection of premium essentials designed for the modern woman. Timeless pieces crafted with sustainable materials.</p>
        <button className="btn btn-primary" onClick={() => {
          document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
        }}>
          Shop Collection <ArrowRight size={18} style={{marginLeft: '10px'}} />
        </button>
      </div>
    </section>
  );

  const TrustSignals = () => (
    <section className="trust-signals">
      <div className="container trust-grid">
        <div className="trust-item">
          <div className="trust-icon"><Truck size={28} /></div>
          <h3 className="trust-title">Free Shipping</h3>
          <p className="trust-text">On all orders over $150</p>
        </div>
        <div className="trust-item">
          <div className="trust-icon"><RefreshCw size={28} /></div>
          <h3 className="trust-title">Easy Returns</h3>
          <p className="trust-text">30-day return policy</p>
        </div>
        <div className="trust-item">
          <div className="trust-icon"><ShieldCheck size={28} /></div>
          <h3 className="trust-title">Secure Checkout</h3>
          <p className="trust-text">100% protected payments</p>
        </div>
        <div className="trust-item">
          <div className="trust-icon"><Star size={28} /></div>
          <h3 className="trust-title">Premium Quality</h3>
          <p className="trust-text">Crafted with care</p>
        </div>
      </div>
    </section>
  );

  const Testimonials = () => (
    <section className="section" style={{backgroundColor: 'var(--bg-soft)'}}>
      <div className="container">
        <h2 className="section-title" style={{textAlign: 'center', marginBottom: '4rem'}}>What Our Customers Say</h2>
        <div style={{display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center'}}>
          {[
            { name: "Emma Thompson", role: "Verified Buyer", text: "The quality of the silk dress is absolutely unmatched. It drapes beautifully and the customer service was exceptional. I'll definitely be ordering again for my upcoming events.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
            { name: "Sophie Chen", role: "Verified Buyer", text: "AURA has completely transformed my everyday wardrobe. The linen trousers are my new go-to. They are so breathable and elegant. Highly recommend their new spring collection!", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
            { name: "Olivia Rodriguez", role: "Verified Buyer", text: "I was hesitant to buy shoes online, but the leather ankle boots fit like a glove. The sizing guide was perfectly accurate and the packaging felt incredibly premium.", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" }
          ].map((review, i) => (
            <div key={i} style={{flex: '1', minWidth: '300px', backgroundColor: 'white', padding: '2.5rem', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)'}}>
              <div className="stars" style={{marginBottom: '1.5rem'}}><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
              <p style={{fontSize: '1.05rem', fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6'}}>"{review.text}"</p>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <img src={review.img} alt={review.name} style={{width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover'}} />
                <div>
                  <h4 style={{margin: '0', fontSize: '1rem'}}>{review.name}</h4>
                  <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>{review.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const ProductCard = ({ product }) => (
    <div className="product-card">
      <div className="product-image-container" onClick={() => viewProduct(product)} style={{cursor: 'pointer'}}>
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="product-actions" onClick={(e) => e.stopPropagation()}>
          <button className="action-btn" onClick={() => toggleWishlist(product.id)}>
            <Heart size={20} fill={wishlist.includes(product.id) ? "currentColor" : "none"} color={wishlist.includes(product.id) ? "#e74c3c" : "currentColor"} />
          </button>
          <button className="action-btn" onClick={() => addToCart(product, 1, product.size[0])}>
            <ShoppingBag size={20} />
          </button>
          <button className="action-btn" onClick={() => viewProduct(product)}>
            <Search size={20} />
          </button>
        </div>
      </div>
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name" onClick={() => viewProduct(product)} style={{cursor: 'pointer'}}>{product.name}</h3>
        <div className="product-price">
          {product.oldPrice && <span className="product-old-price">${product.oldPrice}</span>}
          <span className={product.oldPrice ? "sale" : ""}>${product.price}</span>
        </div>
      </div>
    </div>
  );

  const Shop = ({ title = "New Arrivals", subtitle = "Curated styles for the season" }) => (
    <section id="shop" className="section container">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
      </div>
      
      <div className="shop-layout">
        <aside className="filters-sidebar">
          <div className="filter-group">
            <h4 className="filter-title">Category</h4>
            <div className="filter-list">
              {['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'].map(cat => (
                <div key={cat} className={`filter-item ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
                  <div className="filter-checkbox">{activeCategory === cat && <div style={{width: '10px', height: '10px', backgroundColor: 'var(--primary-color)'}}></div>}</div>
                  {cat}
                </div>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <h4 className="filter-title">Color</h4>
            <div className="filter-color-grid">
              {['All', 'Black', 'White', 'Beige', 'Blue'].map(col => (
                <div 
                  key={col} 
                  className={`color-swatch ${activeColor === col ? 'active' : ''}`}
                  style={{
                    backgroundColor: col === 'All' ? '#eee' : col.toLowerCase(),
                    border: col === 'All' && activeColor !== 'All' ? '1px solid #ccc' : ''
                  }}
                  title={col}
                  onClick={() => setActiveColor(col)}
                >
                  {col === 'All' && <span style={{fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>All</span>}
                </div>
              ))}
            </div>
          </div>
        </aside>
        
        <div className="products-main">
          <div className="products-header">
            <span>Showing {filteredProducts.length} results</span>
            <select className="sort-select">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
          
          <div className="grid">
            {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>
    </section>
  );

  const ProductDetail = ({ product }) => {
    const [selectedSize, setSelectedSize] = useState(product.size[0]);
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState('desc'); // desc, shipping, reviews

    if (!product) return null;

    return (
      <div className="product-detail container">
        <div className="product-detail-layout">
          <div className="product-gallery">
            <div className="product-thumbnails">
              <div className="thumbnail active">
                <img src={product.image} alt="thumb 1" />
              </div>
              <div className="thumbnail">
                <img src={product.image} alt="thumb 2" style={{opacity: 0.7}} />
              </div>
            </div>
            <div className="main-image">
              <img src={product.image} alt={product.name} />
            </div>
          </div>
          
          <div className="product-info-detail">
            <div className="product-meta">
              <span className="product-category">{product.category}</span>
              <div className="reviews-summary">
                <div className="stars">
                  <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
                </div>
                <span>(128 Reviews)</span>
              </div>
            </div>
            
            <h1 className="product-detail-title">{product.name}</h1>
            <div className="product-detail-price">
              {product.oldPrice && <span className="product-old-price" style={{fontSize: '1.2rem'}}>${product.oldPrice}</span>}
              <span className={product.oldPrice ? "sale" : ""}>${product.price}</span>
            </div>
            
            <p className="product-description">
              Elevate your wardrobe with this exquisite piece. Designed with meticulous attention to detail and crafted from premium materials to ensure both comfort and style. Perfect for both casual outings and sophisticated evening events.
            </p>
            
            <div className="selector-group">
              <div className="selector-header">
                <span style={{fontWeight: 500}}>Size</span>
                <span className="size-guide">Size Guide</span>
              </div>
              <div className="size-grid">
                {product.size.map(s => (
                  <button 
                    key={s} 
                    className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="add-to-cart-group">
              <div className="quantity-selector">
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={16} /></button>
                <div className="qty-value">{qty}</div>
                <button className="qty-btn" onClick={() => setQty(qty + 1)}><Plus size={16} /></button>
              </div>
              <button className="btn btn-primary btn-add-cart" onClick={() => addToCart(product, qty, selectedSize)}>
                Add to Cart
              </button>
              <button 
                className={`btn-wishlist ${wishlist.includes(product.id) ? 'active' : ''}`}
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart size={24} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
              </button>
            </div>
            
            <div className="accordion">
              <div className={`accordion-item ${activeTab === 'desc' ? 'active' : ''}`}>
                <div className="accordion-header" onClick={() => setActiveTab(activeTab === 'desc' ? '' : 'desc')} style={{cursor: 'pointer'}}>
                  <span>Product Details</span>
                  {activeTab === 'desc' ? <Minus size={18}/> : <Plus size={18}/>}
                </div>
                <div className="accordion-content">
                  <ul>
                    <li>Premium imported fabric</li>
                    <li>Tailored fit</li>
                    <li>Dry clean only</li>
                    <li>Model is 5'9" and wearing size S</li>
                  </ul>
                </div>
              </div>
              <div className={`accordion-item ${activeTab === 'shipping' ? 'active' : ''}`}>
                <div className="accordion-header" onClick={() => setActiveTab(activeTab === 'shipping' ? '' : 'shipping')} style={{cursor: 'pointer'}}>
                  <span>Shipping & Returns</span>
                  {activeTab === 'shipping' ? <Minus size={18}/> : <Plus size={18}/>}
                </div>
                <div className="accordion-content">
                  <p>Free standard shipping on orders over $150. Express shipping available at checkout. Easy 30-day returns for unworn items with tags attached.</p>
                </div>
              </div>
              <div className={`accordion-item ${activeTab === 'reviews' ? 'active' : ''}`}>
                <div className="accordion-header" onClick={() => setActiveTab(activeTab === 'reviews' ? '' : 'reviews')} style={{cursor: 'pointer'}}>
                  <span>Customer Reviews (3)</span>
                  {activeTab === 'reviews' ? <Minus size={18}/> : <Plus size={18}/>}
                </div>
                <div className="accordion-content">
                  <div style={{marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)'}}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '0.5rem'}}>
                      <div className="stars" style={{marginRight: '0.5rem'}}><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
                      <span style={{fontWeight: 500, fontSize: '0.9rem'}}>Sarah M.</span>
                    </div>
                    <p style={{fontSize: '0.9rem'}}>Absolutely love the fit and the material. Looks exactly like the picture!</p>
                  </div>
                  <div style={{marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)'}}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '0.5rem'}}>
                      <div className="stars" style={{marginRight: '0.5rem'}}><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} color="var(--border-color)" /></div>
                      <span style={{fontWeight: 500, fontSize: '0.9rem'}}>Jessica T.</span>
                    </div>
                    <p style={{fontSize: '0.9rem'}}>Great quality, but runs a little small. I recommend sizing up.</p>
                  </div>
                  <div>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '0.5rem'}}>
                      <div className="stars" style={{marginRight: '0.5rem'}}><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
                      <span style={{fontWeight: 500, fontSize: '0.9rem'}}>Emily R.</span>
                    </div>
                    <p style={{fontSize: '0.9rem'}}>Beautiful piece. I wore it to an event and got so many compliments.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recommendations */}
        <div className="section" style={{paddingTop: '6rem'}}>
          <h2 className="section-title" style={{textAlign: 'center', marginBottom: '3rem'}}>You May Also Like</h2>
          <div className="grid">
            {PRODUCTS.filter(p => p.id !== product.id).slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>
    );
  };

  const CartSlideOver = () => (
    <>
      <div className={`overlay ${isCartOpen ? 'active' : ''}`} onClick={() => setIsCartOpen(false)}></div>
      <div className={`slide-over ${isCartOpen ? 'active' : ''}`}>
        <div className="slide-header">
          <h2 className="slide-title">Your Cart ({cartCount})</h2>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}><X size={24} /></button>
        </div>
        
        {cartTotal > 0 && (
          <div style={{padding: '1.5rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-alt)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500}}>
              <span>{cartTotal >= 150 ? 'You have free shipping!' : `$${(150 - cartTotal).toFixed(2)} away from Free Shipping`}</span>
            </div>
            <div style={{width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden'}}>
              <div style={{height: '100%', backgroundColor: cartTotal >= 150 ? 'var(--success-color)' : 'var(--primary-color)', width: `${Math.min(100, (cartTotal / 150) * 100)}%`, transition: 'width 0.3s ease'}}></div>
            </div>
          </div>
        )}

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-state">
              <ShoppingBag size={48} className="empty-icon" />
              <h3>Your cart is empty</h3>
              <p style={{marginTop: '1rem', marginBottom: '2rem'}}>Looks like you haven't added anything yet.</p>
              <button className="btn btn-primary" onClick={() => {setIsCartOpen(false); goHome(); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });}}>Start Shopping</button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div className="cart-item" key={`${item.id}-${item.size}-${idx}`}>
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h4 className="cart-item-title">{item.name}</h4>
                  <div className="cart-item-meta">Size: {item.size} | Color: {item.color}</div>
                  <div className="cart-item-price">${item.price}</div>
                  <div className="cart-item-actions">
                    <div className="cart-qty">
                      <button className="cart-qty-btn" onClick={() => updateQuantity(item.id, item.size, -1)}><Minus size={14} /></button>
                      <div className="cart-qty-val">{item.quantity}</div>
                      <button className="cart-qty-btn" onClick={() => updateQuantity(item.id, item.size, 1)}><Plus size={14} /></button>
                    </div>
                    <button className="cart-remove" onClick={() => removeFromCart(item.id, item.size)}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-line">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-line">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="cart-total">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary btn-checkout" onClick={() => { setCurrentView('checkout'); setIsCartOpen(false); window.scrollTo(0,0); }}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );

  const SearchOverlay = () => (
    <div className={`search-overlay ${isSearchOpen ? 'active' : ''}`}>
      <div className="search-container">
        <button className="close-btn search-close" onClick={() => setIsSearchOpen(false)}><X size={28} /></button>
        <div className="search-input-wrapper">
          <Search size={24} className="search-icon" />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search for products, categories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus={isSearchOpen}
          />
        </div>
        {!searchQuery ? (
          <div style={{marginTop: '3rem'}}>
            <h4 style={{marginBottom: '1rem', color: 'var(--text-secondary)'}}>Trending Searches</h4>
            <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
              {['Blazer', 'Silk Dress', 'Linen Trousers', 'Leather Boots'].map(term => (
                <button key={term} style={{padding: '0.5rem 1rem', border: '1px solid var(--border-color)', borderRadius: '20px', fontSize: '0.9rem'}} onClick={() => setSearchQuery(term)}>
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="search-results">
            {PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
              <div className="search-suggestion" key={p.id} onClick={() => { viewProduct(p); setIsSearchOpen(false); setSearchQuery(''); }}>
                <img src={p.image} alt={p.name} style={{width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px'}} />
                <div>
                  <div style={{fontWeight: 500}}>{p.name}</div>
                  <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>${p.price}</div>
                </div>
              </div>
            ))}
            {PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
               <div style={{padding: '2rem 0', color: 'var(--text-secondary)'}}>No products found matching "{searchQuery}"</div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const Footer = () => (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">AURA.</div>
            <p className="footer-text">Elevating everyday style with premium quality pieces designed for the modern, confident woman.</p>
            <div className="social-links">
              {/* Mock Social Icons */}
              <a href="#" className="social-link">In</a>
              <a href="#" className="social-link">Fb</a>
              <a href="#" className="social-link">Tw</a>
              <a href="#" className="social-link">Pi</a>
            </div>
          </div>
          <div>
            <h4 className="footer-title">Shop</h4>
            <div className="footer-links">
              <a href="#">New Arrivals</a>
              <a href="#">Bestsellers</a>
              <a href="#">Clothing</a>
              <a href="#">Accessories</a>
              <a href="#">Sale</a>
            </div>
          </div>
          <div>
            <h4 className="footer-title">Help</h4>
            <div className="footer-links">
              <a href="#">Contact Us</a>
              <a href="#">FAQ</a>
              <a href="#">Shipping & Returns</a>
              <a href="#">Track Order</a>
              <a href="#">Size Guide</a>
            </div>
          </div>
          <div>
            <h4 className="footer-title">Newsletter</h4>
            <p className="footer-text" style={{marginBottom: '1rem'}}>Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" className="newsletter-input" required />
              <button type="submit" className="newsletter-btn">SUBSCRIBE</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <div>&copy; 2026 AURA Fashion. All rights reserved.</div>
          <div className="payment-methods">
            <CreditCard size={24} />
            {/* Additional payment icons would go here */}
            <span>Secure Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );

  const WishlistSlideOver = () => (
    <>
      <div className={`overlay ${isWishlistOpen ? 'active' : ''}`} onClick={() => setIsWishlistOpen(false)}></div>
      <div className={`slide-over ${isWishlistOpen ? 'active' : ''}`}>
        <div className="slide-header">
          <h2 className="slide-title">Your Wishlist ({wishlist.length})</h2>
          <button className="close-btn" onClick={() => setIsWishlistOpen(false)}><X size={24} /></button>
        </div>
        
        <div className="cart-items">
          {wishlist.length === 0 ? (
            <div className="empty-state">
              <Heart size={48} className="empty-icon" />
              <h3>Your wishlist is empty</h3>
              <p style={{marginTop: '1rem', marginBottom: '2rem'}}>Save items you love here.</p>
              <button className="btn btn-primary" onClick={() => {setIsWishlistOpen(false); goHome(); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });}}>Start Shopping</button>
            </div>
          ) : (
            wishlist.map((id) => {
              const item = PRODUCTS.find(p => p.id === id);
              if (!item) return null;
              return (
                <div className="cart-item" key={`wishlist-${item.id}`}>
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h4 className="cart-item-title">{item.name}</h4>
                    <div className="cart-item-price">${item.price}</div>
                    <div className="cart-item-actions" style={{marginTop: '1rem'}}>
                      <button className="btn btn-primary" style={{padding: '0.5rem 1rem', fontSize: '0.8rem'}} onClick={() => { addToCart(item, 1, item.size[0]); toggleWishlist(item.id); }}>Add to Cart</button>
                      <button className="cart-remove" onClick={() => toggleWishlist(item.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );

  const AccountModal = () => (
    <>
      <div className={`overlay ${isAccountOpen ? 'active' : ''}`} onClick={() => setIsAccountOpen(false)} style={{backdropFilter: 'blur(5px)'}}></div>
      <div className={`auth-modal ${isAccountOpen ? 'active' : ''}`} style={{
        position: 'fixed',
        top: '50%', left: '50%', 
        transform: isAccountOpen ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -45%) scale(0.95)', 
        width: '100%', maxWidth: '420px', 
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        padding: '2.5rem', 
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        opacity: isAccountOpen ? 1 : 0,
        visibility: isAccountOpen ? 'visible' : 'hidden',
        pointerEvents: isAccountOpen ? 'auto' : 'none',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 1005,
        border: '1px solid rgba(0,0,0,0.05)'
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 600, letterSpacing: '-0.5px', margin: 0 }}>
            {currentUser ? 'My Account' : (isLoginView ? 'Welcome Back' : 'Create Account')}
          </h2>
          <button className="close-btn" onClick={() => setIsAccountOpen(false)} style={{
            background: 'var(--bg-alt)', borderRadius: '50%', padding: '8px', display: 'flex', transition: 'background 0.2s'
          }}>
            <X size={20} />
          </button>
        </div>
        
        {currentUser ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 600, margin: '0 auto 1.5rem' 
            }}>
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>{currentUser.name}</h3>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>{currentUser.email}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <button className="btn btn-secondary" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px' }}>My Orders</button>
              <button className="btn btn-secondary" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px' }}>Account Settings</button>
            </div>
            
            <button className="btn btn-primary" style={{width: '100%', borderRadius: '8px', padding: '1rem'}} onClick={() => { setCurrentUser(null); setIsAccountOpen(false); }}>
              Log Out
            </button>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
              {isLoginView ? 'Enter your details to access your account.' : 'Join AURA to discover premium fashion.'}
            </p>
            <form onSubmit={handleAuthSubmit}>
              {!isLoginView && (
                <div style={{marginBottom: '1.2rem'}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)'}}>Full Name</label>
                  <input type="text" value={authFormData.name} onChange={(e) => setAuthFormData({...authFormData, name: e.target.value})} 
                    style={{width: '100%', padding: '0.9rem', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-alt)', outline: 'none', transition: 'border-color 0.2s'}} 
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                    required={!isLoginView} placeholder="Jane Doe" 
                  />
                </div>
              )}
              <div style={{marginBottom: '1.2rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)'}}>Email Address</label>
                <input type="email" value={authFormData.email} onChange={(e) => setAuthFormData({...authFormData, email: e.target.value})} 
                  style={{width: '100%', padding: '0.9rem', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-alt)', outline: 'none', transition: 'border-color 0.2s'}} 
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                  required placeholder="jane@example.com" 
                />
              </div>
              <div style={{marginBottom: '1.5rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)'}}>Password</label>
                  {isLoginView && <a href="#" style={{fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'underline'}}>Forgot?</a>}
                </div>
                <input type="password" value={authFormData.password} onChange={(e) => setAuthFormData({...authFormData, password: e.target.value})} 
                  style={{width: '100%', padding: '0.9rem', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-alt)', outline: 'none', transition: 'border-color 0.2s'}} 
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                  required placeholder="••••••••" 
                />
              </div>
              
              <button type="submit" className="btn btn-primary" style={{width: '100%', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', fontWeight: 600, letterSpacing: '0.5px'}}>
                {isLoginView ? 'Sign In' : 'Create Account'}
              </button>
              
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '1.5rem'}}>
                <div style={{flex: 1, height: '1px', backgroundColor: 'var(--border-color)'}}></div>
                <span style={{padding: '0 10px', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase'}}>Or continue with</span>
                <div style={{flex: 1, height: '1px', backgroundColor: 'var(--border-color)'}}></div>
              </div>
              
              <button type="button" style={{
                width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', 
                backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                fontWeight: 500, transition: 'background 0.2s', cursor: 'pointer'
              }} onMouseOver={(e) => e.target.style.backgroundColor = 'var(--bg-alt)'} onMouseOut={(e) => e.target.style.backgroundColor = 'white'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.37 10H12V14.26H17.93C17.67 15.63 16.89 16.8 15.73 17.58V20.35H19.28C21.36 18.44 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                  <path d="M12 23C14.97 23 17.46 22.02 19.28 20.35L15.73 17.58C14.74 18.24 13.48 18.65 12 18.65C9.13 18.65 6.7 16.71 5.82 14.11H2.17V16.94C4.01 20.6 7.73 23 12 23Z" fill="#34A853"/>
                  <path d="M5.82 14.11C5.59 13.44 5.46 12.74 5.46 12C5.46 11.26 5.59 10.56 5.82 9.89V7.06H2.17C1.41 8.57 1 10.24 1 12C1 13.76 1.41 15.43 2.17 16.94L5.82 14.11Z" fill="#FBBC05"/>
                  <path d="M12 5.35C13.62 5.35 15.06 5.91 16.21 7.01L19.36 3.86C17.45 2.08 14.97 1 12 1C7.73 1 4.01 3.4 2.17 7.06L5.82 9.89C6.7 7.29 9.13 5.35 12 5.35Z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </form>
            <div style={{marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>
              {isLoginView ? "Don't have an account? " : "Already have an account? "}
              <button style={{color: 'var(--primary-color)', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline'}} onClick={(e) => { e.preventDefault(); setIsLoginView(!isLoginView); }}>
                {isLoginView ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );

  const CheckoutPage = () => {
    const shippingCost = cartTotal >= 150 ? 0 : 15;
    const finalTotal = cartTotal + shippingCost;
    
    return (
      <div className="container" style={{paddingTop: '120px', paddingBottom: '4rem', minHeight: '80vh'}}>
        <h1 className="section-title" style={{marginBottom: '2rem'}}>Checkout</h1>
        
        {cart.length === 0 ? (
          <div style={{textAlign: 'center', padding: '4rem 0'}}>
            <ShoppingBag size={48} style={{color: 'var(--text-secondary)', marginBottom: '1rem'}} />
            <h2>Your cart is empty</h2>
            <p style={{color: 'var(--text-secondary)', marginBottom: '2rem'}}>You need items in your cart to proceed to checkout.</p>
            <button className="btn btn-primary" onClick={goHome}>Return to Shop</button>
          </div>
        ) : (
          <div style={{display: 'flex', gap: '3rem', flexWrap: 'wrap'}}>
            <div style={{flex: '1 1 600px'}}>
              <div style={{backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '2rem'}}>
                <h3 style={{marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem'}}>Shipping Information</h3>
                <form>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem'}}>First Name</label>
                      <input type="text" style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '4px'}} required />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem'}}>Last Name</label>
                      <input type="text" style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '4px'}} required />
                    </div>
                  </div>
                  <div style={{marginBottom: '1rem'}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem'}}>Address</label>
                    <input type="text" style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '4px'}} required />
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '2rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem'}}>City</label>
                      <input type="text" style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '4px'}} required />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem'}}>State</label>
                      <input type="text" style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '4px'}} required />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem'}}>ZIP Code</label>
                      <input type="text" style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '4px'}} required />
                    </div>
                  </div>
                  
                  <h3 style={{marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem'}}>Payment Details</h3>
                  <div style={{marginBottom: '1rem'}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem'}}>Card Number</label>
                    <input type="text" placeholder="XXXX XXXX XXXX XXXX" style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '4px'}} required />
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem'}}>Expiry Date</label>
                      <input type="text" placeholder="MM/YY" style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '4px'}} required />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem'}}>CVC</label>
                      <input type="text" placeholder="XXX" style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '4px'}} required />
                    </div>
                  </div>
                  
                  <button type="button" className="btn btn-primary" style={{width: '100%', padding: '1.2rem'}} onClick={async () => {
                    try {
                      const res = await fetch('http://localhost:5000/api/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ items: cart, shipping: shippingCost, total: finalTotal })
                      });
                      const data = await res.json();
                      if (data.success) {
                        alert(`Payment processed successfully! Order ID: ${data.orderId}`);
                        setCart([]);
                        goHome();
                      }
                    } catch (err) {
                      alert('Error processing payment. Please try again.');
                    }
                  }}>
                    Proceed to Pay ${finalTotal.toFixed(2)}
                  </button>
                </form>
              </div>
            </div>
            
            <div style={{flex: '1 1 350px'}}>
              <div style={{backgroundColor: 'var(--bg-alt)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-color)', position: 'sticky', top: '100px'}}>
                <h3 style={{marginBottom: '1.5rem'}}>Order Summary</h3>
                <div style={{maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem'}}>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                      <img src={item.image} alt={item.name} style={{width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px'}} />
                      <div>
                        <div style={{fontWeight: 500, fontSize: '0.9rem'}}>{item.name}</div>
                        <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>Size: {item.size} | Qty: {item.quantity}</div>
                        <div style={{fontWeight: 500, marginTop: '0.5rem'}}>${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{borderTop: '1px solid var(--border-color)', paddingTop: '1rem'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem'}}>
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app-wrapper">
      <Navbar />
      
      {currentView === 'home' ? (
        <>
          <Hero />
          <TrustSignals />
          <Testimonials />
          <Shop />
        </>
      ) : currentView === 'product' ? (
        <ProductDetail product={selectedProduct} />
      ) : currentView === 'checkout' ? (
        <CheckoutPage />
      ) : (
        <div style={{ paddingTop: '80px', paddingBottom: '4rem', minHeight: '80vh' }}>
          <Shop 
            title={
              currentView === 'new_in' ? 'New In' : 
              currentView === 'sale' ? 'Sale' : 
              currentView.charAt(0).toUpperCase() + currentView.slice(1)
            } 
            subtitle={`Explore our collection of ${currentView.replace('_', ' ')}`} 
          />
        </div>
      )}
      
      <Footer />
      
      <CartSlideOver />
      <SearchOverlay />
      <WishlistSlideOver />
      <AccountModal />
    </div>
  );
}
