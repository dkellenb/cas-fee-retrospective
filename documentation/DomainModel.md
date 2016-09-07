# Domain Model

## User

```yaml
User:
  uuid: UUID
  shortname: String
  email: Email
```

## Retrospective

```yaml
Retrospective:
  uuid: UUID
  title: String
  description: String
  managers: User[]
  comments: RetrospectiveComment[]
  status: RetrospectiveStatus
  attendees: User
```
  
```yaml
RetrospectiveStatus
  enum: [ OPEN, REVIEW, GROUP, VOTE, CLOSED ]
```

## Retrospective Comments

```yaml
RetrospectiveComment:
  uuid: UUID
  title: String
  descripton: String
  votes: RetrospectiveVote[]
```

## Retrospective Votes

```yaml
RetrospectiveComment:
  uuid: UUID
  userUuid: UUID
```
