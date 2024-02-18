// Open the spreadsheet once in a global context
const sheet_url = PropertiesService.getScriptProperties().getProperty("SHEET_URL");
const slack_token = PropertiesService.getScriptProperties().getProperty("SLACK_TOKEN");
const spreadSheet = SpreadsheetApp.openByUrl(sheet_url);

function doPost(e) {
  try {
    if (slack_token !== e.parameter.token) {
      throw new Error('Invalid Slack token');
    }

    const logSheet = spreadSheet.getSheetByName("log_sheet");
    // var lastRow = logSheet.getLastRow();
    // if (lastRow != 0.0) {
    //   var lastCell = logSheet.getRange(lastRow, 2);
    //   Logger.log("last cell");
    //   Logger.log(lastCell.getValue());
    //   if (lastCell === 'start') {
    //     return ContentService.createTextOutput("WARNING PUNCH: You forgot to stop work 👊👊👊👊");
    //   }
    // }

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
    // "attachments": [{
    //   "title": "👊👊👊 slack punch 👊👊👊",
    //   "text": "Choose one of the options below 👊👊👊",
    //   "fallback": "Yeeeeeeeeeeah!!!",
    //   "callback_id": "callback_button",
    //   "color": "#00bfff",
    //   "attachment_type": "default",
    //   "actions": [{
    //     "name": "jpn",
    //     "text": "Stop",
    //     "type": "button",
    //     "value": "stop",
    //     "action_id": "start-work"
    //   }]
    // }]
  };
}
// // Open the spreadsheet once in a global context
// //const SHEET_URL = "https://docs.google.com/spreadsheets/d/1M1S_REhbVirwr03qO6vz5OQccA2oXQl21xbV73jhHp8/edit#gid=0";
// //const slack_token = 'sqamGyFeX3wGDO8hd1xz24Tc'; // Verification Tokenで取得したトークン
// const sheet_url = PropertiesService.getScriptProperties().getProperty("SHEET_URL");
// const slack_token = PropertiesService.getScriptProperties().getProperty("SLACK_TOKEN");
// const spreadSheet = SpreadsheetApp.openByUrl(sheet_url);

// function doPost(e) {
//   try {
//     if (slack_token != e.parameter.token) {
//       throw new Error(e.parameter.token);
//     }
//   } catch (error) {
//     return ContentService.createTextOutput(403);
//   }
//   const startTime = new Date();
//   const logSheet = spreadSheet.getSheetByName("log_sheet");
//   const table = logSheet.getDataRange().getValues();
//    //validation if user has already started or not
//   if (table.length > 0) {
//     const userStatus = table[table.length - 1][1];
//     if (userStatus === 'start') {
//       return ContentService.createTextOutput("WARNING PUNCH: you forgot stopping work👊👊👊👊");
//     }
//     //if slash command is executed, append start
//     logSheet.appendRow([startTime, "start"]);
//     var data = {
//       "text": "Hello! I'm slack punch 👊👊👊. I'll will record how long you have worked so far.", //アタッチメントではない通常メッセージ
//       "response_type": "in_chanel", // ここを"ephemeral"から"in_chanel"に変えると他の人にも表示されるらしい（？）
//       //アタッチメント部分
//       "attachments": [{
//         "title": "👊👊👊 slack punch 👊👊👊",//　アタッチメントのタイトル
//         "text": "Choose one of options 👊👊👊",//アタッチメント内テキスト
//         "fallback": "Yeeeeeeeeeeah!!!",//ボタン表示に対応してない環境での表示メッセージ. 
//         "callback_id": "callback_button",
//         "color": "#00bfff", //左の棒の色を指定する
//         "attachment_type": "default",
//         // ボタン部分
//         "actions": [
//           {
//             "name": "jpn",
//             "text": "stop",
//             "type": "button",
//             "value": "stop"
//           }
//         ]
//       }]
//     };
//     return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
//   }

  // var dateUserStartedWorking = new Date();
  // dateUserStartedWorking.setSeconds(0);
  // const logSheetName = `log_${dateUserStartedWorking.getFullYear()}/${dateUserStartedWorking.getMonth() + 1}/${dateUserStartedWorking.getUTCDate()}`;
  // const summarySheetName = `summary_${dateUserStartedWorking.getFullYear()}/${dateUserStartedWorking.getMonth() + 1}`;


  // //0.3s
  // var logSheet = spreadSheet.getSheetByName(logSheetName);
  // //
  // var summarySheet = spreadSheet.getSheetByName(summarySheetName);
  // // シートがなければ作成
  // if (!logSheet) {
  //   console.log("inside before copySheet");

  //   //3.34s
  //   // log sheet monthly
  //   // button (create next summary sheet and log yearly calcurate) =>
  //   copySheet(logSheetName, "template_log");
  //   // Get the newly created sheet
  //   logSheet = spreadSheet.getSheetByName(logSheetName);
  //   //

  // } else if (!summarySheet) {
  //   console.log("inside before copySheet");

  //   //3.34s
  //   copySheet(logSheetName, "template_summary");
  //   // Get the newly created sheet
  //   logSheet = spreadSheet.getSheetByName(summarySheetName);
  //   //

  // }

  //0.5s
  // logSheet.getRange('f5').setValues([[true]]);
  //

  // let isModyfing = false;
  // const sheets = spreadSheet.getSheets();
  // const logSheets = sheets.filter((sheet) => sheet.getName().includes("log") && !sheet.getName().includes("sample"));

  // //1.34s
  // logSheets.forEach((logSheet) => {
  //   if (logSheet.getRange('f5').getValue() === true) {
  //     isModyfing = true;
  //   }
  //   if (isModyfing) {
  //     return ContentService.createTextOutput("you have already executed start_work seemingly");
  //   }
  // })
  //

  // 返答データ本体
// }

// function copySheet(sheetName, templateName) {
//   // Get sample sheet
//   console.log("inside copySheet");
//   var templateSheet = spreadSheet.getSheetByName(templateName);
//   // Copy sample sheet to new sheet
//   // 0.5 sec
//   templateSheet.copyTo(spreadSheet).setName(sheetName);
// }
