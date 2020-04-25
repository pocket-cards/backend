// // 環境変数
// const TABLE_USER_GROUPS = process.env.TABLE_USER_GROUPS as string;

// export default async (event: ): Promise<void> => {
//   if (!event.body || !event.pathParameters) {
//     return;
//   }

//   // ユーザID
//   const userId = event.queryStringParameters['userId'];

//   // グループ一覧を取得する
//   const groupList = await DBUtils.query(UserGroups.queryGroupList(TABLE_USER_GROUPS, userId));

//   Logger.info('検索結果', groupList);

//   Logger.info('単語辞書の登録は完了しました.');
// };
