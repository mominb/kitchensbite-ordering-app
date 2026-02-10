import { appStorage } from "./storage";

const CART_STORAGE_KEY = "@kitchensbite_cart";

// Get all cart items
export async function getMenuItemsInCart() {
   try {
      const cartData = await appStorage.getItem(CART_STORAGE_KEY);
      return cartData ? JSON.parse(cartData) : [];
   } catch (error) {
      console.log("Error getting cart items:", error);
      return [];
   }
}

// Save item to cart
export async function saveItemToCart(item, amount) {
   try {
      const cartItems = await getMenuItemsInCart();
      const existingItemIndex = cartItems.findIndex((i) => i.item_id === item.id);

      if (existingItemIndex >= 0) {
         // Update existing item
         cartItems[existingItemIndex].amount += amount;
      } else {
         // Add new item
         cartItems.push({
            item_id: item.id,
            name: item.name,
            price: item.price,
            description: item.description,
            image_url: item.image_url,
            category: item.category,
            amount: amount,
         });
      }

      await appStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      return { type: "success", message: "Item added to cart" };
   } catch (error) {
      console.log("Add to cart failed:", error);
      return { type: "error", message: "Failed to add item" };
   }
}

// Delete cart item
export async function deleteCartItem(item_id) {
   try {
      const cartItems = await getMenuItemsInCart();
      const filteredItems = cartItems.filter((item) => item.item_id !== item_id);
      await appStorage.setItem(CART_STORAGE_KEY, JSON.stringify(filteredItems));
      return { type: "success", message: "Item deleted from cart" };
   } catch (error) {
      console.log("Deletion from cart failed:", error);
      return { type: "error", message: "Failed to delete item" };
   }
}

// Get cart item count
export async function cartItemCount() {
   const cartItems = await getMenuItemsInCart();
   return cartItems.length;
}

// Change item quantity in cart
export async function changeItemQtyInCart(item_id, operation) {
   try {
      const cartItems = await getMenuItemsInCart();
      const itemIndex = cartItems.findIndex((item) => item.item_id === item_id);

      if (itemIndex >= 0) {
         if (operation === "increase") {
            cartItems[itemIndex].amount += 1;
         } else if (operation === "decrease" && cartItems[itemIndex].amount > 1) {
            cartItems[itemIndex].amount -= 1;
         }
         await appStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      }
   } catch (error) {
      console.log("Error changing item quantity:", error);
   }
}

// Get total cart cost
export async function getTotalCartCost() {
   try {
      const cartItems = await getMenuItemsInCart();
      const total = cartItems.reduce(
         (sum, item) => sum + item.amount * item.price,
         0
      );
      return total;
   } catch (error) {
      console.log("Error calculating total cost of cart:", error);
      return 0;
   }
}

// Delete all cart items
export async function deleteAllCartRows() {
   try {
      await appStorage.removeItem(CART_STORAGE_KEY);
   } catch (error) {
      console.log("Error clearing cart:", error);
   }
}
