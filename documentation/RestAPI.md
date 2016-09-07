# REST Api

## Overview

* Retrospective management (Overview, Create, Get, Update, Delete)
  * Status management (PUT)
  * Export (Get)
  * Retrospective comments (Overview, Create, Get, Update, Delete)
  * Retrospective comment vote (Post vote, remove vote)
* Register
  * User management (Update, Remove)

## Headers
For all methods needing authentication they require a JWT passed by the header:
`Authorization: Bearer <token>`

## Methods

### Retrospective Management

URL: `/rest/retrospective`

| Method  | CMD    | Auth |Description                                                        |
|---------|--------|------|-------------------------------------------------------------------|
|         | GET    | X    | Returns all retrospectives the authenticated user has access to   |
|         | POST   |      | Creates a new retrospective                                       |
| :id     | GET    |      | Get details about the retrospective                               |
| :id     | PUT    | X    | Updates the configuration of a retrospective                      |
| :id     | DELETE | X    | Deletes the retrospective if the authenticated user can manage it |

### Retrospective Management: Change status

URL: `/rest/retrospective/:id/status`

| Method  | CMD    | Auth |Description                                                        |
|---------|--------|------|-------------------------------------------------------------------|
|         | GET    |      | The current status of the retrospective                           |
|         | PUT    |      | Change status of the retrospective                                |

### Retrospective Management: Attendees

URL: `/rest/retrospective/:id/attendees`

| Method  | CMD    | Auth |Description                                                        |
|---------|--------|------|-------------------------------------------------------------------|
|         | GET    |      | Retrieve an updated list of the attendees                         |

### Retrospective Management: Comments

URL: `/rest/retrospective/:id/comments`

| Method  | CMD    | Auth |Description                                                        |
|---------|--------|------|-------------------------------------------------------------------|
|         | GET    |      | Gets all comments posted to a retrospective                       |
|         | POST   |      | Puts a new comment to a retrospective                             |
| :id     | GET    |      | Get a single comment                                              |
| :id     | PUT    |      | Update a single comment                                           |
| :id     | DELETE |      | Delete a single comment                                           |

### Retrospective Management: Voting

URL `/rest/retrospective/:id/comments/:id/votes`

| Method  | CMD    | Auth |Description                                                        |
|---------|--------|------|-------------------------------------------------------------------|
|         | GET    |      | Get all votes (restricted)                                        |
|         | PUT    |      | Posts a vote to a single comment                                  |
| :id     | DELETE |      | Remove a vote (only if from the current user)                     |

### User Management

URL `/rest/user`

| Method  | CMD    | Auth |Description                                                        |
|---------|--------|------|-------------------------------------------------------------------|
|         | GET    | X    | Retrieve all users (incl. filter possibilites)                    |
|         | POST   |      | Create new user and JWT token, in order to identify a user        |
|         | PUR    |      | Updates the current user                                          |
| :id     | GET    | X    | Gets user details of the user (self or admin)                     |
| :id     | PUT    |      | Updates the user                                                  |
| :id     | DELETE | X    | Self delete or by admin                                           |

### User Management: Transfer of account to other computer

URL `/rest/user/:id/transfertoken`

| Method  | CMD    | Auth |Description                                                        |
|---------|--------|------|-------------------------------------------------------------------|
|         | POST   | X    | Creates a transfer token and sends it by mail                     |
| :id     | GET    |      | Retrieve user details with the given token => transfer completed  |
