# Kitchen's Bite 🍽️

A modern React Native food ordering application built with Expo, featuring real-time order management, user authentication, and admin dashboard.
iOS/Android/Web

## 🚀 Features

### User Features
- 📱 Email OTP Authentication
- 🍕 Browse menu with categories and search
- 🛒 Shopping cart management
- 📦 Order placement with multiple delivery options
- 📋 Order history and tracking
- 👤 User profile management
- 🏪 Restaurant open/closed status indicator

### Admin Features
- 📊 Admin dashboard
- 📝 Menu management (Add/Edit/Delete items)
- 🖼️ Image upload for menu items
- 📦 Order management with status updates
- ⚙️ Global settings control
- 🔐 Role-based access control

## 🛠️ Tech Stack

- **Framework:** React Native with Expo (~54.0.33)
- **Navigation:** React Navigation v7
- **Backend:** Supabase (Authentication, Database, Storage)
- **State Management:** React Hooks
- **Storage:** AsyncStorage
- **UI Components:** 
  - React Native Element Dropdown
  - React Native Loading Spinner Overlay
  - React Native Toast Message
  - Expo Vector Icons

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Supabase account

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kitchensbite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Business Configuration**
   
   Edit `config.js` to customize the app for your business:
   ```javascript
   export const BUSINESS_CONFIG = {
     businessName: "Your Restaurant Name",
     appName: "Your App Name",
     country: "Your Country",
     countryCode: "+XX", // Your country code
     currency: "Rs", // Your currency symbol
     // ... other settings
   };
   ```
   
   **Key Configuration Options:**
   - `businessName` - Your restaurant/business name
   - `countryCode` - Phone number country code (e.g., +92, +1, +44)
   - `currency` - Default currency symbol
   - `deliveryOptions` - Available delivery methods
   - `paymentOptions` - Supported payment methods
   - `orderStatuses` - Order status workflow
   - `features` - Enable/disable app features

5. **Supabase Setup**
   
   Create the following tables in your Supabase project:
   
   - `menu` - Menu items
   - `orders` - Customer orders
   - `user_roles` - User role management
   - `global_settings` - App-wide settings
   
   Create a storage bucket:
   - `menu-images` - For menu item images

## 🚀 Running the App

