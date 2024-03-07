# Slack Punch アプリ

Slack Punch は、Slack コマンドを使用して作業開始時間を記録し、休憩を取るようリマインダーを提供するための Google Apps Script（GAS）アプリケーションです。

## セットアップ

1. **Google Sheets のセットアップ**
   - 新しい Google Sheets ドキュメントを作成します。(https://docs.google.com/spreadsheets)
   - 作成した Google Sheets ドキュメントの URL を取得します。URL はスプレッドシートの上部に表示されます。
   - GAS スクリプトの [プロジェクトの設定] > [スクリプトプロパティの追加] から `SHEET_URL` を取得した URL に設定します。例:
     ```
     https://docs.google.com/spreadsheets/d/example/edit#gid=123456
     ```
   - プレビュー上部の [拡張機能] > [AppsScript] から、spreadsheetに紐付いたapps scriptを作成します。

2. **Google Apps Script のセットアップ**
   - １で作成したスクリプトに`user_action`をコピーして貼り付けます。
   - 新しくgasを其々作成し、`modify_work_execution`と`start_work_execution`をコピーして貼り付けます。
   - スクリプトを保存します。

3. **Slack アプリのセットアップ**
   - Slack app を作成する(https://api.slack.com/) 
   - [Your apps] > [アプリを選択] > [Interactivity & Shortcuts] のリクエストURLに、デプロイした `user_action` のURLを設定します。
   - [Your apps] > [アプリを選択] ＞ [Slash Commands]でGASの`modify_work_execution`をデプロイし、`modify_punch`のエンドポイントしてアサインする
   - 同様にして、GASの`start_work_execution`をデプロイし,URLを取得します。そして、`modify_punch`にエンドポイントしてアサインする
   - 新しい Slack アプリを作成するか、既存のものを使用します。
   - Slack アプリの Slash Commands 機能を有効にします。
   - Slack アプリの Slash Command に対するリクエスト URL を GAS Web App の URL に設定します。
   - (https://api.slack.com/tutorials/tracks/getting-a-token)この手順に従い、 Slack トークンを取得します。
   - GAS スクリプト内の `SLACK_TOKEN` プロパティを取得した Slack トークンに設定します。



## 使用法

セットアップが完了したら、Slash コマンドを使用して Slack Punch アプリを使用できます。

- `/start_work`: 作業を始めるときは、このスラッシュ・コマンドを実行する。その後、作業を中断したいときは「stop」を押してください。 
- `/modify_punch`: `start_work` コマンドの実行を忘れた場合、このコマンドを使用して、先日の休憩時間、先日の作業を開始した時刻、先日の作業を終了した時刻を記録できます。
