const sheet_url = PropertiesService.getScriptProperties().getProperty("SHEET_URL");
const slack_token = PropertiesService.getScriptProperties().getProperty("SLACK_TOKEN");
const spreadSheet = SpreadsheetApp.openByUrl(sheet_url);

function doPost(e) {
  try {
    if (slack_token !== e.parameter.token) {
      throw new Error('Invalid Slack token');
    }
    const logSheet = spreadSheet.getSheetByName("log_sheet");
    const startTime = new Date();
    startTime.setMilliseconds(0);
    logSheet.appendRow([startTime, "start"]);

    const response = createSlackResponse();
    return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error(error);
    return ContentService.createTextOutput("An error occurred. Please try again later.");
  }
}

function createSlackResponse() {
  return {
    "text": "Hello! I'm slack punch 👊👊👊. I'll record how long you have worked so far.",
    "response_type": "in_channel",
    "blocks": [
		{
			"type": "section",
			"text": {
				"type": "plain_text",
				"text": "wanna get some rest?🍵🫖",
				"emoji": true
			}
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "stop",
						"emoji": true
					},
					"value": "stop",
					"action_id": "actionId-0"
				}
			]
		}
	]
  };
}
