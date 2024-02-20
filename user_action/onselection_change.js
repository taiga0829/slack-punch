function onSelectionChange(e) {
  // Check if e and e.source are not null
  if (e && e.source) {
    const sheets = e.source.getSheets();
    const logSheet = {};
    const summarySheets = [{}];
    // sorting sheets into summarysheets and logsheet
    sheets.forEach(sheet => {
      if (sheet.getName() === "log_sheet") {
        logSheet = sheet;
      } else if (sheet.getName.includes("summary")) {
        summarySheets.push(sheet);
      }
    })

    const today = new Date();
    const summarySheetName = "summary_" + today.getFullYear() + "/" + String(today.getMonth() + 1).padStart(2, '0');
    if(!spreadSheet.getSheetByName(summarySheetName)){
      copySheet(summarySheetName,"template_summary");
    }
    //get values from log sheet
    var logTable = logSheet.getDataRange().getValues();
    for (let i = 0; i < logTable.length; i++) {
          let timeStamp = logTable[0][i];
          const processingTimeStamp = new Date(timeStamp);
          // 2024/02
          const timeStampYearAndMonth = `${processingTimeStamp.getFullYear()}` + "/" + `${String(processingTimeStamp.getMonth() + 1).padStart(2, '0')}`;
          const timeStampDay = processingTimeStamp.getDate();
          summarySheets.forEach((summarySheet) => {
            // ex:) 2024/2 ∊ summary_2024/2
            if(summarySheet.getName().includes(timeStampYearAndMonth)){
              // TODO: try to validation that start, start, 
              if(logTable[1][i]==="start"){
                let range = `A${timeStampDay}`;
                summarySheet.getRange(range).setValue([[logTable[0][i]]]);
              }
              if(logTable[1][i]==="stop"){
                let range = `B${timeStampDay}`;
                summarySheet.getRange(range).setValue([[logTable[0][i]]]);
              }
              if(logSheet[1][i] === "start"&&logSheet[1][i+1] === "stop"){
                let range = `C${timeStampDay}`;
                let diff = logSheet[0][i+1] - logSheet[0][i];
                summarySheet.getRange(range).setValue([[diff]]);
              }
              // cannot be index out of index error sincev there are always modify-rest and modify-stop
              if(logSheet[1][i] === "modify-start"){
                range = `A${timeStampDay}`;
                summarySheet.getRange(range).setValue([[logTable[0][i]]]);
                range = `B${timeStampDay}`;
                summarySheet.getRange(range).setValue([[logTable[0][i+1]]]);
                range = `C${timeStampDay}`;
                summarySheet.getRange(range).setValue([[logTable[0][i+2]]]);
              } 
            }
    })
        }
      }
    }

function timeDifference(date1, date2) {

  // Convert the strings to JavaScript Date objects
  var dateObject1 = new Date(date1);
  var dateObject2 = new Date(date2);

  // Calculate the time difference in milliseconds
  var timeDifferenceMillis = Math.abs(dateObject1 - dateObject2);

  // Convert milliseconds to hours and minutes
  var hours = Math.floor(timeDifferenceMillis / 3600000);
  var minutes = Math.floor((timeDifferenceMillis % 3600000) / 60000);

  // Output the result
  console.log("Time Difference: " + hours + " hours, " + minutes + " minutes");
}

function copySheet(sheetName, templateName) {
  // Get sample sheet
  console.log("inside copySheet");
  var templateSheet = spreadSheet.getSheetByName(templateName);
  // Copy sample sheet to new sheet
  // 0.5 sec
  templateSheet.copyTo(spreadSheet).setName(sheetName);
}

