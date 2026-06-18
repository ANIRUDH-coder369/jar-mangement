import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert, ActivityIndicator } from "react-native"
import { useGetCustomersQuery, useDeleteCustomerMutation } from "../apis/customer.api"

export default function CustomersScreen({ onNavigate }: { onNavigate: (screen: string, params?: any) => void }) {
  const { data, isLoading, refetch } = useGetCustomersQuery()
  const [deleteMut] = useDeleteCustomerMutation()
  const customers = data?.customers || []

  const handleDelete = (id: string, name: string) => {
    Alert.alert("Delete", `Delete ${name}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { try { await deleteMut(id) } catch {} } },
    ])
  }

  if (isLoading) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" }}><ActivityIndicator size="large" color="#7C3AED" /></View>

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <FlatList
        data={customers}
        keyExtractor={(c: any) => c._id}
        contentContainerStyle={customers.length === 0 ? { flex: 1, justifyContent: "center", alignItems: "center" } : { padding: 16, paddingBottom: 80 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}
        ListEmptyComponent={<><Text style={{ fontSize: 16, color: "#999", textAlign: "center" }}>No customers yet</Text><Text style={{ fontSize: 13, color: "#bbb", textAlign: "center", marginTop: 4 }}>Tap + to add</Text></>}
        renderItem={({ item }: { item: any }) => (
          <TouchableOpacity
            style={{ backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 10, elevation: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
            onPress={() => onNavigate("customerDetail", { customerId: item._id })}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#333" }}>{item.name}</Text>
              <Text style={{ fontSize: 13, color: "#666", marginTop: 2 }}>{item.email} · {item.phone}</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
              {item.isBlocked && <Text style={{ color: "#DC2626", fontSize: 11, fontWeight: "600", backgroundColor: "#FEE2E2", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, overflow: "hidden" }}>Blocked</Text>}
              <TouchableOpacity style={{ backgroundColor: "#EEF2FF", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }} onPress={() => onNavigate("editCustomer", { customerId: item._id })}>
                <Text style={{ color: "#7C3AED", fontWeight: "600", fontSize: 13 }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: "#FEE2E2", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }} onPress={() => handleDelete(item._id, item.name)}>
                <Text style={{ color: "#DC2626", fontWeight: "600", fontSize: 13 }}>Del</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={{ position: "absolute", bottom: 24, right: 24, backgroundColor: "#7C3AED", width: 56, height: 56, borderRadius: 28, justifyContent: "center", alignItems: "center", elevation: 4 }}
        onPress={() => onNavigate("addCustomer")}
      >
        <Text style={{ color: "#fff", fontSize: 28, lineHeight: 30 }}>+</Text>
      </TouchableOpacity>
    </View>
  )
}
