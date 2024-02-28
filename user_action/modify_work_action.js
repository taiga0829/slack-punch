function modifyWorkProcess(logSheet, values) {

  console.log(values);

  // Declare variables to store the values
  var timepicker_start;
  var timepicker_finish;
  var timepicker_rest;
  var datepicker;

  // Loop through each key in the values object
  for (var key in values) {
    // Check if the current key has 'timepicker-action' property
    if (values[key]['timepicker-action']) {
      const action = values[key]['timepicker-action'];
      // Depending on the type of action, handle accordingly
      if (action.type === 'datepicker') {
        console.log(`Selected date for ${key}: ${action.selected_date}`);
        datepicker = action.selected_date;
        // Handle datepicker action
      } else if (action.type === 'timepicker') {
        let temp = action.selected_time;
        const [hours, minutes] = temp.split(':').map(Number);
        if (!timepicker_start) {
          timepicker_start = temp;
        } else if (!timepicker_finish) {
          timepicker_finish = temp;
        } else if (!timepicker_rest) {
          timepicker_rest = temp;
        }
      }
    }
  }

  // Log the values
  console.log("Timepicker Start: " + timepicker_start);
  console.log("Timepicker Finish: " + timepicker_finish);
  console.log("Timepicker Rest: " + timepicker_rest);
  console.log("Datepicker: " + datepicker);

  // Parse the date to a JavaScript Date object
  const parsedDate = new Date(datepicker);

  // スプレッドシートを取得
  const spreadSheet = SpreadsheetApp.openByUrl(sheet_url);
  // Construct dates using new Date()
  const modify_start = new Date(datepicker + " " + timepicker_start + ":00");
  console.log("modify_start");
  console.log(modify_start);
  const modify_finish = new Date(datepicker + " " + timepicker_finish + ":00");
  console.log("modify_finish");
  console.log(modify_finish);

  const today = new Date();

  //validation
  if(modify_start >= modify_finish){
    return ContentService.createTextOutput(JSON.stringify(modifyStartAndModifyFinishError)).setMimeType(ContentService.MimeType.JSON);
  }else if(modify_start > today){
    return ContentService.createTextOutput(JSON.stringify(modifyStartError)).setMimeType(ContentService.MimeType.JSON);
  }
  
  try {
    logSheet.appendRow([modify_start, "modify-start"]);
    logSheet.appendRow([modify_finish, "modify-finish"]);
    logSheet.appendRow([timepicker_rest, "modify-rest"]);
    return ContentService.createTextOutput();
  } catch (error) {
    console.error(error);
    return ContentService.createTextOutput(JSON.stringify(error)).setMimeType(ContentService.MimeType.JSON);
  }
}

const modifyStartError = { 
   "response_action": "errors",
      "errors": {
        "start-time": "start time cannot be set for an upcoming day",
      }
}

const modifyStartAndModifyFinishError = {
      "response_action": "errors",
      "errors": {
        "start-time": "start time cannot be equal and greater than finish time",
        "finish-time": "start time cannot be equal and greater than finish time"
      }
    }
