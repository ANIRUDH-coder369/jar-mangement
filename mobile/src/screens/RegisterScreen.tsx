import { useState } from "react"
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from "react-native"
import { useVendorRegisterMutation } from "../apis/vendor.api"

export default function RegisterScreen({ onBack, onRegister }: { onBack: () => void; onRegister: (token: string, vendor: any) => void }) {
  const [form, setForm] = useState({ companyName: "", address: "", contactNo: "", email: "", username: "", password: "" })
  const [registerMut, { isLoading }] = useVendorRegisterMutation()

  const update = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }))

  const handleRegister = async () => {
    const { companyName, address, contactNo, email, username, password } = form
    if (!companyName || !address || !contactNo || !email || !username || !password) {
      Alert.alert("Error", "All fields are required")
      return
    }
    try {
      const data = await registerMut(form).unwrap()
      onRegister(data.token, data.vendor)
    } catch (err: any) {
      console.log("Register error:", JSON.stringify(err))
      Alert.alert("Registration Failed", err?.data?.message || err?.error || JSON.stringify(err))
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#f5f5f5" }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
        <Text style={s.title}>Vendor Registration</Text>
        <Text style={s.subtitle}>Create your account to get started</Text>
        {(["companyName", "address", "contactNo", "email", "username", "password"] as const).map((field) => (
          <TextInput
            key={field}
            style={s.input}
            placeholder={field === "contactNo" ? "Contact No" : field.charAt(0).toUpperCase() + field.slice(1)}
            placeholderTextColor="#999"
            value={form[field]}
            onChangeText={(v) => update(field, v)}
            secureTextEntry={field === "password"}
            keyboardType={field === "email" ? "email-address" : field === "contactNo" ? "phone-pad" : "default"}
            autoCapitalize="none"
          />
        ))}
        <TouchableOpacity style={[s.btn, isLoading && { opacity: 0.6 }]} onPress={handleRegister} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Register</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={onBack}><Text style={s.link}>Already have an account? Login</Text></TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "bold", color: "#333", textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 15, color: "#666", textAlign: "center", marginBottom: 28 },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 12, color: "#333" },
  btn: { backgroundColor: "#7C3AED", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 8 },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "600" },
  link: { color: "#7C3AED", textAlign: "center", fontSize: 14, marginTop: 14 },
})
