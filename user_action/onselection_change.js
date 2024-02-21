const SUMMARY_SHEET_HEADER_HEIGHT = 2;
function onSelectionChange(e) {
  console.log("inside select");
  // Check if e and e.source are not null
  if (e && e.source) {
    const sheets = e.source.getSheets();
    console.log("sheets");
    console.log(sheets);
    let logSheet;
    let summarySheets = [];
    // sorting sheets into summarysheets and logsheet
    sheets.forEach(sheet => {
      if (sheet.getName() === "log_sheet") {
        logSheet = sheet;
      } else if (sheet.getName().includes("summary")) {
        summarySheets.push(sheet);
      }
    })
    //OK

    //get values from log sheet
    var logTable = logSheet.getDataRange().getValues();
    for (let i = 0; i < logTable.length; i++) {
      let timestamp = logTable[i][0];
      const processingTimestamp = new Date(timestamp);
      // 2024/02
      const timestampYearAndMonth = `${processingTimestamp.getFullYear()}` + "/" + `${String(processingTimestamp.getMonth() + 1).padStart(2, '0')}`;
      const timestampDay = processingTimestamp.getDate();
      const targetTimestampCell = timestampDay + SUMMARY_SHEET_HEADER_HEIGHT;
      summarySheets.forEach((summarySheet) => {
        // ex:) 2024/02 ∊ summary_2024/02
        if (summarySheet.getName().includes(timestampYearAndMonth)) {
          //OK
          console.log("logtable");
          console.log(logTable);
          //2024/02/09 17:43:33 start=> 9:{ start:"17:43", } 
          //2024/02/10 20:43:33 start=>     stop:"20:43"} 

          // TODO: try to validation that start, start, 
          if (logTable[i][1] === "start" && logTable[i + 1][1] === "stop") {
            let eachdatesLogsMap = {};
            addEachdatesLogsMap(logTable[i][0], logTable[i+1][0], eachdatesLogsMap)
            // const startRange = `A${targetTimestampCell}`;
            // console.log("logTable");
            // console.log(logTable[i][1]);
            // summarySheet.getRange(startRange).setValue([[timestamp]]);
          }
          // if () {
          //   let stopRange = `B${targetTimestampCell}`;
          //   console.log("range");
          //   console.log(stopRange);
          //   summarySheet.getRange(stopRange).setValue([[timestamp]]);
          // }
          // if(logSheet[1][i] === "start"&&logSheet[1][i+1] === "stop"){
          //   let restRange = `C${targetTimestampCell}`;
          //   let diff = logSheet[0][i+1] - logSheet[0][i];
          //   summarySheet.getRange(restRange).setValue([[diff]]);
          // }
          // cannot be index out of index error sincev there are always modify-rest and modify-stop
          // if(logSheet[1][i] === "modify-start"){
          //   const modifyStartRange = `A${targetTimestampCell}`;
          //.  const modifyStopRange = `B${targetTimestampCell}`;
          //   const modifyRestRange = `C${targetTimestampCell}`;

          //   summarySheet.getRange(modifyStartRange).setValue([[logTable[0][i]]]);
          //   
          //   summarySheet.getRange(modifyStopRange).setValue([[logTable[0][i+1]]]);

          //   summarySheet.getRange(modifyRestRange).setValue([[logTable[0][i+2]]]);
          // } 
        } else {
          let currenTimestamp = logTable[i][0];
          console.log(currenTimestamp);
          console.log("currenTimestamp");
          const latestDate = new Date(currenTimestamp);
          const summarySheetName = "summary_" + latestDate.getFullYear() + "/" + String(latestDate.getMonth() + 1).padStart(2, '0');
          console.log("summarysheetName");
          console.log(summarySheetName);
          let targetSheet;
          sheets.forEach((sheet) => {
            if (summarySheetName === sheet.getName()) {
              targetSheet = sheet;
            }
          })
          console.log("targetSheet");
          console.log(targetSheet);
          if (!targetSheet) {
            console.log("before copy function");
            copySheet(summarySheetName, "template_summary", sheets);
          }
          appendAllOfDaysInMonth(summarySheetName, sheets);
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

function copySheet(sheetName, templateName, sheets) {
  // Get sample sheet
  console.log("inside copySheet");
  let templateSheet;
  sheets.forEach((sheet) => {
    if (sheet.getName() === templateName) {
      templateSheet = sheet;
    }
  })
  //var templateSheet = spreadSheet.getSheetByName(templateName);
  // Copy sample sheet to new sheet
  // 0.5 sec
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  templateSheet.copyTo(ss).setName(sheetName);

}

function appendAllOfDaysInMonth(sheetName, sheets) {
  console.log("appendAll");
  let targetSheet;
  let rangeCnt = 0;

  // Iterate through each sheet to find the target sheet
  sheets.forEach((sheet) => {
    // Check if the current sheet name matches the target sheet name
    if (sheet.getName() === sheetName) {
      // Assign the current sheet to the targetSheet variable
      targetSheet = sheet;
    }
  });

  // Extract year and month from the sheetName
  const parts = sheetName.split('_')[1].split('/');
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1], 10);

  // Initialize an array to hold all the days in the month
  var daysInMonth = [];

  // Initialize a Date object to the first day of the month
  var date = new Date(year, month - 1, 1);

  // Loop through each day of the month
  while (date.getMonth() === month - 1) {
    // Format the date as "yyyy/mm/dd"
    var formattedDate = date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2);
    // Push the formatted date to the array
    daysInMonth.push(formattedDate);
    // Set the formatted date in the target sheet
    const range = `E${rangeCnt + 3}`; // Update the range dynamically
    targetSheet.getRange(range).setValue([[formattedDate]]);
    // Move to the next day
    date.setDate(date.getDate() + 1);
    rangeCnt++;
  }

  // Return the array containing all the days in the month
  return daysInMonth;
}

function addEachdatesLogsMap(startTime, stopTime, eachdatesLogsMap) {
  // Create Date objects from the input strings
  const startTimeDate = new Date(startTime);
  const stopTimeDate = new Date(stopTime);

  // Extract the day, hour, and minute from the Date objects
  const startDay = startTimeDate.getDate();
  const startHour = startTimeDate.getHours();
  const startMinute = startTimeDate.getMinutes();

  const stopDay = stopTimeDate.getDate();
  const stopHour = stopTimeDate.getHours();
  const stopMinute = stopTimeDate.getMinutes();

  // Format the start and stop times as HH:mm
  const formattedStartTime = ('0' + startHour).slice(-2) + ':' + ('0' + startMinute).slice(-2);
  const formattedStopTime = ('0' + stopHour).slice(-2) + ':' + ('0' + stopMinute).slice(-2);

  // Check if the start day exists in eachdatesLogsMap, if not, create an empty array
  if (!eachdatesLogsMap[startDay]) {
    eachdatesLogsMap[startDay] = [];
  }

  // Push the new log entry to the array corresponding to the start day
  eachdatesLogsMap[startDay].push({
    start: formattedStartTime,
    stop: formattedStopTime
  });

  // Return the updated eachdatesLogsMap
  return eachdatesLogsMap;
}

