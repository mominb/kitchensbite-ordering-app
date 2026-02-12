/**
 * Business Configuration
 * 
 * This file contains all business-specific settings that can be customized
 * for different deployments of the app.
 * 
 * IMPORTANT: Update these values for each business deployment
 */

export const BUSINESS_CONFIG = {
  // Business Identity
  businessName: "Kitchen's Bite",
  businessTagline: "Delicious food at your doorstep",
  
  // Location & Contact
  country: "Pakistan",
  countryCode: "+92",
  currency: "Rs", // Default currency symbol (can be overridden by database settings)
  
  // App Identity
  appName: "Kitchen's Bite",
  appVersion: "1.0.0",
  
  // Default Settings
  defaultLanguage: "en",
  timeZone: "Asia/Karachi",
  
  // Business Hours (Optional - can be managed via admin settings)
  businessHours: {
    open: "09:00",
    close: "23:00",
  },
  
  // Support Information
  supportEmail: "support@kitchensbite.com",
  supportPhone: "+92-XXX-XXXXXXX",
  supportWhatsApp: "+92-XXX-XXXXXXX",
  
  // Delivery Options
  deliveryOptions: [
    { label: "Deliver to Doorstep", value: "Delivery" },
    { label: "Pick-up from Restaurant", value: "Pickup" },
  ],
  
  // Payment Options
  paymentOptions: [
    { label: "Cash on Delivery", value: "COD" },
    // Add more payment methods as needed
    // { label: "Credit/Debit Card", value: "Card" },
    // { label: "Mobile Wallet", value: "Wallet" },
  ],
  
  // Order Status Values
  orderStatuses: [
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ],
  
  // Feature Flags
  features: {
    enableUserRegistration: true,
    enableGuestCheckout: false,
    enableOrderTracking: true,
    enableReviews: false,
    enableLoyaltyPoints: false,
    enableMultipleAddresses: false,
  },
  
  // Social Media Links (Optional)
  socialMedia: {
    facebook: "",
    instagram: "",
    twitter: "",
    website: "",
  },
  
  // Restaurant/Business Address
  businessAddress: {
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Pakistan",
  },

  // Validation Rules & Regex Patterns
  validation: {
    // Phone number validation (without country code prefix)
    // Pakistan: 10 digits starting with 3
    phoneRegex: /^3[0-9]{9}$/,
    phoneFormat: "3XX XXXXXXX",
    phoneMinLength: 10,
    phoneMaxLength: 10,
    phoneErrorMessage: "Invalid number",
    
    // Examples for other countries:
    // USA: /^[2-9][0-9]{9}$/ (10 digits, first digit 2-9)
    // UK: /^[0-9]{10}$/ (10 digits)
    // India: /^[6-9][0-9]{9}$/ (10 digits starting with 6-9)
    
    // Email validation
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    emailErrorMessage: "Please enter a valid email address",
    
    // Postal code validation (can vary by country)
    postalCodeRegex: /^[0-9]{5}$/,
    postalCodeFormat: "XXXXX",
    postalCodeErrorMessage: "Postal code must be 5 digits",
    
    // Examples for other countries:
    // USA: /^[0-9]{5}(-[0-9]{4})?$/ (ZIP code: 12345 or 12345-6789)
    // UK: /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i (Postcode: SW1A 1AA)
    // Canada: /^[A-Z][0-9][A-Z]\s?[0-9][A-Z][0-9]$/i (Postal code: K1A 0B1)
    
    // Name validation
    nameMinLength: 2,
    nameMaxLength: 50,
    nameRegex: /^[a-zA-Z\s'-]+$/,
    nameErrorMessage: "Name can only contain letters, spaces, hyphens, and apostrophes",
    
    // Order ID format (for display)
    orderIdLength: 8,
    orderIdFormat: "XXXXXXXX",
    
    // Price validation
    priceRegex: /^\d+(\.\d{1,2})?$/,
    priceErrorMessage: "Price must be a valid number with up to 2 decimal places",
    minPrice: 0,
    maxPrice: 999999,
    
    // Quantity validation
    minOrderQuantity: 1,
    maxOrderQuantity: 99,
  },

  // Country-Specific Formats
  formats: {
    // Date format for display
    dateFormat: "DD/MM/YYYY",
    dateTimeFormat: "DD/MM/YYYY hh:mm A",
    
    // Time format
    timeFormat: "hh:mm A", // 12-hour format with AM/PM
    use24HourFormat: false,
    
    // Currency format
    currencyPosition: "left", // 'left' or 'right' (Rs 100 vs 100 Rs)
    currencySpacing: true, // Add space between currency and amount
    decimalSeparator: ".",
    thousandSeparator: ",",
    currencyDecimals: 2,
  },
};

// Validation helper functions
export const validatePhone = (phone) => {
  const { phoneRegex, phoneErrorMessage } = BUSINESS_CONFIG.validation;
  if (!phoneRegex.test(phone)) {
    return { valid: false, message: phoneErrorMessage };
  }
  return { valid: true };
};

export const validateEmail = (email) => {
  const { emailRegex, emailErrorMessage } = BUSINESS_CONFIG.validation;
  if (!emailRegex.test(email)) {
    return { valid: false, message: emailErrorMessage };
  }
  return { valid: true };
};

export const validateName = (name) => {
  const { nameMinLength, nameMaxLength, nameRegex, nameErrorMessage } = BUSINESS_CONFIG.validation;
  if (!name || name.length < nameMinLength || name.length > nameMaxLength) {
    return { valid: false, message: `Name must be between ${nameMinLength} and ${nameMaxLength} characters` };
  }
  if (!nameRegex.test(name)) {
    return { valid: false, message: nameErrorMessage };
  }
  return { valid: true };
};

export const formatCurrency = (amount) => {
  const { currencyPosition, currencySpacing, decimalSeparator, thousandSeparator, currencyDecimals } = BUSINESS_CONFIG.formats;
  const { currency } = BUSINESS_CONFIG;
  
  // Format number with thousands separator and decimals
  const formattedAmount = Number(amount)
    .toFixed(currencyDecimals)
    .replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
    .replace('.', decimalSeparator);
  
  const space = currencySpacing ? ' ' : '';
  
  if (currencyPosition === 'left') {
    return `${currency}${space}${formattedAmount}`;
  } else {
    return `${formattedAmount}${space}${currency}`;
  }
};

export const formatPhoneNumber = (phone) => {
  const { countryCode } = BUSINESS_CONFIG;
  // Remove any existing country code and format
  const cleanPhone = phone.replace(/^\+?\d{1,3}\s?/, '').replace(/\D/g, '');
  return `${countryCode}${cleanPhone}`;
};

// Export individual items for convenience
export const {
  businessName,
  appName,
  countryCode,
  currency,
  deliveryOptions,
  paymentOptions,
  orderStatuses,
  features,
  validation,
  formats,
} = BUSINESS_CONFIG;
