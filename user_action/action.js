function doPost(e) {
  const spreadSheet = SpreadsheetApp.openByUrl(SHEET_URL);
  const logSheet = spreadSheet.getSheetByName("log_sheet");
  const payload = JSON.parse(e.parameter.payload);
  const type = payload.type;
  //true => /start_work
  if (type === "block_actions") {
    const responseUrl = payload.response_url;
    const response = {
      text: "sent request successfully👊👊",
    };
    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(response),
    }
    UrlFetchApp.fetch(responseUrl, options);
    // Access the first action object from the actions array
    const action = payload.actions[0];
    // Retrieve the action timestamp (action_ts) from the action object
    const actionTs = action.action_ts;
    return startWorkProcess(logSheet, actionTs);
  } else {
    ///modify
    // TOOD: create errors
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
  const url = 'https://slack.com/api/views.update';

  const headers = {
    'Authorization': 'Bearer ' + SLACK_TOKEN,
    'Content-Type': 'application/json'
  };

  const data = {
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

  const options = {
    'method': 'post',
    'headers': headers,
    'payload': JSON.stringify(data)
  };

  const response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getContentText());
}
