import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native"
import { useGetPlanStatusQuery, useSelectPlanMutation } from "../apis/vendor.api"

const PLANS = [
  { key: "free", label: "Free", price: "$0", duration: "10 days", desc: "Try before you buy" },
  { key: "monthly", label: "Monthly", price: "$500", duration: "30 days", desc: "Best for small vendors" },
  { key: "halfyearly", label: "Half-Yearly", price: "$2,000", duration: "180 days", desc: "Save $1,000" },
  { key: "yearly", label: "Yearly", price: "$5,000", duration: "365 days", desc: "Best value" },
] as const

export default function PlanSelectionScreen({ onBack }: { onBack: () => void }) {
  const { data: planData, isLoading: fetching } = useGetPlanStatusQuery()
  const [selectMut, { isLoading }] = useSelectPlanMutation()

  const currentPlan = planData?.plan?.type
  const hasUsedFree = !!planData?.plan?.hasUsedFreePlan

  const handleSelect = async (plan: string) => {
    if (plan === currentPlan) return
    if (plan === "free" && hasUsedFree) { Alert.alert("Used", "Free plan is one-time use only"); return }
    try {
      const res = await selectMut({ plan }).unwrap()
      Alert.alert("Success", res.message)
    } catch (err: any) { Alert.alert("Error", err?.data?.message || err?.message || "Failed") }
  }

  if (fetching) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" }}><ActivityIndicator size="large" color="#7C3AED" /></View>

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <TouchableOpacity onPress={onBack} style={{ padding: 16 }}><Text style={{ color: "#7C3AED", fontSize: 16 }}>← Back to Dashboard</Text></TouchableOpacity>
      <Text style={{ fontSize: 22, fontWeight: "bold", color: "#333", textAlign: "center", marginBottom: 4 }}>Choose Your Plan</Text>
      <Text style={{ fontSize: 14, color: "#666", textAlign: "center", marginBottom: 20 }}>Current: {currentPlan ? String(currentPlan).toUpperCase() : "None"}</Text>
      <View style={{ paddingHorizontal: 16, paddingBottom: 32 }}>
        {PLANS.map((plan) => {
          const active = currentPlan === plan.key
          return (
            <TouchableOpacity
              key={plan.key}
              style={{ backgroundColor: "#fff", borderRadius: 16, padding: 20, marginBottom: 12, elevation: 1, borderWidth: 2, borderColor: active ? "#7C3AED" : "transparent" }}
              onPress={() => handleSelect(plan.key)}
              disabled={isLoading}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 18, fontWeight: "600", color: active ? "#7C3AED" : "#333" }}>{plan.label}</Text>
                {active && <Text style={{ backgroundColor: "#7C3AED", color: "#fff", fontSize: 12, fontWeight: "600", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, overflow: "hidden" }}>Active</Text>}
              </View>
              <Text style={{ fontSize: 30, fontWeight: "bold", color: "#333", marginTop: 8 }}>{plan.price}</Text>
              <Text style={{ fontSize: 14, color: "#666", marginTop: 4 }}>{plan.duration}</Text>
              <Text style={{ fontSize: 13, color: "#999", marginTop: 4 }}>{plan.desc}</Text>
            </TouchableOpacity>
          )
        })}
        {isLoading && <ActivityIndicator size="large" color="#7C3AED" />}
      </View>
    </ScrollView>
  )
}
