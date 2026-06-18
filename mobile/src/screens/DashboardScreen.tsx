import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from "react-native"
import { useGetTodaySalesQuery } from "../apis/chart.api"
import { useGetPlanStatusQuery } from "../apis/vendor.api"

const todayStr = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
const todayDate = new Date().toISOString().split("T")[0]

export default function DashboardScreen({ vendor, onNavigate }: { vendor: any; onNavigate: (screen: string, params?: any) => void }) {
  const { data: planData, isLoading: planLoading, refetch: refetchPlan } = useGetPlanStatusQuery()
  const { data: salesData, isLoading: salesLoading, refetch: refetchSales } = useGetTodaySalesQuery(todayDate)

  const plan = planData?.plan
  const sales = salesData
  const loading = planLoading || salesLoading

  const onRefresh = () => { refetchSales(); refetchPlan() }

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome,</Text>
          <Text style={styles.name}>{vendor?.companyName || "Vendor"}</Text>
        </View>
      </View>


      <View style={styles.planBadge}>
        <Text style={styles.planLabel}>Plan: {plan?.type ? String(plan.type).toUpperCase() : "No Plan"}</Text>
        <Text style={[styles.planStatus, { color: plan?.hasActivePlan ? "#059669" : "#DC2626" }]}>
          {plan?.hasActivePlan ? "Active" : plan?.type ? "Expired" : "No plan"}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Today's Sales — {todayStr}</Text>

      {
        loading ? (
          <ActivityIndicator size="large" color="#7C3AED" style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.cards}>
            <View style={styles.card}><Text style={styles.cardVal}>{sales?.totalJars ?? 0}</Text><Text style={styles.cardLabel}>Total Jars</Text></View>
            <View style={styles.card}><Text style={styles.cardVal}>₹{sales?.totalRevenue ?? 0}</Text><Text style={styles.cardLabel}>Revenue</Text></View>
          </View>
        )
      }

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <TouchableOpacity style={styles.action} onPress={() => onNavigate("customers")}><Text style={styles.actionText}>👥 Manage Customers</Text></TouchableOpacity>
      <TouchableOpacity style={styles.action} onPress={() => onNavigate("planSelection")}><Text style={styles.actionText}>📋 View / Change Plan</Text></TouchableOpacity>
      <TouchableOpacity style={styles.action} onPress={() => onNavigate("charts")}><Text style={styles.actionText}>📈 Monthly Sales Chart</Text></TouchableOpacity>
      <TouchableOpacity style={styles.action} onPress={() => onNavigate("reviews")}><Text style={styles.actionText}>⭐ Reviews</Text></TouchableOpacity>
    </ScrollView >
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { backgroundColor: "#7C3AED", padding: 20, paddingTop: 56, paddingBottom: 28 },
  greeting: { color: "rgba(255,255,255,0.8)", fontSize: 14 },
  name: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  planBadge: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#fff", marginHorizontal: 16, marginTop: -14, padding: 16, borderRadius: 12, elevation: 2 },
  planLabel: { fontSize: 15, fontWeight: "600", color: "#333" },
  planStatus: { fontSize: 14, fontWeight: "500" },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#333", margin: 16, marginBottom: 10 },
  cards: { flexDirection: "row", paddingHorizontal: 16, gap: 12 },
  card: { flex: 1, backgroundColor: "#fff", borderRadius: 12, padding: 20, elevation: 2, alignItems: "center" },
  cardVal: { fontSize: 26, fontWeight: "bold", color: "#7C3AED" },
  cardLabel: { fontSize: 14, color: "#666", marginTop: 4 },
  action: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginHorizontal: 16, marginBottom: 10, elevation: 1 },
  actionText: { fontSize: 16, color: "#333" },
})
