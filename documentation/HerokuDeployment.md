# HEROKU Deployment

## Initialize
1. `$ heroku git:remote -a cas-fee-retrospective`
1. `$ git push heroku`

## Compilation steps
Do this if you want to add a new version. First check if the version is running locally.

1. `$ gulp build`
1. Check if it's working with `$ heroku local web`

Next compile it and commit generated files ({{client/dist}} and {{server/build}})

1. `$ gulp heroku-build`
1. `$ git commit`
1. `$ git push heroku master`

## Needed heroku environment variables

| Variable Name | Description                  | Example |
|---------------|------------------------------|---------|
| MONGODB_URI   | Database URL                 | mongodb://user:pass@host/database |
| APP_HOSTNAME  | Startup Host Name            | localhost |
| JWT_KEY       | JSON WebToken Encryption Key | çjd8f_4$8fja8df382hvcASDUwe |