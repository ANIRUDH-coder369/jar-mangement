import { View, Text } from "react-native"

export default function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 1 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Text key={i} style={{ fontSize: size, color: i < rating ? "#F59E0B" : "#D1D5DB" }}>
          ★
        </Text>
      ))}
    </View>
  )
}
