# User

There are two types of user:

- anonymous user
- registered user

# Roles

Within a given context, a user could have different roles

- Administrator (can only be given to registered users)
- Manager (can manage a board)
- Editor (can change a comment)
- Reader (can see comments)

# States

- COMMENT: Users are allowed to comment
- GROUP: Comments can be grouped
- VOTE: Users are allowed to vote
- CLOSED: Session is closed and cannot be modified

# Use Cases

## Retrospective attendance

### <a id="ra01"></a>RA01: Join an existing retrospective

1. User gets the link to the retrospective and opens the page
1. If the user is already known to the system, continues to (#ra02). Otherwise the system show a page where the user could enter a short name.
1. The system persists the short name and redirects to (#ra02)

### <a id="ra02"></a>RA02: Show retrospective comments

1. System show all retrospective comments, split up in three groups: Start doing, continue doing, stop doing. Additionally on this view following UCs can be started:
  - [RA03: Share retrospective session](#ra03)
  - [RA04: Add a comment](#ra04)
  - [RA05: Modify an own comment](#ra05)
  - [RA06: Delete an own comment](#ra06)
  - [RA07: Change state no further comment](#ra07)
  - [RA09: Show single comment](#ra09)
  - [RA10: Export comments and votes](#ra10)
  - [RM02: Change retrospective settings](#rm02)
  - [RM03: Persist session](#rm03)
  - [RM04: Unhide comments](#rm04)
  - [RM06: Group comments](#rm06)
  - [RM07: Delete comment](#rm07)
  - [RM08: Modify comment](#rm08)
  - [RM09: Write outcome](#rm09)
1. System updates the view as soon as new comments have been added

### <a id="ra03"></a>RA03: Share retrospective session

1. User clicks on 'share retrospective session'
1. System show the link to share

### <a id="ra04"></a>RA04: Add a comment

Precondition: Session is in 'COMMENT'-mode

1. User clicks on one of the three buttons to add a comment
1. System shows a text field
1. User enters the text and confirms it
1. System saves the comment and pushes the comment to the other attendees
1. System goes back to [RA02](#ra02)

### <a id="ra05"></a>RA05: Modify an own comment

Precondition: Session is in 'COMMENT'-mode

1. User clicks on own comment
1. System shows a text field with the comment
1. User enters the text and confirms it
1. System saves the comment and pushes the update to the other attendees
1. System goes back to [RA02](#ra02)

### <a id="ra06"></a>RA06: Delete an own comment

Precondition: Session is in 'COMMENT'-mode

1. User clicks delete action on own comment
1. System removes the comment and pushes the delete to the other attendees
1. System goes back to [RA02](#ra02)

### <a id="ra07"></a>RA07: Change state no further comment
 
Precondition: Session is in 'COMMENT'-mode

1. User confirms that he has no intention to add further comment
1. System pushes this information to all attendees
1. System updates view. Continue with [RA02](#ra02)
 
### <a id="ra08"></a>RA08: Show single comment

Precondition: Session is not in 'COMMENT'-mode

1. User clicks on comment
1. System shows the full content. Following further actions are possible:
  - Close (go back to [RA02](#ra02)
  - Vote on comment ([RA09](#ra09)) (if in 'VOTE'-mode)

### <a id="ra09"></a>RA09: Vote/Unvote on comments

Precondition: Session is in 'VOTE'-mode

1. Unvoted by user: If user has enough votes available, he can add a vote. Voted by user: User can remove vote
1. Close (go back to [RA02)(#ra02))

### <a id="ra10"></a>RA10: Export comments and votes

Precondition: Session is not in 'COMMENT'-mode

1. User clicks on export
1. System generates a JSON based export of the retrospective

## Retrospective Management

### <a id="rm01"></a>RM01: Create a new retrospective

As a user I want to create a new retrospective session.

1. User is on start page
1. System show a simple form to create a new retrospective session. Following fields are contained:
  * name
  * optional additional settings
1. User clicks on create
1. System goes to [RA02: Show retrospective comments](#ra02)

### <a id="rm02"></a>RM02: Change retrospective settings

As a retrospective manager, i want to change the retrospective settings

Precondition: User is on comments overview

1. User clicks on retrospective settings
1. System shows the settings, which contains:
  - Max number of votes
  - Name of the retrospective
  - Other managers
1. User changes settings and saves it
1. System goes to [RA02: Show retrospective comments](#ra02)

### <a id="rm03"></a>RM03: Persist session

As a user i want to persist this session 

Precondition: User is not authenticated

1. User clicks on 'persist'
1. System show the note that sessions can only be persisted if user is authenticated
1. User 'register' or 'authenticate' (see [REG01](#REG01) or [REG02](#REG02))

### <a id="rm04"></a>RM04: Unhide comments

As a retrospective leader (manager), i want to unhide all comments.

1. If all users have declared that they have finished, the manager can unhide the comments.
1. The system changes the status of the retrospective and notifies all clients to reload all comments

### <a id=rm05"></a>RM05: Iterate trough comments
### <a id=rm06"></a>RM06: Group comments
### <a id=rm07"></a>RM07: Delete comment
### <a id=rm08"></a>RM08: Modify comment
### <a id=rm09"></a>RM09: Write outcome

## Registration Flow
### <a id=reg01"></a>REG01: Register
### <a id=reg02"></a>REG02: Authenticate
### <a id=reg03"></a>REG03: Change user settings
### <a id=reg04"></a>REG04: Logout
  
## Manage

### <a id=m01"></a>M01: View persisted retro sessions
### <a id=m02"></a>M02: Delete retro session
  
## Admin flow

### <a id=a01"></a>A01: Manage subscribed users
### <a id=a02"></a>A02: Manage persistent retro sessions

