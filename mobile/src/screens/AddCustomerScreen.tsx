import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { useCreateCustomerMutation } from "../apis/customer.api"

export default function AddCustomerScreen({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [createMut, { isLoading }] = useCreateCustomerMutation()

  const handleSubmit = async () => {
    if (!name || !email || !phone) { Alert.alert("Error", "Name, email, and phone are required"); return }
    try { await createMut({ name, email, phone, address: address || undefined }).unwrap(); onBack() }
    catch (err: any) { Alert.alert("Error", err?.data?.message || err?.message || "Failed to create customer") }
  }

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <TouchableOpacity onPress={onBack} style={{ padding: 16 }}><Text style={{ color: "#7C3AED", fontSize: 16 }}>← Back</Text></TouchableOpacity>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.title}>Add Customer</Text>
        <TextInput style={s.input} placeholder="Name *" placeholderTextColor="#999" value={name} onChangeText={setName} />
        <TextInput style={s.input} placeholder="Email *" placeholderTextColor="#999" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={s.input} placeholder="Phone *" placeholderTextColor="#999" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextInput style={s.input} placeholder="Address" placeholderTextColor="#999" value={address} onChangeText={setAddress} />
        <TouchableOpacity style={[s.btn, isLoading && { opacity: 0.6 }]} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Create Customer</Text>}
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
