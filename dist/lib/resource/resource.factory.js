"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const name_parser_1 = require("../../utils/name.parser");
const source_root_helpers_1 = require("../../utils/source-root.helpers");
const strings_1 = require("@angular-devkit/core/src/utils/strings");
const pluralize = require("pluralize");
const __1 = require("../..");
const dependencies_utils_1 = require("../../utils/dependencies.utils");
const tasks_1 = require("@angular-devkit/schematics/tasks");
function main(options) {
    options = transform(options);
    return (tree, context) => {
        return schematics_1.branchAndMerge(schematics_1.chain([
            addMappedTypesDependencyIfApplies(options),
            source_root_helpers_1.mergeSourceRoot(options),
            addDeclarationToModule(options),
            schematics_1.mergeWith(generate(options)),
        ]))(tree, context);
    };
}
exports.main = main;
function transform(options) {
    var _a;
    const target = Object.assign({}, options);
    if (!target.name) {
        throw new schematics_1.SchematicsException('Option (name) is required.');
    }
    target.metadata = 'imports';
    const location = new name_parser_1.NameParser().parse(target);
    target.name = core_1.strings.dasherize(location.name);
    target.path = core_1.strings.dasherize(location.path);
    target.language = target.language !== undefined ? target.language : 'ts';
    if (target.language === 'js') {
        throw new Error('The "resource" schematic does not support JavaScript language (only TypeScript is supported).');
    }
    target.path = target.flat
        ? target.path
        : core_1.join(target.path, target.name);
    target.isSwaggerInstalled = (_a = options.isSwaggerInstalled) !== null && _a !== void 0 ? _a : false;
    return target;
}
function generate(options) {
    return (context) => schematics_1.apply(schematics_1.url(core_1.join('./files', options.language)), [
        schematics_1.filter((path) => {
            if (path.endsWith('.dto.ts')) {
                return (options.type !== 'graphql-code-first' &&
                    options.type !== 'graphql-schema-first' &&
                    options.crud);
            }
            if (path.endsWith('.input.ts')) {
                return ((options.type === 'graphql-code-first' ||
                    options.type === 'graphql-schema-first') &&
                    options.crud);
            }
            if (path.endsWith('.resolver.ts') ||
                path.endsWith('.resolver.spec.ts')) {
                return (options.type === 'graphql-code-first' ||
                    options.type === 'graphql-schema-first');
            }
            if (path.endsWith('.graphql')) {
                return options.type === 'graphql-schema-first' && options.crud;
            }
            if (path.endsWith('controller.ts') ||
                path.endsWith('.controller.spec.ts')) {
                return options.type === 'microservice' || options.type === 'rest';
            }
            if (path.endsWith('.gateway.ts') || path.endsWith('.gateway.spec.ts')) {
                return options.type === 'ws';
            }
            if (path.includes('@ent')) {
                return options.crud;
            }
            return true;
        }),
        options.spec ? schematics_1.noop() : schematics_1.filter((path) => !path.endsWith('.spec.ts')),
        schematics_1.template(Object.assign(Object.assign(Object.assign({}, core_1.strings), options), { lowercased: (name) => {
                const classifiedName = strings_1.classify(name);
                return (classifiedName.charAt(0).toLowerCase() + classifiedName.slice(1));
            }, singular: (name) => pluralize.singular(name), ent: (name) => name + '.entity' })),
        schematics_1.move(options.path),
    ])(context);
}
function addDeclarationToModule(options) {
    return (tree) => {
        if (options.skipImport !== undefined && options.skipImport) {
            return tree;
        }
        options.module = new __1.ModuleFinder(tree).find({
            name: options.name,
            path: options.path,
        });
        if (!options.module) {
            return tree;
        }
        const content = tree.read(options.module).toString();
        const declarator = new __1.ModuleDeclarator();
        tree.overwrite(options.module, declarator.declare(content, Object.assign(Object.assign({}, options), { type: 'module' })));
        return tree;
    };
}
function addMappedTypesDependencyIfApplies(options) {
    return (host, context) => {
        try {
            if (options.type === 'graphql-code-first') {
                return;
            }
            if (options.type === 'rest') {
                const nodeDependencyRef = dependencies_utils_1.getPackageJsonDependency(host, '@nestjs/swagger');
                if (nodeDependencyRef) {
                    options.isSwaggerInstalled = true;
                    return;
                }
            }
            const nodeDependencyRef = dependencies_utils_1.getPackageJsonDependency(host, '@nestjs/mapped-types');
            if (!nodeDependencyRef) {
                dependencies_utils_1.addPackageJsonDependency(host, {
                    type: dependencies_utils_1.NodeDependencyType.Default,
                    name: '@nestjs/mapped-types',
                    version: '*',
                });
                context.addTask(new tasks_1.NodePackageInstallTask());
            }
        }
        catch (err) {
        }
    };
}
