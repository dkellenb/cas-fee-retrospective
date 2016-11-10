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

URL: `/rest/retrospectives`

| +URL    | CMD    | Auth | Done | Description                                                       |
|---------|--------|------|------|-------------------------------------------------------------------|
|         | GET    | X    |      | Returns all retrospectives the authenticated user has access to   |
|         | POST   |      | OK   | Creates a new retrospective                                       |
| :id     | GET    | X    | OK   | Get details about the retrospective                               |
| :id     | PUT    | X    | Updates the configuration of a retrospective                      |
| :id     | DELETE | X    | Deletes the retrospective if the authenticated user can manage it |

### Retrospective Management: Change status

URL: `/rest/retrospectives/:id/status`

| Method  | CMD    | Auth |Description                                                        |
|---------|--------|------|-------------------------------------------------------------------|
|         | GET    |      | The current status of the retrospective                           |
|         | PUT    |      | Change status of the retrospective                                |

### Retrospective Management: Attendees

URL: `/rest/retrospectives/:id/attendees`

| Method  | CMD    | Auth |Description                                                        |
|---------|--------|------|-------------------------------------------------------------------|
|         | GET    |      | Retrieve an updated list of the attendees                         |

### Retrospective Management: Comments

URL: `/rest/retrospectives/:id/comments`

| Method  | CMD    | Auth |Description                                                        |
|---------|--------|------|-------------------------------------------------------------------|
|         | GET    |      | Gets all comments posted to a retrospective                       |
|         | POST   |      | Puts a new comment to a retrospective                             |
| :id     | GET    |      | Get a single comment                                              |
| :id     | PUT    |      | Update a single comment                                           |
| :id     | DELETE |      | Delete a single comment                                           |

### Retrospective Management: Voting

URL `/rest/retrospectives/:id/comments/:id/votes`

| Method  | CMD    | Auth |Description                                                        |
|---------|--------|------|-------------------------------------------------------------------|
|         | GET    |      | Get all votes (restricted)                                        |
|         | PUT    |      | Posts a vote to a single comment                                  |
| :id     | DELETE |      | Remove a vote (only if from the current user)                     |

### User Management

URL `/rest/user`

| +URL    | CMD    | Auth | Done | Description                                                       |
|---------|--------|------|------|-------------------------------------------------------------------|
|         | GET    | X    |      | Retrieve all users (incl. filter possibilites)                    |
|         | POST   |      | OK   | Create new user and JWT token, in order to identify a user        |
| current | GET    | X    | OK   | Get the current user                                              |
| :id     | GET    | X    | OK   | Gets the some details about the user (only public attributes)     |
| :id     | PUT    | X    | OK   | Updates the given user (only allowed by the user itself or admin  |
| :id     | DELETE | X    | OK   | Self delete or by admin                                           |

### User Token retrieval

URL `/rest/user/:userid/tokens`

| +URL    | CMD    | Auth | Done | Description                                                       |
|---------|--------|------|------|-------------------------------------------------------------------|
| :id     | GET    |      | OK   | Gets the token for the given :userid and :id (token id) => JWT    |


### User Management: Transfer of account to other computer

URL `/rest/users/:id/transfertoken`

| Method  | CMD    | Auth |Description                                                        |
|---------|--------|------|-------------------------------------------------------------------|
|         | POST   | X    | Creates a transfer token and sends it by mail                     |
| :id     | GET    |      | Retrieve user details with the given token => transfer completed  |
