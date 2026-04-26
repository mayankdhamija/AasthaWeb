import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import { ShoppingBag, Menu, X, ShoppingCart, ArrowRight, Heart, ChevronLeft, ChevronRight, Camera, MessageCircle } from 'lucide-react'
import './App.css'

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  availableSizes: string[];
  category: string;
  stock: { [size: string]: number };
}

interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

const carouselItems = [
  {
    title: "Summer 2026 Collection",
    subtitle: "REDEFINE YOUR STYLE",
    description: "Premium Western wear designed for the bold and the beautiful.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&auto=format&fit=crop&q=80",
    color: "bg-slate-100"
  },
  {
    title: "New Arrivals",
    subtitle: "URBAN ESSENTIALS",
    description: "Discover the latest trends in streetwear and casual elegance.",
    image: "https://images.unsplash.com/photo-1529139513477-3235a14a1392?w=1600&auto=format&fit=crop&q=80",
    color: "bg-rose-50"
  },
  {
    title: "Evening Gala",
    subtitle: "NIGHT OUT SPECIALS",
    description: "Exquisite gowns and sharp blazers for your special occasions.",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1600&auto=format&fit=crop&q=80",
    color: "bg-slate-200"
  }
];

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'home' | 'shop' | 'cart'>('home');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchProducts();
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    getDocs(collection(db, 'products'))
      .then(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Product));
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching products", error);
        setLoading(false);
      });
  };

  const addToCart = (product: Product, size: string) => {
    const stockForSize = product.stock?.[size] ?? 0;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size);
      const currentQty = existing ? existing.quantity : 0;
      if (currentQty >= stockForSize) return prev; // can't exceed stock
      if (existing) {
        return prev.map(item => (item.id === product.id && item.selectedSize === size) ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size }];
    });
  };

  const removeFromCart = (id: number, size: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const filteredProducts = categoryFilter === 'All' ? products : products.filter(p => p.category === categoryFilter);
  const newArrivals = products.filter(p => p.category === 'Streetwear' || p.category === 'Casual').slice(0, 4);

  const handleCheckout = () => {
    const phoneNumber = "919352617073"; 
    const message = `*New Order from Aastha Fashion*%0A%0A` + 
      cart.map(item => `• ${item.name} (${item.selectedSize}) (x${item.quantity}) - ₹${(item.price * item.quantity).toLocaleString()}`).join('%0A') +
      `%0A%0A*Total: ₹${cartTotal.toLocaleString()}*%0A%0A_Please confirm my order._`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 
              onClick={() => { setView('home'); setCategoryFilter('All'); }}
              className="text-2xl font-black tracking-tighter cursor-pointer text-black"
            >
              AASTHA <span className="text-rose-600">FASHION</span>
            </h1>
            <div className="hidden md:flex gap-6 text-sm font-semibold uppercase tracking-wider text-slate-500">
              <button onClick={() => { setView('shop'); setCategoryFilter('All'); }} className="hover:text-black transition-colors">Shop All</button>
              <button onClick={() => { setView('shop'); setCategoryFilter('Streetwear'); }} className="hover:text-black transition-colors">New Arrivals</button>
              <button onClick={() => { setView('shop'); setCategoryFilter('Evening'); }} className="hover:text-black transition-colors">Evening Wear</button>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="hidden sm:block hover:text-rose-600 transition-colors"><Heart size={22} /></button>
            <button 
              onClick={() => setView('cart')}
              className="relative p-2 hover:bg-slate-50 rounded-full transition-colors"
            >
              <ShoppingCart size={22} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Content Rendering */}
      <div className="pt-20">
        {view === 'home' && (
          <>
            {/* Carousel Hero Section */}
            <div className="relative h-[80vh] w-full overflow-hidden bg-slate-100">
              {carouselItems.map((item, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 flex items-center ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  <div className="absolute inset-0 bg-black/10 z-[5]"></div>
                  <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                  
                  <div className="relative z-10 px-4 md:px-20 max-w-2xl text-white">
                    <span className="inline-block px-3 py-1 bg-rose-600 text-white text-xs font-bold tracking-widest uppercase mb-4">{item.title}</span>
                    <h2 className="text-6xl md:text-8xl font-black leading-none mb-6 drop-shadow-lg">{item.subtitle}</h2>
                    <p className="text-white/90 text-lg mb-8 drop-shadow-md">{item.description}</p>
                    <button 
                      onClick={() => setView('shop')}
                      className="group bg-white text-black px-8 py-4 flex items-center gap-3 font-bold hover:bg-rose-600 hover:text-white transition-all shadow-xl"
                    >
                      SHOP THE COLLECTION <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => setCurrentSlide((prev) => (prev + 1) % carouselItems.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all"
              >
                <ChevronRight size={24} />
              </button>
              
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {carouselItems.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? 'bg-rose-600 w-8' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>

            <section className="py-24 px-4 max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tight">New Arrivals</h3>
                  <p className="text-slate-500 mt-2">Fresh drops from our latest western collection.</p>
                </div>
                <button 
                  onClick={() => { setView('shop'); setCategoryFilter('Streetwear'); }}
                  className="text-sm font-bold border-b-2 border-black pb-1 hover:text-rose-600 hover:border-rose-600 transition-all"
                >
                  EXPLORE ALL
                </button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                  [1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-slate-100 animate-pulse"></div>)
                ) : (
                  newArrivals.map(product => (
                    <ProductCard key={product.id} product={product} onAdd={addToCart} />
                  ))
                )}
              </div>
            </section>

            <section className="bg-black text-white py-16 px-4 mb-24">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div>
                  <h3 className="text-3xl font-black mb-2">JOIN THE FASHION CLUB</h3>
                  <p className="text-slate-400 font-medium">Get 15% off your first order and exclusive access to new drops.</p>
                </div>
                <div className="flex w-full md:w-auto">
                  <input type="email" placeholder="ENTER YOUR EMAIL" className="bg-slate-900 border border-slate-800 px-6 py-4 w-full md:w-80 font-bold focus:outline-none focus:border-rose-600 transition-colors" />
                  <button className="bg-rose-600 px-8 py-4 font-black hover:bg-rose-700 transition-colors">JOIN</button>
                </div>
              </div>
            </section>
          </>
        )}

        {view === 'shop' && (
          <section className="py-12 px-4 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
              <h3 className="text-4xl font-black uppercase tracking-tighter">
                {categoryFilter === 'All' ? 'Complete' : categoryFilter} Collection
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {['All', 'Streetwear', 'Evening', 'Workwear', 'Casual'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${categoryFilter === cat ? 'bg-black text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-[3/4] bg-slate-100 animate-pulse rounded-sm"></div>)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} onAdd={addToCart} />
                ))}
              </div>
            )}
          </section>
        )}

        {view === 'cart' && (
          <section className="py-12 px-4 max-w-3xl mx-auto min-h-[60vh]">
            <h3 className="text-4xl font-black uppercase mb-12 tracking-tighter">Your Shopping Bag</h3>
            {cart.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 rounded-2xl">
                <ShoppingBag size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500 font-bold mb-6 tracking-wide">Your bag is empty.</p>
                <button onClick={() => setView('shop')} className="bg-black text-white px-8 py-3 font-bold hover:bg-rose-600 transition-colors">START SHOPPING</button>
              </div>
            ) : (
              <div className="space-y-8">
                {cart.map(item => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-6 items-center border-b border-slate-100 pb-8">
                    <img src={item.imageUrls[0]} alt={item.name} className="w-24 h-32 object-cover bg-slate-100 rounded-sm" />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg uppercase tracking-tight leading-tight mb-1">{item.name}</h4>
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{item.category}</p>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest">Size: {item.selectedSize}</p>
                      </div>
                      <p className="font-black text-black">₹{item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => {
                            if (item.quantity > 1) {
                              setCart(prev => prev.map(i => (i.id === item.id && i.selectedSize === item.selectedSize) ? { ...i, quantity: i.quantity - 1 } : i))
                            } else {
                              removeFromCart(item.id, item.selectedSize)
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full font-bold transition-colors"
                        >-</button>
                        <span className="font-bold w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => setCart(prev => prev.map(i => (i.id === item.id && i.selectedSize === item.selectedSize) ? { ...i, quantity: i.quantity + 1 } : i))}
                          disabled={item.quantity >= (item.stock?.[item.selectedSize] ?? 0)}
                          className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id, item.selectedSize)} className="text-slate-300 hover:text-rose-600 transition-colors"><X size={20} /></button>
                    </div>
                  </div>
                ))}
                <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div>
                    <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1">Total Amount Due</p>
                    <p className="text-4xl font-black tracking-tighter">₹{cartTotal.toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full sm:w-auto bg-[#25D366] text-white px-12 py-5 font-black hover:bg-[#128C7E] transition-all uppercase tracking-widest text-sm shadow-2xl flex items-center justify-center gap-2"
                  >
                    Order on WhatsApp
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black text-white pt-24 pb-12 px-4 mt-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-slate-800 pb-16">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-black tracking-tighter mb-6 uppercase">AASTHA FASHION</h1>
            <p className="text-slate-400 max-w-sm leading-relaxed font-medium">Elevating your everyday wardrobe with premium quality western wear that combines comfort with avant-garde design. From the streets to the gala, we have you covered.</p>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-rose-600">Customer Care</h4>
            <ul className="text-slate-400 space-y-4 text-sm font-medium uppercase tracking-wide">
              <li><a href="#" className="hover:text-white transition-colors">Order Tracking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping & Delivery</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-rose-600">Contact Us</h4>
            <ul className="text-slate-400 space-y-4 text-sm font-medium uppercase tracking-wide">
              <li><a href="mailto:info@aasthafashion.com" className="hover:text-white transition-colors">info@aasthafashion.com</a></li>
              <li>
                <a href="https://wa.me/919352617073" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#25D366] transition-colors">
                  <MessageCircle size={16} /> +91 93526 17073
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/aastha_fashion.06?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-rose-400 transition-colors">
                  <Camera size={16} /> @aastha_fashion.06
                </a>
              </li>
              <li>Mumbai, India</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
          <p>© 2026 AASTHA FASHION RETAIL LTD.</p>
          <p>MADE FOR THE MODERN WOMAN</p>
        </div>
      </footer>
    </div>
  )
}

function ProductCard({ product, onAdd }: { product: Product, onAdd: (p: Product, size: string) => void }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const urls = product.imageUrls || [];

  const isFullyOutOfStock = product.availableSizes?.every(size => (product.stock?.[size] ?? 0) === 0);
  const isSizeOutOfStock = (size: string) => (product.stock?.[size] ?? 0) === 0;

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (urls.length > 0) {
      setCurrentImgIndex((prev) => (prev + 1) % urls.length);
    }
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (urls.length > 0) {
      setCurrentImgIndex((prev) => (prev - 1 + urls.length) % urls.length);
    }
  };

  return (
    <div className="group relative">
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 mb-5 rounded-sm">
        {/* Product Photo Carousel */}
        <div className="w-full h-full relative">
          {urls.length > 0 ? urls.map((url, idx) => (
            <img 
              key={idx}
              src={url} 
              alt={`${product.name} ${idx}`} 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${idx === currentImgIndex ? 'opacity-100' : 'opacity-0'}`}
            />
          )) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold uppercase text-xs">No Image</div>
          )}
          
          {/* Controls visible on hover */}
          {urls.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <button onClick={prevImg} className="p-1 bg-white/50 backdrop-blur-md rounded-full hover:bg-white text-black transition-all shadow-sm">
                <ChevronLeft size={16} />
              </button>
              <button onClick={nextImg} className="p-1 bg-white/50 backdrop-blur-md rounded-full hover:bg-white text-black transition-all shadow-sm">
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Size Overlay on Hover */}
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <p className="text-white text-[10px] font-black tracking-widest uppercase">Select Size</p>
            <div className="flex flex-wrap justify-center gap-2 px-4">
              {product.availableSizes?.map(size => {
                const oos = isSizeOutOfStock(size);
                const stock = product.stock?.[size] ?? 0;
                return (
                  <button
                    key={size}
                    onClick={() => !oos && setSelectedSize(size)}
                    disabled={oos}
                    title={oos ? 'Out of stock' : `${stock} left`}
                    className={`w-10 h-10 flex items-center justify-center text-xs font-bold transition-all relative
                      ${oos ? 'bg-black/10 text-white/30 cursor-not-allowed line-through border border-white/10' :
                        selectedSize === size ? 'bg-white text-black scale-110' :
                        'bg-black/20 text-white hover:bg-white/40 border border-white/30'}`}
                  >
                    {size}
                    {oos && <span className="absolute inset-0 flex items-center justify-center"><span className="w-full h-[1px] bg-white/30 rotate-45 absolute"></span></span>}
                  </button>
                );
              })}
            </div>
            {selectedSize && !isSizeOutOfStock(selectedSize) && (
              <p className="text-white/70 text-[10px] font-bold tracking-widest">
                {product.stock?.[selectedSize]} left in stock
              </p>
            )}
          </div>
        </div>

        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
          <span className="bg-black text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest shadow-lg">
            {product.category}
          </span>
          {isFullyOutOfStock && (
            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest shadow-lg">
              Out of Stock
            </span>
          )}
        </div>

        <button 
          onClick={() => {
            if (selectedSize && !isSizeOutOfStock(selectedSize)) {
              onAdd(product, selectedSize);
              setSelectedSize('');
            }
          }}
          disabled={!selectedSize || isFullyOutOfStock || isSizeOutOfStock(selectedSize)}
          className={`absolute bottom-0 w-full py-5 font-black uppercase tracking-widest text-xs translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-30 
            ${isFullyOutOfStock ? 'bg-slate-600 text-slate-400 cursor-not-allowed' :
              selectedSize && !isSizeOutOfStock(selectedSize) ? 'bg-rose-600 text-white cursor-pointer' :
              'bg-slate-800 text-slate-400 cursor-not-allowed'}`}
        >
          {isFullyOutOfStock ? 'OUT OF STOCK' : selectedSize ? `ADD SIZE ${selectedSize} TO BAG` : 'SELECT A SIZE'}
        </button>
      </div>

      <div className="px-1">
        <h4 className="font-bold text-[11px] uppercase tracking-widest mb-1 text-slate-500 group-hover:text-black transition-colors leading-tight">{product.name}</h4>
        <p className="font-black text-xl tracking-tighter">₹{product.price.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default App
