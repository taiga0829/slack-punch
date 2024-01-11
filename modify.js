  // 返答データ本体
function doPost(e) {
  var slack_token = 'sqamGyFeX3wGDO8hd1xz24Tc'; // Verification Tokenで取得したトークン
  // 指定したチャンネルからの命令しか受け付けない
  if (slack_token != e.parameter.token) {
    throw new Error(e.parameter.token);
  }
  
 const data = {
	"type": "modal",
	"title": {
		"type": "plain_text",
		"text": "👊👊Modify Punch👊👊",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "Submit",
		"emoji": true
	},
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "choose the date when you want to modify data."
			}
		},
		{
			"type": "input",
			"element": {
				"type": "datepicker",
				"initial_date": "2024-01-09",
				"placeholder": {
					"type": "plain_text",
					"text": "Select a date",
					"emoji": true
				},
				"action_id": "timepicker-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Rest time",
				"emoji": true
			}
		},
		{
			"type": "input",
			"element": {
				"type": "timepicker",
				"placeholder": {
					"type": "plain_text",
					"text": "Select start time",
					"emoji": true
				},
				"action_id": "timepicker-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Select start time",
				"emoji": true
			}
		},
		{
			"type": "input",
			"element": {
				"type": "timepicker",
				"placeholder": {
					"type": "plain_text",
					"text": "Select finish time",
					"emoji": true
				},
				"action_id": "timepicker-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Select finish time",
				"emoji": true
			}
		},
		{
			"type": "input",
			"element": {
				"type": "timepicker",
				"initial_time": "00:00",
				"placeholder": {
					"type": "plain_text",
					"text": "Select time",
					"emoji": true
				},
				"action_id": "timepicker-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Rest time",
				"emoji": true
			}
		}
	]
};

  // 　botを呼び出した人にのみ表示する
  //   返信データをJSON形式に変換してチャンネルに返す
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
  //return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}