const fs = require("fs");
let code = fs.readFileSync("src/components/CourseViewer.tsx", "utf-8");

code = code.replace(
  `              const modProgressPercent = totalModLessons > 0 ? Math.round((completedModLessons / totalModLessons) * 100) : 0;\n\n              return (\n                <div key={mod.id}`,
  `              const modProgressPercent = totalModLessons > 0 ? Math.round((completedModLessons / totalModLessons) * 100) : 0;\n\n              return (\n<LazyRender key={mod.id} height="200px">\n                <div`
);

code = code.replace(
  `                  </div>\n                </div>\n              );\n            })}\n          </div>\n        </div>`,
  `                  </div>\n                </div>\n</LazyRender>\n              );\n            })}\n          </div>\n        </div>`
);

fs.writeFileSync("src/components/CourseViewer.tsx", code);
