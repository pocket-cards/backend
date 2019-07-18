# pocket-cards-backend

| Status      | Path                           | Http Method | Function ID | Comment                  |
| ----------- | ------------------------------ | ----------- | ----------- | ------------------------ |
|             | /users/{userId}                | GET         | A001        | ユーザ情報取得           |
|             | /users/{userId}/history        | GET         | A002        | 学習履歴取得             |
|             |                                |             | A003        | 最後の学習時間を計算する |
|             | /groups                        | POST        | B001        | グループ登録             |
|             | /groups/{groupId}              | GET         | B002        | グループ情報取得         |
|             | /groups/{groupId}              | PUT         | B003        | グループ情報変更         |
|             | /groups/{groupId}              | DELETE      | B004        | グループ情報削除         |
|             | /groups/{groupId}/words        | POST        | C001        | 単語一括登録             |
| **Deleted** | /groups/{groupId}/words        | GET         | C002        | 単語一覧取得             |
|             | /groups/{groupId}/words/{word} | GET         | C003        | 単語情報取得             |
|             | /groups/{groupId}/words/{word} | PUT         | C004        | 単語情報更新             |
|             | /groups/{groupId}/words/{word} | DELETE      | C005        | 単語情報削除             |
|             | /groups/{groupId}/new          | GET         | C006        | 新規学習モード単語一覧   |
|             | /groups/{groupId}/test         | GET         | C007        | テストモード単語一覧     |
|             | /groups/{groupId}/review       | GET         | C008        | 復習モード単語一覧       |
|             | /image2text                    | POST        | D001        | 画像から単語に変換する   |
|             | /image2line                    | POST        | D002        | 画像から行に変換する     |
| **Deleted** | dynaomdb stream                |             | S001        | 履歴テーブルに保存する   |
|             | Cognito Sync Trigger           |             | S002        |                          |

## UserInfo

### Definition

| Item     | Key  | LSI1 | LSI2 | GSI1 | GSI2 |
| -------- | ---- | ---- | ---- | ---- | ---- |
| userId   | Hash |      |      |      |      |
| target   |      |      |      |      |      |
| email    |      |      |      |      |      |
| nickName |      |      |      |      |      |

### Search Conditions

| Status       | Conditions   |
| ------------ | ------------ |
| Get Settings | UserId = xxx |
| Put Settings | UserId = xxx |

## GroupInfo

### Definition

| Item      | Key   | LSI1 | LSI2 | GSI1 | GSI2 |
| --------- | ----- | ---- | ---- | ---- | ---- |
| userId    | Hash  |      |      | 〇   |      |
| groupId   | Range |      |      | Hash |      |
| groupName |       |      |      |      |      |

### Search Conditions

| Status       | Conditions                  | Index |
| ------------ | --------------------------- | ----- |
| Get Settings | UserId = xxx, GroupId = xxx |       |
| Put Settings | UserId = xxx, GroupId = xxx |       |
| Del Settings | UserId = xxx, GroupId = xxx |       |
| Get UserId   | GroupId = xxx               | GSI   |

## GroupWords

### Definition

| Item     | Key   | LSI1  | LSI2 | GSI1 | GSI2 |
| -------- | ----- | ----- | ---- | ---- | ---- |
| groupId  | Hash  | Hash  |      |      |      |
| word     | Range | 〇    |      |      |      |
| nextTime |       | Range |      |      |      |
| lastTime |       |       |      |      |      |
| times    |       | 〇    |      |      |      |

### Search Conditions

| Status         | Conditions                                             |
| -------------- | ------------------------------------------------------ |
| New Targets    | Times = 0, NextTime <= now, NextTime ASC               |
| New Success    | Times = Times + 1, LastTime = now , NextTime = now ASC |
| Review Targets | Times = 1                                              |
| Test Targets   | Times <> 0, NextTime <= now                            |
| Test Success   | Times = Times + 1, LastTime = now, NextTime = now + x  |
| Test Failure   | Times = 0, LastTime = now, NextTime = now              |

## WordDict

### Definition

| Item      | Key  | LSI1 | LSI2 | GSI1 | GSI2 |
| --------- | ---- | ---- | ---- | ---- | ---- |
| word      | Hash |      |      |      |      |
| mp3       |      |      |      |      |      |
| pronounce |      |      |      |      |      |
| ja        |      |      |      |      |      |
| zh        |      |      |      |      |      |

### Search Conditions

| Status   | Conditions |
| -------- | ---------- |
| Get Word | Word = xxx |
| Put Word | Word = xxx |

## Histroy

### Definition

| Item      | Key   | LSI1 | LSI2 | GSI1 | GSI2 |
| --------- | ----- | ---- | ---- | ---- | ---- |
| userId    | Hash  |      |      |      |      |
| timestamp | Range |      |      |      |      |
| word      |       |      |      |      |      |
| times     |       |      |      |      |      |

### Search Conditions

| Status      | Conditions                                   |
| ----------- | -------------------------------------------- |
| Get Daily   | UserId = xxx, Timestamp begin_with YYYYMMDD  |
| Get Weekly  | UserId = xxx, Timestamp >= YYYYMMDD000000000 |
| Get Monthly | UserId = xxx, Timestamp >= YYYYMMDD000000000 |
