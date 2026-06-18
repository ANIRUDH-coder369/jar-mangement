import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert, ActivityIndicator } from "react-native"
import { useGetCustomerByIdQuery, useBlockCustomerMutation, useUnblockCustomerMutation } from "../apis/customer.api"
import { useGetJarEntriesQuery, useDeleteJarEntryMutation } from "../apis/jar.api"

export default function CustomerDetailScreen({ customerId, onNavigate, onBack }: { customerId: string; onNavigate: (screen: string, params?: any) => void; onBack: () => void }) {
  const { data: cData, isLoading: cLoading, refetch: refetchC } = useGetCustomerByIdQuery(customerId)
  const { data: eData, isLoading: eLoading, refetch: refetchE } = useGetJarEntriesQuery(customerId)
  const [blockMut] = useBlockCustomerMutation()
  const [unblockMut] = useUnblockCustomerMutation()
  const [deleteMut] = useDeleteJarEntryMutation()

  const customer = cData?.customer
  const entries = eData?.entries || []

  const onRefresh = () => { refetchC(); refetchE() }

  const handleDelete = (entryId: string) => {
    Alert.alert("Delete Entry", "Delete this entry?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { try { await deleteMut(entryId) } catch {} } },
    ])
  }

  const handleToggleBlock = async () => {
    try {
      if (customer?.isBlocked) await unblockMut(customerId)
      else await blockMut(customerId)
    } catch {}
  }

  if (cLoading || eLoading) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" }}><ActivityIndicator size="large" color="#7C3AED" /></View>

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <TouchableOpacity onPress={onBack} style={{ padding: 16, paddingBottom: 0 }}><Text style={{ color: "#7C3AED", fontSize: 16 }}>← Back</Text></TouchableOpacity>
      <View style={{ backgroundColor: "#fff", margin: 16, borderRadius: 12, padding: 20, elevation: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#333" }}>{customer?.name}</Text>
        <Text style={{ fontSize: 14, color: "#666", marginTop: 4 }}>{customer?.email} · {customer?.phone}</Text>
        {customer?.address ? <Text style={{ fontSize: 14, color: "#666", marginTop: 2 }}>{customer.address}</Text> : null}
        <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
          <TouchableOpacity style={{ backgroundColor: customer?.isBlocked ? "#DCFCE7" : "#FEE2E2", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }} onPress={handleToggleBlock}>
            <Text style={{ color: customer?.isBlocked ? "#16A34A" : "#DC2626", fontWeight: "600", fontSize: 14 }}>{customer?.isBlocked ? "Unblock" : "Block"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: "#EEF2FF", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }} onPress={() => onNavigate("editCustomer", { customerId })}>
            <Text style={{ color: "#7C3AED", fontWeight: "600", fontSize: 14 }}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, marginBottom: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", color: "#333" }}>JAR Entries</Text>
        <TouchableOpacity style={{ backgroundColor: "#7C3AED", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }} onPress={() => onNavigate("addJarEntry", { customerId })}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={entries}
        keyExtractor={(e: any) => e._id}
        contentContainerStyle={entries.length === 0 ? { flex: 1, justifyContent: "center", alignItems: "center" } : { paddingHorizontal: 16, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={{ fontSize: 15, color: "#999" }}>No JAR entries yet</Text>}
        renderItem={({ item }: { item: any }) => (
          <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 10, elevation: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={{ fontSize: 15, fontWeight: "600", color: "#333" }}>{item.date}</Text>
              <Text style={{ fontSize: 13, color: "#666", marginTop: 2 }}>Jars: {item.noOfJars} · ₹{item.pricing}</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 6 }}>
              <TouchableOpacity style={{ backgroundColor: "#EEF2FF", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }} onPress={() => onNavigate("editJarEntry", { entryId: item._id })}>
                <Text style={{ color: "#7C3AED", fontWeight: "600", fontSize: 13 }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: "#FEE2E2", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }} onPress={() => handleDelete(item._id)}>
                <Text style={{ color: "#DC2626", fontWeight: "600", fontSize: 13 }}>Del</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  )
}
