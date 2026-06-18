import { useState, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from "react-native"
import { useVendorLoginMutation } from "../apis/vendor.api"
import { useGetReviewsQuery } from "../apis/review.api"
import StarRating from "../components/StarRating"

const FEATURES = [
  { title: "Organized Storage", desc: "Keep all your JAR data categorized and easily accessible.", emoji: "📦", color: "#7C3AED" },
  { title: "Secure Access", desc: "Role-based authentication ensures only authorized users manage data.", emoji: "🔒", color: "#2563EB" },
  { title: "Real-time Tracking", desc: "Monitor JAR status and delivery history with live updates.", emoji: "📊", color: "#059669" },
  { title: "Sales Analytics", desc: "Track monthly sales, customer trends, and revenue growth.", emoji: "📈", color: "#EA580C" },
  { title: "Vendor Management", desc: "Multi-vendor support with individual dashboards.", emoji: "👥", color: "#E11D48" },
  { title: "JAR Pricing", desc: "Flexible pricing tiers with easy configuration.", emoji: "💰", color: "#D97706" },
]

const HOW_IT_WORKS = [
  { step: "01", title: "Register", desc: "Sign up as a vendor in seconds.", color: "#7C3AED" },
  { step: "02", title: "Add Customers", desc: "Create customer profiles with contact details.", color: "#2563EB" },
  { step: "03", title: "Track JAR Entries", desc: "Log daily JAR usage with quantity and pricing.", color: "#059669" },
  { step: "04", title: "Analyze & Grow", desc: "View charts and make data-driven decisions.", color: "#EA580C" },
]

const STATIC_REVIEWS = [
  { _id: "s1", vendorId: "", vendorName: "Rajesh Kumar", rating: 5, text: "This platform transformed how we manage JAR distributions. The customer tracking and monthly analytics are incredibly useful.", createdAt: "" },
  { _id: "s2", vendorId: "", vendorName: "Priya Sharma", rating: 5, text: "The vendor dashboard gives me real-time visibility into our JAR sales. The reports help us plan better.", createdAt: "" },
  { _id: "s3", vendorId: "", vendorName: "Amit Verma", rating: 4, text: "Excellent tool for managing JAR inventory across multiple customers. Highly recommended!", createdAt: "" },
  { _id: "s4", vendorId: "", vendorName: "Sneha Patel", rating: 5, text: "The ease of adding daily entries and viewing historical data is fantastic.", createdAt: "" },
  { _id: "s5", vendorId: "", vendorName: "Vikram Singh", rating: 5, text: "Love the clean interface and monthly sales chart. It's helped us optimize our supply chain.", createdAt: "" },
  { _id: "s6", vendorId: "", vendorName: "Ananya Gupta", rating: 4, text: "Great platform for JAR lifecycle management. Complete control over pricing and customers.", createdAt: "" },
]

const AVATAR_COLORS = ["#7C3AED", "#2563EB", "#059669", "#EA580C", "#E11D48", "#D97706"]

export default function LoginScreen({ onLogin, onGoToRegister }: { onLogin: (token: string, vendor: any) => void; onGoToRegister: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showLogin, setShowLogin] = useState(false)
  const scrollY = useRef(new Animated.Value(0)).current

  const [loginMut, { isLoading: loginLoading }] = useVendorLoginMutation()
  const { data: reviewsData } = useGetReviewsQuery()

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }
    try {
      const data = await loginMut({ email, password }).unwrap()
      onLogin(data.token, data.vendor)
    } catch (err: any) {
      console.log("Login error:", JSON.stringify(err))
      Alert.alert("Login Failed", err?.data?.message || err?.error || JSON.stringify(err))
    }
  }

  const allReviews = [...(reviewsData?.reviews || []), ...STATIC_REVIEWS]

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroBg} />
          <View style={styles.heroContent}>
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>Smart JAR management starts here</Text>
            </View>
            <Text style={styles.heroTitle}>
              Run Your{" "}
              <Text style={styles.heroHighlight}>JAR</Text>{" "}
              Business with Confidence
            </Text>
            <Text style={styles.heroDesc}>
              Your business deserves smart tools. Manage JARs effortlessly and focus on growing your reach.
            </Text>
            <View style={styles.heroButtons}>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowLogin(true)}>
                <Text style={styles.primaryBtnText}>Get Started Free →</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => setShowLogin(true)}>
                <Text style={styles.secondaryBtnText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Login Form */}
        {showLogin && (
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <View style={styles.loginCard}>
              <Text style={styles.loginTitle}>Vendor Login</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TouchableOpacity style={[styles.loginBtn, loginLoading && { opacity: 0.6 }]} onPress={handleLogin} disabled={loginLoading}>
                {loginLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnText}>Login</Text>}
              </TouchableOpacity>
              <TouchableOpacity onPress={onGoToRegister}>
                <Text style={styles.linkText}>Don't have an account? Register</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <View key={i} style={[styles.featureCard, { borderTopColor: f.color, borderTopWidth: 3 }]}>
                <Text style={styles.featureIcon}>{f.emoji}</Text>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* How It Works */}
        <View style={[styles.section, { backgroundColor: "#fff" }]}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsContainer}>
            {HOW_IT_WORKS.map((s, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={[styles.stepCircle, { backgroundColor: s.color }]}>
                  <Text style={styles.stepNumber}>{s.step}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{s.title}</Text>
                  <Text style={styles.stepDesc}>{s.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews */}
        <View style={[styles.section, { backgroundColor: "#7C3AED", paddingBottom: 40 }]}>
          <Text style={[styles.sectionTitle, { color: "#fff" }]}>
            What Our{" "}
            <Text style={{ color: "#FBBF24" }}>Vendors</Text> Say
          </Text>
          <Text style={[styles.sectionDesc, { color: "rgba(255,255,255,0.7)" }]}>
            Hear from vendors who trust us for their daily JAR management needs.
          </Text>
          {allReviews.map((r, i) => {
            const color = AVATAR_COLORS[i % AVATAR_COLORS.length]
            const initials = r.vendorName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
            return (
              <View key={r._id || i} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={[styles.avatar, { backgroundColor: color }]}>
                    <Text style={styles.avatarText}>{initials}</Text>
                  </View>
                  <View>
                    <Text style={styles.reviewName}>{r.vendorName}</Text>
                    <StarRating rating={r.rating} size={12} />
                  </View>
                </View>
                <Text style={styles.reviewText}>"{r.text}"</Text>
              </View>
            )
          })}
        </View>
      </Animated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  hero: { backgroundColor: "#7C3AED", paddingTop: 60, paddingBottom: 60, paddingHorizontal: 24, position: "relative", overflow: "hidden" },
  heroBg: { position: "absolute", top: -80, right: -80, width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.05)" },
  heroContent: { alignItems: "center" },
  badge: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginBottom: 20 },
  badgeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#34D399", marginRight: 8 },
  badgeText: { color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: "500" },
  heroTitle: { fontSize: 32, fontWeight: "bold", color: "#fff", textAlign: "center", lineHeight: 40 },
  heroHighlight: { color: "#FBBF24" },
  heroDesc: { color: "rgba(255,255,255,0.8)", textAlign: "center", marginTop: 12, fontSize: 15, lineHeight: 22, maxWidth: 320 },
  heroButtons: { flexDirection: "row", gap: 12, marginTop: 24 },
  primaryBtn: { backgroundColor: "#fff", paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  primaryBtnText: { color: "#7C3AED", fontWeight: "700", fontSize: 15 },
  secondaryBtn: { borderWidth: 1, borderColor: "rgba(255,255,255,0.3)", paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  secondaryBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  loginCard: { backgroundColor: "#fff", marginHorizontal: 16, marginTop: -20, borderRadius: 16, padding: 20, elevation: 4, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8 },
  loginTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 16, textAlign: "center" },
  input: { backgroundColor: "#f9f9f9", borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 12, color: "#333" },
  loginBtn: { backgroundColor: "#7C3AED", borderRadius: 12, padding: 14, alignItems: "center", marginTop: 4 },
  loginBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  linkText: { color: "#7C3AED", textAlign: "center", fontSize: 14, marginTop: 12 },
  section: { paddingHorizontal: 16, paddingTop: 32, paddingBottom: 16 },
  sectionTitle: { fontSize: 22, fontWeight: "bold", color: "#333", textAlign: "center", marginBottom: 8 },
  sectionDesc: { fontSize: 14, textAlign: "center", marginBottom: 20, lineHeight: 20 },
  featuresGrid: { gap: 12 },
  featureCard: { backgroundColor: "#fff", borderRadius: 12, padding: 16, elevation: 1 },
  featureIcon: { fontSize: 28, marginBottom: 8 },
  featureTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
  featureDesc: { fontSize: 13, color: "#666", marginTop: 4, lineHeight: 18 },
  stepsContainer: { gap: 16 },
  stepRow: { flexDirection: "row", alignItems: "center" },
  stepCircle: { width: 48, height: 48, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  stepNumber: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  stepContent: { marginLeft: 14, flex: 1 },
  stepTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
  stepDesc: { fontSize: 13, color: "#666", marginTop: 2 },
  reviewCard: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 16, marginBottom: 10 },
  reviewHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center" },
  avatarText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  reviewName: { color: "#fff", fontSize: 14, fontWeight: "600" },
  reviewText: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 8, lineHeight: 18, fontStyle: "italic" },
})
