const fs = require("fs");
let code = fs.readFileSync("src/components/DashboardEngine.tsx", "utf-8");

code = code.replace(
  `import React, { useState } from 'react';`,
  `import React, { useState } from 'react';\nimport { LazyRender } from './LazyRender';`
);

// We need to wrap each widget in LazyRender.
// Wait, the primaryWidgets map returns the widget.
// We can change `{config.primaryWidgets.map((widget) => {` to `{config.primaryWidgets.map((widget) => (<LazyRender key={widget.id} height="300px">{(() => {`
// and close it at the end of the map.
code = code.replace(
  `{config.primaryWidgets.map((widget) => {`,
  `{config.primaryWidgets.map((widget) => (<LazyRender key={widget.id} height="300px">{(() => {`
);

// The map block ends around line 535:
//             return null;
//           })}
//         </div>
code = code.replace(
  `            return null;\n          })}`,
  `            return null;\n          })()}</LazyRender>))}`
);

fs.writeFileSync("src/components/DashboardEngine.tsx", code);
