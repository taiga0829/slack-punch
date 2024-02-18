function doPost(e) {
  console.log("action gas");
  const logSheet = spreadSheet.getSheetByName("log_sheet");
  var payload = JSON.parse(e.parameter.payload);
  console.log("inside");;
  console.log("payload");
  console.log(payload);
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
      text: "processing...",
    };
    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(response),
    }
    UrlFetchApp.fetch(responseUrl, options);
    const actionTs = payload.action_ts;
    return startWorkProcess(logSheet, actionTs);
  } else {
    ///modify
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
