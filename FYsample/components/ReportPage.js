import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ReportPage = () => {
  return (
    <View style={styles.container}>
      <Text>Reportt page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ReportPage;
