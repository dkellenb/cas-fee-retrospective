# Specialities

This page is intended to show what we learned and have built in into this application.

## Steps
1. Write UCs (see [Use Cases](UseCases.md))
1. Created mockups (see [Mockup](mockup/page/index.html))
1. Created components (non angular) based on mockups (see [Live Components](mockup/live/index.html))
1. Create a own angular 2 component library with full documentation [rsb-lib](../client/src/app/shared)
1. Analyzed which technology shall be used
1. Defined how a RestAPI should look like (see [Rest API](RestAPI.md))
1. Parallel developed server / client
1. TODO User testing (see [User testing](UserTesting.md))
1. Deployed on Heroku (see https://cas-fee-retrospective.herokuapp.com/)
1. Made a [Usability-Test](Usability-Test-Findings.md)

## Built in
- General
  - Persistence to NoSQL-Database (mongodb)
  - JWT used for authentication
  - Separate npm projects for server / client
    - Individual development possible (live / static for server / client)
    - Shared domain model
  - Websocket with different 'rooms'
- Client
  - Create a complete own [component lib](../client/src/app/shared). No use of external libs like matirial
  - Create a fully functional [carousel](../client/src/app/shared/carousel) component
  - Create a way to send [notification messges](../client/src/app/shared/notifier) from anywhere in the application by a service.
  - All components has their own css. Just a minimum set of global styles.
  - Used Scss.
  - Add a protector e2e test
  - Made Tests with the MockBackand and the TestBed (retrospective.service.spec.ts)
  - Used Bem for the styles.
- Server side implementation:
  - Express server
  - Using injection based framework ([https://github.com/inversify/inversify-express-utils](inversify-express-utils))
  - Rest API
  - JWT for authentication
  - noSQL Database MongoDB
  - Use TypeScript directly using *ts-node*
  - Using mocks
  - Deployable to Heroku

  
