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
- REVIEW: Comments can be reviewed and grouped
- VOTE: Users are allowed to vote
- CLOSED: Session is closed and cannot be modified

# Use Cases

## Retrospective attendance

### <a id="RA01"></a>RA01: Join an existing retrospective

1. User gets the link to the retrospective and opens the page
1. If the user is already known to the system, continues to (#RA02). Otherwise the system show a page where the user could enter a short name.
1. The system persists the short name and redirects to (#RA02)

### <a id="RA02"></a>RA02: Show retrospective comments

1. System show all retrospective comments, split up in three groups: Start doing, continue doing, stop doing. Additionally on this view following UCs can be started:
  - [RA03: Share retrospective session](#RA03)
  - [RA04: Add a comment](#RA04)
  - [RA05: Modify an own comment](#RA05)
  - [RA06: Delete an own comment](#RA06)
  - [RA07: Change state no further comment](#RA07)
  - [RA09: Show single comment](#RA09)
  - [RA10: Export comments and votes](#RA10)
  - [RM02: Change retrospective settings](#RM02)
  - [RM03: Persist session](#RM03)
  - [RM04: Unhide comments](#RM04)
  - [RM06: Group comments](#RM06)
  - [RM07: Delete comment](#RM07)
  - [RM08: Modify comment](#RM08)
  - [RM09: Write outcome](#RM09)
1. System updates the view as soon as new comments have been added

### <a id="RA03"></a>RA03: Share retrospective session

1. User clicks on 'share retrospective session'
1. System show the link to share

### <a id="RA04"></a>RA04: Add a comment

Precondition: Session is in 'COMMENT'-mode

1. User clicks on one of the three buttons to add a comment
1. System shows a text field
1. User enters the text and confirms it
1. System saves the comment and pushes the comment to the other attendees
1. System goes back to [RA02](#RA02)

### <a id="RA05"></a>RA05: Modify an own comment

Precondition: Session is in 'COMMENT'-mode

1. User clicks on own comment
1. System shows a text field with the comment
1. User enters the text and confirms it
1. System saves the comment and pushes the update to the other attendees
1. System goes back to [RA02](#RA02)

### <a id="RA06"></a>RA06: Delete an own comment

Precondition: Session is in 'COMMENT'-mode

1. User clicks delete action on own comment
1. System removes the comment and pushes the delete to the other attendees
1. System goes back to [RA02](#RA02)

### <a id="RA07"></a>RA07: Change state no further comment
 
Precondition: Session is in 'COMMENT'-mode

1. User confirms that he has no intention to add further comment
1. System pushes this information to all attendees
1. System updates view. Continue with [RA02](#RA02)
 
### <a id="RA08"></a>RA08: Show single comment

Precondition: Session is not in 'COMMENT'-mode

1. User clicks on comment
1. System shows the full content. Following further actions are possible:
  - Close (go back to [RA02](#RA02)
  - Vote on comment ([RA09](#RA09)) (if in 'VOTE'-mode)

### <a id="RA09"></a>RA09: Vote/Unvote on comments

Precondition: Session is in 'VOTE'-mode

1. Unvoted by user: If user has enough votes available, he can add a vote. Voted by user: User can remove vote
1. Close (go back to [RA02)(#RA02))

### <a id="RA10"></a>RA10: Export comments and votes

Precondition: Session is not in 'COMMENT'-mode

1. User clicks on export
1. System generates a JSON based export of the retrospective

## Retrospective Management

### <a id="RM01"></a>RM01: Create a new retrospective

As a user I want to create a new retrospective session.

1. User is on start page
1. System show a simple form to create a new retrospective session. Following fields are contained:
  * name
  * optional additional settings
1. User clicks on create
1. System goes to [RA02: Show retrospective comments](#RA02)

### <a id="RM02"></a>RM02: Change retrospective settings

As a retrospective manager, I want to change the retrospective settings

Precondition: User is on comments overview

1. User clicks on retrospective settings
1. System shows the settings, which contains:
  - Max number of votes
  - Name of the retrospective
  - Other managers
1. User changes settings and saves it
1. System goes to [RA02: Show retrospective comments](#RA02)

### <a id="RM03"></a>RM03: Persist session

As a user I want to persist this session 

Precondition: User is not authenticated

1. User clicks on 'persist'
1. System show the note that sessions can only be persisted if user is authenticated
1. User 'register' or 'authenticate' (see [REG01](#REG01) or [REG02](#REG02))

### <a id="RM04"></a>RM04: Unhide comments

As a retrospective leader (manager), I want to change the status in order to unhide all comments.

1. If all users have declared that they have finished, the manager can unhide the comments.
1. The system changes the status of the retrospective and notifies all clients to reload all comments

### <a id="RM05"></a>RM05: Iterate trough comments

As a retrospective leader (manager), I want to go with the team through the review comments.

Precondition: Status not in COMMENT

1. By clicking on a comment the user can look at the comments
1. The system show a single comment
1. The user can now navigate forward or backward or close it (go to [RA02](#RA02))
1. System goes to step 2.

### <a id="RM06"></a>RM06: Group comments

As a user I want to group comments into a single comment (merge)

Precondition: Status not in COMMENT nor in CLOSED

1. As a user i can merge two comments by dragging one comment on another.
1. The system merges those two and let the view of all attendees update.

### <a id="RM07"></a>RM07: Delete comment

As a user I want to delete a comment.

Precondition: Status not in COMMENT nor in CLOSED

1. A user clicks on delete of a comment
2. The system deletes the comment and let the view of all attendees update.

### <a id="RM08"></a>RM08: Modify comment

As a user I want to update a comment.

Precondition: Status not in COMMENT nor in CLOSED

1. User clicks on own comment
1. System shows a text field with the comment
1. User enters the text and confirms it
1. System saves the comment and pushes the update to the other attendees
1. System goes back to [RA02](#RA02)

### <a id="RM08"></a>RM09: Highlight top most voted comments

As a retrospective leader I want to highlight the most voted comments

Precondition: Status not in COMMENT nor CLOSED

1. User click on the highlight toggle
1. If already highlighted, highlight will be removed, otherwise topics with the 3 highest votes will be highlighted. This will be done on all views of all attendees.

## Registration Flow

### <a id="REG01"></a>REG01: Register or authenticate

As a user I can register myself with my email address. The goal is that i can manage my retrospectives also on other computers.

Precondition: User is not authenticated

1. At anytime a user can register by clicking on the register action
1. The system shows a dialog with the possibility to enter his email address
1. The user enteres his email address
1. The system sends a token to the email address in order to verify his validity. If the email address is already registered, the token sent to the email will be used to merge user settings with the one registered with the email address.
1. The user clicks on the link provided in the email
1. The system either creates the user or merges the two accounts. Next [RA02](#RA02) is shown again.

### <a id="REG03"></a>REG03: Change user settings

I want to change my user settings

Precondition: Authenticated

1. The user clicks on settings
1. The system shows him all user specivic settings.
1. The user either cancels the operation o he provides meaningful settings values. Saves the form.
1. Settings have been stored by the system. Go back to [RA02](#RA02)

### <a id="REG04"></a>REG04: Logout

I want to unlink my access from the current machine.

  
## Manage

### <a id="M01"></a>M01: View persisted retro sessions

As a user I want to see previous retrospective sessions

Precondition: Authenticated

### <a id="M02"></a>M02: Delete retro session

As a user I want to remove previous retrospective session (because i don't trust the provider ;-) )

Precondition: Authenticated
  
## Admin flow

### <a id="A01"></a>A01: Manage subscribed users

As an administrator I want to manage subscribed users

### <a id="A02"></a>A02: Manage persistent retro sessions

As an administrator I want to manage all persisted retrospective sessions