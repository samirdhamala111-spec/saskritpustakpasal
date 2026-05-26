# StationeryHub 🎨✍️

StationeryHub is a high-fidelity, fully functional modern e-commerce platform specializing in premium stationery products (Notebooks, Pens, Pencils, Markers, Sticky Notes, Files, School Bags, and Art Supplies). It is built using the **MERN Stack** (MongoDB, Express, React, Node) with **Tailwind CSS** for a breathtaking glassmorphic dark/light visual aesthetic.

---

## 🚀 Key Features

*   **Secure Authentication**: Secure registers and login sessions utilizing JSON Web Tokens (JWT) and `bcryptjs` password hashing.
*   **Persistent Shopping Cart**: Dynamically synchronization between local storage (for guest browsing) and MongoDB collections (when authenticated).
*   **Wishlist System**: Single-click toggles to pin desired items, cached directly under customer profiles.
*   **Advanced Catalog Search & Filters**: Search catalog parameters via search keywords, category tags, price range limits, and sort configurations.
*   **Product Reviews System**: Tabbed specifications panels with interactive review submissions and dynamically computed average score ratios.
*   **3D Credit Card Checkout**: A gorgeous, animated billing card graphic that updates in real-time as users type and flips in 3D when focusing on the CVV input.
*   **Staff Command Dashboard**: Administrative dashboard stats, user directories, catalog inventories (CRUD with modals), and order dispatch tracking milestones.
*   **Printable Invoices**: Clean, structured invoice summaries styled perfectly for paper printing.
*   **Production-Ready Structure**: Clean environment variables, CORS configs, unified error handlers, and Express controllers.

---

## 📂 Project Structure

```
d:/internhsip/
├── backend/                   # Node.js + Express backend
│   ├── config/                # Database connection
│   ├── controllers/           # REST API Route controllers
│   ├── middleware/            # Security validation & error handlers
│   ├── models/                # MongoDB Database schemas
│   ├── routes/                # REST API endpoints mappings
│   ├── utils/                 # Seeding scripts & JWT helpers
│   ├── .env                   # Local configuration keys (created during installation)
│   ├── .env.example           # Configuration template
│   ├── package.json           # Backend package configs
│   └── server.js              # Express main entrypoint
├── frontend/                  # React.js + Tailwind CSS frontend
│   ├── src/
│   │   ├── components/        # Reusable navbar, footer, cards, ratings
│   │   ├── context/           # Session auth & cart sync engines
│   │   ├── pages/             # Route pages (Home, Products, Details, Cart, Checkout, Dashboard)
│   │   ├── index.css          # Styling layers (Glassmorphic definitions,Outfit fonts)
│   │   ├── App.jsx            # React route mappings
│   │   └── main.jsx           # App bootstrap
│   ├── tailwind.config.js     # Tailwind extended configurations
│   ├── postcss.config.js      # PostCSS mappings
│   ├── vite.config.js         # Vite settings
│   └── package.json           # Frontend package configs
└── README.md                  # Unified installation manual
```

---

## 🛠️ Local Installation & Setup

Follow these simple steps to configure and boot StationeryHub on your computer:

### Prerequisites
*   [Node.js](https://nodejs.org/) installed (v18+ recommended)
*   [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed and active locally, OR a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection URI.

---

### Step 1: Clone or Open the Project
Open your terminal inside the workspace directory `d:\internhsip\`.

### Step 2: Set up the Backend
1.  Navigate to the backend directory and verify package structures:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure your environment parameters. Replicate the template `.env.example` into a local `.env` file (one has been pre-created for you during installation with standard community paths):
    *   `PORT=5000`
    *   `NODE_ENV=development`
    *   `MONGO_URI=mongodb://127.0.0.1:27017/stationeryhub`
    *   `JWT_SECRET=stationeryhub_secret_key_2026`

---

### Step 3: Seed Sample Products
Populate your database collections with default users and Unsplash sample stationery products by triggering our seeding utility script:
```bash
npm run seed
```
> [!NOTE]  
> This command will purge any pre-existing records in user, product, and cart schemas to inject high-quality mock objects.
> It creates two default accounts for easy evaluation:
> *   **Staff Admin**: `admin@stationeryhub.com` / `admin123`
> *   **Customer User**: `user@stationeryhub.com` / `user123`

---

### Step 4: Set up the Frontend
1.  Open a new terminal window inside the root directory and navigate to the frontend React folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

---

## 💻 Running the Application

### 1. Boot the Backend Server
Inside the `/backend` folder, start the development REST API server:
```bash
npm run dev
```
The server will bind to `http://localhost:5000` and output confirmation:
```
MongoDB Connected successfully: 127.0.0.1
StationeryHub Backend Server is active in development mode on port 5000
```

### 2. Boot the Frontend React App
Inside the `/frontend` folder, boot the Vite local dev engine:
```bash
npm run dev
```
The application will launch on `http://localhost:5173` (or the first available port). 

Open your browser and navigate to the address to experience **StationeryHub**!

---

## 🎨 Premium Theme Architecture
*   **Palette**: Glassmorphic panels with blur-saturations, overlaying Indigo, Violet, Purple, and Royal Blue radial gradient spotlights.
*   **Responsive Gating**: Layouts adapt perfectly for phone screens, tablets, and full desktop displays.
*   **Fluid Animations**: Smooth transitions, float elements, card expansions, heart pulses, and billing card flips.
