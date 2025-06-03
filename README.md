
# DT140G - MotionsBoost - Backend

## Info
Projketet använder sig av NestJS med MongoDB som databas.
I databasen finns det fem collection som ser ut enligt nedan.
 
### Users

| Id   | firstName    | lastName    | email | password | image  | totalSteps | account_created   | 
| ---- | -------------- | ---------- | ---------- | ---------- |  -------- |-------- |-------- |
| 1  | Oskar  | Sundström   | fake@mail.se | ********** | bild url | totala steg|  2021-01-01 T 15:05:40     |

### Groups

| id   | totalSteps    | numberMembers    | groupName  | info | post_created  | 
| ---- | -------------- | ---------- | ---------- | -------- |  --------  |  
| 1  | totala steg  | antal medlemmar  | namn  | beskrivning |   2021-01-01 T 15:05:40 | 

### Challanges

| Id   | group    | challangeName    | targetSteps | totalSteps |status |account_created   | 
| ---- | -------------- | ---------- | ---------- | ---------- | -------- | -------- | 
| 1  | group objekt  | Namn   | Roll | mål steg    | totala steg | Booelean | 2021-01-01 T 15:05:40  |

### ChallangeUsers

| Id   | user    | challange    | stepsTaken | account_created   |  
| ---- | -------------- | ---------- | ---------- | ---------- | 
| 1  | user objekt  | challange objekt   | antal steg | 2021-01-01 T 15:05:40     | 

### GroupUsers

| Id   | user    | group    | role | totalSteps   | account_created  | 
| ---- | -------------- | ---------- | ---------- | ---------- | -------- |
| 1  | user objekt  | group objekt   | Roll | antal steg    | 2021-01-01 T 15:05:40 |



## Användning
 Hur man användet det:

| Metod   | Url ändelse    | Beskrivning   | 
| ---- | -------------- | ---------- | 
| POST   | /auth/login    | Logga in   | 
| POST   | /auth/register    | Skapa konto  | 
| GET   | /auth/google    | Inloggning Google   | 
| GET   | /auth/google/callback    | Callback efter inlogg Google  | 
| PUT   | /auth/updateUser   | Updatera användare  | 
| DELETE   | /auth/deleteUder    | Radera användare | 
| ---- | -------------- | ---------- | 
| POST   | /groups/createGroup   | Skapa grupp | 
| POST   | /groups/joinGroup    | Gå med i gruppe | 
| GET   | /groups/myGroups    | Hämtar användarens grupper | 
| GET   | /groups/:groupId    | Häntar grupp baserat på id | 
| DELETE   | /groups/:groupid/delete    | Radera en grupp | 
| DELETE   | /groups/:groupId/leave    | Lämna en grupp | 
| ---- | -------------- | ---------- | 
| POST   | /challanges/createchallange/:groupId   | skapa ny utmaning| 
| GET   | /challanges/:challangeId   | Hämta en utmanings data | 
| PUT   | /challanges/:challangeId/status    | Uppdatera status | 
| DELETE   | /challanges/:challangeId   | Radera en utmaning | 
