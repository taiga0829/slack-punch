function doPost(e) {
    var slack_token = 'sqamGyFeX3wGDO8hd1xz24Tc'; // Verification Tokenで取得したトークン
    // 指定したチャンネルからの命令しか受け付けない
    if (slack_token != e.parameter.token) {
        throw new Error(e.parameter.token);
    }

    // 返答データ本体
    var data = {
        "text": "Hello! I'm slack punch 👊👊👊. I'll will record how long you have worked so far.", //アタッチメントではない通常メッセージ
        "response_type": "ephemeral", // ここを"ephemeral"から"in_chanel"に変えると他の人にも表示されるらしい（？）
        //アタッチメント部分
        "attachments": [{
            "title": "👊👊👊 slack punch 👊👊👊",//　アタッチメントのタイトル
            "text": "Choose one of options 👊👊👊",//アタッチメント内テキスト
            "fallback": "Yeeeeeeeeeeah!!!",//ボタン表示に対応してない環境での表示メッセージ. 
            "callback_id": "callback_button",
            "color": "#00bfff", //左の棒の色を指定する
            "attachment_type": "default",
            // ボタン部分
            "actions": [
                //ボタン1
                {
                    "name": "eng",
                    "text": "restart",
                    "type": "button",//
                    "value": "language"
                },
                //ボタン2
                {
                    "name": "jpn",
                    "text": "stop",
                    "type": "button",
                    "value": "language"
                }
            ]
        }]
    };
    // 　botを呼び出した人にのみ表示する
    //   返信データをJSON形式に変換してチャンネルに返す
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
