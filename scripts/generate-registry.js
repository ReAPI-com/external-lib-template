#!/usr/bin/env node

/**
 * Component Registry Generator
 *
 * Scans source files for components registered with assertion(), valueGenerator(),
 * hook(), and @Utility decorator. Generates a real TypeScript file with the
 * component registration arrays.
 *
 * Usage: node scripts/generate-registry.js
 */

import { parse } from '@babel/parser'
import _traverse from '@babel/traverse'
import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import { fileURLToPath } from 'url'

// Handle ESM/CJS interop
const traverse = _traverse.default || _traverse

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')

const collected = {
  assertions: [],
  valueGenerators: [],
  hooks: [],
  utilities: [],
}

async function scanComponents() {
  const srcDir = path.join(root, 'src')
  const files = await glob('**/*.ts', {
    cwd: srcDir,
    ignore: ['**/*.test.ts', '**/*.d.ts', '_support/**', '_generated/**', 'index.ts'],
  })

  for (const file of files) {
    const filePath = path.join(srcDir, file)
    const code = fs.readFileSync(filePath, 'utf-8')

    try {
      const ast = parse(code, {
        sourceType: 'module',
        plugins: ['typescript', ['decorators', { decoratorsBeforeExport: true }]],
      })

      const processedClasses = new Set()

      traverse(ast, {
        // Find: export const x = assertion({...}, function() {...})
        ExportNamedDeclaration(nodePath) {
          const decl = nodePath.node.declaration

          // Handle variable declarations: export const x = assertion({...}, fn)
          if (decl && decl.type === 'VariableDeclaration') {
            for (const varDecl of decl.declarations) {
              if (varDecl.init && varDecl.init.type === 'CallExpression') {
                processCallExpression(varDecl.id.name, varDecl.init, file)
              }
            }
          }

          // Handle decorated class declarations: @Utility(...) export class X
          if (decl && decl.type === 'ClassDeclaration' && decl.decorators) {
            const className = decl.id?.name
            if (className && !processedClasses.has(className)) {
              processedClasses.add(className)
              processClassDecorators(decl, file)
            }
          }
        },

        // Also check for decorated classes that are not exported inline
        ClassDeclaration(nodePath) {
          const className = nodePath.node.id?.name
          if (
            nodePath.node.decorators &&
            nodePath.node.decorators.length > 0 &&
            className &&
            !processedClasses.has(className)
          ) {
            processedClasses.add(className)
            processClassDecorators(nodePath.node, file)
          }
        },
      })
    } catch (err) {
      console.warn(`[generate-registry] Failed to parse ${file}:`, err.message)
    }
  }

  console.log('[generate-registry] Discovered components:')
  console.log(`  - Assertions: ${collected.assertions.length}`)
  console.log(`  - Value Generators: ${collected.valueGenerators.length}`)
  console.log(`  - Hooks: ${collected.hooks.length}`)
  console.log(`  - Utilities: ${collected.utilities.length}`)
}

function processCallExpression(exportName, callExpr, file) {
  const callee = callExpr.callee
  if (callee.type !== 'Identifier') return

  const funcName = callee.name
  const args = callExpr.arguments

  // We expect: funcName(metaObject, function)
  if (args.length < 1) return

  const metaArg = args[0]
  if (metaArg.type !== 'ObjectExpression') return

  const meta = extractObjectLiteral(metaArg)
  meta._name = exportName
  meta._file = file.replace(/\.ts$/, '')

  switch (funcName) {
    case 'assertion':
      collected.assertions.push(meta)
      break
    case 'valueGenerator':
      collected.valueGenerators.push(meta)
      break
    case 'hook':
      collected.hooks.push(meta)
      break
  }
}

function processClassDecorators(classNode, file) {
  const decorators = classNode.decorators || []
  const className = classNode.id?.name

  if (!className) return

  for (const decorator of decorators) {
    if (decorator.expression.type !== 'CallExpression') continue

    const callee = decorator.expression.callee
    const decoratorName = callee.type === 'Identifier' ? callee.name : null

    if (decoratorName !== 'Utility') continue

    const args = decorator.expression.arguments[0]
    if (!args || args.type !== 'ObjectExpression') continue

    const meta = extractObjectLiteral(args)
    meta._name = className
    meta._file = file.replace(/\.ts$/, '')
    meta._methods = extractStaticMethods(classNode)

    collected.utilities.push(meta)
  }
}

