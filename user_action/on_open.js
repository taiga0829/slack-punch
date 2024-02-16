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



