import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default <Partial<Config>>{
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    fontSize: {
      base: [
        "16px",
        {
          lineHeight: "24px",
          letterSpacing: "-0.18px",
          fontWeight: "400",
        },
      ],
      xl: [
        "36px",
        {
          lineHeight: "40px",
          letterSpacing: "-0.18px",
          fontWeight: "700",
        },
      ],
      "3xl": [
        "56px",
        {
          lineHeight: "64px",
          letterSpacing: "-0.18px",
          fontWeight: "700",
        },
      ],
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    // ...
  ],
};
