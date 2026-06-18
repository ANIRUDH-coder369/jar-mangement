import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { useCreateReviewMutation, useCheckReviewQuery } from "../apis/review.api"

export default function ReviewsScreen({ onBack }: { onBack: () => void }) {
  const { data: checkData, isLoading } = useCheckReviewQuery()
  const [createMut, { isLoading: submitting }] = useCreateReviewMutation()
  const [rating, setRating] = useState(5)
  const [text, setText] = useState("")

  const hasReviewed = checkData?.hasReviewed || false

  const handleSubmit = async () => {
    if (!text.trim()) { Alert.alert("Error", "Review text is required"); return }
    try {
      await createMut({ rating, text }).unwrap()
      setText(""); setRating(5)
      Alert.alert("Success", "Review submitted")
    } catch (err: any) { Alert.alert("Error", err?.data?.message || err?.message || "Failed") }
  }

  if (isLoading) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" }}><ActivityIndicator size="large" color="#7C3AED" /></View>

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <TouchableOpacity onPress={onBack} style={{ padding: 16 }}><Text style={{ color: "#7C3AED", fontSize: 16 }}>← Back</Text></TouchableOpacity>
      <View style={{ padding: 16 }}>
        {!hasReviewed ? (
          <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 20, elevation: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 12 }}>Write a Review</Text>
            <View style={{ flexDirection: "row", marginBottom: 12, gap: 4 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity key={n} onPress={() => setRating(n)}>
                  <Text style={{ fontSize: 28, color: n <= rating ? "#F59E0B" : "#ddd" }}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 14, fontSize: 15, color: "#333", minHeight: 80, textAlignVertical: "top" }}
              placeholder="Share your experience..."
              placeholderTextColor="#999"
              value={text}
              onChangeText={setText}
              multiline
            />
            <TouchableOpacity style={{ backgroundColor: "#7C3AED", borderRadius: 12, padding: 14, alignItems: "center", marginTop: 12, opacity: submitting ? 0.6 : 1 }} onPress={handleSubmit} disabled={submitting}>
              {submitting ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Submit Review</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ backgroundColor: "#EEF2FF", borderRadius: 12, padding: 16, alignItems: "center" }}>
            <Text style={{ color: "#7C3AED", fontWeight: "500" }}>You have already submitted a review</Text>
          </View>
        )}
      </View>
    </View>
  )
}
