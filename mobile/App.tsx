import { useState, useEffect } from "react"
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native"
import * as SecureStore from "expo-secure-store"
import { StatusBar } from "expo-status-bar"
import { Provider } from "react-redux"
import { store } from "./src/store/store"
import { setToken } from "./src/store/token"
import LoginScreen from "./src/screens/LoginScreen"
import RegisterScreen from "./src/screens/RegisterScreen"
import DashboardScreen from "./src/screens/DashboardScreen"
import CustomersScreen from "./src/screens/CustomersScreen"
import CustomerDetailScreen from "./src/screens/CustomerDetailScreen"
import AddCustomerScreen from "./src/screens/AddCustomerScreen"
import EditCustomerScreen from "./src/screens/EditCustomerScreen"
import AddJarEntryScreen from "./src/screens/AddJarEntryScreen"
import EditJarEntryScreen from "./src/screens/EditJarEntryScreen"
import PlanSelectionScreen from "./src/screens/PlanSelectionScreen"
import ReviewsScreen from "./src/screens/ReviewsScreen"
import ChartsScreen from "./src/screens/ChartsScreen"

type NavScreen =
  | { name: "login" }
  | { name: "register" }
  | { name: "dashboard" }
  | { name: "customers" }
  | { name: "customerDetail"; customerId: string }
  | { name: "addCustomer" }
  | { name: "editCustomer"; customerId: string }
  | { name: "addJarEntry"; customerId: string }
  | { name: "editJarEntry"; entryId: string }
  | { name: "planSelection" }
  | { name: "reviews" }
  | { name: "charts" }

const SCREEN_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  customers: "Customers",
  customerDetail: "Customer",
  addCustomer: "Add Customer",
  editCustomer: "Edit Customer",
  addJarEntry: "Add JAR Entry",
  editJarEntry: "Edit JAR Entry",
  planSelection: "Plans",
  reviews: "Reviews",
  charts: "Charts",
}

function AppInner() {
  const [screen, setScreen] = useState<NavScreen>({ name: "login" })
  const [vendor, setVendor] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([SecureStore.getItemAsync("token"), SecureStore.getItemAsync("vendor")]).then(([t, v]) => {
      if (t) {
        setToken(t)
        if (v) setVendor(JSON.parse(v))
        setScreen({ name: "dashboard" })
      }
      setLoading(false)
    })
  }, [])

  const handleLogin = async (newToken: string, newVendor: any) => {
    setToken(newToken)
    await SecureStore.setItemAsync("token", newToken)
    await SecureStore.setItemAsync("vendor", JSON.stringify(newVendor))
    setVendor(newVendor)
    setScreen({ name: "dashboard" })
  }

  const handleLogout = async () => {
    setToken(null)
    await SecureStore.deleteItemAsync("token")
    await SecureStore.deleteItemAsync("vendor")
    setVendor(null)
    setScreen({ name: "login" })
  }

  const navigate = (name: string, params?: any) => {
    setScreen({ name, ...params } as NavScreen)
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" }}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <StatusBar style="auto" />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <StatusBar style={screen.name === "login" || screen.name === "register" ? "dark" : "light"} />

      {screen.name === "login" && (
        <LoginScreen onLogin={handleLogin} onGoToRegister={() => setScreen({ name: "register" })} />
      )}

      {screen.name === "register" && (
        <RegisterScreen onBack={() => setScreen({ name: "login" })} onRegister={handleLogin} />
      )}

      {screen.name !== "login" && screen.name !== "register" && (
        <View style={{ flex: 1 }}>
          <View style={{ backgroundColor: "#7C3AED", paddingTop: 48, paddingBottom: 12, paddingHorizontal: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <TouchableOpacity onPress={() => screen.name === "dashboard" ? setScreen({ name: "login" }) : setScreen({ name: "dashboard" })}>
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: "500" }}>{screen.name === "dashboard" ? "Home" : "← Back"}</Text>
            </TouchableOpacity>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>{SCREEN_TITLES[screen.name] || "App"}</Text>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>{screen.name === "dashboard" ? "Logout" : ""}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            {screen.name === "dashboard" && (
              <DashboardScreen vendor={vendor} onNavigate={navigate} />
            )}
            {screen.name === "customers" && (
              <CustomersScreen onNavigate={navigate} />
            )}
            {screen.name === "customerDetail" && (
              <CustomerDetailScreen customerId={(screen as any).customerId} onNavigate={navigate} onBack={() => setScreen({ name: "customers" })} />
            )}
            {screen.name === "addCustomer" && (
              <AddCustomerScreen onBack={() => setScreen({ name: "customers" })} />
            )}
            {screen.name === "editCustomer" && (
              <EditCustomerScreen customerId={(screen as any).customerId} onBack={() => setScreen({ name: "customers" })} />
            )}
            {screen.name === "addJarEntry" && (
              <AddJarEntryScreen customerId={(screen as any).customerId} onBack={() => setScreen({ name: "customerDetail", customerId: (screen as any).customerId })} />
            )}
            {screen.name === "editJarEntry" && (
              <EditJarEntryScreen entryId={(screen as any).entryId} onBack={() => navigate("dashboard")} />
            )}
            {screen.name === "planSelection" && (
              <PlanSelectionScreen onBack={() => setScreen({ name: "dashboard" })} />
            )}
            {screen.name === "reviews" && (
              <ReviewsScreen onBack={() => setScreen({ name: "dashboard" })} />
            )}
            {screen.name === "charts" && (
              <ChartsScreen onBack={() => setScreen({ name: "dashboard" })} />
            )}
          </View>
        </View>
      )}
    </View>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  )
}
