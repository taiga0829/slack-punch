const createModalView = () => {
  return {
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
        "block_id": "date-selection",
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
          "text": "Select the date when you want to modify",
          "emoji": true
        },  
      },
      {
        "block_id": "start-time",
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
        "block_id": "finish-time",
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
        "block_id": "rest-time",
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
    ]
  }
};