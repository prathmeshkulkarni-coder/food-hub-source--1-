import { type FormEvent, type SyntheticEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowDownWideNarrow, ArrowRight, BadgeIndianRupee, Check, ChevronDown,
  Clock3, Heart, Leaf, MapPin, Menu, Minus, Plus, Search, ShieldCheck,
  ShoppingBag, ShoppingBasket, Star,
  Utensils, X,
} from 'lucide-react';

type Restaurant = {
  id: string; name: string; cuisine: string; rating: string; time: string;
  areas: string[]; image: string; tag: string;
};
type Dish = {
  id: string; name: string; category: string; price: number; description: string;
  restaurant: string[]; image: string; vegetarian: boolean;
};
type CartLine = { dishId: string; quantity: number };

const towns = ['Jalgaon', 'Pachora', 'Chalisgaon', 'Jamner', 'Bhusawal', 'Dharangaon', 'Erandol', 'Parola', 'Amalner', 'Chopda'];
const restaurants: Restaurant[] = [
  { id: 'mamata', name: 'Mamata Hotel', cuisine: 'Everyday Maharashtrian', rating: '4.6', time: '20–30 min', areas: ['Jalgaon', 'Bhusawal', 'Dharangaon'], image: 'photo-1555939594-58d7cb561ad1', tag: 'Local favourite' },
  { id: 'nana', name: 'Nana Hotel', cuisine: 'Snacks & homestyle', rating: '4.5', time: '25–35 min', areas: ['Jalgaon', 'Pachora', 'Parola'], image: 'photo-1547592180-85f173990554', tag: 'Comfort food' },
  { id: 'jagdamb', name: 'Jagdamb Hotel', cuisine: 'Thalis & curries', rating: '4.7', time: '30–40 min', areas: ['Jalgaon', 'Chalisgaon', 'Jamner'], image: 'photo-1544025162-d76694265947', tag: 'Hearty plates' },
  { id: 'shivraj', name: 'Shivraj Hotel', cuisine: 'Street-side classics', rating: '4.4', time: '20–30 min', areas: ['Bhusawal', 'Jalgaon', 'Chopda'], image: 'photo-1517248135467-4c7edcad34c4', tag: 'Quick bites' },
  { id: 'shaurya', name: 'Shaurya Vada', cuisine: 'Vada & breakfast', rating: '4.8', time: '15–25 min', areas: ['Jalgaon', 'Amalner', 'Erandol'], image: 'photo-1555396273-367ea4eb4db5', tag: 'Made for mornings' },
  { id: 'nirmal', name: 'Nirmal Hotel', cuisine: 'Classic veg meals', rating: '4.5', time: '25–35 min', areas: ['Jalgaon', 'Pachora', 'Dharangaon', 'Parola'], image: 'photo-1414235077428-338989a2e8c0', tag: 'A little of everything' },
];

