function doPost(e) {
  const spreadSheet = SpreadsheetApp.openByUrl(sheet_url);
  console.log("action gas");
  const logSheet = spreadSheet.getSheetByName("log_sheet");
  var payload = JSON.parse(e.parameter.payload);
  console.log("inside");;
  console.log("payload");
  console.log(payload);
  console.log("blocks");
  //console.log(payload.blocks);
  //console.log(payload.blocks[-1]);
  const type = payload.type;
  console.log("type");
  console.log(type);
  //true => /start_work
  if (type === "block_actions") {
    console.log("action start_work");
    const responseUrl = payload.response_url;
    console.log("responseUrl");
    console.log(responseUrl);
    const response = {
      text: "sent request successfully👊👊",
    };
    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(response),
    }
    UrlFetchApp.fetch(responseUrl, options);
    console.log("payload");
    console.log(payload);
    // Access the first action object from the actions array
    const action = payload.actions[0];
    // Retrieve the action timestamp (action_ts) from the action object
    const actionTs = action.action_ts;
    return startWorkProcess(logSheet, actionTs);
  } else {
    ///modify
    // TOOD: create errors
    console.log("else");

    // const error = {
    //   "response_action": "errors",
    //   "errors": {
    //     "my_block_id": "You may not select a due date in the past"
    //   }
    // }
    // return ContentService.createTextOutput(JSON.stringify(error)).setMimeType(ContentService.MimeType.JSON);
    console.log("else");
    const values = payload.view.state.values;
    return modifyWorkProcess(logSheet, values);
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
