# pocket-cards-backend

| Status      | Path                           | Http Method | Function ID | Comment                |
| ----------- | ------------------------------ | ----------- | ----------- | ---------------------- |
|             | /regist                        | POST        | A001        | ユーザ登録             |
|             | /login                         | POST        | A002        | ユーザログイン         |
|             | /groups                        | POST        | B001        | グループ登録           |
|             | /groups/{groupId}              | GET         | B002        | グループ情報取得       |
|             | /groups/{groupId}              | PUT         | B003        | グループ情報変更       |
|             | /groups/{groupId}              | DELETE      | B004        | グループ情報削除       |
|             | /groups/{groupId}/words        | POST        | C001        | 単語一括登録           |
| **Deleted** | /groups/{groupId}/words        | GET         | C002        | 単語一覧取得           |
|             | /groups/{groupId}/words/{word} | GET         | C003        | 単語情報取得           |
|             | /groups/{groupId}/words/{word} | PUT         | C004        | 単語情報更新           |
|             | /groups/{groupId}/words/{word} | DELETE      | C005        | 単語情報削除           |
|             | /groups/{groupId}/new          | GET         | C006        | 新規学習モード単語一覧 |
|             | /groups/{groupId}/test         | GET         | C007        | テストモード単語一覧   |
|             | /groups/{groupId}/review       | GET         | C008        | 復習モード単語一覧     |
|             | /image2text                    | POST        | D001        | 画像から単語に変換する |
| **Deleted** | /speech                        | GET         | D002        | word to speech         |

## Search Conditions

| Status         | Conditions                                             |
| -------------- | ------------------------------------------------------ |
| New Targets    | Times = 0, NextTime <= now, NextTime ASC               |
| New Success    | Times = Times + 1, LastTime = now , NextTime = now ASC |
| Review Targets | Times = 1, NextTime = now                              |
| Test Targets   | Times <> 0, NextTime <= now                            |
| Test Success   | Times = Times + 1, LastTime = now, NextTime = now + x  |
| Test Failure   | Times = 0, LastTime = now, NextTime = now              |
