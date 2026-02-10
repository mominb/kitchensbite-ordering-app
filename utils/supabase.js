import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import { appStorage } from "./storage";
import { Platform } from "react-native";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const withQueryTimeout = async (queryPromise, timeoutMs = 8000) => {
   if (Platform.OS !== "web") {
      return await queryPromise;
   }
   
   return Promise.race([
      queryPromise,
      new Promise((_, reject) =>
         setTimeout(() => reject(new Error("Query timeout")), timeoutMs)
      ),
   ]);
};

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
   console.error("Missing Supabase env vars.");
}

export const supabase = createClient(
   SUPABASE_URL,
   SUPABASE_ANON_KEY,
   {
      auth: {
         storage: appStorage,
         persistSession: true,
         autoRefreshToken: true,
         detectSessionInUrl: Platform.OS === "web",
         debug: __DEV__ && Platform.OS === "web",
      },
   },
);

const MENU_IMAGE_BUCKET = "menu-images";
const buildPublicUrlPrefix = () =>
   `${SUPABASE_URL}/storage/v1/object/public/${MENU_IMAGE_BUCKET}/`;

const getStoragePathFromPublicUrl = (publicUrl) => {
   if (!publicUrl) return null;
   const prefix = buildPublicUrlPrefix();
   if (!publicUrl.startsWith(prefix)) return null;
   const path = publicUrl.replace(prefix, "");
   return path.split("?")[0];
};

const getFileExtension = (uri) => {
   const cleanUri = uri.split("?")[0];
   const parts = cleanUri.split(".");
   return parts.length > 1 ? parts.pop() : "jpg";
};

const buildMenuImagePath = (uri, itemId) => {
   const extension = getFileExtension(uri);
   const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
   const prefix = itemId ? `menu/${itemId}` : "menu/new";
   return `${prefix}/${uniqueSuffix}.${extension}`;
};

export async function uploadMenuImage({ uri, itemId }) {
   try {
      const response = await fetch(uri);
      const arrayBuffer = await response.arrayBuffer();
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
         console.log("error uploading menu image: empty file");
         return { error: new Error("Empty file") };
      }
      const path = buildMenuImagePath(uri, itemId);
      const { data, error } = await supabase.storage
         .from(MENU_IMAGE_BUCKET)
         .upload(path, arrayBuffer, {
            contentType: response.headers.get("Content-Type") || "image/jpeg",
            upsert: true,
         });

      if (error) {
         console.log("error uploading menu image: ", error);
         return { error };
      }

      const { data: publicData } = supabase.storage
         .from(MENU_IMAGE_BUCKET)
         .getPublicUrl(data.path);

      return { publicUrl: publicData.publicUrl, path: data.path, error: null };
   } catch (error) {
      console.log("error uploading menu image: ", error);
      return { error };
   }
}

export async function deleteMenuImageByUrl(imageUrl) {
   const path = getStoragePathFromPublicUrl(imageUrl);
   if (!path) return { error: null };

   const { error } = await supabase.storage
      .from(MENU_IMAGE_BUCKET)
      .remove([path]);
   if (error) {
      console.log("error deleting menu image: ", error);
      return { error };
   }
   return { error: null };
}

export async function sendEmailOTP(email) {
   const { error } = await supabase.auth.signInWithOtp({ email });

   if (error) {
      console.log(error.message);
      return "error";
   }
   return "success";
}

export async function verifyEmailOTP(email, token) {
   const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
   });

   if (error) {
      console.log(error.message);
      return { error };
   }

   return { session: data.session, error: null };
}

export async function updateUserData(updates) {
   const { data, error } = await supabase.auth.updateUser({ data: updates });
   if (error) {
      console.log("error updating user data in supabase: ", error);
      return { error };
   }
   return { user: data.user, error: null };
}

export async function getUserData() {
   try {
      const authPromise = supabase.auth.getUser();
      const { data, error } = await withQueryTimeout(authPromise, 5000);

      if (error) {
         console.log("error retrieving user data from supabase: ", error);
         return { error };
      }

      return { data, error: null };
   } catch (error) {
      console.log("getUserData exception:", error);
      return { error };
   }
}

export async function placeOrder(
   cartItems,
   deliveryMethod,
   paymentMethod,
   total_price,
) {
   const user = await getUserData();
   const orderItems = cartItems.map((item) => ({
      name: item.name,
      quantity: item.amount,
   }));
   const { error } = await supabase.from("orders").insert([
      {
         order_items: orderItems,
         payment_mode: paymentMethod,
         delivery_mode: deliveryMethod,
         total_price: total_price,
         user_data: user.data?.user?.user_metadata,
      },
   ]);
   if (error) {
      console.log("error placing order: ", error);
      return { error };
   }
   return { error: null };
}

