# 🛒 BazarDor – Daily Market Price Tracker

BazarDor is a responsive web application that helps users explore and compare daily prices of essential products in Bangladesh. It provides updated market price information for rice, lentils, cooking oil, vegetables, fish, meat, and other daily necessities.

## 🚀 Features

- **Daily Market Prices:** View current prices of essential products.
- **Price Comparison:** Identify products with increased or decreased prices.
- **Product Categories:** Browse products by category.
- **Sorting:** Sort products by price from low to high or high to low.
- **Product Details:** View individual product information and market-wise prices.
- **Authentication:** Sign up, sign in, and Google authentication using Better Auth.
- **User Profile:** View and update profile information.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.
- **Custom 404 Page:** User-friendly page for invalid routes.
- **Loading States:** HeroUI spinners while data is loading.

## 🛠️ Technologies Used

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- HeroUI
- Lucide React
- Better Auth
- MongoDB
- React Toastify
- Programming Hero BazarDor API

## 📁 Project Structure

```text
src/
└── app/
    ├── (auth)/
    │   ├── sign-in/
    │   └── sign-up/
    ├── api/
    ├── category/
    │   └── [slug]/
    ├── component/
    │   ├── footer/
    │   ├── home/
    │   ├── navbar/
    │   └── shared/
    ├── lib/
    ├── product/
    │   └── [slug]/
    ├── profile/
    ├── types/
    ├── globals.css
    ├── layout.tsx
    ├── not-found.tsx
    └── page.tsx
```

## ⚙️ Installation

**1. Clone the repository**

```bash
git clone https://github.com/humaeidmansur/auth-project-assignment-7.git
```

**2. Navigate to the project folder**

```bash
cd authentication-project
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create a `.env` file in the project root:

```env
const client = new MongoClient(process.env.DATABASE_URI!);
secret: process.env.BETTER_AUTH_SECRET,
baseURL: process.env.BETTER_AUTH_URL,
google: 
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
github: 
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
```

**5. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📡 API

BazarDor uses the Programming Hero BazarDor API to retrieve product and market price information.

**Base URL:**

```text
https://openapi.programming-hero.com/api/bazardor
```

## 👨‍💻 Developer

**Humaeid Bin Mansur**

International Business Student | AI & Software Engineering

-