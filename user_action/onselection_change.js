const SUMMARY_SHEET_HEADER_HEIGHT = 2;
function onSelectionChange(e) {
  console.log("inside select");
  // Check if e and e.source are not null
  if (e && e.source) {
    //e.source => spreadsheet
    const ss = e.source;
    let logSheet = ss.getSheetByName("log_sheet");
    let summarySheets = getSheetsBySubstring("summary", ss);
    let eachdatesLogsMap = {};
    //OK

    let oneBackTimestamp = "";
    let isSameMonth = false;
    let initFlag = 0;
    //get values from log sheet
    const logTable = logSheet.getDataRange().getValues();
    for (let i = 0; i < logTable.length; i++) {
      let timestamp = logTable[i][0];
      const processingTimestamp = new Date(timestamp);
      // 2024/02
      const timestampYearAndMonth = `${processingTimestamp.getFullYear()}` + "/" + `${String(processingTimestamp.getMonth() + 1).padStart(2, '0')}`;
      const timestampDay = processingTimestamp.getDate();
      const timestampMonth = processingTimestamp.getMonth();

      const targetTimestampCell = timestampDay + SUMMARY_SHEET_HEADER_HEIGHT;
      let haveTimestampYearAndMonth = false;
      let targetSummarySheet = "";

      summarySheets.forEach((summarySheet) => {
        // ex:) 2024/02 ∊ summary_2024/02
        if (summarySheet.getName().includes(timestampYearAndMonth)) {
          haveTimestampYearAndMonth = true;
          targetSummarySheet = summarySheet;
        }
      })

      if (!haveTimestampYearAndMonth) {
        console.log("before copy function");
        const summarySheetName = "summary_" + timestampYearAndMonth;
        copySheet(summarySheetName, "template_summary", ss.getSheets());
        appendAllOfDaysInMonth(summarySheetName, ss.getSheets());
        targetSummarySheet = ss.getSheetByName(summarySheetName);
        console.log(summarySheetName);
      }

      // store current temp(month) . if they are different, transform it to 2d array, 
      //setvalues to sheet then different create another datesmap
      isSameMonth = oneBackTimestamp == timestampMonth;
      console.log("outside extract");
      if (!isSameMonth && initFlag === 1) {
        console.log("inside extract");
        console.log(eachdatesLogsMap);
        let twoDArrayToInsert = objectTo2DArray(eachdatesLogsMap, SUMMARY_SHEET_HEADER_HEIGHT);
        //A3 to C33:
        targetSummarySheet.getRange(3, 1, 34, 3).setValues(
          twoDArrayToInsert
        );
      }
      oneBackTimestamp = timestampMonth;
      initFlag = 1;

      //OK
      console.log("logtable");
      console.log(logTable);
      //2024/02/09 17:43:33 start=> 9:{ start:"17:43", } 
      //2024/02/10 20:43:33 start=>     stop:"20:43"} 
      // TODO: try to validation that start, start, 
      if (logTable[i][1] === "start" && logTable[i + 1][1] === "stop") {
        eachdatesLogsMap = addEachdatesLogsMap(logTable[i][0], logTable[i + 1][0], eachdatesLogsMap);
      }
      // else if (logSheet[i][1] === "modify-start") {
      //   //TODO: append 2d array
      //   const modifyStartRange = `A${targetTimestampCell}`;
      //   const modifyStopRange = `B${targetTimestampCell}`;
      //   const modifyRestRange = `C${targetTimestampCell}`;
      //   summarySheet.getRange(modifyStartRange).setValue([[logTable[i][0]]]);
      //   summarySheet.getRange(modifyStopRange).setValue([[logTable[i + 1][0]]]);
      //   summarySheet.getRange(modifyRestRange).setValue([[logTable[i + 2][0]]]);
      // }
      //   // TODO: extract and fill data in summary sheet (exclude modify things) 
      //   //
      //   //
    }
  }
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

function objectTo2DArray(data, SUMMARY_SHEET_HEADER_HEIGHT) {
  const result = [];

  for (let y = 0; y <= 31 + SUMMARY_SHEET_HEADER_HEIGHT; y++) {
    const row = [];

    for (let x = 0; x < 3; x++) { // Changed to 3 columns
      if (y < SUMMARY_SHEET_HEADER_HEIGHT) {
        row.push(null);
      } else {
        const day = (y - SUMMARY_SHEET_HEADER_HEIGHT) + 1;
        const dayData = data[day.toString()];

        if (dayData) {
          if (x === 0 && dayData[0]) {
            row.push(dayData[0].start);
          } else if (x === 1 && dayData.length > 1) {
            row.push(dayData[dayData.length - 1].stop);
          } else if (x === 2 && dayData.length > 1) {
            let restTime = 0;
            for (let i = 1; i < dayData.length; i++) {
              const start = new Date('1970-01-01T' + dayData[i - 1].stop + ':00');
              const stop = new Date('1970-01-01T' + dayData[i].start + ':00');
              restTime += stop - start;
            }
            // Convert milliseconds to minutes
            row.push(restTime / (1000 * 60));
          } else {
            row.push(null);
          }
        } else {
          row.push(null);
        }
      }
    }

    result.push(row);
  }

  return result;
}


function getSheetsBySubstring(substring, ss) {
  var sheets = ss.getSheets();
  var matchingSheets = [];

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


