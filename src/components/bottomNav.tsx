import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function BottomNav() {
  return (
    <View style={styles.container}>
      <Text>🏠</Text>
      <Text>🕒</Text>
      <Text>🤍</Text>
      <Text>⚙️</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
});
