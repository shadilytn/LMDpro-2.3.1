const fs = require('fs');
const glob = require('glob');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const files = glob.sync('src/**/*.tsx').concat(glob.sync('src/**/*.ts'));
let errors = 0;

for (const file of files) {
  const code = fs.readFileSync(file, 'utf-8');
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });
  } catch(e) {
    continue;
  }

  traverse(ast, {
    Function(path) {
      const componentName = path.node.id ? path.node.id.name : 'anonymous';
      
      const isComponent = /^[A-Z]/.test(componentName) || /^use[A-Z]/.test(componentName) || 
                          (path.parent.type === 'VariableDeclarator' && /^[A-Z]/.test(path.parent.id.name));
                          
      if (!isComponent) return;

      path.traverse({
        CallExpression(callPath) {
          const callee = callPath.node.callee;
          if (callee.type === 'Identifier' && /^use[A-Z]/.test(callee.name)) {
            let current = callPath;
            while (current && current !== path) {
              if (current.type === 'IfStatement' || current.type === 'ForStatement' || current.type === 'WhileStatement' || current.type === 'SwitchStatement' || current.type === 'ConditionalExpression' || current.type === 'LogicalExpression') {
                 console.log(`Hook ${callee.name} called conditionally in ${file}:${callPath.node.loc.start.line}`);
                 errors++;
                 break;
              }
              current = current.parentPath;
            }
          }
        }
      });
      
      path.traverse({
        BlockStatement(blockPath) {
           let seenReturn = false;
           for (const stmt of blockPath.node.body) {
              if (stmt.type === 'ReturnStatement' || (stmt.type === 'IfStatement' && stmt.consequent.type === 'ReturnStatement')) {
                 seenReturn = true;
              } else if (seenReturn) {
                 traverse(stmt, {
                    noScope: true,
                    CallExpression(callPath) {
                       const callee = callPath.node.callee;
                       if (callee.type === 'Identifier' && /^use[A-Z]/.test(callee.name)) {
                          console.log(`Hook ${callee.name} called after return in ${file}:${callPath.node.loc.start.line}`);
                          errors++;
                       }
                    }
                 });
              }
           }
        }
      });
    }
  });
}
if (errors === 0) console.log("No hooks after return or conditionally called found.");
