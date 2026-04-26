# AURA | Premium Women's Fashion E-Commerce

![AURA Banner](https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

A modern, responsive, and beautifully designed full-stack e-commerce web application for a premium women's fashion brand. Built with React and Node.js, AURA focuses on a "wow" visual experience, smooth micro-interactions, and a seamless user journey from product discovery to checkout.

## ✨ Features

### Frontend (User Experience)
*   **Dynamic Product Discovery**: Filter products by Category, Color, and Sort by Price or Newest.
*   **Premium UI/UX**: Clean, minimalist design featuring glassmorphism effects, modern typography (Inter), and subtle hover animations.
*   **Authentication**: Beautiful, modal-based Sign In / Sign Up flow with visual feedback.
*   **Shopping Cart & Wishlist**: Persistent slide-over cart and wishlist components. Dynamic "Free Shipping" progress bar indicator.
*   **Product Details**: Comprehensive product views including image galleries, size selection, accordion-style details, and customer reviews.
*   **Checkout Flow**: Clean, step-by-step mock checkout interface collecting shipping and payment details.
*   **Fully Responsive**: Carefully crafted CSS ensures the platform looks perfect on mobile phones, tablets, and large desktop screens.

### Backend (API)
*   **RESTful API**: Node.js and Express backend serving product data and handling business logic.
*   **User Authentication**: Endpoint routing for user registration and login.
*   **Order Management**: Checkout endpoints to receive and process user orders.
*   **CORS Enabled**: Seamless communication between the React development server and the Express API.

## 🛠️ Technology Stack

*   **Frontend**: React 19, Vite, Vanilla CSS, Lucide React (Icons)
*   **Backend**: Node.js, Express.js
*   **State Management**: React Hooks (useState, useEffect)
*   **Routing**: React Router DOM

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone https://github.com/Soundaryajothi/ecommerce-.git
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

### Running the Application

To run this application, you need to start **both** the backend API server and the frontend React development server.

1.  **Start the Backend API Server**:
    Open a terminal in the project directory and run:
    ```bash
    node server.js
    ```
    *The backend server will start on `http://localhost:5000`*

2.  **Start the Frontend Development Server**:
    Open a **second, separate terminal** in the same project directory and run:
    ```bash
    npm run dev
    ```
    *The frontend application will start (typically on `http://localhost:5173` or `5174`). Click the local link in your terminal to open it in your browser.*

## 📂 Project Structure

```text
├── public/                 # Static assets (Favicons, product images)
├── src/                    
│   ├── App.jsx             # Main application component & routes
│   ├── index.css           # Global styles and design system tokens
│   └── main.jsx            # React entry point
├── server.js               # Node.js/Express backend API server
├── package.json            # Project dependencies and scripts
└── vite.config.js          # Vite configuration
```

## 🔮 Future Roadmap (Next Steps)
*   **Database Integration**: Replace in-memory array storage with a robust database (MongoDB or PostgreSQL) for persistent user accounts and orders.
*   **Payment Gateway**: Integrate Stripe or PayPal API for real payment processing during checkout.
*   **Admin Dashboard**: Create a protected `/admin` route for store owners to manage inventory and view orders.

---