### Development
```bash
# Start Expo development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

## 📁 Project Structure

```
kitchensbite/
├── assets/              # Images, fonts, and other static assets
├── components/          # Reusable UI components
│   ├── Button.js
│   ├── Filter.js
│   ├── InfoBox.js
│   ├── OrderCards.js
│   ├── OrderItemList.js
│   ├── PageHeader.js
│   └── ...
├── screens/            # Screen components
│   ├── admin/         # Admin-only screens
│   │   ├── AdminHome.js
│   │   ├── AllOrders.js
│   │   ├── ManageMenu.js
│   │   ├── ManageOrder.js
│   │   └── Settings.js
│   ├── user/          # User screens
│   │   ├── Cart.js
│   │   ├── Checkout.js
│   │   ├── Home.js
│   │   ├── Orders.js
│   │   └── Profile.js
│   └── Onboarding.js  # Authentication screen
├── utils/             # Utility functions
│   ├── supabase.js   # Supabase client and API calls
│   ├── cart.js       # Cart management functions
│   ├── storage.js    # AsyncStorage wrapper
│   └── bootstrap.js  # App initialization
├── config.js         # Business configuration (CUSTOMIZE THIS!)
├── theme.js          # Design system (colors, spacing, etc.)
├── App.js           # Root component with navigation
└── index.js         # Entry point
```

## � Multi-Business Deployment

This app is designed to be easily deployed for multiple businesses across different countries.

### Quick Setup for New Business

1. **Clone the repository** for the new business
2. **Edit `config.js`** - Update all business-specific settings:
   - Business name and tagline
   - Country and country code
   - Currency symbol
   - Delivery and payment options
   - Support contact information
3. **Configure Supabase** - Set up a new Supabase project
4. **Update `.env`** - Add new Supabase credentials
5. **Customize theme** (optional) - Edit `theme.js` for brand colors
6. **Update assets** (optional) - Replace logos and images in `/assets`

### Configuration Options

**Location Settings:**
- `country` - Business location country
- `countryCode` - Phone number prefix (e.g., +92, +1, +44)
- `currency` - Local currency symbol (Rs, $, €, £, etc.)
- `timeZone` - Local timezone

**Business Operations:**
- `deliveryOptions` - Customize delivery methods
- `paymentOptions` - Add/remove payment methods (COD, Card, etc.)
- `orderStatuses` - Customize order workflow
- `businessHours` - Set operating hours

**Feature Toggles:**
- Enable/disable features per business needs
- Control guest checkout, reviews, loyalty points, etc.

### Example: Different Country Deployments

**USA:**
```javascript
countryCode: "+1",
currency: "$",
timeZone: "America/New_York",
```

**UK:**
```javascript
countryCode: "+44",
currency: "£",
timeZone: "Europe/London",
```

**Pakistan (Default):**
```javascript
countryCode: "+92",
currency: "Rs",
timeZone: "Asia/Karachi",
```

## �🎨 Theme Configuration

The app uses a centralized theme system (`theme.js`) with:

- **Color Palette:** Professional slate grey with vibrant pink accents (FoodPanda-inspired)
- **Spacing:** Consistent spacing scale (xs to xxl)
- **Typography:** Defined font sizes and weights
- **Shadows:** Pre-configured shadow styles
- **Border Radius:** Consistent corner radii

To customize colors, edit `/theme.js`:
```javascript
export const colors = {
  primary: '#1F2937',
  secondary: '#FF1744',
  // ... other colors
};
```

## 🔐 Authentication Flow

1. User enters email
2. OTP sent via Supabase Auth
3. User verifies OTP
4. Session created and persisted
5. Role-based navigation (User/Admin)

## 📦 Order Management

### Order Statuses
- `pending` - Order received
- `confirmed` - Order confirmed by admin
- `completed` - Order fulfilled
- `cancelled` - Order cancelled

### Order Flow
1. User adds items to cart
2. Proceeds to checkout
3. Selects delivery method (Delivery/Pickup)
4. Selects payment method (COD)
5. Places order
6. Admin updates order status
7. User tracks order in Orders screen

## 🌐 Platform Support

- ✅ iOS
- ✅ Android
- ✅ Web (with optimized REST API fallbacks for better performance)

## 🐛 Known Issues & Fixes

### Web Platform Optimizations
- REST API fallbacks implemented for critical database queries
- Timeout protection on all network requests (8 seconds)
- Auth state management optimized for web
- Profile loading with timeout handling

## 📝 API Documentation

### Key Supabase Functions

**Authentication:**
- `sendEmailOTP(email)` - Send OTP to email
- `verifyEmailOTP(email, token)` - Verify OTP and login
- `updateUserData(updates)` - Update user metadata
- `getUserData()` - Get current user data

**Menu:**
- `getMenuItems(includeDisabled)` - Fetch menu items
- `getMenuByFilterAndSearch(categories, searchTerm)` - Filter menu
- `updateMenuItem(...)` - Update menu item
- `addMenuItem(...)` - Add new menu item
- `deleteMenuItem(id)` - Delete menu item

**Orders:**
- `placeOrder(cartItems, deliveryMethod, paymentMethod, total)` - Place order
- `getUsersOrders()` - Get user's orders
- `getAllOrders()` - Get all orders (admin)
- `updateOrderStatus(status, id)` - Update order status

**Settings:**
- `getGlobalSettings()` - Get app settings
- `updateGlobalSettings(restaurant_available)` - Update settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add NewFeature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Contact

For questions or support, please contact the development team.

---

**Built with ❤️ using React Native and Expo**
