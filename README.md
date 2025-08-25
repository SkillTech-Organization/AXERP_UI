# AXERP

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

# Increasing version number and building

## Version number

To increase the current project version, the "version" field in the package.json configuration file needs to be updated.

`
{
  "name": "AXERP",
  "version": "1.0.0",
  "scripts": {
    ...
`

## Build

Currently there are 4 specialized environment files - not counting the default, unnamed environment.ts:
- development
- localhost
- release
- staging

Due to security reasons, the values for the fields in these environment files are not commited to Git.

When building a new version, the following commands need to be entered into the command line:

`
export NODE_OPTIONS=--openssl-legacy-provider; ng build --configuration="release" --base-href
`

The first command is: `export NODE_OPTIONS=--openssl-legacy-provider;`
This can be obligatory when using newer node.js version to avoid errors.

The second part is: `ng build --configuration="release" --base-href`
This is the actual building of the angular project.
It selects the `release` environment as the one used for the build. The `--base-href` is needed for the index.html.
