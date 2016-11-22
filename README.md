# Retrospective Project - Project 2 of group 'dkellenb' and 'bruede'

This repository contains the project work of the two students [Daniel Kellenberger](https://github.com/dkellenb) and [Benjamin Rüde](https://github.com/bruede).

## Installation
...

## Documentation
* [UseCases](documentation/UseCases.md)
* [DomainModel](documentation/DomainModel.md)
* [RestAPI](documentation/RestAPI.md)

## Development

### UI Development

UI is available in /client/ folder.

#### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

#### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/route/class`.

#### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

#### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

#### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/). 
Before running the tests make sure you are serving the app via `ng serve`.

### Server Development

Server is available in /server/ folder.

 * Prepare: /server/$ `npm install`
 * Run Server: /server/$ `npm start` or use /server/$ `nodemon`
 
 If you want to run the unit tests, simply use `npm test <example>/**/*.spec.ts`  
 To run all tests simply run `npm run test:all`

### Deploying to Github Pages

Run `ng github-pages:deploy` to deploy to Github Pages.

