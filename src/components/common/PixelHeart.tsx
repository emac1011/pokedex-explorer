import { StyleSheet, View } from "react-native";

import { COLORS } from "../../constants/colors";

export function PixelHeart() {
  return (
    <View style={styles.container}>
      {/* Fila 1: · ■ · ■ · */}
      <View style={[styles.pixel, styles.p01]} />
      <View style={[styles.pixel, styles.p03]} />

      {/* Fila 2: ■ ■ ■ ■ ■ */}
      <View style={[styles.pixel, styles.p10]} />
      <View style={[styles.pixel, styles.p11]} />
      <View style={[styles.pixel, styles.p12]} />
      <View style={[styles.pixel, styles.p13]} />
      <View style={[styles.pixel, styles.p14]} />

      {/* Fila 3: ■ ■ ■ ■ ■ */}
      <View style={[styles.pixel, styles.p20]} />
      <View style={[styles.pixel, styles.p21]} />
      <View style={[styles.pixel, styles.p22]} />
      <View style={[styles.pixel, styles.p23]} />
      <View style={[styles.pixel, styles.p24]} />

      {/* Fila 4: · ■ ■ ■ · */}
      <View style={[styles.pixel, styles.p31]} />
      <View style={[styles.pixel, styles.p32]} />
      <View style={[styles.pixel, styles.p33]} />

      {/* Fila 5: · · ■ · · */}
      <View style={[styles.pixel, styles.p42]} />

      {/* Brillo blanco */}
      <View style={styles.highlight} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    marginRight: 10,
    position: "relative",
  },

  pixel: {
    position: "absolute",

    width: 8,
    height: 8,

    backgroundColor: COLORS.red,
  },

  /*
   * MAPA 5 x 5
   *
   * · ■ · ■ ·
   * ■ ■ ■ ■ ■
   * ■ ■ ■ ■ ■
   * · ■ ■ ■ ·
   * · · ■ · ·
   */

  p01: {
    left: 8,
    top: 0,
  },

  p03: {
    left: 24,
    top: 0,
  },

  p10: {
    left: 0,
    top: 8,
  },

  p11: {
    left: 8,
    top: 8,
  },

  p12: {
    left: 16,
    top: 8,
  },

  p13: {
    left: 24,
    top: 8,
  },

  p14: {
    left: 32,
    top: 8,
  },

  p20: {
    left: 0,
    top: 16,
  },

  p21: {
    left: 8,
    top: 16,
  },

  p22: {
    left: 16,
    top: 16,
  },

  p23: {
    left: 24,
    top: 16,
  },

  p24: {
    left: 32,
    top: 16,
  },

  p31: {
    left: 8,
    top: 24,
  },

  p32: {
    left: 16,
    top: 24,
  },

  p33: {
    left: 24,
    top: 24,
  },

  p42: {
    left: 16,
    top: 32,
  },

  highlight: {
    position: "absolute",

    width: 5,
    height: 5,

    backgroundColor: "#FFFFFF",

    left: 11,
    top: 10,
  },
});