//Open the spreadsheet once in a global context
//プロパティストアから"CALENDAR_ID"の値を取得
const sheet_url = PropertiesService.getScriptProperties().getProperty("SHEET_URL");
const slack_token = PropertiesService.getScriptProperties().getProperty("SLACK_TOKEN");
const spreadSheet = SpreadsheetApp.openByUrl(sheet_url);


// function main(e) {
//   console.log("main");
//   console.log(JSON.stringify(e));
//   console.log("oldvalue");
//   console.log(JSON.stringify(e.oldValue));
//   // use this for validation of onselected, onopen, and main => use "e.value" (json) if command name  === "start_work" then do
//   console.log("newvalue");
//   console.log(JSON.stringify(e.value));

//   const jsonn_ob = JSON.stringify(e);
//   //const ee = jsonn_ob.value;
//   console.log("======");
//   console.log(jsonn_ob);
//   //const executed_command_name = ee.parameter.command[0];

//   // message to slack in each command
//   if (executed_command_name === "/start_work") {
//     try {
//       if (slack_token != ee.parameter.token) {
//         throw new Error(ee.parameter.token);
//       }
//     } catch (error) {
//       return ContentService.createTextOutput(403);
//     }

//     var dateUserStartedWorking = new Date();
//     dateUserStartedWorking.setSeconds(0);
//     const logSheetName = `log_${dateUserStartedWorking.getFullYear()}/${dateUserStartedWorking.getMonth() + 1}/${dateUserStartedWorking.getUTCDate()}`;
//     const summarySheetName = `summary_${dateUserStartedWorking.getFullYear()}/${dateUserStartedWorking.getMonth() + 1}`;


//     //0.3s
//     var logSheet = spreadSheet.getSheetByName(logSheetName);
//     //
//     var summarySheet = spreadSheet.getSheetByName(summarySheetName);
//     // シートがなければ作成
//     if (!logSheet) {
//       console.log("inside before copySheet");

//       //3.34s
//       copySheet(logSheetName, "template_log");
//       // Get the newly created sheet
//       logSheet = spreadSheet.getSheetByName(logSheetName);
//       //

//     } else if (!summarySheet) {
//       console.log("inside before copySheet");

//       //3.34s
//       copySheet(logSheetName, "template_summary");
//       // Get the newly created sheet
//       logSheet = spreadSheet.getSheetByName(summarySheetName);
//       //

//     }

//     //0.5s
//     logSheet.getRange('f5').setValues([[true]]);
//     //

//     let isModyfing = false;
//     const sheets = spreadSheet.getSheets();
//     const logSheets = sheets.filter((sheet) => sheet.getName().includes("log") && !sheet.getName().includes("sample"));

//     //1.34s
//     logSheets.forEach((logSheet) => {
//       if (logSheet.getRange('f5').getValue() === true) {
//         isModyfing = true;
//       }
//       if (isModyfing) {
//         return ContentService.createTextOutput("you have already executed start_work seemingly");
//       }
//     })
//     //

//     // 返答データ本体
//     var data = {
//       "text": "Hello! I'm slack punch 👊👊👊. I'll will record how long you have worked so far.", //アタッチメントではない通常メッセージ
//       "response_type": "ephemeral", // ここを"ephemeral"から"in_chanel"に変えると他の人にも表示されるらしい（？）
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
//           //ボタン1
//           {
//             "name": "eng",
//             "text": "start",
//             "type": "button",//
//             "value": "start"
//           },
//           //ボタン2
//           {
//             "name": "jpn",
//             "text": "stop",
//             "type": "button",
//             "value": "stop"
//           },
//           {
//             "name": "jpn",
//             "text": "finish",
//             "type": "button",
//             "value": "finish"
//           }
//         ]
//       }]
//     };
//     return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
//   } else if (executed_command_name === "/modify_punch") {

//   }

// }
// function onOpen(e) {
//   // Open the spreadsheet once in a global context
//   const SHEET_URL = "https://docs.google.com/spreadsheets/d/1M1S_REhbVirwr03qO6vz5OQccA2oXQl21xbV73jhHp8/edit#gid=0";
//   const spreadSheet = SpreadsheetApp.openByUrl(SHEET_URL);
//   //const targetSheetName = e.source.getActiveSheet().getName();
//   const day = new Date();
//   const logSheetName = `log_${day.getFullYear()}/${day.getMonth() + 1}/${day.getDate()}`;
//   const summarySheetName = `summary_${day.getFullYear()}/${day.getMonth() + 1}`;

//   // Check if the sheet with LOG_SHEET_NAME exists
//   const targetLogSheet = e.source.getSheetByName(logSheetName);
//   const targetSummarySheet = e.source.getSheetByName(summarySheetName);

//   console.log(targetLogSheet);
//   console.log(targetSummarySheet);

//   if (targetLogSheet === null) {
//     // create sheet named LOG_SHEET_NAME
//     copySheet(logSheetName, "sample_log");
//   } else if (targetSummarySheet === null) {
//     // create sheet named SUMMARY_SHEET_NAME
//     copySheet(summarySheetName, "sample_summary");
//   }
// }

// function copySheet(sheetName, templateName) {
//   // Get sample sheet
//   var templateSheet = spreadSheet.getSheetByName(templateName);
//   // Copy sample sheet to new sheet
//   templateSheet.copyTo(spreadSheet).setName(sheetName);
// }

// function doGet() {
// }

// function copySheet(sheetName, templateName) {
//   // Get sample sheet
//   console.log("inside copySheet");
//   var templateSheet = spreadSheet.getSheetByName(templateName);
//   // Copy sample sheet to new sheet
//   // 0.5 sec
//   templateSheet.copyTo(spreadSheet).setName(sheetName);
// }