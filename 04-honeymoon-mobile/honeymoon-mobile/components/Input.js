import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';
import { useState } from 'react';

export function Input({ label, placeholder, value, onChangeText, secureTextEntry, keyboardType, required, style }) {
  const [showPw, setShowPw] = useState(false);
  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <Text style={styles.label}>{label}{required && <Text style={styles.req}> *</Text>}</Text>
      )}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.grayLight}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPw}
          keyboardType={keyboardType || 'default'}
          autoCapitalize="none"
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPw(!showPw)} style={styles.eye}>
            <Text style={{ fontSize: 18 }}>{showPw ? '👁' : '👁‍🗨'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.dark, marginBottom: 6 },
  req: { color: COLORS.red },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
  },
  input: { flex: 1, paddingVertical: 14, fontSize: 14, color: COLORS.dark },
  eye: { padding: 4 },
});
