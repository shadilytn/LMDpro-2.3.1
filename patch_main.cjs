const fs = require("fs");
let code = fs.readFileSync("src/main.tsx", "utf-8");
code = code.replace(
  `import { ThemeProvider } from "./components/theme/ThemeProvider";`,
  `import { ThemeProvider } from "./components/theme/ThemeProvider.tsx";`
);
fs.writeFileSync("src/main.tsx", code);
