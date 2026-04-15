import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';

export function PrimaryButton({ title, onPress, style, textStyle }) {
  return (
    <TouchableOpacity style={[styles.primary, style]} onPress={onPress} activeOpacity={0.85}>
      <Text style={[styles.primaryText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

export function GoldButton({ title, onPress, style, textStyle }) {
  return (
    <TouchableOpacity style={[styles.gold, style]} onPress={onPress} activeOpacity={0.85}>
      <Text style={[styles.goldText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

export function OutlineButton({ title, onPress, style, textStyle }) {
  return (
    <TouchableOpacity style={[styles.outline, style]} onPress={onPress} activeOpacity={0.85}>
      <Text style={[styles.outlineText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
  gold: {
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  goldText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
  outline: {
    borderWidth: 1.5,
    borderColor: COLORS.grayLight,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  outlineText: { color: COLORS.dark, fontSize: 16, fontWeight: '500' },
});
