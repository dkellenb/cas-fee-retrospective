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

| +URL     | CMD    | Auth | Done | Description                                                       |
|----------|--------|------|------|-------------------------------------------------------------------|
|          | GET    | X    | Part | Returns all retrospectives the authenticated user has access to   |
|          | POST   |      | OK   | Creates a new retrospective                                       |
| :id      | GET    | X    | OK   | Get details about the retrospective                               |
| :id      | PUT    | X    | OK   | Updates the configuration of a retrospective                      |
| :id      | DELETE | X    | OK   | Deletes the retrospective if the authenticated user can manage it |

### Retrospective Management: Change status

URL: `/rest/retrospectives/:id/status`

| +URL     | CMD    | Auth | Done | Description                                                       |
|----------|--------|------|------|-------------------------------------------------------------------|
|          | GET    | X    | OK   | The current status of the retrospective                           |
|          | PUT    | X    | OK   | Change status of the retrospective                                |

### Retrospective Management: Attendees

URL: `/rest/retrospectives/:id/attendees`

| +URL     | CMD    | Auth | Done | Description                                                       |
|----------|--------|------|------|-------------------------------------------------------------------|
|          | GET    | X    | OK   | Retrieve an updated list of the attendees                         |
|          | POST   | X    | OK   | Just do a simple post to a retrospective to attend to it          |
| :userid  | GET    | X    | OK   | Retrieve a single attendee of a retrospective (e.g. if new)       |

### Retrospective Topics

URL: `/rest/retrospectives/:id/topics`

| +URL     | CMD    | Auth | Done | Description                                                       |
|----------|--------|------|------|-------------------------------------------------------------------|
|          | GET    | X    | OK   | Retrieve all topics                                               |
|          | POST   | X    |      | Add a new topic                                                   |
| :topicid | GET    | X    | OK   | Get just the contents of this particular topic                    |
| :topicid | PUT    | X    |      | Update the topic name (manager only)                              |

### Retrospective Management: Comments

URL: `/rest/retrospectives/:id/topics/:topicid/comments`

| +URL     | CMD    | Auth | Done | Description                                                       |
|----------|--------|------|------|-------------------------------------------------------------------|
|          | GET    | X    | OK   | Gets all comments posted to this topic                            |
|          | POST   | X    | OK   | Puts a new comment to a topic                                     |
| :cid     | GET    | X    | OK   | Get a single comment on this topic                                |
| :cid     | PUT    | X    | OK   | Update a single comment                                           |
| :cid     | DELETE | X    | OK   | Delete a single comment                                           |

### Retrospective Management: Voting

URL `/rest/retrospectives/:id/topics/:topicid/comments/:cid/votes`

| +URL     | CMD    | Auth | Done | Description                                                       |
|----------|--------|------|------|-------------------------------------------------------------------|
|          | GET    | X    |      | Get all votes (restricted)                                        |
|          | PUT    | X    | OK   | Posts a vote to a single comment                                  |
|          | DELETE | X    | OK   | Remove a vote (only if from the current user)                     |

### User Management

URL `/rest/user`

| +URL     | CMD    | Auth | Done | Description                                                       |
|----------|--------|------|------|-------------------------------------------------------------------|
|          | GET    | X    | Part | Retrieve all users (incl. filter possibilites)                    |
|          | POST   |      | OK   | Create new user and JWT token, in order to identify a user        |
| current  | GET    | X    | OK   | Get the current user                                              |
| :id      | GET    | X    | OK   | Gets the some details about the user (only public attributes)     |
| :id      | PUT    | X    | OK   | Updates the given user (only allowed by the user itself or admin  |
| :id      | DELETE | X    | OK   | Self delete or by admin                                           |

### User Token retrieval

URL `/rest/user/:userid/tokens`

| +URL     | CMD    | Auth | Done | Description                                                       |
|----------|--------|------|------|-------------------------------------------------------------------|
| :id      | GET    |      | OK   | Gets the token for the given :userid and :id (token id) => JWT    |


### User Management: Transfer of account to other computer

URL `/rest/users/:id/transfertoken`

| +URL     | CMD    | Auth | Done | Description                                                       |
|----------|--------|------|------|-------------------------------------------------------------------|
|          | POST   | X    |      | Creates a transfer token and sends it by mail                     |
| :id      | GET    |      |      | Retrieve user details with the given token => transfer completed  |
