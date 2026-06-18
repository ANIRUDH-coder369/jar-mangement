import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { useUpdateJarEntryMutation } from "../apis/jar.api"

export default function EditJarEntryScreen({ entryId, onBack }: { entryId: string; onBack: () => void }) {
  const [date, setDate] = useState("")
  const [noOfJars, setNoOfJars] = useState("")
  const [pricing, setPricing] = useState("")
  const [updateMut, { isLoading }] = useUpdateJarEntryMutation()

  const handleSubmit = async () => {
    if (!date || !noOfJars || !pricing) { Alert.alert("Error", "All fields are required"); return }
    try {
      await updateMut({ _id: entryId, date, noOfJars: parseInt(noOfJars), pricing: parseFloat(pricing) }).unwrap()
      onBack()
    } catch (err: any) { Alert.alert("Error", err?.data?.message || err?.message || "Failed to update") }
  }

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <TouchableOpacity onPress={onBack} style={{ padding: 16 }}><Text style={{ color: "#7C3AED", fontSize: 16 }}>← Back</Text></TouchableOpacity>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.title}>Edit JAR Entry</Text>
        <TextInput style={s.input} placeholder="Date (YYYY-MM-DD)" placeholderTextColor="#999" value={date} onChangeText={setDate} />
        <TextInput style={s.input} placeholder="Number of Jars" placeholderTextColor="#999" value={noOfJars} onChangeText={setNoOfJars} keyboardType="numeric" />
        <TextInput style={s.input} placeholder="Total Price" placeholderTextColor="#999" value={pricing} onChangeText={setPricing} keyboardType="decimal-pad" />
        <TouchableOpacity style={[s.btn, isLoading && { opacity: 0.6 }]} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Update Entry</Text>}
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
