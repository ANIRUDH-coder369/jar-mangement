import { View, Text, ScrollView, RefreshControl, ActivityIndicator, Dimensions, TouchableOpacity } from "react-native"
import { useGetMonthlySalesQuery } from "../apis/chart.api"

const SCREEN_W = Dimensions.get("window").width - 64
const MAX_BAR = 160

export default function ChartsScreen({ onBack }: { onBack: () => void }) {
  const { data, isLoading, refetch } = useGetMonthlySalesQuery()
  const salesData = data?.data || []

  if (isLoading) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" }}><ActivityIndicator size="large" color="#7C3AED" /></View>

  const maxRev = Math.max(...salesData.map((d: any) => d.totalRevenue), 1)

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }} refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}>
      <TouchableOpacity onPress={onBack} style={{ padding: 16 }}><Text style={{ color: "#7C3AED", fontSize: 16 }}>← Back</Text></TouchableOpacity>
      <Text style={{ fontSize: 22, fontWeight: "bold", color: "#333", textAlign: "center", marginBottom: 20 }}>Monthly Sales</Text>

      {salesData.length === 0 ? (
        <Text style={{ textAlign: "center", color: "#999", marginTop: 40, fontSize: 16 }}>No sales data available</Text>
      ) : (
        <>
          <View style={{ marginHorizontal: 16, backgroundColor: "#fff", borderRadius: 16, padding: 16, elevation: 2 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: "row", alignItems: "flex-end", height: 200, gap: 12, paddingTop: 20 }}>
                {salesData.map((item: any, i: number) => {
                  const h = (item.totalRevenue / maxRev) * MAX_BAR
                  const month = item.month.length === 7 ? item.month : item.month.slice(0, 7)
                  return (
                    <View key={i} style={{ alignItems: "center", width: 60 }}>
                      <Text style={{ fontSize: 10, color: "#7C3AED", fontWeight: "600", marginBottom: 4 }}>₹{item.totalRevenue}</Text>
                      <View style={{ width: 32, height: Math.max(h, 4), backgroundColor: "#7C3AED", borderRadius: 6 }} />
                      <Text style={{ fontSize: 11, color: "#666", marginTop: 6, fontWeight: "500" }}>{month}</Text>
                      <Text style={{ fontSize: 10, color: "#999", marginTop: 2 }}>{item.totalJars} jars</Text>
                    </View>
                  )
                })}
              </View>
            </ScrollView>
          </View>
          <View style={{ margin: 16, backgroundColor: "#fff", borderRadius: 16, padding: 20, elevation: 2 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 12 }}>Summary</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" }}>
              <Text style={{ fontSize: 14, color: "#666" }}>Total Months</Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#333" }}>{salesData.length}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" }}>
              <Text style={{ fontSize: 14, color: "#666" }}>Total Revenue</Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#333" }}>₹{salesData.reduce((s: number, d: any) => s + d.totalRevenue, 0)}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 }}>
              <Text style={{ fontSize: 14, color: "#666" }}>Total Jars</Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#333" }}>{salesData.reduce((s: number, d: any) => s + d.totalJars, 0)}</Text>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  )
}
