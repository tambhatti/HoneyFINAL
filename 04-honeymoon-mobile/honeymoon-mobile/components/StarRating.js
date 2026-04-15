import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';

export function StarRating({ rating, maxStars = 5, size = 14, interactive = false, onRate }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {Array.from({ length: maxStars }).map((_, i) => (
        <TouchableOpacity key={i} disabled={!interactive} onPress={() => onRate && onRate(i + 1)}>
          <Text style={{ fontSize: size, color: i < Math.round(rating) ? '#f59e0b' : '#e5e7eb' }}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
