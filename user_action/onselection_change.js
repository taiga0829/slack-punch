const HEIGHT_OF_SHEET = 2;
function onSelectionChange(e) {
  Logger.log("inside select");
  // Check if e and e.source are not null
  if (e && e.source) {
    //e.source => spreadsheet
    const ss = e.source;
    filterSheetsUsingRegex(ss.getSheets(), ss);
    let logSheet = ss.getSheetByName("log_sheet");
    let summarySheets = getSheetsBySubstring("summary", ss);
    let eachdatesLogsMap = {};
    let eachdatesLogsMapForModify = [];
    let targetSummarySheet = "";
    let timestamp;
    let startTimestamp;
    let isFirstLoop = true;

    let tempStartTimestamp;
    let tempStopTimestamp;

    let oneBackTimestampMonth = null;
    let isSameYearAndMonth = false;
    //get values from log sheet
    clearValuesFromSheets(zeros,summarySheets);
    const logTable = logSheet.getDataRange().getValues();
    for (let i = 0; i < logTable.length; i++) {
      timestamp = logTable[i][0];
      const userState = logTable[i][1];
      if (userState === "start") {
        startTimestamp = timestamp;
      }
      const processingTimestamp = new Date(timestamp);
      // 2024/02
      const timestampYearAndMonth = `${processingTimestamp.getFullYear()}` + "/" + `${String(processingTimestamp.getMonth() + 1).padStart(2, '0')}`;

      let haveTimestampYearAndMonthInSummarySheet = false;
      summarySheets.forEach((summarySheet) => {
        // ex:) 2024/02 ∊ summary_2024/02
        if (summarySheet.getName().includes(timestampYearAndMonth)) {
          haveTimestampYearAndMonthInSummarySheet = true;
        }
      })

      if (!haveTimestampYearAndMonthInSummarySheet) {
        const summarySheetName = "summary_" + timestampYearAndMonth;
        copySheet(summarySheetName, "template_summary", ss.getSheets());
        //TODO;add proper year and month
        filterSheetsUsingRegex(ss.getSheets(), ss);
        appendAllOfDaysInMonth(summarySheetName, ss.getSheets());
      }
      targetSummarySheet = "";
      isSameYearAndMonth = oneBackTimestampMonth == timestampYearAndMonth;
      // if detect different month and year, do set values in corrensponding sheet, 
      if (!isSameYearAndMonth && !isFirstLoop && userState === "start") {
        targetSummarySheet = getSheetsBySubstring(oneBackTimestampMonth, ss)[0];
        const twoDArrayToInsert = objectTo2DArray(eachdatesLogsMap);
        //A3 to C33:
        Logger.log("eachdatesLogsMap");
        Logger.log(eachdatesLogsMap);
        Logger.log("twoDArrayToInsert");
        Logger.log(twoDArrayToInsert);
   
        targetSummarySheet.getRange(3, 1, 32, 3).setValues(
          twoDArrayToInsert
        );
        eachdatesLogsMap = {};
      }
      isFirstLoop = false;


      if (logTable[i][1] === "start" && !tempStartTimestamp) {
        tempStartTimestamp = logTable[i][0];
        Logger.log("tempStartTimestamp");
        Logger.log(tempStartTimestamp);
      }
      if (logTable[i][1] === "stop" && !tempStopTimestamp) {
        tempStopTimestamp = logTable[i][0];
        Logger.log("tempStopTimestamp");
        Logger.log(tempStopTimestamp);
      }
      if (tempStartTimestamp && tempStopTimestamp) {
        eachdatesLogsMap = addEachdatesLogsMap(tempStartTimestamp, tempStopTimestamp, eachdatesLogsMap);
        Logger.log("eachdatesLogsMap");
        Logger.log(eachdatesLogsMap);
        tempStartTimestamp = null;
        tempStopTimestamp = null;
      }
      else if (logTable[i][1] === "modify-start") {
        Logger.log(logTable[i][0]);
        Logger.log(logTable[i + 1][0]);
        Logger.log(logTable[i + 2][0]);
        const restMinute = logTable[i + 2][0].getHours() * 60 + logTable[i + 2][0].getMinutes();
        eachdatesLogsMapForModify = addEachdatesLogsMapForModify(logTable[i][0], logTable[i + 1][0], restMinute, eachdatesLogsMapForModify);
        Logger.log("eachdatesLogsMapForModify");
        Logger.log(eachdatesLogsMapForModify);

      }
      oneBackTimestampMonth = timestampYearAndMonth;
    }
    // after logtable loop
    // setvalue 

    const targetSummarySheetName = getSummarySheetNameByDate(startTimestamp);
    targetSummarySheet = ss.getSheetByName(targetSummarySheetName);
    Logger.log("twoDArrayToInsert");
    Logger.log(objectTo2DArray(eachdatesLogsMap));
    targetSummarySheet.getRange(3, 1, 32, 3).setValues(
      objectTo2DArray(eachdatesLogsMap)
    );
    setModifyLogs(eachdatesLogsMapForModify, ss);
  }
}