function extractStaticMethods(classNode) {
  const methods = []
  for (const member of classNode.body.body) {
    if (
      member.type === 'ClassMethod' &&
      member.static &&
      member.key.type === 'Identifier'
    ) {
      methods.push(member.key.name)
    }
  }
  return methods
}

function extractObjectLiteral(node) {
  const result = {}
  for (const prop of node.properties) {
    if (prop.type === 'ObjectProperty' && prop.key.type === 'Identifier') {
      result[prop.key.name] = extractValue(prop.value)
    }
  }
  return result
}

function extractValue(node) {
  switch (node.type) {
    case 'StringLiteral':
      return node.value
    case 'NumericLiteral':
      return node.value
    case 'BooleanLiteral':
      return node.value
    case 'NullLiteral':
      return null
    default:
      return undefined
  }
}

function generateRegistryCode() {
  const imports = []
  const seenImports = new Set()

  // Generate imports for all components
  const allComponents = [
    ...collected.assertions,
    ...collected.valueGenerators,
    ...collected.hooks,
    ...collected.utilities,
  ]

  for (const c of allComponents) {
    // Import path relative to _generated folder
    const importPath = `../${c._file}`
    const importKey = `${importPath}:${c._name}`
    if (!seenImports.has(importKey)) {
      imports.push(`import { ${c._name} } from '${importPath}'`)
      seenImports.add(importKey)
    }
  }

  // Generate the registry code
  const code = `/**
 * AUTO-GENERATED by scripts/generate-registry.js
 * Do not edit this file manually - run "pnpm generate" to regenerate.
 */

${imports.join('\n')}

export const assertions: AssertionDefinition[] = [
${collected.assertions
  .map(
    (a) => `  {
    id: '${a.id}',
    displayName: '${a.displayName || a.id}',
    description: '${a.description || ''}',
    noOfParams: ${a.noOfParams},
    enabled: ${a.enabled !== false},
    tested: ${a.tested !== false},
    deprecated: ${a.deprecated === true},
    function: ${a._name},
  }`
  )
  .join(',\n')}
]

export const valueGenerators: ValueGeneratorDefinition[] = [
${collected.valueGenerators
  .map(
    (v) => `  {
    id: '${v.id}',
    displayName: '${v.displayName || v.id}',
    description: '${v.description || ''}',
    noOfParams: ${v.noOfParams ?? 0},
    enabled: ${v.enabled !== false},
    tested: ${v.tested !== false},
    deprecated: ${v.deprecated === true},
    function: ${v._name},
  }`
  )
  .join(',\n')}
]

export const hooks: HookDefinition[] = [
${collected.hooks
  .map(
    (h) => `  {
    id: '${h.id}',
    displayName: '${h.displayName || h.id}',
    description: '${h.description || ''}',
    type: '${h.type}',
    enabled: ${h.enabled !== false},
    tested: ${h.tested !== false},
    deprecated: ${h.deprecated === true},
    function: ${h._name},
  }`
  )
  .join(',\n')}
]

export const utilities: UtilityDefinition[] = [
${collected.utilities
  .map(
    (u) => `  {
    id: '${u.id}',
    displayName: '${u.displayName || u.id}',
    description: '${u.description || ''}',
    className: '${u._name}',
    methods: [${u._methods.map((m) => `'${m}'`).join(', ')}],
  }`
  )
  .join(',\n')}
]

// Re-export utility classes for runtime access
${collected.utilities.map((u) => `export { ${u._name} }`).join('\n')}
`

  return code
}

async function main() {
  await scanComponents()

  const code = generateRegistryCode()

  // Ensure _generated directory exists
  const generatedDir = path.join(root, 'src', '_generated')
  if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir, { recursive: true })
  }

  // Write the registry file
  const outputPath = path.join(generatedDir, 'registry.ts')
  fs.writeFileSync(outputPath, code)
  console.log(`[generate-registry] Written to ${outputPath}`)
}

main().catch(console.error)

