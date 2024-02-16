function doPost(e) {
  console.log("action gas");
  var logSheet = spreadSheet.getSheetByName("log_sheet");

  const parsedData = JSON.parse(e.parameter.payload);
  console.log("inside");
  console.log("e");
  console.log(e);
  const actionTs = JSON.parse(e.parameter.payload).action_ts;
  console.log("parsedData");
  console.log(parsedData);
  const type = parsedData.type;

  const responseUrl = parsedData.response_url;
  const response = {
    text: "processing...",
  };
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(response),
  }
  // UrlFetchApp.fetch(responseUrl, options);

  //true => /start_work
  if (type === "block_actions") {
    console.log("action start_work");

    // Convert epoch time to milliseconds
    const epochTimeInMilliseconds = actionTs * 1000;
    // Create a new Date object with the converted milliseconds
    const stopTime = new Date(epochTimeInMilliseconds);
    stopTime.setMilliseconds(0);
    logSheet.appendRow([stopTime, "stop"]);
    // Return a 200 OK response
    // Return an object containing status 200
    //const response = { status: 200 };
  } else {
    ///modify
    
    console.log("else");
    return ContentService.createTextOutput();
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
      // Return a 200 OK response
      // Return an object containing status 200
      const response = { status: 200 };
      return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
      console.error(error);
      const response = { status: 500 };
      return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
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

function respondToUpdate() {
  var url = 'https://slack.com/api/views.update';

  var headers = {
    'Authorization': 'Bearer ' + slack_token,
    'Content-Type': 'application/json'
  };

  var data = {
    'response_action': 'update',
    'view': {
      'type': 'modal',
      'title': {
        'type': 'plain_text',
        'text': 'Updated view'
      },
      'blocks': [
        {
          'type': 'section',
          'text': {
            'type': 'plain_text',
            'text': 'I\'ve changed and I\'ll never be the same. You must believe me.'
          }
        }
      ]
    }
  };

  var options = {
    'method': 'post',
    'headers': headers,
    'payload': JSON.stringify(data)
  };

  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getContentText());
}

  // //https://api.slack.com/methods/views.push
  // const triggerId = parsedData.trigger_id;
  // console.log(triggerId);
  // const url_update = "https://slack.com/api/views.push";
  // const arg = {
  //   token: slack_token,
  //   trigger_id: triggerId,
  //   view: createModalView(),
  // };
  // console.log("inside foller res");
  // const res = UrlFetchApp.fetch(url_update, arg);
  // console.log(res.toString());
  // console.log(res.getResponseCode());
  // console.log(res.getContent());
  // console.log(res.getHeaders());
  // console.log(res.getAllHeaders());
  // console.log(res.getContentText());
  // console.log(res.getBlob());
