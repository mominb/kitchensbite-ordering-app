import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-toast-message";
import Splash from "./components/Splash";
import Onboarding from "./screens/Onboarding";
import AdminHome from "./screens/admin/AdminHome";
import AllOrders from "./screens/admin/AllOrders";
import ManageMenu from "./screens/admin/ManageMenu";
import ManageOrder from "./screens/admin/ManageOrder";
import MenuItem from "./screens/admin/MenuItem";
import Settings from "./screens/admin/Settings";
import Cart from "./screens/user/Cart";
import Checkout from "./screens/user/Checkout";
import Home from "./screens/user/Home";
import Item from "./screens/user/Item";
import OrderInfo from "./screens/user/OrderInfo";
import Orders from "./screens/user/Orders";
import Profile from "./screens/user/Profile";
import { bootstrap } from "./utils/bootstrap";
import * as cart from "./utils/cart";
import { getUserData, getUserRole, supabase } from "./utils/supabase";

const Stack = createNativeStackNavigator();

export default function App() {
  const [userRole, setUserRole] = useState();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [menuCategories, setMenuCategories] = useState([]);
  const [userMetaDataExists, setUserMetaDataExists] = useState(false);
  const [error, setError] = useState(null);

  const getUserInformation = useCallback(async () => {
    try {
      const userData = await getUserData();
      const user = userData.data?.user;
      setUserMetaDataExists(
        Boolean(user?.user_metadata?.displayName && user?.user_metadata?.phone),
      );
      const role = await getUserRole();
      if (role?.[0]?.role) {
        setUserRole(role[0].role);
      }
    } catch (err) {
      console.error("Error getting user information:", err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const withTimeout = (promise, ms, fallback) =>
        Promise.race([
          promise,
          new Promise((resolve) => setTimeout(() => resolve(fallback), ms)),
        ]);
      
      try {
        const data = await withTimeout(bootstrap(), 5000, [[], null]);
        setMenuCategories(data[0] || []);

        const sessionResult = await withTimeout(
          supabase.auth.getSession(),
          5000,
          { data: { session: null } },
        );
        setSession(sessionResult?.data?.session ?? null);
        
        if (sessionResult?.data?.session) {
          await withTimeout(getUserInformation(), 3000, null);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error during bootstrap:", err);
        setLoading(false);
      }
    };

    load();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);
        if (currentSession) {
          await getUserInformation();
        } else {
          setUserMetaDataExists(false);
          setUserRole(undefined);
        }
      },
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [getUserInformation]);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Startup issue",
        text2: error,
      });
    }
  }, [error]);

  if (loading) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session && userRole === "admin" ? (
          <>
            <Stack.Screen name="AdminHome" component={AdminHome} />
            <Stack.Screen name="AllOrders" component={AllOrders} />
            <Stack.Screen name="ManageOrder" component={ManageOrder} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="ManageMenu" component={ManageMenu} />
            <Stack.Screen name="MenuItem" component={MenuItem} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home">
              {(props) => (
                <Home
                  {...props}
                  menuCategories={menuCategories}
                  session={session}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="Item">
              {(props) => <Item {...props} session={session} />}
            </Stack.Screen>

            <Stack.Screen name="Cart">
              {(props) => (
                <Cart
                  {...props}
                  session={session}
                  userMetaDataExists={userMetaDataExists}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="Checkout">
              {(props) => (
                <Checkout
                  {...props}
                  session={session}
                  userMetaDataExists={userMetaDataExists}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="Orders">
              {(props) => <Orders {...props} session={session} />}
            </Stack.Screen>

            <Stack.Screen name="OrderInfo" component={OrderInfo} />

            <Stack.Screen name="Profile">
              {(props) => (
                <Profile
                  {...props}
                  session={session}
                  refreshUserInfo={getUserInformation}
                  deleteUserCart={cart.deleteAllCartRows}
                />
              )}
            </Stack.Screen>

            <Stack.Screen
              name="Onboarding"
              component={Onboarding}
              options={{ presentation: "modal" }}
            />
          </>
        )}
      </Stack.Navigator>
      <Toast />

      <Spinner
        visible={loading}
        textContent="Loading..."
        textStyle={{ color: "#fff" }}
      />
    </NavigationContainer>
  );
}