const foodImages = [
  'photo-1601050690597-df0568f70950','photo-1565299624946-b28f40a0ae38','photo-1565299507177-b0ac66763828',
  'photo-1604908176997-125f25cc6f3d','photo-1512621776951-a57141f2eefd','photo-1547592180-85f173990554',
  'photo-1546069901-ba9599a7e63c','photo-1565557623262-b51c2513a641','photo-1543353071-873f17a7a088',
  'photo-1512058564366-18510be2db19','photo-1512621776951-a57141f2eefd','photo-1574484284002-952d92456975',
  'photo-1603894584373-5ac82b2ae398','photo-1547592180-85f173990554','photo-1604908176997-125f25cc6f3d',
  'photo-1601050690597-df0568f70950','photo-1565299624946-b28f40a0ae38','photo-1565299507177-b0ac66763828',
  'photo-1565299624946-b28f40a0ae38','photo-1601050690597-df0568f70950','photo-1528735602780-2552fd46c7af',
  'photo-1568901346375-23c9450c58cd','photo-1579751626657-72bc17010498','photo-1573080496219-bb080dd4f877',
  'photo-1512621776951-a57141f2eefd',
];
const dishRaw: [string, string, number, string, string[]][] = [
  ['Vada Pav','Street favourites',35,'Spiced potato fritter tucked into a soft pav.',['shaurya','shivraj']],
  ['Misal Pav','Street favourites',95,'A lively sprouted-bean curry with pav on the side.',['mamata','nana']],
  ['Pav Bhaji','Street favourites',110,'Buttery mashed vegetables with toasted pav.',['nana','shivraj']],
  ['Kanda Poha','Breakfast',55,'Fluffy flattened rice with onion, peanuts and lemon.',['shaurya','mamata']],
  ['Sabudana Khichdi','Breakfast',85,'Pearl tapioca tossed with peanuts and gentle spice.',['shaurya','nirmal']],
  ['Maharashtrian Thali','Thali & meals',220,'A generous sample plate of seasonal veg dishes and bhakri.',['jagdamb','nirmal']],
  ['Veg Thali','Thali & meals',175,'A balanced everyday plate with rice, dal and vegetables.',['mamata','nirmal']],
  ['Paneer Butter Masala','Thali & meals',190,'Soft paneer in a creamy tomato and cashew gravy.',['jagdamb','nirmal']],
  ['Dal Tadka','Thali & meals',120,'Yellow lentils finished with a fragrant tempering.',['mamata','jagdamb']],
  ['Jeera Rice','Thali & meals',95,'Steamed rice with toasted cumin and fresh herbs.',['mamata','nirmal']],
  ['Veg Biryani','Rice & biryani',165,'Aromatic rice layered with vegetables and whole spices.',['jagdamb','nirmal']],
  ['Paneer Biryani','Rice & biryani',195,'Fragrant dum-style rice with tender paneer pieces.',['jagdamb','mamata']],
  ['Pithla Bhakri','Maharashtrian',135,'Rustic chickpea-flour pithla with a soft bhakri.',['mamata','nana']],
  ['Zunka Bhakri','Maharashtrian',125,'Dry-spiced chickpea flour paired with bhakri.',['nana','mamata']],
  ['Bharli Vangi','Maharashtrian',155,'Small aubergines simmered in a peanut-sesame masala.',['mamata','jagdamb']],
  ['Samosa','Snacks',25,'Crisp pastry filled with warmly spiced potato.',['shivraj','shaurya']],
  ['Kachori','Snacks',30,'Golden flaky shell with a savoury lentil filling.',['shivraj','nana']],
  ['Onion Pakoda','Snacks',60,'Crunchy onion fritters, best with a cup of chai.',['shaurya','nana']],
  ['Bread Pakoda','Snacks',45,'Bread wrapped around spiced potato, fried crisp.',['shaurya','shivraj']],
  ['Batata Vada','Snacks',30,'A classic golden potato vada with a crisp crust.',['shaurya','shivraj']],
  ['Veg Cheese Sandwich','Quick bites',95,'Grilled vegetables and cheese between toasted bread.',['nana','shivraj']],
  ['Veg Burger','Quick bites',125,'A seasoned vegetable patty with fresh crunchy layers.',['shivraj','nirmal']],
  ['Veg Pizza','Quick bites',180,'A crisp base topped with vegetables and cheese.',['nirmal','nana']],
  ['French Fries','Quick bites',85,'Golden potato fries with a pinch of seasoning.',['shivraj','nana']],
  ['Masala Khichdi','Thali & meals',130,'Comforting rice and lentils with a warming masala.',['mamata','jagdamb']],
];
const dishes: Dish[] = dishRaw.map(([name, category, price, description, restaurant], i) => ({
  id: name.toLowerCase().replaceAll(' ', '-'), name, category, price, description,
  restaurant, image: foodImages[i], vegetarian: true,
}));
const categories = ['All favourites', 'Street favourites', 'Breakfast', 'Thali & meals', 'Maharashtrian', 'Snacks', 'Quick bites', 'Rice & biryani'];
const photo = (id: string, width = 720) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;
const money = (value: number) => `₹${value.toLocaleString('en-IN')}`;

function handleImageError(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  if (image.dataset.fallbackAttempted) {
    image.removeAttribute('src');
    image.classList.add('image-unavailable');
    return;
  }
  image.dataset.fallbackAttempted = 'true';
  image.src = photo('photo-1547592180-85f173990554', 720);
}

