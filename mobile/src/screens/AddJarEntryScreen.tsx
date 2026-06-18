import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { useCreateJarEntryMutation } from "../apis/jar.api"

export default function AddJarEntryScreen({ customerId, onBack }: { customerId: string; onBack: () => void }) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [noOfJars, setNoOfJars] = useState("")
  const [pricing, setPricing] = useState("")
  const [createMut, { isLoading }] = useCreateJarEntryMutation()

  const handleSubmit = async () => {
    if (!date || !noOfJars || !pricing) { Alert.alert("Error", "All fields are required"); return }
    try {
      await createMut({ customerId, date, noOfJars: parseInt(noOfJars), pricing: parseFloat(pricing) }).unwrap()
      onBack()
    } catch (err: any) { Alert.alert("Error", err?.data?.message || err?.message || "Failed to add entry") }
  }

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <TouchableOpacity onPress={onBack} style={{ padding: 16 }}><Text style={{ color: "#7C3AED", fontSize: 16 }}>← Back</Text></TouchableOpacity>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.title}>Add JAR Entry</Text>
        <TextInput style={s.input} placeholder="Date (YYYY-MM-DD)" placeholderTextColor="#999" value={date} onChangeText={setDate} />
        <TextInput style={s.input} placeholder="Number of Jars" placeholderTextColor="#999" value={noOfJars} onChangeText={setNoOfJars} keyboardType="numeric" />
        <TextInput style={s.input} placeholder="Total Price" placeholderTextColor="#999" value={pricing} onChangeText={setPricing} keyboardType="decimal-pad" />
        <TouchableOpacity style={[s.btn, isLoading && { opacity: 0.6 }]} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Add Entry</Text>}
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
