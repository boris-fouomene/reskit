#!/usr/bin/env node
'use strict';

const { program } = require('commander');

const packageObj = require("../package.json");
const version = packageObj.version;
const packageName = packageObj.name;

program
    .name(packageName)
    .description(`Utility for the ${packageName} package`)
    .version(version);

program.command('generate-icon-types')
    .description(`generate font icon types`)
    .argument('<sets>', 'The icon sets name prefix to generate. Separate multiple sets with a comma. Example: material,fa6')
    .option('-o, --out [path]', 'the output file path')
    .action((iconSetsPrefixes, options) => {
        require("./generate-icon-types")(iconSetsPrefixes, Object.assign({}, options))
    });

program.parse();