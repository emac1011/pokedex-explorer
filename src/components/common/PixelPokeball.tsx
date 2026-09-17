import { StyleSheet, View } from "react-native";

import { COLORS } from "../../constants/colors";

interface PixelPokeballProps {
  size?: number;
}

export function PixelPokeball({
  size = 58,
}: PixelPokeballProps) {
  const border = Math.max(3, Math.round(size * 0.07));
  const centerHeight = Math.max(
    5,
    Math.round(size * 0.12)
  );
  const buttonSize = Math.round(size * 0.38);
  const buttonBorder = Math.max(
    3,
    Math.round(size * 0.07)
  );

  return (
    <View
      style={[
        styles.ball,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: border,
        },
      ]}
    >
      <View
        style={[
          styles.top,
          {
            width: size,
            height: size / 2,
            backgroundColor: COLORS.red,
          },
        ]}
      />

      <View
        style={[
          styles.center,
          {
            width: size,
            height: centerHeight,
          },
        ]}
      >
        <View
          style={[
            styles.button,
            {
              width: buttonSize,
              height: buttonSize,
              borderRadius: buttonSize / 2,
              borderWidth: buttonBorder,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ball: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  top: {
    position: "absolute",
    top: 0,
  },

  center: {
    backgroundColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.black,
  },
});