function App() {
  const [town, setTown] = useState('Jalgaon');
  const [dishSearch, setDishSearch] = useState('');
  const [restaurantSearch, setRestaurantSearch] = useState('');
  const [category, setCategory] = useState('All favourites');
  const [vegOnly, setVegOnly] = useState(true);
  const [sort, setSort] = useState('featured');
  const [cart, setCart] = useState<CartLine[]>(() => {
    try { return JSON.parse(localStorage.getItem('foodhub-demo-cart') || '[]') as CartLine[]; } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [formError, setFormError] = useState('');
  const [customer, setCustomer] = useState({ name: '', mobile: '', address: '', city: 'Jalgaon' });

  useEffect(() => { localStorage.setItem('foodhub-demo-cart', JSON.stringify(cart)); }, [cart]);
  const availableRestaurants = useMemo(() => restaurants.filter(r => r.areas.includes(town) && r.name.toLowerCase().includes(restaurantSearch.toLowerCase())), [town, restaurantSearch]);
  const filteredDishes = useMemo(() => {
    let result = dishes.filter(d => (!dishSearch || d.name.toLowerCase().includes(dishSearch.toLowerCase())) && (category === 'All favourites' || d.category === category) && (!vegOnly || d.vegetarian) && d.restaurant.some(id => restaurants.find(r => r.id === id)?.areas.includes(town)));
    if (sort === 'low') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'high') result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [dishSearch, category, vegOnly, sort, town]);
  const cartItems = cart.map(line => ({ ...line, dish: dishes.find(d => d.id === line.dishId) })).filter((line): line is CartLine & { dish: Dish } => Boolean(line.dish));
  const itemCount = cartItems.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cartItems.reduce((sum, line) => sum + line.dish.price * line.quantity, 0);
  const deliveryFee = itemCount ? 25 : 0;
  const total = subtotal + deliveryFee;

  function addToCart(dishId: string) {
    setCart(current => current.some(line => line.dishId === dishId)
      ? current.map(line => line.dishId === dishId ? { ...line, quantity: line.quantity + 1 } : line)
      : [...current, { dishId, quantity: 1 }]);
    setCartOpen(true);
  }
  function setQuantity(id: string, delta: number) {
    setCart(current => current.map(line => line.dishId === id ? { ...line, quantity: line.quantity + delta } : line).filter(line => line.quantity > 0));
  }
  function navigate(id: string) {
    setMobileMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!customer.name.trim() || !customer.address.trim() || !customer.city.trim()) { setFormError('Please complete each required field.'); return; }
    if (!/^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(customer.mobile.replace(/\s/g, ''))) { setFormError('Enter a valid 10-digit Indian mobile number.'); return; }
    setFormError('');
    setOrderId(`FH-${Math.floor(100000 + Math.random() * 899999)}`);
    setOrderDone(true);
    setCart([]);
  }
  function closeCheckout() { setCheckoutOpen(false); setOrderDone(false); }

  return (
    <div className="site-shell">
      <div className="demo-ribbon"><ShieldCheck size={14} /> Food Hub is a local concept. Listings, prices, ratings and coverage shown here are unverified demo information.</div>
      <header className="topbar">
        <a className="brand" href="#home" onClick={e => { e.preventDefault(); navigate('home'); }} data-testid="link-home">
          <span className="brand-mark"><Utensils size={21} /></span><span>Food<span> Hub</span></span>
        </a>
        <nav className={`nav-links ${mobileMenu ? 'nav-open' : ''}`} aria-label="Main navigation">
          <button onClick={() => navigate('restaurants')} data-testid="link-restaurants">Restaurants</button>
          <button onClick={() => navigate('menu')} data-testid="link-menu">Explore food</button>
          <button onClick={() => navigate('offers')} data-testid="link-offers">Offers</button>
          <button onClick={() => navigate('about')} data-testid="link-about">About</button>
        </nav>
        <div className="top-actions">
          <label className="location-select"><MapPin size={17} /><span className="sr-only">Choose town</span><select value={town} onChange={e => setTown(e.target.value)} data-testid="select-location">{towns.map(place => <option key={place}>{place}</option>)}</select><ChevronDown size={14} /></label>
          <button className="cart-trigger" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${itemCount} items`} data-testid="button-open-cart"><ShoppingBag size={19} /><span className="cart-trigger-label">Your basket</span><b data-testid="text-cart-count">{itemCount}</b></button>
          <button className="mobile-menu-button" aria-label={mobileMenu ? 'Close menu' : 'Open menu'} onClick={() => setMobileMenu(!mobileMenu)} data-testid="button-mobile-menu">{mobileMenu ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> YOUR NEIGHBOURHOOD, ON A PLATE</div>
            <h1>Discover Delicious<br /><em>Food Near You!</em></h1>
            <p>Explore local restaurants and enjoy your favourite food.</p>
            <div className="hero-searches">
              <label className="search-box"><Search size={19} /><input value={dishSearch} onChange={e => setDishSearch(e.target.value)} placeholder="Search a dish you love..." aria-label="Search dishes" data-testid="input-search-dishes" /><button onClick={() => navigate('menu')} aria-label="Find dishes" data-testid="button-search-dishes"><ArrowRight size={19} /></button></label>
              <label className="search-box restaurant-search"><MapPin size={19} /><input value={restaurantSearch} onChange={e => setRestaurantSearch(e.target.value)} placeholder="Find a restaurant..." aria-label="Search restaurants" data-testid="input-search-restaurants" /><button onClick={() => navigate('restaurants')} aria-label="Find restaurants" data-testid="button-search-restaurants"><ArrowRight size={19} /></button></label>
            </div>
            <div className="hero-trust"><span><Check size={15} /> Local favourites</span><span><Check size={15} /> Clear demo pricing</span><span><Check size={15} /> No payment collected</span></div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-frame"><img src={photo('photo-1547592180-85f173990554', 1100)} alt="A colourful spread of Indian vegetarian food, illustrative demo imagery" onError={handleImageError} /></div>
            <div className="image-caption"><span className="caption-icon"><Utensils size={18} /></span><span><b>A taste of home</b><small>Illustrative food imagery</small></span></div>
            <div className="hero-stamp"><span>GOOD FOOD</span><b>NEAR<br />YOU</b><small>JALGAON DISTRICT</small></div>
            <span className="hero-sun" />
          </div>
          <div className="hero-bottom-line"><span>GOOD THINGS ARE COOKING</span><span>01 — 04</span></div>
        </section>

        <section className="town-notice" aria-label="Coverage disclosure" data-testid="notice-demo-coverage"><div className="notice-icon"><MapPin size={19} /></div><p><b>Exploring {town}.</b> These service areas are illustrative only, not confirmed restaurant coverage. Check with a restaurant directly before making plans.</p><button onClick={() => document.getElementById('town-list')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-view-towns">View towns <ArrowRight size={15} /></button></section>

        <section className="section restaurant-section" id="restaurants">
          <div className="section-heading"><div><span className="eyebrow">A PLACE TO START</span><h2>Restaurants around <em>{town}</em></h2><p>Names to know, options to explore. Details are demo-only and unverified.</p></div><button className="text-link" onClick={() => navigate('menu')} data-testid="button-see-food">Browse all food <ArrowRight size={17} /></button></div>
          {availableRestaurants.length ? <div className="restaurant-grid">{availableRestaurants.map((restaurant, i) => <article className="restaurant-card" key={restaurant.id} data-testid={`card-restaurant-${restaurant.id}`}>
            <div className="restaurant-image"><img src={photo(restaurant.image, 650)} alt={`Illustrative food and dining imagery for ${restaurant.name}; not a photograph of this restaurant`} loading="lazy" onError={handleImageError} /><span className="illustrative-tag">Illustrative imagery</span><span className="restaurant-index">0{i + 1}</span></div>
            <div className="restaurant-card-body"><div className="restaurant-tag">{restaurant.tag}</div><h3>{restaurant.name}</h3><p>{restaurant.cuisine}</p><div className="restaurant-meta"><span><Star size={14} fill="currentColor" /> {restaurant.rating} <small>demo</small></span><span><Clock3 size={14} /> {restaurant.time} <small>demo</small></span></div><div className="service-area">Sample service areas: {restaurant.areas.join(', ')}</div><button className="restaurant-link" onClick={() => { setRestaurantSearch(restaurant.name); navigate('menu'); }} data-testid={`button-menu-${restaurant.id}`}>See menu <ArrowRight size={15} /></button></div>
          </article>)}</div> : <div className="empty-state"><MapPin size={26} /><h3>No demo listings for {town} yet</h3><p>Try Jalgaon or another town, or clear the restaurant search.</p><button className="button-outline" onClick={() => { setRestaurantSearch(''); setTown('Jalgaon'); }} data-testid="button-reset-restaurants">Show Jalgaon listings</button></div>}
          <p className="micro-disclaimer">All names, ratings, times and sample service areas are illustrative demo content; none have been verified.</p>
        </section>

        <section className="category-band" id="categories">
          <div className="section-heading"><div><span className="eyebrow">WHAT SOUNDS GOOD?</span><h2>Find your <em>kind of craving.</em></h2></div><span className="category-side-note">The familiar, the filling<br />and something for later.</span></div>
          <div className="category-list">{categories.slice(1).map((item, i) => <button key={item} className={`category-chip ${category === item ? 'selected' : ''}`} onClick={() => { setCategory(category === item ? 'All favourites' : item); navigate('menu'); }} data-testid={`button-category-${item.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}><span className="category-number">0{i + 1}</span>{item}<ArrowRight size={15} /></button>)}</div>
          <div className="category-foot">MADE FOR THE WAY WE EAT HERE <span>—</span> A SAMPLE MENU, NOT A LIVE CATALOGUE</div>
        </section>

        <section className="section menu-section" id="menu">
          <div className="section-heading menu-heading"><div><span className="eyebrow">POPULAR PICKS</span><h2>Made for <em>your appetite.</em></h2><p>25 local-inspired favourites. Every listing, description and INR price is unverified demo content.</p></div><div className="menu-count"><strong>{filteredDishes.length.toString().padStart(2, '0')}</strong><span>dish ideas</span></div></div>
          <div className="menu-toolbar">
            <div className="filter-chips">{categories.slice(0, 6).map(item => <button key={item} className={`filter-chip ${category === item ? 'active' : ''}`} onClick={() => setCategory(item)} data-testid={`filter-category-${item.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>{item}</button>)}</div>
            <div className="filter-controls"><label className={`veg-toggle ${vegOnly ? 'on' : ''}`}><input type="checkbox" checked={vegOnly} onChange={e => setVegOnly(e.target.checked)} data-testid="toggle-vegetarian" /><span className="veg-icon"><Leaf size={14} /></span> Vegetarian</label><label className="sort-select"><ArrowDownWideNarrow size={16} /><span className="sr-only">Sort dishes by price</span><select value={sort} onChange={e => setSort(e.target.value)} data-testid="select-sort-price"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select><ChevronDown size={14} /></label></div>
          </div>
          {filteredDishes.length ? <div className="dish-grid">{filteredDishes.map((dish, i) => <article className="dish-card" key={dish.id} data-testid={`card-dish-${dish.id}`}>
            <div className="dish-image-wrap"><img src={photo(dish.image, 640)} alt={`${dish.name}, illustrative food photography`} loading="lazy" onError={handleImageError} /><span className="dish-image-label">Illustrative image</span><span className="dish-order">{String(i + 1).padStart(2, '0')}</span><button className="save-dish" aria-label={`Save ${dish.name}`} onClick={e => { e.currentTarget.classList.toggle('saved'); }} data-testid={`button-save-${dish.id}`}><Heart size={17} /></button></div>
            <div className="dish-info"><div className="dish-topline"><span className="veg-mark"><span /> VEG</span><span className="dish-category">{dish.category}</span></div><h3>{dish.name}</h3><p>{dish.description}</p><div className="dish-footer"><strong data-testid={`text-price-${dish.id}`}>{money(dish.price)} <small>demo</small></strong><button className="add-button" onClick={() => addToCart(dish.id)} aria-label={`Add ${dish.name} to basket`} data-testid={`button-add-${dish.id}`}><Plus size={17} /> <span>Add</span></button></div><div className="dish-restaurant">From {dish.restaurant.map(id => restaurants.find(r => r.id === id)?.name).filter(Boolean).join(' · ')}</div></div>
          </article>)}</div> : <div className="empty-state"><Search size={25} /><h3>No dishes found for that search</h3><p>Try another name, choose a different category or town.</p><button className="button-outline" onClick={() => { setDishSearch(''); setRestaurantSearch(''); setCategory('All favourites'); setTown('Jalgaon'); }} data-testid="button-clear-filters">Clear filters</button></div>}
          <div className="catalog-disclaimer"><ShieldCheck size={17} /><span>Illustrative sample menu only. Availability, ingredients, prices and restaurant associations are not confirmed. Confirm details with the restaurant.</span></div>
        </section>

        <section className="offer-section" id="offers"><div className="offer-art"><img src={photo('photo-1547592180-85f173990554', 950)} alt="Illustrative Indian vegetarian meal" loading="lazy" onError={handleImageError} /><span>DEMO OFFER</span></div><div className="offer-copy"><span className="eyebrow">A LITTLE EXTRA JOY</span><h2>Good food.<br /><em>Gentle on the wallet.</em></h2><p>Try a sample offer on your next order. Offers are made up for this demo and are not redeemable with any restaurant.</p><div className="offer-ticket"><div className="ticket-left"><small>DEMO CODE</small><strong>JALGAON10</strong></div><span className="ticket-line" /><div className="ticket-right"><b>10%</b><small>sample offer</small></div></div><span className="offer-terms">Illustrative discount only. No code is applied and no payment is collected.</span></div></section>

        <section className="why-section" id="about"><div className="why-title"><span className="eyebrow">A GOOD PLACE TO BEGIN</span><h2>Local food, with<br /><em>nothing hidden.</em></h2><p>Food Hub is a concept for finding the familiar around Jalgaon district. It is not connected to the restaurants listed here.</p></div><div className="why-points"><article><span className="why-icon"><MapPin size={20} /></span><div><h3>Made for nearby</h3><p>Explore a set of district towns, with clear notes on demo-only service areas.</p></div></article><article><span className="why-icon"><BadgeIndianRupee size={20} /></span><div><h3>Costs in the open</h3><p>See sample item prices, a flat demo delivery fee and the full total before checkout.</p></div></article><article><span className="why-icon"><ShieldCheck size={20} /></span><div><h3>A demo that says so</h3><p>Sample details are labelled. Checkout stays on this device and sends nothing out.</p></div></article><article><span className="why-icon"><Heart size={20} /></span><div><h3>Rooted in favourites</h3><p>From a quick vada pav to a full thali, start with food that feels like home.</p></div></article></div></section>

        <section className="town-strip" id="town-list"><div><span className="eyebrow">OUR DEMO MAP</span><h2>Ten towns.<br /><em>One shared table.</em></h2></div><div className="town-tags">{towns.map(place => <button className={town === place ? 'current-town' : ''} key={place} onClick={() => { setTown(place); navigate('restaurants'); }} data-testid={`button-town-${place.toLowerCase()}`}><MapPin size={13} />{place}</button>)}</div><p>Illustrative town list only. Restaurant coverage is not verified and all listed service areas are examples.</p></section>
      </main>

      <footer className="footer"><a className="brand footer-brand" href="#home" onClick={e => { e.preventDefault(); navigate('home'); }} data-testid="link-footer-home"><span className="brand-mark"><Utensils size={21} /></span><span>Food<span> Hub</span></span></a><p>A neighbourhood food guide concept.<br />Local flavours, clearly labelled demo details.</p><div className="footer-nav"><button onClick={() => navigate('restaurants')} data-testid="footer-link-restaurants">Restaurants</button><button onClick={() => navigate('menu')} data-testid="footer-link-menu">Explore food</button><button onClick={() => navigate('offers')} data-testid="footer-link-offers">Offers</button></div><div className="footer-fineprint">© Food Hub demo · Not a live ordering service · No orders or payments are transmitted</div></footer>

      {cartOpen && <div className="overlay" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setCartOpen(false); }}><aside className="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title"><div className="panel-heading"><div><span className="eyebrow">YOUR FOOD, FOR NOW</span><h2 id="cart-title">Your basket <span>({itemCount})</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close basket" data-testid="button-close-cart"><X /></button></div>
        {cartItems.length ? <><div className="cart-demo-note">Demo basket saved on this device only.</div><div className="cart-lines">{cartItems.map(({ dish, quantity }) => <div className="cart-line" key={dish.id} data-testid={`cart-item-${dish.id}`}><img src={photo(dish.image, 160)} alt="" onError={handleImageError} /><div className="cart-line-info"><b>{dish.name}</b><small>{money(dish.price)} each · demo price</small><div className="quantity-control"><button onClick={() => setQuantity(dish.id, -1)} aria-label={`Decrease ${dish.name}`} data-testid={`button-decrease-${dish.id}`}><Minus size={14} /></button><span data-testid={`text-quantity-${dish.id}`}>{quantity}</span><button onClick={() => setQuantity(dish.id, 1)} aria-label={`Increase ${dish.name}`} data-testid={`button-increase-${dish.id}`}><Plus size={14} /></button></div></div><strong>{money(dish.price * quantity)}</strong></div>)}</div><div className="bill"><div><span>Food subtotal</span><strong>{money(subtotal)}</strong></div><div><span>Demo delivery fee <small>(flat, no hidden charges)</small></span><strong>{money(deliveryFee)}</strong></div><div className="bill-total"><span>Total <small>sample INR amount</small></span><strong>{money(total)}</strong></div></div><div className="cart-panel-actions"><button className="button-outline" onClick={() => setCart([])} data-testid="button-clear-cart">Clear basket</button><button className="button-primary" onClick={() => { setCartOpen(false); setCheckoutOpen(true); setCustomer(c => ({ ...c, city: town })); }} data-testid="button-checkout">Continue to checkout <ArrowRight size={17} /></button></div></> : <div className="cart-empty"><span className="empty-bag"><ShoppingBasket size={28} /></span><h3>Your basket is waiting</h3><p>Add something delicious to start a demo order.</p><button className="button-primary" onClick={() => { setCartOpen(false); navigate('menu'); }} data-testid="button-explore-menu">Explore the menu <ArrowRight size={16} /></button></div>}
        <p className="panel-footnote">Demo only: no restaurant receives this basket and no payment is processed.</p></aside></div>}

      {checkoutOpen && <div className="overlay checkout-overlay" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) closeCheckout(); }}><section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title"><div className="panel-heading"><div><span className="eyebrow">{orderDone ? 'THAT’S A WRAP' : 'ONE LAST DEMO STEP'}</span><h2 id="checkout-title">{orderDone ? 'Demo order noted.' : 'Delivery details'}</h2></div><button className="icon-button" onClick={closeCheckout} aria-label="Close checkout" data-testid="button-close-checkout"><X /></button></div>
        {orderDone ? <div className="order-confirmation" data-testid="status-order-confirmation"><span className="confirmation-check"><Check size={27} /></span><h3>Thanks, {customer.name.split(' ')[0]}.</h3><p>Your demo order <b>{orderId}</b> has been noted on this device.</p><div className="confirmation-alert"><ShieldCheck size={19} /><p><b>This is a local demonstration only.</b> Nothing was sent to a restaurant, no real order was placed and no payment was processed.</p></div><button className="button-primary" onClick={closeCheckout} data-testid="button-finish-order">Back to Food Hub <ArrowRight size={16} /></button></div> : <div className="checkout-content"><form onSubmit={submitOrder} noValidate><p className="form-intro">This local demo will not contact a restaurant or process payment.</p><label className="form-field">Your name<input value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} placeholder="e.g. Aditi Patil" required data-testid="input-customer-name" /></label><label className="form-field">Mobile number<input type="tel" value={customer.mobile} onChange={e => setCustomer({ ...customer, mobile: e.target.value })} placeholder="10-digit Indian mobile" required data-testid="input-customer-mobile" /></label><label className="form-field">Delivery address<textarea value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} placeholder="House / street / landmark" required rows={3} data-testid="input-delivery-address" /></label><label className="form-field">Town or city<select value={customer.city} onChange={e => setCustomer({ ...customer, city: e.target.value })} data-testid="select-checkout-city">{towns.map(place => <option key={place}>{place}</option>)}</select></label>{formError && <p className="form-error" role="alert" data-testid="status-checkout-error">{formError}</p>}<button type="submit" className="button-primary submit-order" data-testid="button-place-demo-order">Place demo order · {money(total)} <ArrowRight size={17} /></button></form><aside className="checkout-summary"><span className="eyebrow">ORDER SUMMARY</span><h3>{itemCount} {itemCount === 1 ? 'item' : 'items'}</h3><div className="summary-items">{cartItems.map(({ dish, quantity }) => <div key={dish.id}><span>{quantity} × {dish.name}</span><b>{money(dish.price * quantity)}</b></div>)}</div><div className="bill summary-bill"><div><span>Food subtotal</span><strong>{money(subtotal)}</strong></div><div><span>Demo delivery fee</span><strong>{money(deliveryFee)}</strong></div><div className="bill-total"><span>Total</span><strong>{money(total)}</strong></div></div><p className="summary-disclosure">All prices and the flat fee are demo amounts. No discount is applied; no hidden charges.</p></aside></div>}
      </section></div>}
    </div>
  );
}

export default App;
