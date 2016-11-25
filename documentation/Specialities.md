# Specialities

This page is intended to show what we learned and have built in into this application.

## Steps
1. Write UCs (see [Use Cases](UseCases.md))
1. Created mockups (see [Mockup](mockup/page/index.html))
1. Created components (non angular) based on mockups (see [Live Components](mockup/live/index.html))
1. Analyzed which technology shall be used
1. Defined how a RestAPI should look like (see [Rest API](RestAPI.md))
1. Parallel developed server / client
1. TODO User testing (see [User testing](UserTesting.md))
1. TODO Deployed on Heroku

## Built in
- General
  - Persistence to NoSQL-Database (mongodb)
  - JWT used for authentication
  - Separate npm projects for server / client
    - Individual development possible (live / static for server / client)
    - Shared domain model
  - Websocket with different 'rooms'
- Client
  - Lazy loading of debug module (see `client/src/app/+debug`)
  - ...
- Server side implementation:
  - Express server
  - Using injection based framework ([https://github.com/inversify/inversify-express-utils](inversify-express-utils))
  - Rest API
  - JWT for authentication
  - noSQL Database MongoDB
  - Use TypeScript directly using *ts-node*
  - Using mocks

  
