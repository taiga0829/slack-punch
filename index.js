function doPost(e) {
  var logSheet = spreadSheet.getSheetByName("log_sheet");
  const parsedData = JSON.parse(e.parameter.payload);
  // console.log("payload");
  // console.log(parsedData);
  const actionTs = JSON.parse(e.parameter.payload).action_ts;
  // const blocks = parsedData.original_message.blocks[0];
  // // Accessing the elements array
  // const elementsArray = blocks.elements;

  // // Iterating over the elements
  // elementsArray.forEach(element => {
  //   // Access each element and do something with it
  //   console.log("element");
  //   console.log(element);
  // });
  // console.log("blocks");
  // console.log(blocks);

  console.log("parsedData");
  console.log(parsedData);
  //https://api.slack.com/methods/views.push
  const triggerId = parsedData.trigger_id;
  console.log(triggerId);
  const url_update = "https://slack.com/api/views.push";
  const arg = {
    token:slack_token,
    trigger_id : triggerId,
    view:createModalView(),
  };
  console.log("inside foller res");
  const res = UrlFetchApp.fetch(url_update,arg);
  console.log(res.toString());
  console.log(res.getResponseCode());
  console.log(res.getContent());
  console.log(res.getHeaders());
  console.log(res.getAllHeaders());
  console.log(res.getContentText());
  console.log(res.getBlob());
  // Access the api_app_id attribute

  const action_id = parsedData.actions[0].action_id ? parsedData.actions[0].action_id  : "";
  console.log("action_id");
  console.log(action_id);

  //true => /start_work (modify has only action_id)
  if (action_id === "") {
    // Convert epoch time to milliseconds
    const epochTimeInMilliseconds = actionTs * 1000;
    // Create a new Date object with the converted milliseconds
    const stopTime = new Date(epochTimeInMilliseconds);
    stopTime.setMilliseconds(0);
    logSheet.appendRow([stopTime, "stop"]);
    return ContentService.createTextOutput("👊👊👊request is successfully sent👊👊👊"); 
  } else {
    ///modify
    console.log("else");
    var payload = JSON.parse(e.parameter.payload);
    var values = payload.view.state.values;

    console.log(values);

    // Declare variables to store the values
    var timepicker_start;
    var timepicker_finish;
    var timepicker_rest;
    var datepicker;

    // Loop through keys
    for (var key in values) {
      if (values[key]['timepicker-start'] !== undefined) {
        timepicker_start = values[key]['timepicker-start'].selected_time;
      } else if (values[key]['timepicker-finish'] !== undefined) {
        timepicker_finish = values[key]['timepicker-finish'].selected_time;
      } else if (values[key]['timepicker-rest'] !== undefined) {
        timepicker_rest = values[key]['timepicker-rest'].selected_time;
      } else if (values[key]['datepicker'] !== undefined) {
        datepicker = values[key]['datepicker'].selected_date;
      }
    }

    // Log the values
    console.log("Timepicker Start: " + timepicker_start);
    console.log("Timepicker Finish: " + timepicker_finish);
    console.log("Timepicker Rest: " + timepicker_rest);
    console.log("Datepicker: " + datepicker);

    // Parse the date to a JavaScript Date object
    const parsedDate = new Date(datepicker);

    console.log("log_sheet");

    // スプレッドシートを取得
    const spreadSheet = SpreadsheetApp.openByUrl(sheet_url);
    // Construct dates using new Date()
    const modify_start = new Date(datepicker + " " + timepicker_start + ":00");
    const modify_finish = new Date(datepicker + " " + timepicker_finish + ":00");

    // Log the logSheetName
    console.log("Log Sheet Name: " + logSheetName);
    try {
      logSheet.appendRow([modify_start, "modify-start"]);
      logSheet.appendRow([modify_finish, "modify-finish"]);
      logSheet.appendRow([timepicker_rest, "rest"]);
      return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
      console.error(error);
      return ContentService.createTextOutput(JSON.stringify({ success: false })).setMimeType(ContentService.MimeType.JSON);
    }
  }
}

const createModalView = () => {
  return {
    "response_action": "update",
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
          "action_id": "timepicker-action",
        },
        "label": {
          "type": "plain_text",
          "text": "Rest time",
          "emoji": true
        },  
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
        },
        
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
        },
        
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
        },
      }, 
      {
        "block_id": "my_block_id",
        "type": "input",
        "optional": true,
        "label": {
          "type": "plain_text",
          "text": "Select a channel to post the result on",
        },
        "element": {
          "action_id": "my_action_id",
          "type": "conversations_select",
          "response_url_enabled": true,
        },
      },
    ]
  }
};
