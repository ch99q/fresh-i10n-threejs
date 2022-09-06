
import { createStitches } from "https://esm.sh/@stitches/core?alias=react:preact/compat,react-dom:preact/compat,@types/react:preact/compat&external=preact";

const { css, getCssText } = createStitches({
  theme: {
    colors: {
      hiContrast: 'hsl(206,10%,5%)',
      loContrast: 'white',

      gray100: 'hsl(206,22%,99%)',
      gray200: 'hsl(206,12%,97%)',
      gray300: 'hsl(206,11%,92%)',
      gray400: 'hsl(206,10%,84%)',
      gray500: 'hsl(206,10%,76%)',
      gray600: 'hsl(206,10%,44%)',
    },
  },
});

export { css, getCssText };