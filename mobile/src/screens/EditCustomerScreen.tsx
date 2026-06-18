import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { useGetCustomerByIdQuery, useUpdateCustomerMutation } from "../apis/customer.api"

export default function EditCustomerScreen({ customerId, onBack }: { customerId: string; onBack: () => void }) {
  const { data, isLoading: fetching } = useGetCustomerByIdQuery(customerId)
  const [updateMut, { isLoading }] = useUpdateCustomerMutation()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")

  useEffect(() => {
    if (data?.customer) {
      setName(data.customer.name)
      setEmail(data.customer.email)
      setPhone(data.customer.phone)
      setAddress(data.customer.address || "")
    }
  }, [data])

  const handleSubmit = async () => {
    if (!name || !email || !phone) { Alert.alert("Error", "All fields are required"); return }
    try { await updateMut({ _id: customerId, name, email, phone, address: address || undefined }).unwrap(); onBack() }
    catch (err: any) { Alert.alert("Error", err?.data?.message || err?.message || "Failed to update") }
  }

  if (fetching) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" }}><ActivityIndicator size="large" color="#7C3AED" /></View>

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <TouchableOpacity onPress={onBack} style={{ padding: 16 }}><Text style={{ color: "#7C3AED", fontSize: 16 }}>← Back</Text></TouchableOpacity>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.title}>Edit Customer</Text>
        <TextInput style={s.input} value={name} onChangeText={setName} />
        <TextInput style={s.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={s.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextInput style={s.input} value={address} onChangeText={setAddress} />
        <TouchableOpacity style={[s.btn, isLoading && { opacity: 0.6 }]} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Update Customer</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scroll: { padding: 24, paddingTop: 0 },
  title: { fontSize: 22, fontWeight: "bold", color: "#333", marginBottom: 24, textAlign: "center" },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 14, color: "#333" },
  btn: { backgroundColor: "#7C3AED", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 8 },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "600" },
})
