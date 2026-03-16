#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');
const STARTER_TEMPLATE_DIR = join(ROOT, 'templates', 'starter');
const TEMPLATE_SRC_DIR = join(STARTER_TEMPLATE_DIR, 'src');
const TEMPLATE_UI_DIR = join(TEMPLATE_SRC_DIR, 'components', 'ui');
const TEMPLATE_LAYOUT_DIR = join(TEMPLATE_SRC_DIR, 'layout');
const TEMPLATE_LAYOUT_COMPONENT_DIR = join(TEMPLATE_SRC_DIR, 'components', 'layout');
const TEMPLATE_STYLE_DIR = join(TEMPLATE_SRC_DIR, 'styles');

const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
  dim: (text) => `\x1b[2m${text}\x1b[0m`,
};

const UI_ALIASES = {
  'progress-bar-v1': 'progresbarv1',
  'progress-bar-v2': 'progresbarv2',
  'progress-bar-v3': 'progresbarv3',
  progressbarv1: 'progresbarv1',
  progressbarv2: 'progresbarv2',
  progressbarv3: 'progresbarv3',
  'scroll-to-top': 'scroltotop',
  scrolltotop: 'scroltotop',
};

const LAYOUT_REGISTRY = [
  {
    name: 'admin-layout',
    aliases: ['admin'],
    files: [
      {
        source: join(TEMPLATE_LAYOUT_DIR, 'AdminLayout.tsx'),
        destination: 'src/layout/AdminLayout.tsx',
      },
      {
        source: join(TEMPLATE_LAYOUT_COMPONENT_DIR, 'AdminHeader.tsx'),
        destination: 'src/components/layout/AdminHeader.tsx',
      },
      {
        source: join(TEMPLATE_LAYOUT_COMPONENT_DIR, 'AdminSidebar.tsx'),
        destination: 'src/components/layout/AdminSidebar.tsx',
      },
      {
        source: join(TEMPLATE_STYLE_DIR, 'admin.css'),
        destination: 'src/styles/admin.css',
      },
    ],
  },
];

const [, , command, ...rawArgs] = process.argv;
const { flags, positional } = parseArgs(rawArgs);

function parseArgs(args) {
  const parsedFlags = new Set();
  const parsedPositional = [];

  for (const arg of args) {
    if (arg.startsWith('--')) {
      parsedFlags.add(arg);
      continue;
    }

    parsedPositional.push(arg);
  }

  return { flags: parsedFlags, positional: parsedPositional };
}

function toPackageName(value) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || 'dealtech-app';
}

function toKebabCase(value) {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function toPascalCase(value) {
  return value
    .trim()
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join('');
}

function compactKey(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function isDirectoryEmpty(targetDir) {
  const ignoredEntries = new Set(['.git']);
  const entries = readdirSync(targetDir).filter((entry) => !ignoredEntries.has(entry));
  return entries.length === 0;
}

function ensureDirectory(targetDir) {
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }
}

function copyDirectory(sourceDir, destinationDir) {
  ensureDirectory(destinationDir);

  const entries = readdirSync(sourceDir, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = join(sourceDir, entry.name);
    const destinationPath = join(destinationDir, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
      continue;
    }

    copyFileSync(sourcePath, destinationPath);
  }
}

function copyFileWithParents(sourcePath, destinationPath) {
  ensureDirectory(dirname(destinationPath));
  copyFileSync(sourcePath, destinationPath);
}

function getFilesRecursive(targetDir) {
  if (!existsSync(targetDir)) {
    return [];
  }

  const files = [];
  const entries = readdirSync(targetDir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = join(targetDir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getFilesRecursive(entryPath));
      continue;
    }

    files.push(entryPath);
  }

  return files;
}

