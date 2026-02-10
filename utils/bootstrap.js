import { getMenuCategories } from "./supabase";
import { appStorage } from "./storage";

export async function bootstrap() {
   try {
      const menuCategories = await getMenuCategories();
      const isOnboarded = await appStorage.getItem("isOnboarded");
      return [menuCategories, isOnboarded];
   } catch (error) {
      console.error("Bootstrap error:", error);
      return [[], null];
   }
}