function getSummarySheetNameByDate(date) {
  const summarySheetNameBasedOnDate = `summary_${date.getFullYear()}` + "/" + `${String(date.getMonth() + 1).padStart(2, '0')}`;
  return summarySheetNameBasedOnDate;
}

function setModifyLogs(modify2DArray, ss) {

  //Ax to Cx;
  modify2DArray.forEach((e) => {
    const startModifyDate = e[0];
    const day = startModifyDate.getDate();
    const targetSheetName = getSummarySheetNameByDate(startModifyDate);
    const targetSheet = ss.getSheetByName(targetSheetName);
    Logger.log("targetSheet");
    Logger.log(targetSheet);
    Logger.log("targetSheetName");
    Logger.log(targetSheetName);
    const rangeByDate = day + HEIGHT_OF_SHEET;
    targetSheet.getRange(rangeByDate, 1, 1, 3).setValues([e]);
  })
}

function copySheet(sheetName, templateName, sheets) {
  // Get sample sheet
  Logger.log("inside copySheet");
  let templateSheet;
  sheets.forEach((sheet) => {
    if (sheet.getName() === templateName) {
      templateSheet = sheet;
    }
  })

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  templateSheet.copyTo(ss).setName(sheetName);
}

function addEachdatesLogsMapForModify(startTime, stopTime, restTime, eachdatesLogsMapForModify) {
  const toAdd = [startTime, stopTime, restTime];
  eachdatesLogsMapForModify.push(toAdd);
  return eachdatesLogsMapForModify;
}
function appendAllOfDaysInMonth(sheetName, sheets) {
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
  targetSheet.getRange("A1").setValue([[year]]);
  targetSheet.getRange("C1").setValue([[month]]);

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

  // Check if the start day exists in eachdatesLogsMap, if not, create an empty array
  if (!eachdatesLogsMap[startDay]) {
    eachdatesLogsMap[startDay] = [];
  }

  // Push the new log entry to the array corresponding to the start day
  eachdatesLogsMap[startDay].push({
    start: startTimeDate,
    stop: stopTimeDate
  });

  // Return the updated eachdatesLogsMap
  return eachdatesLogsMap;
}

function objectTo2DArray(data) {
  const result = [];

  for (let y = 1; y <= 32; y++) {
    const row = [];
    for (let x = 0; x < 3; x++) { // Changed to 3 columns
      const day = y;
      const dayData = data[day.toString()];
      if (dayData) {
        if (x === 0 && dayData[0]) {
          row.push(dayData[0].start);
        } else if (x === 1) {
            Logger.log(dayData);
          row.push(dayData[dayData.length - 1].stop);
        } else if (x === 2) {
          let restTime = 0;
          for (let i = 1; i < dayData.length; i++) {
            const start = new Date(dayData[i - 1].stop);
            const stop = new Date(dayData[i].start);
            restTime += stop - start;
          }
          // Convert milliseconds to minutes
          row.push(restTime / (1000 * 60));
        } else {
          row.push(0);
        }
      } else {
        row.push(0);
      }
    }
    result.push(row);
  }

  return result;
}

function getSheetsBySubstring(substring, ss) {
  const sheets = ss.getSheets();
  let matchingSheets = [];

  for (var i = 0; i < sheets.length; i++) {
    var sheetName = sheets[i].getName();

    // Check if the sheet name contains the provided substring
    if (sheetName.indexOf(substring) !== -1) {
      matchingSheets.push(sheets[i]);
    }
  }
  // Return the array of matching sheets
  return matchingSheets;
}

function filterSheetsUsingRegex(sheets, ss) {
  let garbageSheets = [];
  const summaryRegex = new RegExp("^summary_\\d{4}/\\d{2}$");

  sheets.forEach((sheet) => {
    const sheetName = sheet.getName();
    if (!summaryRegex.test(sheetName) && sheetName !== "log_sheet" && sheetName !== "template_summary") {
      garbageSheets.push(sheet);
    }
  });

  garbageSheets.forEach((garbageSheet) => {
    ss.deleteSheet(garbageSheet);
  });
}

function clearValuesFromSheets(zeros,sheets){
  sheets.forEach((sheet)=>{
    sheet.getRange(3, 1, 32, 3).setValues(
          zeros
        );
  })
}

const zeros = [["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00",0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0], ["0:00:00", 0, 0]];



