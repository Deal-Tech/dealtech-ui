#!/usr/bin/env node

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { existsSync, mkdirSync, copyFileSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

// ── Colors (no dependency) ──────────────────────────
const c = {
    green: (t) => `\x1b[32m${t}\x1b[0m`,
    red: (t) => `\x1b[31m${t}\x1b[0m`,
    cyan: (t) => `\x1b[36m${t}\x1b[0m`,
    yellow: (t) => `\x1b[33m${t}\x1b[0m`,
    bold: (t) => `\x1b[1m${t}\x1b[0m`,
    dim: (t) => `\x1b[2m${t}\x1b[0m`,
};

// ── Load registry ───────────────────────────────────
const registry = JSON.parse(readFileSync(join(ROOT, 'registry.json'), 'utf-8'));

// ── CLI ─────────────────────────────────────────────
const [, , command, ...args] = process.argv;

function showHelp() {
    console.log(`
${c.bold('dealtech-ui')} — DealTech Component Library

${c.bold('Usage:')}
  npx dealtech-ui ${c.cyan('add')} ${c.dim('<component>')}    Install a component
  npx dealtech-ui ${c.cyan('add-layout')} ${c.dim('<layout>')}  Install a layout
  npx dealtech-ui ${c.cyan('install')}              Install ALL components & layouts
  npx dealtech-ui ${c.cyan('list')}                 Show available components & layouts
  npx dealtech-ui ${c.cyan('help')}                 Show this message

${c.bold('Examples:')}
  npx dealtech-ui add button
  npx dealtech-ui add card modal
  npx dealtech-ui add-layout sidebar-layout
`);
}

function listComponents() {
    console.log(`\n${c.bold('Available components:')}\n`);
    registry.components.forEach((comp) => {
        const deps = comp.dependencies.length > 0 ? c.dim(` → deps: ${comp.dependencies.join(', ')}`) : '';
        console.log(`  ${c.cyan(comp.name.padEnd(20))} ${comp.description}${deps}`);
    });

    if (registry.layouts && registry.layouts.length > 0) {
        console.log(`\n${c.bold('Available layouts:')}\n`);
        registry.layouts.forEach((layout) => {
            const deps = layout.dependencies.length > 0 ? c.dim(` → deps: ${layout.dependencies.join(', ')}`) : '';
            console.log(`  ${c.cyan(layout.name.padEnd(20))} ${layout.description}${deps}`);
        });
    }
    console.log();
}

function addItems(names, type) {
    const isLayout = type === 'layout';
    const items = isLayout ? (registry.layouts || []) : registry.components;
    const outputBase = isLayout ? 'src/layouts' : 'src/components';
    const outputDir = resolve(process.cwd(), ...outputBase.split('/'));
    const label = isLayout ? 'layout' : 'component';

    if (names.length === 0) {
        console.log(c.red(`\n✗ Please specify ${label} name(s). Example: npx dealtech-ui ${isLayout ? 'add-layout sidebar-layout' : 'add button'}\n`));
        listComponents();
        return;
    }

    const allDeps = new Set();

    console.log();

    for (const name of names) {
        const item = items.find((i) => i.name === name.toLowerCase());

        if (!item) {
            console.log(c.red(`  ✗ ${label} "${name}" not found.`));
            continue;
        }

        const itemDir = join(outputDir, item.name);
        const sourceDir = join(ROOT, item.path);

        // Create target directory
        if (!existsSync(itemDir)) {
            mkdirSync(itemDir, { recursive: true });
        }

        // Copy files
        for (const file of item.files) {
            const src = join(sourceDir, file);
            const dest = join(itemDir, file);

            if (!existsSync(src)) {
                console.log(c.red(`  ✗ Source file not found: ${file}`));
                continue;
            }

            copyFileSync(src, dest);
            console.log(c.green(`  ✓ ${item.name}/${file}`) + c.dim(` → ${outputBase}/${item.name}/${file}`));
        }

        // Collect dependencies
        item.dependencies.forEach((dep) => allDeps.add(dep));
    }

    // Show dependency install hint
    if (allDeps.size > 0) {
        const depList = [...allDeps].join(' ');
        console.log(`\n${c.yellow('📦 Install required dependencies:')}`);
        console.log(c.dim(`   npm install ${depList}\n`));
    } else {
        console.log();
    }
}

function installAll() {
    console.log(c.bold('\nInstalling ALL DealTech components and layouts...\n'));
    const allDeps = new Set();

    const installItems = (items, outputBase) => {
        if (!items || items.length === 0) return;
        const outputDir = resolve(process.cwd(), ...outputBase.split('/'));
        items.forEach(item => {
            const itemDir = join(outputDir, item.name);
            const sourceDir = join(ROOT, item.path);
            if (!existsSync(itemDir)) mkdirSync(itemDir, { recursive: true });
            item.files.forEach(file => {
                const src = join(sourceDir, file);
                const dest = join(itemDir, file);
                if (existsSync(src)) {
                    copyFileSync(src, dest);
                    console.log(c.green(`  ✓ ${item.name}/${file}`) + c.dim(` → ${outputBase}/${item.name}/${file}`));
                }
            });
            item.dependencies.forEach(dep => allDeps.add(dep));
        });
    };

    installItems(registry.components, 'src/components');
    installItems(registry.layouts, 'src/layouts');

    if (allDeps.size > 0) {
        const depList = [...allDeps].join(' ');
        console.log(`\n${c.yellow('📦 Install required dependencies:')}`);
        console.log(c.dim(`   npm install ${depList}\n`));
    } else {
        console.log();
    }
}

// ── Route command ───────────────────────────────────
switch (command) {
    case 'add':
        addItems(args, 'component');
        break;
    case 'add-layout':
        addItems(args, 'layout');
        break;
    case 'install':
        installAll();
        break;
    case 'list':
        listComponents();
        break;
    case 'help':
    case '--help':
    case '-h':
    case undefined:
        showHelp();
        break;
    default:
        console.log(c.red(`\n✗ Unknown command: ${command}`));
        showHelp();
}
