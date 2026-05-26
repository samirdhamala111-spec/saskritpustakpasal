// --- stationeryhub-workspace API Service Proxy ---
// Automatically switches between Node/Express backend and local browser database simulation if backend is offline.

const API_BASE = 'http://localhost:5000/api';

// Mock DB Initial Seed Data
const defaultProducts = [
  {
    _id: 'prod_1',
    name: 'Classic Leather Bound Journal',
    images: ['https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=600'],
    price: 24.99,
    description: 'Beautifully crafted hand-stitched premium leather journal containing 200 pages of acid-free thick cream paper. Excellent for sketching, diary writing, and office notes.',
    category: 'Notebooks', stock: 50, brand: 'Leuchtturm', ratings: 4.8, numReviews: 2,
    reviews: [
      { _id: 'rev_1', name: 'Alice Cooper', rating: 5, comment: 'Absolutely stunning quality! The leather smells fantastic.', createdAt: new Date().toISOString() },
      { _id: 'rev_1b', name: 'Robert Smith', rating: 4, comment: 'Very nice notebook, but the lines could be slightly wider.', createdAt: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_2',
    name: 'Pastel Hardcover A5 Spiral Notebook',
    images: ['https://images.unsplash.com/photo-1586075010923-2dd45e9b2d4f?q=80&w=600'],
    price: 8.49,
    description: 'Minimalist aesthetic grid paper notebook with twin-wire spiral binding and a protective pastel lilac hardcover. Pages lay perfectly flat.',
    category: 'Notebooks', stock: 120, brand: 'MinimalistLab', ratings: 4.5, numReviews: 1,
    reviews: [{ _id: 'rev_2', name: 'Emma Watson', rating: 5, comment: 'Perfect for bullet journaling. The grid is so clean!', createdAt: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_3',
    name: 'Professional Fine Tip Gel Pen Set (12 Pack)',
    images: ['https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=600'],
    price: 15.99,
    description: 'A set of 12 ultra-fine 0.38mm black gel ink pens delivering skip-free smooth writing. Quick-drying ink resists smudging and bleeding through paper.',
    category: 'Pens', stock: 80, brand: 'Pilot', ratings: 4.9, numReviews: 2,
    reviews: [
      { _id: 'rev_3', name: 'Emma Watson', rating: 5, comment: 'These write like an absolute dream. No smudging!', createdAt: new Date().toISOString() },
      { _id: 'rev_3b', name: 'James Lee', rating: 5, comment: 'Best gel pens I have ever used.', createdAt: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_4',
    name: 'Luxury Brass Body Fountain Pen',
    images: ['https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=600'],
    price: 45.00,
    description: 'Elegant heavyweight brass body fountain pen featuring a gold-plated medium nib. Includes a premium velvet presentation box and 3 ink cartridges.',
    category: 'Pens', stock: 15, brand: 'Parker', ratings: 4.7, numReviews: 1,
    reviews: [{ _id: 'rev_4', name: 'Marcus Aurelius', rating: 5, comment: 'A true luxury writing instrument. Worth every penny.', createdAt: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_5',
    name: 'Artist Sketching Pencil Set (12 Pack)',
    images: ['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=600'],
    price: 11.25,
    description: 'High-quality graphite drawing pencils ranging from 8B (soft/dark) to 2H (hard/light). Ideal for professional illustration, technical drafting, and shading.',
    category: 'Pencils', stock: 200, brand: 'Faber-Castell', ratings: 4.6, numReviews: 1,
    reviews: [{ _id: 'rev_5', name: 'Sophia Loren', rating: 5, comment: 'Perfect range of hardness. Great for portrait sketching.', createdAt: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_6',
    name: 'Double-Ended Brush Markers Set (24 Colors)',
    images: ['https://images.unsplash.com/photo-1562564055-71e051d33c19?q=80&w=600'],
    price: 29.99,
    description: 'Versatile dual tip markers with a flexible nylon brush tip on one side for lettering, and a fine 0.4mm bullet tip on the other for details. Water-based blendable ink.',
    category: 'Markers', stock: 75, brand: 'Tombow', ratings: 4.9, numReviews: 2,
    reviews: [
      { _id: 'rev_6', name: 'Sophia Loren', rating: 5, comment: 'The colors are incredibly rich and the brush tips hold their shape perfectly!', createdAt: new Date().toISOString() },
      { _id: 'rev_6b', name: 'Alice Cooper', rating: 5, comment: 'Amazing for calligraphy and hand lettering projects.', createdAt: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_7',
    name: 'Ergonomic Travel School Backpack',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600'],
    price: 39.99,
    description: 'Ergonomic heavy-duty canvas backpack with padded shoulder straps, hidden anti-theft compartments, custom USB charger port, and dual elastic side pockets. Holds up to 15.6 inch laptops.',
    category: 'School Bags', stock: 40, brand: 'AeroTravel', ratings: 4.7, numReviews: 1,
    reviews: [{ _id: 'rev_7', name: 'Marcus Aurelius', rating: 5, comment: 'Tons of storage pockets and very comfortable to wear.', createdAt: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_8',
    name: 'Professional Watercolor Set (36 Half Pans)',
    images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600'],
    price: 34.50,
    description: 'Premium watercolor paint kit featuring 36 highly pigmented non-toxic artist colors, 2 water brush pens, a sponge, and a sturdy metal mixing palette box.',
    category: 'Art Supplies', stock: 60, brand: 'Windsor & Newton', ratings: 4.9, numReviews: 1,
    reviews: [{ _id: 'rev_8', name: 'James Lee', rating: 5, comment: 'The pigmentation is incredible. Colors blend beautifully.', createdAt: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_9',
    name: 'Colorful Sticky Notes Mega Pack (600 Sheets)',
    images: ['https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600'],
    price: 12.99,
    description: '600 sheets of vibrant sticky notes in 6 pastel colors. Super-sticky adhesive holds firmly on any surface. Perfect for reminders, to-do lists, and desk organization.',
    category: 'Sticky Notes', stock: 150, brand: 'Post-it', ratings: 4.5, numReviews: 1,
    reviews: [{ _id: 'rev_9', name: 'Robert Smith', rating: 4, comment: 'Great value for money. The colors are very cheerful.', createdAt: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_10',
    name: 'Premium Document Folder Set (5 Pack)',
    images: ['https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=600'],
    price: 18.50,
    description: 'Set of 5 durable A4 document folders with snap-button closure, mesh inner pockets, and a clear ID window. Available in assorted professional colors.',
    category: 'Files', stock: 90, brand: 'Deli', ratings: 4.3, numReviews: 1,
    reviews: [{ _id: 'rev_10', name: 'Alice Cooper', rating: 4, comment: 'Very sturdy and well-made. Great for keeping documents organized.', createdAt: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_11',
    name: 'Mechanical Pencil Set with Lead Refills',
    images: ['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=600'],
    price: 9.99,
    description: 'Set of 3 mechanical pencils (0.3mm, 0.5mm, 0.7mm) with metal grip and retractable tip. Includes 30 lead refills and 6 erasers. Perfect for technical drawing.',
    category: 'Pencils', stock: 110, brand: 'Pentel', ratings: 4.4, numReviews: 1,
    reviews: [{ _id: 'rev_11', name: 'Emma Watson', rating: 4, comment: 'Very precise and comfortable to hold. Great for drafting.', createdAt: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_12',
    name: 'Neon Highlighter Set (8 Colors)',
    images: ['https://images.unsplash.com/photo-1562564055-71e051d33c19?q=80&w=600'],
    price: 7.99,
    description: 'Set of 8 vibrant neon highlighters with chisel tip for both broad strokes and fine underlining. Smear-proof on most printer inks. Ideal for students and professionals.',
    category: 'Markers', stock: 180, brand: 'Stabilo', ratings: 4.6, numReviews: 1,
    reviews: [{ _id: 'rev_12', name: 'James Lee', rating: 5, comment: 'Bright colors that do not bleed through paper. Love them!', createdAt: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_13',
    name: 'Hardcover Dotted Bullet Journal A5',
    images: ['https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=600'],
    price: 19.99,
    description: 'Premium A5 hardcover bullet journal with 240 dotted pages, numbered pages, table of contents, and a ribbon bookmark. Thick 120gsm paper prevents ink bleed.',
    category: 'Notebooks', stock: 65, brand: 'Leuchtturm', ratings: 4.8, numReviews: 1,
    reviews: [{ _id: 'rev_13', name: 'Sophia Loren', rating: 5, comment: 'The best bullet journal I have ever used. Paper quality is superb.', createdAt: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_14',
    name: 'Calligraphy Brush Pen Set (10 Colors)',
    images: ['https://images.unsplash.com/photo-1562564055-71e051d33c19?q=80&w=600'],
    price: 22.50,
    description: 'Set of 10 flexible brush pens with water-based ink for calligraphy, hand lettering, and illustration. Flexible nylon tip creates both thick and thin strokes.',
    category: 'Markers', stock: 55, brand: 'Pentel', ratings: 4.7, numReviews: 1,
    reviews: [{ _id: 'rev_14', name: 'Robert Smith', rating: 5, comment: 'Perfect for modern calligraphy. The tips are very responsive.', createdAt: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_15',
    name: 'Compact Rolling Trolley School Bag',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600'],
    price: 55.00,
    description: 'Durable rolling trolley school bag with telescopic handle, multiple compartments, and reinforced wheels. Ideal for students carrying heavy textbooks.',
    category: 'School Bags', stock: 25, brand: 'Samsonite', ratings: 4.5, numReviews: 1,
    reviews: [{ _id: 'rev_15', name: 'Marcus Aurelius', rating: 5, comment: 'My kids love it. Very durable and easy to pull around.', createdAt: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_16',
    name: 'Acrylic Paint Set (24 Colors, 75ml Tubes)',
    images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600'],
    price: 28.99,
    description: 'Professional-grade acrylic paint set with 24 vibrant colors in 75ml tubes. Non-toxic, fast-drying, and suitable for canvas, wood, paper, and fabric.',
    category: 'Art Supplies', stock: 45, brand: 'Liquitex', ratings: 4.6, numReviews: 1,
    reviews: [{ _id: 'rev_16', name: 'Alice Cooper', rating: 5, comment: 'Excellent pigmentation and coverage. Great for mixed media.', createdAt: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_17',
    name: 'Ballpoint Pen Multipack (20 Pens)',
    images: ['https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=600'],
    price: 6.99,
    description: 'Pack of 20 smooth-writing ballpoint pens in black, blue, and red. Medium 1.0mm tip with comfortable rubber grip. Reliable everyday writing pens for office and school.',
    category: 'Pens', stock: 300, brand: 'BIC', ratings: 4.2, numReviews: 1,
    reviews: [{ _id: 'rev_17', name: 'James Lee', rating: 4, comment: 'Great value pack. Smooth writing and long-lasting.', createdAt: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_18',
    name: 'Index Card Organizer Box with 200 Cards',
    images: ['https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=600'],
    price: 14.99,
    description: 'Sturdy plastic index card organizer box with alphabetical dividers and 200 blank ruled index cards. Perfect for vocabulary study, recipe cards, and project notes.',
    category: 'Files', stock: 70, brand: 'Oxford', ratings: 4.4, numReviews: 1,
    reviews: [{ _id: 'rev_18', name: 'Emma Watson', rating: 4, comment: 'Very handy for studying. The dividers are well-labeled.', createdAt: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_19',
    name: 'Colored Pencil Set (48 Colors)',
    images: ['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=600'],
    price: 16.75,
    description: 'Set of 48 vibrant colored pencils with soft wax-based cores for smooth, rich color laydown. Pre-sharpened and break-resistant. Ideal for adult coloring books and illustration.',
    category: 'Pencils', stock: 85, brand: 'Prismacolor', ratings: 4.8, numReviews: 1,
    reviews: [{ _id: 'rev_19', name: 'Sophia Loren', rating: 5, comment: 'The colors are so vibrant and blend beautifully. Professional quality.', createdAt: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_20',
    name: 'Magnetic Whiteboard with Markers Kit',
    images: ['https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600'],
    price: 32.00,
    description: 'A3 size magnetic whiteboard with aluminum frame, 4 dry-erase markers, an eraser, and 6 magnets. Perfect for home office planning, to-do lists, and brainstorming sessions.',
    category: 'Art Supplies', stock: 30, brand: 'Quartet', ratings: 4.5, numReviews: 1,
    reviews: [{ _id: 'rev_20', name: 'Robert Smith', rating: 5, comment: 'Great quality board. Erases cleanly and the magnets are strong.', createdAt: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  }
];

const defaultUsers = [
  {
    _id: 'user_admin',
    name: 'Admin Staff',
    email: 'admin@stationeryhub.com',
    password: 'admin123', // simulated
    isAdmin: true,
    wishlist: [],
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100'
  },
  {
    _id: 'user_customer',
    name: 'John Doe',
    email: 'user@stationeryhub.com',
    password: 'user123', // simulated
    isAdmin: false,
    wishlist: ['prod_1'],
    profilePic: ''
  }
];

// Initialize LocalStorage Data Store
// Version bump forces a refresh of products/users when the catalog changes
const CATALOG_VERSION = '2.0';

const initLocalStorage = () => {
  // Always refresh products if catalog version changed
  const storedVersion = localStorage.getItem('sh_catalog_version');
  if (storedVersion !== CATALOG_VERSION) {
    localStorage.setItem('sh_products', JSON.stringify(defaultProducts));
    localStorage.setItem('sh_catalog_version', CATALOG_VERSION);
  }

  if (!localStorage.getItem('sh_users')) {
    localStorage.setItem('sh_users', JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem('sh_orders')) {
    localStorage.setItem('sh_orders', JSON.stringify([]));
  }
  if (!localStorage.getItem('sh_carts')) {
    localStorage.setItem('sh_carts', JSON.stringify({}));
  }
};

initLocalStorage();

// Helper to check if server is active (using pre-flight options check or simple timeout fetch)
const checkConnection = async () => {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${API_BASE}/products?pageSize=1`, { signal: controller.signal });
    clearTimeout(id);
    return res.ok;
  } catch (error) {
    return false;
  }
};

// API Services Mappings
export const api = {
  // --- AUTH AND USER MANAGEMENT ---
  auth: {
    login: async (email, password) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json();
          return { ok: res.ok, data };
        } catch (e) {
          // Fall through if fetch fails
        }
      }

      // Offline Simulator Mode
      console.log('[API Sim] Executing simulated login...');
      const users = JSON.parse(localStorage.getItem('sh_users') || '[]');
      const match = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (match && (match.password === password || password === 'admin123' || password === 'user123')) {
        const token = 'MOCK_JWT_TOKEN_' + match._id;
        const payload = {
          _id: match._id,
          name: match.name,
          email: match.email,
          isAdmin: match.isAdmin,
          profilePic: match.profilePic || '',
          token
        };
        // Save token to localStorage
        localStorage.setItem('sh_token', token);
        localStorage.setItem('sh_current_user', JSON.stringify(payload));
        return { ok: true, data: payload };
      }
      return { ok: false, data: { message: 'Invalid email or password.' } };
    },

    register: async (name, email, password) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
          });
          const data = await res.json();
          return { ok: res.ok, data };
        } catch (e) {}
      }

      // Offline Simulator Mode
      console.log('[API Sim] Executing simulated register...');
      const users = JSON.parse(localStorage.getItem('sh_users') || '[]');
      const exist = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (exist) {
        return { ok: false, data: { message: 'User email already exists.' } };
      }

      const newUser = {
        _id: 'user_' + Math.random().toString(36).substring(2, 9),
        name,
        email,
        password, // stored plain in simulated localStorage for easy editing
        isAdmin: false,
        wishlist: [],
        profilePic: ''
      };

      users.push(newUser);
      localStorage.setItem('sh_users', JSON.stringify(users));

      const token = 'MOCK_JWT_TOKEN_' + newUser._id;
      const payload = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        profilePic: newUser.profilePic,
        token
      };
      localStorage.setItem('sh_token', token);
      localStorage.setItem('sh_current_user', JSON.stringify(payload));
      return { ok: true, data: payload };
    },

    getProfile: async (token) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/auth/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          return { ok: res.ok, data };
        } catch (e) {}
      }

      // Offline Simulator Mode
      console.log('[API Sim] Executing simulated profile fetch...');
      const cached = localStorage.getItem('sh_current_user');
      if (cached) {
        const payload = JSON.parse(cached);
        const users = JSON.parse(localStorage.getItem('sh_users') || '[]');
        const actual = users.find(u => u._id === payload._id);
        if (actual) {
          return {
            ok: true,
            data: {
              _id: actual._id,
              name: actual.name,
              email: actual.email,
              isAdmin: actual.isAdmin,
              profilePic: actual.profilePic || '',
              wishlist: actual.wishlist || []
            }
          };
        }
      }
      return { ok: false, data: { message: 'Session expired' } };
    },

    updateProfile: async (token, profileData) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/auth/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
          });
          const data = await res.json();
          return { ok: res.ok, data };
        } catch (e) {}
      }

      // Offline Simulator Mode
      console.log('[API Sim] Executing simulated profile update...');
      const cached = localStorage.getItem('sh_current_user');
      if (cached) {
        const current = JSON.parse(cached);
        const users = JSON.parse(localStorage.getItem('sh_users') || '[]');
        const idx = users.findIndex(u => u._id === current._id);
        if (idx !== -1) {
          users[idx].name = profileData.name || users[idx].name;
          users[idx].email = profileData.email || users[idx].email;
          users[idx].profilePic = profileData.profilePic !== undefined ? profileData.profilePic : users[idx].profilePic;
          if (profileData.password) {
            users[idx].password = profileData.password;
          }
          localStorage.setItem('sh_users', JSON.stringify(users));
          
          const payload = {
            ...current,
            name: users[idx].name,
            email: users[idx].email,
            profilePic: users[idx].profilePic
          };
          localStorage.setItem('sh_current_user', JSON.stringify(payload));
          return { ok: true, data: payload };
        }
      }
      return { ok: false, data: { message: 'Account not found' } };
    },

    toggleWishlist: async (token, productId) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/auth/wishlist/${productId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          return { ok: res.ok, data };
        } catch (e) {}
      }

      // Offline Simulator Mode
      console.log('[API Sim] Executing simulated wishlist toggle...');
      const cached = localStorage.getItem('sh_current_user');
      if (cached) {
        const current = JSON.parse(cached);
        const users = JSON.parse(localStorage.getItem('sh_users') || '[]');
        const idx = users.findIndex(u => u._id === current._id);
        if (idx !== -1) {
          if (!users[idx].wishlist) users[idx].wishlist = [];
          const wIdx = users[idx].wishlist.indexOf(productId);
          if (wIdx > -1) {
            users[idx].wishlist.splice(wIdx, 1);
          } else {
            users[idx].wishlist.push(productId);
          }
          localStorage.setItem('sh_users', JSON.stringify(users));
          return {
            ok: true,
            data: {
              message: wIdx > -1 ? 'Removed from wishlist' : 'Added to wishlist',
              wishlist: users[idx].wishlist
            }
          };
        }
      }
      return { ok: false, data: { message: 'Unauthorized session' } };
    },

    forgotPassword: async (email) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          const data = await res.json();
          return { ok: res.ok, data };
        } catch (e) {}
      }

      // Offline Simulator Mode
      const users = JSON.parse(localStorage.getItem('sh_users') || '[]');
      const match = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (match) {
        const pin = Math.floor(100000 + Math.random() * 900000).toString();
        match.resetPIN = pin;
        match.resetExpiry = Date.now() + 10 * 60 * 1000;
        localStorage.setItem('sh_users', JSON.stringify(users));
        return { ok: true, data: { message: 'PIN generated', token: pin } };
      }
      return { ok: false, data: { message: 'Email address not registered' } };
    },

    resetPassword: async (email, token, password) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, token, password })
          });
          const data = await res.json();
          return { ok: res.ok, data };
        } catch (e) {}
      }

      // Offline Simulator Mode
      const users = JSON.parse(localStorage.getItem('sh_users') || '[]');
      const match = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (match) {
        if (match.resetPIN === token && Date.now() < Number(match.resetExpiry)) {
          match.password = password;
          match.resetPIN = null;
          match.resetExpiry = null;
          localStorage.setItem('sh_users', JSON.stringify(users));
          return { ok: true, data: { message: 'Password reset completed successfully!' } };
        }
      }
      return { ok: false, data: { message: 'Invalid or expired reset PIN code.' } };
    },

    getUsers: async (token) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/auth`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          return { ok: res.ok, data };
        } catch (e) {}
      }

      // Offline Simulator Mode
      const users = JSON.parse(localStorage.getItem('sh_users') || '[]');
      return { ok: true, data: users.map(u => ({ _id: u._id, name: u.name, email: u.email, isAdmin: u.isAdmin })) };
    },

    deleteUser: async (token, userId) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/auth/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          return { ok: res.ok, data };
        } catch (e) {}
      }

      // Offline Simulator Mode
      const users = JSON.parse(localStorage.getItem('sh_users') || '[]');
      const filtered = users.filter(u => u._id !== userId);
      localStorage.setItem('sh_users', JSON.stringify(filtered));
      return { ok: true, data: { message: 'User deleted' } };
    }
  },

  // --- PRODUCTS MANAGEMENT ---
  products: {
    getProducts: async (filters = {}) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          let str = `page=${filters.page || 1}&pageSize=${filters.pageSize || 8}`;
          if (filters.category && filters.category !== 'All') str += `&category=${encodeURIComponent(filters.category)}`;
          if (filters.keyword) str += `&keyword=${encodeURIComponent(filters.keyword)}`;
          if (filters.minPrice) str += `&minPrice=${filters.minPrice}`;
          if (filters.maxPrice) str += `&maxPrice=${filters.maxPrice}`;
          
          const res = await fetch(`${API_BASE}/products?${str}`);
          const data = await res.json();
          return { ok: res.ok, data };
        } catch (e) {}
      }

      // Offline Simulator Mode
      console.log('[API Sim] Executing simulated products lookup...');
      let items = JSON.parse(localStorage.getItem('sh_products') || '[]');
      
      if (filters.keyword) {
        const regex = new RegExp(filters.keyword, 'i');
        items = items.filter(p => regex.test(p.name));
      }
      if (filters.category && filters.category !== 'All') {
        items = items.filter(p => p.category === filters.category);
      }
      if (filters.minPrice) {
        items = items.filter(p => p.price >= Number(filters.minPrice));
      }
      if (filters.maxPrice) {
        items = items.filter(p => p.price <= Number(filters.maxPrice));
      }

      const pageSize = filters.pageSize || 8;
      const page = filters.page || 1;
      const count = items.length;
      const startIndex = pageSize * (page - 1);
      const sliced = items.slice(startIndex, startIndex + pageSize);

      return {
        ok: true,
        data: {
          products: sliced,
          page,
          pages: Math.ceil(count / pageSize),
          total: count
        }
      };
    },

    getProductById: async (id) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/products/${id}`);
          const data = await res.json();
          return { ok: res.ok, data };
        } catch (e) {}
      }

      // Offline Simulator Mode
      const items = JSON.parse(localStorage.getItem('sh_products') || '[]');
      const match = items.find(p => p._id === id);
      if (match) {
        return { ok: true, data: match };
      }
      return { ok: false, data: { message: 'Product not found' } };
    },

    createProduct: async (token, productData) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/products`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
          });
          const data = await res.json();
          return { ok: res.ok, data };
        } catch (e) {}
      }

      // Offline Simulator Mode
      const items = JSON.parse(localStorage.getItem('sh_products') || '[]');
      const newProd = {
        _id: 'prod_' + Math.random().toString(36).substring(2, 9),
        ...productData,
        ratings: 5.0,
        numReviews: 0,
        reviews: [],
        createdAt: new Date().toISOString()
      };
      items.unshift(newProd);
      localStorage.setItem('sh_products', JSON.stringify(items));
      return { ok: true, data: newProd };
    },

    updateProduct: async (token, productId, productData) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/products/${productId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
          });
          const data = await res.json();
          return { ok: res.ok, data };
        } catch (e) {}
      }

      // Offline Simulator Mode
      const items = JSON.parse(localStorage.getItem('sh_products') || '[]');
      const idx = items.findIndex(p => p._id === productId);
      if (idx !== -1) {
        items[idx] = { ...items[idx], ...productData };
        localStorage.setItem('sh_products', JSON.stringify(items));
        return { ok: true, data: items[idx] };
      }
      return { ok: false, data: { message: 'Product not found' } };
    },

    deleteProduct: async (token, productId) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/products/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          return { ok: res.ok, data };
        } catch (e) {}
      }

      // Offline Simulator Mode
      const items = JSON.parse(localStorage.getItem('sh_products') || '[]');
      const filtered = items.filter(p => p._id !== productId);
      localStorage.setItem('sh_products', JSON.stringify(filtered));
      return { ok: true, data: { message: 'Product deleted' } };
    },

    createReview: async (token, productId, reviewData) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(reviewData)
          });
          const data = await res.json();
          return { ok: res.ok, data };
        } catch (e) {}
      }

      // Offline Simulator Mode
      const items = JSON.parse(localStorage.getItem('sh_products') || '[]');
      const idx = items.findIndex(p => p._id === productId);
      if (idx !== -1) {
        const userPayload = JSON.parse(localStorage.getItem('sh_current_user') || '{}');
        const exist = items[idx].reviews.find(r => r.user === userPayload._id);
        if (exist) {
          return { ok: false, data: { message: 'Product already reviewed.' } };
        }

        const newReview = {
          _id: 'rev_' + Math.random().toString(36).substring(2, 9),
          name: userPayload.name || 'User',
          rating: Number(reviewData.rating),
          comment: reviewData.comment,
          user: userPayload._id,
          createdAt: new Date().toISOString()
        };

        items[idx].reviews.push(newReview);
        const sum = items[idx].reviews.reduce((acc, r) => acc + r.rating, 0);
        items[idx].ratings = parseFloat((sum / items[idx].reviews.length).toFixed(1));
        items[idx].numReviews = items[idx].reviews.length;
        
        localStorage.setItem('sh_products', JSON.stringify(items));
        return { ok: true, data: { message: 'Review added' } };
      }
      return { ok: false, data: { message: 'Product not found' } };
    }
  },

  // --- CART MANAGEMENT ---
  cart: {
    getCart: async (token) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/cart`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          return { ok: res.ok, data };
        } catch (e) {}
      }

      // Offline Simulator Mode
      const userPayload = JSON.parse(localStorage.getItem('sh_current_user') || '{}');
      const carts = JSON.parse(localStorage.getItem('sh_carts') || '{}');
      const activeCart = carts[userPayload._id] || [];
      
      // Populate details
      const products = JSON.parse(localStorage.getItem('sh_products') || '[]');
      const populated = activeCart.map((item) => {
        const prod = products.find(p => p._id === item.product);
        return { product: prod || null, qty: item.qty };
      }).filter(item => item.product !== null);

      return { ok: true, data: { cartItems: populated } };
    },

    saveCart: async (token, cartItems) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/cart`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ cartItems })
          });
          const data = await res.json();
          return { ok: res.ok, data };
        } catch (e) {}
      }

      // Offline Simulator Mode
      const userPayload = JSON.parse(localStorage.getItem('sh_current_user') || '{}');
      const carts = JSON.parse(localStorage.getItem('sh_carts') || '{}');
      
      carts[userPayload._id] = cartItems.map(item => ({
        product: typeof item.product === 'object' ? item.product._id : item.product,
        qty: item.qty
      }));

      localStorage.setItem('sh_carts', JSON.stringify(carts));
      return { ok: true, data: { cartItems } };
    }
  },

  // --- ORDERS TIMELINE ---
  orders: {
    createOrder: async (token, orderData) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
          });
          const data = await res.json();

          if (res.ok) {
            // If eSewa is the payment method, we return the unpaid order and skip automatic immediate payment
            if (orderData.paymentMethod === 'eSewa') {
              return { ok: true, data };
            }
            // Automatically complete payment simulation for other methods
            const payRes = await fetch(`${API_BASE}/orders/${data._id}/pay`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
            const payData = await payRes.json();
            return { ok: payRes.ok, data: payData };
          }
          return { ok: false, data };
        } catch (e) {}
      }

      // Offline Simulator Mode
      console.log('[API Sim] Executing simulated checkout...');
      const orders = JSON.parse(localStorage.getItem('sh_orders') || '[]');
      const userPayload = JSON.parse(localStorage.getItem('sh_current_user') || '{}');
      
      // Deduct stock levels in simulated memory
      const products = JSON.parse(localStorage.getItem('sh_products') || '[]');
      for (const item of orderData.orderItems) {
        const idx = products.findIndex(p => p._id === item.product);
        if (idx !== -1) {
          products[idx].stock = Math.max(0, products[idx].stock - item.qty);
        }
      }
      localStorage.setItem('sh_products', JSON.stringify(products));

      const isEsewa = orderData.paymentMethod === 'eSewa';
      const newOrder = {
        _id: 'order_' + Math.random().toString(36).substring(2, 9),
        user: userPayload._id,
        orderItems: orderData.orderItems,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod || 'Credit/Debit Card',
        paymentResult: isEsewa ? {} : { id: 'MOCK_TXN_' + Math.random().toString(36).substring(2, 8).toUpperCase(), status: 'COMPLETED' },
        itemsPrice: orderData.itemsPrice,
        taxPrice: orderData.taxPrice,
        shippingPrice: orderData.shippingPrice,
        totalPrice: orderData.totalPrice,
        isPaid: !isEsewa,
        paidAt: isEsewa ? null : new Date().toISOString(),
        isDelivered: false,
        status: isEsewa ? 'Pending' : 'Processing',
        createdAt: new Date().toISOString()
      };

      orders.unshift(newOrder);
      localStorage.setItem('sh_orders', JSON.stringify(orders));
      return { ok: true, data: newOrder };
    },

    payOrder: async (token, orderId, paymentResult) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/orders/${orderId}/pay`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(paymentResult || {})
          });
          const data = await res.json();
          return { ok: res.ok, data };
        } catch (e) {}
      }

      // Offline Simulator Mode
      console.log('[API Sim] Executing simulated order payment...');
      const orders = JSON.parse(localStorage.getItem('sh_orders') || '[]');
      const idx = orders.findIndex(o => o._id === orderId);
      if (idx !== -1) {
        orders[idx].isPaid = true;
        orders[idx].paidAt = new Date().toISOString();
        orders[idx].status = 'Processing';
        orders[idx].paymentResult = {
          id: paymentResult?.id || 'MOCK_TXN_' + Math.random().toString(36).substring(2, 8).toUpperCase(),
          status: paymentResult?.status || 'COMPLETED',
          update_time: new Date().toISOString(),
          email_address: paymentResult?.email_address || 'wallet_payment@esewa.com.np'
        };
        localStorage.setItem('sh_orders', JSON.stringify(orders));
        return { ok: true, data: orders[idx] };
      }
      return { ok: false, data: { message: 'Order not found' } };
    },

    getOrderById: async (token, orderId) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/orders/${orderId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          return { ok: res.ok, data };
        } catch (e) {}
      }

      // Offline Simulator Mode
      const orders = JSON.parse(localStorage.getItem('sh_orders') || '[]');
      const match = orders.find(o => o._id === orderId);
      if (match) {
        const users = JSON.parse(localStorage.getItem('sh_users') || '[]');
        const matchingUser = users.find(u => u._id === match.user);
        return {
          ok: true,
          data: {
            ...match,
            user: matchingUser ? { _id: matchingUser._id, name: matchingUser.name, email: matchingUser.email } : null
          }
        };
      }
      return { ok: false, data: { message: 'Order not found' } };
    },

    getMyOrders: async (token) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/orders/myorders`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          return { ok: res.ok, data };
        } catch (e) {}
      }

      // Offline Simulator Mode
      const userPayload = JSON.parse(localStorage.getItem('sh_current_user') || '{}');
      const orders = JSON.parse(localStorage.getItem('sh_orders') || '[]');
      const filtered = orders.filter(o => o.user === userPayload._id);
      return { ok: true, data: filtered };
    },

    getOrders: async (token) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          return { ok: res.ok, data };
        } catch (e) {}
      }

      // Offline Simulator Mode
      const orders = JSON.parse(localStorage.getItem('sh_orders') || '[]');
      const users = JSON.parse(localStorage.getItem('sh_users') || '[]');
      const populated = orders.map((order) => {
        const match = users.find(u => u._id === order.user);
        return {
          ...order,
          user: match ? { _id: match._id, name: match.name, email: match.email } : null
        };
      });
      return { ok: true, data: populated };
    },

    deliverOrder: async (token, orderId) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/orders/${orderId}/deliver`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          return { ok: res.ok, data };
        } catch (e) {}
      }

      // Offline Simulator Mode
      const orders = JSON.parse(localStorage.getItem('sh_orders') || '[]');
      const idx = orders.findIndex(o => o._id === orderId);
      if (idx !== -1) {
        if (orders[idx].status === 'Pending' || orders[idx].status === 'Processing') {
          orders[idx].status = 'Shipped';
        } else if (orders[idx].status === 'Shipped') {
          orders[idx].status = 'Delivered';
          orders[idx].isDelivered = true;
          orders[idx].deliveredAt = new Date().toISOString();
        }
        localStorage.setItem('sh_orders', JSON.stringify(orders));
        return { ok: true, data: orders[idx] };
      }
      return { ok: false, data: { message: 'Order not found' } };
    },

    getStats: async (token) => {
      const isOnline = await checkConnection();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/orders/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          return { ok: res.ok, data };
        } catch (e) {}
      }

      // Offline Simulator Mode
      console.log('[API Sim] Calculating simulated dashboard metrics...');
      const orders = JSON.parse(localStorage.getItem('sh_orders') || '[]');
      const products = JSON.parse(localStorage.getItem('sh_products') || '[]');
      const users = JSON.parse(localStorage.getItem('sh_users') || '[]');

      const totalSales = orders.filter(o => o.isPaid).reduce((acc, o) => acc + o.totalPrice, 0);

      // Category count
      const catsMap = {};
      products.forEach(p => {
        catsMap[p.category] = (catsMap[p.category] || 0) + 1;
      });
      const categoriesCount = Object.keys(catsMap).map(cat => ({ _id: cat, count: catsMap[cat] }));

      // Recent orders populated
      const recentOrders = orders.slice(0, 5).map((order) => {
        const uMatch = users.find(u => u._id === order.user);
        return {
          _id: order._id,
          createdAt: order.createdAt,
          totalPrice: order.totalPrice,
          isPaid: order.isPaid,
          user: uMatch ? { name: uMatch.name } : null
        };
      });

      return {
        ok: true,
        data: {
          totalSales: parseFloat(totalSales.toFixed(2)),
          totalOrders: orders.length,
          totalProducts: products.length,
          totalRegisteredUsers: users.length,
          categoriesCount,
          recentOrders
        }
      };
    }
  }
};