function getTemplateUiFolders() {
  if (!existsSync(TEMPLATE_UI_DIR)) {
    return [];
  }

  return readdirSync(TEMPLATE_UI_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function getUiLookupMap() {
  const map = new Map();

  for (const folderName of getTemplateUiFolders()) {
    map.set(compactKey(folderName), folderName);
  }

  for (const [alias, folderName] of Object.entries(UI_ALIASES)) {
    map.set(compactKey(alias), folderName);
  }

  return map;
}

function resolveUiFolder(componentArg) {
  return getUiLookupMap().get(compactKey(componentArg)) ?? null;
}

function getUiDependencies(folderName) {
  const folderPath = join(TEMPLATE_UI_DIR, folderName);
  const dependencies = new Set();

  for (const filePath of getFilesRecursive(folderPath)) {
    if (!/\.(ts|tsx)$/.test(filePath)) {
      continue;
    }

    const fileContent = readFileSync(filePath, 'utf-8');
    const matches = fileContent.matchAll(/from ['"]\.\.\/([^/'"]+)\/[^'"]+['"]/g);

    for (const match of matches) {
      const dependencyFolder = match[1];

      if (existsSync(join(TEMPLATE_UI_DIR, dependencyFolder))) {
        dependencies.add(dependencyFolder);
      }
    }
  }

  return Array.from(dependencies);
}

function collectUiComponentTree(folderName, collected = new Set()) {
  if (collected.has(folderName)) {
    return collected;
  }

  collected.add(folderName);

  for (const dependencyFolder of getUiDependencies(folderName)) {
    collectUiComponentTree(dependencyFolder, collected);
  }

  return collected;
}

function resolveLayout(layoutArg) {
  const key = compactKey(layoutArg);

  for (const layout of LAYOUT_REGISTRY) {
    const names = [layout.name, ...layout.aliases];
    if (names.some((name) => compactKey(name) === key)) {
      return layout;
    }
  }

  return null;
}

function updatePackageName(targetDir, projectName) {
  const packageJsonPath = join(targetDir, 'package.json');
  if (!existsSync(packageJsonPath)) {
    return;
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  packageJson.name = toPackageName(projectName);
  writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf-8');
}

function installDependencies(targetDir) {
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(npmCommand, ['install'], {
    cwd: targetDir,
    stdio: 'inherit',
  });

  return result.status === 0;
}

function showHelp() {
  console.log(`
${colors.bold('dealtech-ui')} - DealTech UI Starter CLI

${colors.bold('Usage:')}
  npx dealtech-ui ${colors.cyan('install')} ${colors.dim('[project-name]')} ${colors.dim('[--no-install] [--force]')}
  npx dealtech-ui ${colors.cyan('add')} ${colors.dim('<ui-name> [...ui-name] [--force]')}
  npx dealtech-ui ${colors.cyan('add-layout')} ${colors.dim('<layout-name> [...layout-name] [--force]')}
  npx dealtech-ui ${colors.cyan('add-page')} ${colors.dim('<page-name>')}
  npx dealtech-ui ${colors.cyan('help')}

${colors.bold('Examples:')}
  npx dealtech-ui install my-admin-app
  npx dealtech-ui add button badge modal
  npx dealtech-ui add tabledata-v2
  npx dealtech-ui add-layout admin-layout
  npx dealtech-ui add-page reports

${colors.bold('Available layout:')}
  ${colors.dim(LAYOUT_REGISTRY.map((layout) => layout.name).join(', '))}
`);
}

function ensureStarterTemplate() {
  if (!existsSync(STARTER_TEMPLATE_DIR)) {
    console.error(colors.red('\n[error] Starter template not found.\n'));
    process.exit(1);
  }
}

function installStarter(projectArg) {
  ensureStarterTemplate();

  const force = flags.has('--force');
  const skipInstall = flags.has('--no-install');
  const useCurrentDirectory = !projectArg || projectArg === '.';
  const targetDir = useCurrentDirectory ? process.cwd() : resolve(process.cwd(), projectArg);

  if (existsSync(targetDir) && !statSync(targetDir).isDirectory()) {
    console.error(colors.red('\n[error] Target path exists and is not a directory.\n'));
    process.exit(1);
  }

  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  if (!isDirectoryEmpty(targetDir) && !force) {
    console.error(colors.red('\n[error] Target directory is not empty.'));
    console.error(colors.dim('Run in an empty folder or use --force to overwrite files.\n'));
    process.exit(1);
  }

  copyDirectory(STARTER_TEMPLATE_DIR, targetDir);

  const projectName = toPackageName(useCurrentDirectory ? basename(targetDir) : projectArg);
  updatePackageName(targetDir, projectName);

  console.log(colors.green('\n[ok] Starter app created successfully.'));
  console.log(colors.dim(`      Path: ${targetDir}`));

  if (skipInstall) {
    console.log(colors.yellow('\n[info] Dependency install skipped (--no-install).'));
    printNextSteps(targetDir, useCurrentDirectory);
    return;
  }

  console.log(colors.bold('\nInstalling dependencies with npm...'));
  const installSuccess = installDependencies(targetDir);

  if (!installSuccess) {
    console.log(colors.yellow('\n[warn] npm install failed. You can run it manually.'));
  }

  printNextSteps(targetDir, useCurrentDirectory);
}

function buildPageTemplate(componentName, title) {
  return `const ${componentName} = () => {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#334a34]">
          DealTech UI
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-gray-900">${title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-500">
          Halaman ini dibuat otomatis oleh dealtech-ui. Lanjutkan dengan komponen
          dan data sesuai kebutuhan modul Anda.
        </p>
      </div>
    </section>
  );
};

export default ${componentName};
`;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function insertBlockBeforeMarker(content, marker, block) {
  const pattern = new RegExp(`([ \\t]*)${escapeRegExp(marker)}`);

  if (!pattern.test(content)) {
    return null;
  }

  return content.replace(pattern, (_, indent) => {
    const indentedBlock = block
      .split('\n')
      .map((line) => (line ? `${indent}${line}` : line))
      .join('\n');

    return `${indentedBlock}\n${indent}${marker}`;
  });
}

function resolvePageScaffold(sourceDir, routeName, componentName) {
  const adminAppPath = join(sourceDir, 'layout', 'AdminApp.tsx');
  if (existsSync(adminAppPath)) {
    return {
      pageDirectory: join(sourceDir, 'pages', routeName),
      pageFilePath: join(sourceDir, 'pages', routeName, `${componentName}.tsx`),
      routerPath: adminAppPath,
      displayPath: `src/pages/${routeName}/${componentName}.tsx`,
      displayRoute: `/dashboard/${routeName}`,
      importMarker: '// [dealtech:auto-imports]',
      routeMarker: '{/* [dealtech:auto-routes] */}',
      importStatement: `import ${componentName} from '../pages/${routeName}/${componentName}';`,
      fallbackImport: "import ConfirmModalPage from '../pages/komponent/ConfirmModalPage';",
      routeBlock: `<Route path="${routeName}" element={<${componentName} />} />`,
      fallbackRoute: '      <Route path="komponent/confirm-modal" element={<ConfirmModalPage />} />',
      routerLabel: 'src/layout/AdminApp.tsx',
    };
  }

  const routerPath = join(sourceDir, 'router.tsx');
  if (existsSync(routerPath)) {
    return {
      pageDirectory: join(sourceDir, 'pages'),
      pageFilePath: join(sourceDir, 'pages', `${componentName}.tsx`),
      routerPath,
      displayPath: `src/pages/${componentName}.tsx`,
      displayRoute: `/${routeName}`,
      importMarker: '// [dealtech:auto-imports]',
      routeMarker: '{/* [dealtech:auto-routes] */}',
      importStatement: `import { ${componentName} } from './pages/${componentName}';`,
      fallbackImport: "import { LoginPage } from './pages/LoginPage';",
      routeBlock: `<Route
  path="/${routeName}"
  element={
    <PrivateRoute>
      <${componentName} />
    </PrivateRoute>
  }
/>`,
      fallbackRoute: '<Route path="/" element={<Navigate to="/dashboard" replace />} />',
      routerLabel: 'src/router.tsx',
    };
  }

  return null;
}

function addUi(componentArgs) {
  ensureStarterTemplate();

  if (componentArgs.length === 0) {
    console.error(colors.red('\n[error] Please provide at least one UI element name.\n'));
    console.error(colors.dim(`Available UI: ${getTemplateUiFolders().join(', ')}\n`));
    process.exit(1);
  }

  const unknownComponents = [];
  const requestedFolders = [];
  const seenRequested = new Set();

  for (const componentArg of componentArgs) {
    const resolvedFolder = resolveUiFolder(componentArg);

    if (!resolvedFolder) {
      unknownComponents.push(componentArg);
      continue;
    }

    if (!seenRequested.has(resolvedFolder)) {
      requestedFolders.push(resolvedFolder);
      seenRequested.add(resolvedFolder);
    }
  }

  if (unknownComponents.length > 0) {
    console.error(colors.red(`\n[error] Unknown UI element: ${unknownComponents.join(', ')}`));
    console.error(colors.dim(`Available UI: ${getTemplateUiFolders().join(', ')}\n`));
    process.exit(1);
  }

  const allFolders = new Set();
  for (const folderName of requestedFolders) {
    collectUiComponentTree(folderName, allFolders);
  }

  const force = flags.has('--force');
  const targetBaseDir = join(process.cwd(), 'src', 'components', 'ui');
  ensureDirectory(targetBaseDir);

  const copiedFolders = [];
  const skippedFolders = [];

  for (const folderName of Array.from(allFolders).sort()) {
    const sourceDir = join(TEMPLATE_UI_DIR, folderName);
    const destinationDir = join(targetBaseDir, folderName);

    if (existsSync(destinationDir) && !force) {
      skippedFolders.push(`src/components/ui/${folderName}`);
      continue;
    }

    copyDirectory(sourceDir, destinationDir);
    copiedFolders.push(`src/components/ui/${folderName}`);
  }

  const dependencyFolders = Array.from(allFolders).filter(
    (folderName) => !requestedFolders.includes(folderName)
  );

  console.log(colors.green('\n[ok] UI elements processed successfully.'));
  console.log(colors.dim(`      Requested : ${requestedFolders.join(', ')}`));

  if (dependencyFolders.length > 0) {
    console.log(colors.dim(`      Included  : ${dependencyFolders.sort().join(', ')}`));
  }

  if (copiedFolders.length > 0) {
    console.log(colors.dim(`      Copied    : ${copiedFolders.join(', ')}`));
  }

  if (skippedFolders.length > 0) {
    console.log(colors.yellow('\n[info] Existing UI folders skipped. Use --force to overwrite.'));
    console.log(colors.dim(`      Skipped   : ${skippedFolders.join(', ')}`));
  }

  console.log();
}

function addLayout(layoutArgs) {
  ensureStarterTemplate();

  if (layoutArgs.length === 0) {
    console.error(colors.red('\n[error] Please provide at least one layout name.\n'));
    console.error(colors.dim(`Available layout: ${LAYOUT_REGISTRY.map((layout) => layout.name).join(', ')}\n`));
    process.exit(1);
  }

  const unknownLayouts = [];
  const requestedLayouts = [];
  const seenLayouts = new Set();

  for (const layoutArg of layoutArgs) {
    const resolvedLayout = resolveLayout(layoutArg);

    if (!resolvedLayout) {
      unknownLayouts.push(layoutArg);
      continue;
    }

    if (!seenLayouts.has(resolvedLayout.name)) {
      requestedLayouts.push(resolvedLayout);
      seenLayouts.add(resolvedLayout.name);
    }
  }

  if (unknownLayouts.length > 0) {
    console.error(colors.red(`\n[error] Unknown layout: ${unknownLayouts.join(', ')}`));
    console.error(colors.dim(`Available layout: ${LAYOUT_REGISTRY.map((layout) => layout.name).join(', ')}\n`));
    process.exit(1);
  }

  const force = flags.has('--force');
  const copiedFiles = [];
  const skippedFiles = [];

  for (const layout of requestedLayouts) {
    for (const file of layout.files) {
      const destinationPath = resolve(process.cwd(), file.destination);

      if (existsSync(destinationPath) && !force) {
        skippedFiles.push(file.destination);
        continue;
      }

      copyFileWithParents(file.source, destinationPath);
      copiedFiles.push(file.destination);
    }
  }

  console.log(colors.green('\n[ok] Layout processed successfully.'));
  console.log(colors.dim(`      Requested : ${requestedLayouts.map((layout) => layout.name).join(', ')}`));

  if (copiedFiles.length > 0) {
    console.log(colors.dim(`      Copied    : ${copiedFiles.join(', ')}`));
  }

  if (skippedFiles.length > 0) {
    console.log(colors.yellow('\n[info] Existing layout files skipped. Use --force to overwrite.'));
    console.log(colors.dim(`      Skipped   : ${skippedFiles.join(', ')}`));
  }

  console.log();
}

function addPage(pageArg) {
  if (!pageArg) {
    console.error(colors.red('\n[error] Please provide a page name. Example: npx dealtech-ui add-page reports\n'));
    process.exit(1);
  }

  const routeName = toKebabCase(pageArg);
  const pageBaseName = toPascalCase(pageArg);

  if (!routeName || !pageBaseName) {
    console.error(colors.red('\n[error] Invalid page name.\n'));
    process.exit(1);
  }

  const componentName = `${pageBaseName}Page`;
  const sourceDir = resolve(process.cwd(), 'src');
  const pageScaffold = resolvePageScaffold(sourceDir, routeName, componentName);

  if (!pageScaffold) {
    console.error(colors.red('\n[error] Starter router not found in src/.'));
    console.error(colors.dim('Run this command inside a DealTech starter app.\n'));
    process.exit(1);
  }

  if (!existsSync(pageScaffold.pageDirectory)) {
    mkdirSync(pageScaffold.pageDirectory, { recursive: true });
  }

  if (existsSync(pageScaffold.pageFilePath)) {
    console.error(colors.red(`\n[error] Page already exists: ${pageScaffold.displayPath}\n`));
    process.exit(1);
  }

  writeFileSync(pageScaffold.pageFilePath, buildPageTemplate(componentName, pageBaseName), 'utf-8');

  let routerContent = readFileSync(pageScaffold.routerPath, 'utf-8');

  if (routerContent.includes(pageScaffold.importMarker)) {
    routerContent = routerContent.replace(
      pageScaffold.importMarker,
      `${pageScaffold.importStatement}\n${pageScaffold.importMarker}`
    );
  } else if (!routerContent.includes(pageScaffold.importStatement)) {
    if (routerContent.includes(pageScaffold.fallbackImport)) {
      routerContent = routerContent.replace(
        pageScaffold.fallbackImport,
        `${pageScaffold.fallbackImport}\n${pageScaffold.importStatement}`
      );
    } else {
      console.error(colors.red(`\n[error] Unable to insert page import into ${pageScaffold.routerLabel}.`));
      process.exit(1);
    }
  }

  if (routerContent.includes(pageScaffold.routeMarker)) {
    const nextRouterContent = insertBlockBeforeMarker(
      routerContent,
      pageScaffold.routeMarker,
      pageScaffold.routeBlock
    );

    if (!nextRouterContent) {
      console.error(colors.red(`\n[error] Unable to insert page route into ${pageScaffold.routerLabel}.`));
      process.exit(1);
    }

    routerContent = nextRouterContent;
  } else if (routerContent.includes(pageScaffold.fallbackRoute)) {
    routerContent = routerContent.replace(
      pageScaffold.fallbackRoute,
      `${pageScaffold.routeBlock}\n${pageScaffold.fallbackRoute}`
    );
  } else {
    console.error(colors.red(`\n[error] Unable to insert page route into ${pageScaffold.routerLabel}.`));
    process.exit(1);
  }

  writeFileSync(pageScaffold.routerPath, routerContent, 'utf-8');

  console.log(colors.green('\n[ok] Page generated successfully.'));
  console.log(colors.dim(`      File : ${pageScaffold.displayPath}`));
  console.log(colors.dim(`      Route: ${pageScaffold.displayRoute}\n`));
}

function printNextSteps(targetDir, useCurrentDirectory) {
  console.log(colors.bold('\nNext steps:'));

  if (!useCurrentDirectory) {
    console.log(colors.cyan(`  cd ${targetDir}`));
  }

  if (flags.has('--no-install')) {
    console.log(colors.cyan('  npm install'));
  }

  console.log(colors.cyan('  npm run dev'));
  console.log();
}

switch (command) {
  case 'install':
    installStarter(positional[0]);
    break;
  case 'add':
    addUi(positional);
    break;
  case 'add-layout':
    addLayout(positional);
    break;
  case 'add-page':
    addPage(positional[0]);
    break;
  case 'help':
  case '--help':
  case '-h':
  case undefined:
    showHelp();
    break;
  default:
    console.error(colors.red(`\n[error] Unknown command: ${command}`));
    showHelp();
    process.exit(1);
}