export async function getUsersOrders() {
   const { data: userData, error: userErr } = await supabase.auth.getUser();
   if (userErr) {
      console.log("error getting user: ", userErr);
      return [];
   }
   const userId = userData?.user?.id;
   const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
   if (error) {
      console.log("error retrieving user orders: ", error);
      return [];
   }
   return data;
}

export async function getAllOrders() {
   const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
   if (error) {
      console.log("error retrieving user orders: ", error);
      return [];
   }
   return data;
}

export async function getUserRole() {
   try {
      const authPromise = supabase.auth.getUser();
      const { data: userData, error: userErr } = await withQueryTimeout(authPromise, 5000);
      
      if (userErr) {
         console.log("error getting user: ", userErr);
         return [];
      }
      
      const userId = userData?.user?.id;
      if (!userId) {
         return [];
      }
      
      const query = supabase
         .from("user_roles")
         .select("*")
         .eq("user_id", userId);
      
      const { data, error } = await withQueryTimeout(query);
      
      if (error) {
         console.log("error retrieving user roles: ", error);
         return [];
      }

      return data || [];
   } catch (error) {
      console.log("getUserRole exception:", error);
      return [];
   }
}

export async function updateOrderStatus(status, id) {
   const { error } = await supabase
      .from("orders")
      .update({ order_status: status })
      .eq("id", id);
   if (error) {
      console.log("error updating order status: ", error);
      return { error };
   }
   return { error: null };
}

export async function getMenuItems(includeDisabled = false) {
   let query = supabase.from("menu").select("*");
   if (!includeDisabled) {
      query = query.eq("is_disabled", false);
   }
   const { data, error } = await query;
   if (error) {
      console.log("error fetching menu items: ", error);
      return [];
   }
   return data;
}

export async function updateMenuItem(
   id,
   name,
   description,
   price,
   category,
   is_disabled,
   image_url,
) {
   const { error } = await supabase
      .from("menu")
      .update({ name, description, price, category, is_disabled, image_url })
      .eq("id", id);
   if (error) {
      console.log("error updating menu item: ", error);
      return { error };
   } else {
      console.log("menu updated");
      return { error: null };
   }
}

export async function addMenuItem(
   name,
   description,
   price,
   category,
   is_disabled,
   image_url,
) {
   const { error } = await supabase
      .from("menu")
      .insert({ name, description, price, category, is_disabled, image_url });
   if (error) {
      console.log("error adding menu item: ", error);
      return { error };
   } else {
      console.log("menu updated");
      return { error: null };
   }
}

export async function deleteMenuItem(id) {
   const { error } = await supabase.from("menu").delete().eq("id", id);
   if (error) {
      console.log("error deleting menu item: ", error);
      return { error };
   } else {
      console.log("menu updated");
      return { error: null };
   }
}

export async function getGlobalSettings() {
   try {
      const query = supabase
         .from("global_settings")
         .select("*")
         .eq("id", true);
      
      const { data, error } = await withQueryTimeout(query);

      if (error) {
         console.log("error fetching global settings: ", error);
         return [];
      }
      return data || [];
   } catch (error) {
      console.log("getGlobalSettings exception:", error);
      return [];
   }
}

export async function updateGlobalSettings(restaurant_available) {
   const { error } = await supabase
      .from("global_settings")
      .update({ restaurant_available })
      .eq("id", true);
   if (error) {
      console.log("error updating global settings: ", error);
   }
}

export async function getMenuByFilterAndSearch(categories, searchTerm) {
   try {
      let query = supabase.from("menu").select("*").eq("is_disabled", false);

      if (searchTerm) {
         query = query.ilike("name", `%${searchTerm}%`);
      }

      if (categories?.length) {
         query = query.in("category", categories);
      }

      const { data, error } = await query;
      if (error) {
         console.log("error filtering menu items: ", error);
         return [];
      }
      return data || [];
   } catch (error) {
      console.log("getMenuByFilterAndSearch exception:", error);
      return [];
   }
}

export async function getMenuCategories() {
   try {
      const query = supabase
         .from("menu")
         .select("category")
         .eq("is_disabled", false);
      
      const { data, error } = await withQueryTimeout(query);
      
      if (error) {
         console.log("error fetching menu categories: ", error);
         return [];
      }
      const categories = [];
      data?.forEach((item) => {
         if (item.category && !categories.includes(item.category)) {
            categories.push(item.category);
         }
      });
      return categories;
   } catch (error) {
      console.log("getMenuCategories exception:", error);
      return [];
   }
}
