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

/* program.command('generate-icon-types')
    .description(`generate font icon types`)
    .argument('[sets]', 'The icon sets name or prefix to generate. Separate multiple sets with a comma. Example: material,fa6,antd,foundation,ionic,octicons')
    .option('-o, --out [path]', 'the output file path')
    .action((iconSetsPrefixes, options) => {
        require("./generate-icon-types")(iconSetsPrefixes, Object.assign({}, options))
    }); */

program.command('generate-variants')
    .description(`Generate application variants`)
    .option('-i, --input [path]', 'The path of the input json file in which the application\'s variants are declared. If not specified, the application will try to find the variants.json file located in the directory where the command was executed.')
    .action((colors, options) => {
        console.log(options, " is optttttt")
        require("./generate-variants")(Object.assign({}, options))
    });

program.parse();