# Assessment remarks

## Installation
(see also [README.md](../README.md))

1. `git clone https://github.com/dkellenb/cas-fee-retrospective`
1. `npm install -g gulp`
1. `npm install`
1. `gulp build`

## Configuration

Copy file `server/server-config-template.json` to `server/server-config.json` and adapt it to your needs.

## Execution
1. Start application with `gulp run`.
1. Open http://localhost:3000/ in your browser

## Documentation to check
* We have documented our special features / what we have covered in [Specialities](./Specialities.md)

## Own retrospective:
### Well done
- Played through most of the covered technologies from our lecture (UCs, Mocks, Live Mock, Styleguide, Development, Testing, Usability Testing)
- Use BEM from the beginning
- Rest API as a basic contract
- Small components in Angular

### What we would do differently next time
- Websockets should also transfer the data, not only the events
- Start earlier with deploying to heroku (working too long with ts-node)
- Don't vast time for our own styles, use bootstrap or material
- Choose a simpler application to build
- Client / server build
- Store comments and topics also as separate collections (use more of the populate mongo feature)
- Have higher test coverage

### Learnings
- Learned a lot by trying to cover most of the presented  technologies from our lecture
- Don't choose always the most recent version, you may loose too much time
- Filter stackoverflow comments by selecting only the last recent ones (as most of the answers are not valid anymore)
- Browser Stack is really helpful for finding IPhone 6 rendering issues, if no Mac is available for debugging.