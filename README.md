# pocket-cards-backend

| Status         | Path                           | Http Method | Function ID | Comment                  | Implemented |
| -------------- | ------------------------------ | ----------- | ----------- | ------------------------ | ----------- |
| **descripted** | /users/{userId}                | GET         | A001        | ユーザ情報取得           |
|                | /history                       | GET         | A002        | 学習履歴取得             |
|                |                                |             | A003        | 最後の学習時間を計算する |
|                | /groups                        | PUT         | B001        | グループ新規作成         | ✓           |
|                | /groups                        | GET         | B002        | グループ一覧取得         | ✓           |
|                | /groups/{groupId}              | GET         | B003        | グループ情報取得         | ✓           |
|                | /groups/{groupId}              | PUT         | B004        | グループ情報変更         | ✓           |
|                | /groups/{groupId}              | DELETE      | B005        | グループ情報削除         | ✓           |
|                | /groups/{groupId}/words        | POST        | C001        | 単語一括登録             | ✓           |
|                | /groups/{groupId}/words        | GET         | C002        | 単語一覧取得             | ✓           |
|                | /groups/{groupId}/words/{word} | GET         | C003        | 単語情報取得             | ✓           |
|                | /groups/{groupId}/words/{word} | PUT         | C004        | 単語情報更新             | ✓           |
|                | /groups/{groupId}/words/{word} | DELETE      | C005        | 単語情報削除             | ✓           |
|                | /groups/{groupId}/new          | GET         | C006        | 新規学習モード単語一覧   | ✓           |
|                | /groups/{groupId}/test         | GET         | C007        | テストモード単語一覧     | ✓           |
|                | /groups/{groupId}/review       | GET         | C008        | 復習モード単語一覧       | ✓           |
|                | /image2text                    | POST        | D001        | 画像から単語に変換する   | ✓           |
|                | /image2line                    | POST        | D002        | 画像から行に変換する     |
|                | /words/{word}                  | GET         | E001        | 単語詳細情報取得         | ✓           |
|                | /words/{word}                  | PUT         | E002        | 単語詳細情報更新         | ✓           |
|                | Cognito Sync Trigger           |             | S002        |                          |

## Users

### Definition

| Item   | Key  | LSI1 | LSI2 | GSI1 | GSI2 |
| ------ | ---- | ---- | ---- | ---- | ---- |
| id     | Hash |      |      |      |      |
| email  |      |      |      |      |      |
| name   |      |      |      |      |      |
| target |      |      |      |      |      |

### Search Conditions

| Status | Conditions                        |
| ------ | --------------------------------- |
| Get    | id = xxx                          |
| Put    | id = xxx, name = xxx, email = xxx |

## Groups

### Definition

| Item        | Key   | LSI1 | LSI2 | GSI1  | GSI2 |
| ----------- | ----- | ---- | ---- | ----- | ---- |
| id          | Hash  |      |      | Range |      |
| userId      | Range |      |      | Hash  |      |
| name        |       |      |      | 〇    |      |
| description |       |      |      | 〇    |      |
| count       |       |      |      |       |      |

### Search Conditions

| Status | Conditions                              | Index |
| ------ | --------------------------------------- | ----- |
| Get    | id = xxx                                |       |
| Put    | id = xxx, name = xxx, description = xxx |       |
| Del    | id = xxx                                |       |
| Query  | userId = xxx                            | GSI1  |

## Words

### Definition

| Item     | Key   | LSI1 | LSI2 | GSI1  | GSI2 |
| -------- | ----- | ---- | ---- | ----- | ---- |
| id       | Hash  |      |      | Range |      |
| groupId  | Range |      |      | Hash  |      |
| nextTime |       |      |      |       |      |
| lastTime |       |      |      |       |      |
| times    |       |      |      |       |      |

### Search Conditions

| Status       | Conditions                                             | Index |
| ------------ | ------------------------------------------------------ | ----- |
| Get          | id = xxx, groupId = xxx                                |       |
| Put          | id = xxx, groupId = xxx                                |       |
| 復習単語     | groupId = xxx, times = 1                               | GSI1  |
| テスト単語   | groupId = xxx, nextTime < Now ,times <> 0              | GSI1  |
| 新規単語     | groupId = xxx, nextTime <= Now, times = 0              | GSI1  |
| New Success  | Times = Times + 1, LastTime = now , NextTime = now ASC |       |
| Test Targets | Times <> 0, NextTime <= now                            |       |
| Test Success | Times = Times + 1, LastTime = now, NextTime = now + x  |       |
| Test Failure | Times = 0, LastTime = now, NextTime = now              |       |

## WordMaster

### Definition

| Item      | Key  | LSI1 | LSI2 | GSI1 | GSI2 |
| --------- | ---- | ---- | ---- | ---- | ---- |
| id        | Hash |      |      |      |      |
| mp3       |      |      |      |      |      |
| pronounce |      |      |      |      |      |
| ja        |      |      |      |      |      |
| zh        |      |      |      |      |      |

### Search Conditions

| Status   | Conditions |
| -------- | ---------- |
| Get Word | id = xxx   |
| Put Word | id = xxx   |

## Histroy

### Definition

| Item      | Key   | LSI1 | LSI2 | GSI1 | GSI2 |
| --------- | ----- | ---- | ---- | ---- | ---- |
| user      | Hash  |      |      |      |      |
| timestamp | Range |      |      |      |      |
| group     |       |      |      |      |      |
| word      |       |      |      |      |      |
| times     |       |      |      |      |      |
| lastTime  |       |      |      |      |      |

### Search Conditions

| Status      | Conditions                                 |
| ----------- | ------------------------------------------ |
| Get Daily   | User = xxx, Timestamp begin_with YYYYMMDD  |
| Get Weekly  | User = xxx, Timestamp >= YYYYMMDD000000000 |
| Get Monthly | User = xxx, Timestamp >= YYYYMMDD000000000 |

<!-- ## Maintenance Functions

| Function | Description                                            |
| -------- | ------------------------------------------------------ |
| M001     | Send notification to slack when build Success / Failed |
| M002     | CodeBuild state change to failed                       |
| M003     | CodePipeline state change to success                   | -->
