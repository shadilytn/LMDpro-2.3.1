const fs = require("fs");
let code = fs.readFileSync("src/components/CourseViewer.tsx", "utf-8");

if (!code.includes("LazyRender")) {
  code = code.replace(
    `import React, { useState, useEffect, useRef } from "react";`,
    `import React, { useState, useEffect, useRef } from "react";\nimport { LazyRender } from './LazyRender';`
  );

  code = code.replace(
    `{course.modules.map((mod, mIdx) => {`,
    `{course.modules.map((mod, mIdx) => (<LazyRender key={mod.id} height="150px">{(() => {`
  );

  code = code.replace(
    `              );\n            })}\n          </div>\n        </div>\n\n        {/* Main Workspace */}`,
    `              );\n            })()}</LazyRender>\n            ))}\n          </div>\n        </div>\n\n        {/* Main Workspace */}`
  );
  fs.writeFileSync("src/components/CourseViewer.tsx", code);
}
