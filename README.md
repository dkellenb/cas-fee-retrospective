# Retrospective Project - Project 2 of group 'dkellenb' and 'bruede'
This repository contains the project work of the two students [Daniel Kellenberger](https://github.com/dkellenb) and [Benjamin Rüde](https://github.com/bruede) as a result of the 2nd project for the CAS in Front End Engineering at Rapperswil, Switerland.

## Goal
For those teams working with scrum in distributed teams, doing retrospectives together is not easy. This project aims
to fill some part of the gap by providing an online collaboration tool to do retrospectives together.

## Retrospective application (Demo application)
### Demo Access
https://cas-fee-retrospective.herokuapp.com/

### Requirements (Participants)
 * Participants are connected through phone conference system
 * Screen of the organisator is shared with all participants
 * Each participant has a device with access to the internet

### Features
* Easy setup of retrospectives (can be done by anyone, no login required)
* Invite other participants by sharing the URL or the QR Code
* Four phase process:
    1. *COMMENT*: All participants can add comments
    1. *REVIEW*: Manager can show all comments, modify or delete them or create new ones (discuss them)
    1. *VOTE*: Participants can vote on each topic
    1. *CLOSE*: Retrospective is freezed

## Installation, configuration and launch (Self installation)
### Installation
1. `git clone https://github.com/dkellenb/cas-fee-retrospective`
1. `npm install -g gulp`
1. `npm install`
1. `gulp build`

### Configuration
Copy file `server/server-config-template.json` to `server/server-config.json` and adapt it to your needs.
 * mongodbUrl
 * jwt-key

### Execution
Start application with `gulp run`.

## Documentation
* [UseCases](documentation/UseCases.md)
* [DomainModel](documentation/DomainModel.md)
* [RestAPI](documentation/RestAPI.md)
* [Assessment Remarks](documentation/AssessmentRemarks.md)
* [Specialities](documentation/Specialities.md)

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
 
To run all tests simply run `npm run test`

### Deploying to Github Pages

Run `ng github-pages:deploy` to deploy to Github Pages.

