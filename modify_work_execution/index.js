const SLACK_TOKEN = PropertiesService.getScriptProperties().getProperty("SLACK_TOKEN");
function doPost(e) {
  const parameter = e.parameter;
  console.log("modify parameter");
  console.log(parameter);

  const response = {
    text: "Opening modal...",
    attachments: [
      {
        text: "This is an attachment",
        fallback: "Attachment text",
      },
    ],
  };
  // Send the response back to Slack
  const responseUrl = parameter.response_url;
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(response),
  }

  try {
    openModal(parameter);
    // Send the response back to Slack
    UrlFetchApp.fetch(responseUrl, options);
    return ContentService.createTextOutput("");
  } catch (error) {
    console.log(error);
    return ContentService.createTextOutput(error)
  }
}

/**
 * モーダルOpen
 */
const openModal = payload => {
  const modalView = createModalView();
  const viewData = {
    token: SLACK_TOKEN,
    trigger_id: payload.trigger_id,
    view: JSON.stringify(modalView)
  };
  const viewDataPayload = JSON.stringify(viewData);
  const postUrl = 'https://slack.com/api/views.open';
  const options = {
    method: "post",
    contentType: "application/json",
    headers: { "Authorization": `Bearer ` + SLACK_TOKEN },
    payload: viewDataPayload
  };

  console.log(SLACK_TOKEN);
  console.log("modify");
  const res = UrlFetchApp.fetch(postUrl, options);
  console.log("trigger_id");
  console.log("Trigger ID:", payload.trigger_id);
  console.log("Response as String:", res.toString());
  console.log("Response Code:", res.getResponseCode());
  console.log("Response Content:", res.getContent());
  console.log("Response Headers:", res.getHeaders());
  console.log("All Response Headers:", res.getAllHeaders());
  console.log("Content as Text:", res.getContentText());
  console.log("Response Blob:", res.getBlob()); // add label
  console.log("payload");
  console.log(options.payload);
  console.log("end of modify");
  return ContentService.createTextOutput();
};



// function doPost(e) {
//   try {
//     if (slack_token != e.parameter.token) {
//       throw new Error(e.parameter.token);
//     }
//   } catch (error) {
//     return ContentService.createTextOutput(403);
//   }

//   const data = {
//     "text": "Hello! I'm slack punch 👊👊👊. I'll will record how long you have worked so far.", //アタッチメントではない通常メッセージ
//     "response_type": "in_chanel", // ここを"ephemeral"から"in_chanel"に変えると他の人にも表示されるらしい（？）
//     //アタッチメント部分
//     "attachments": [{
//       "blocks": [
//         {
//           "type": "section",
//           "text": {
//             "type": "mrkdwn",
//             "text": "choose the date when you want to modify data."
//           },
//           "accessory": {
//             "type": "datepicker",
//             "initial_date": "1990-04-28",
//             "placeholder": {
//               "type": "plain_text",
//               "text": "Select a date",
//               "emoji": true
//             },
//             "action_id": "datepicker-action"
//           }
//         },
//         {
//           "type": "actions",
//           "elements": [
//             {
//               "type": "timepicker",
//               "initial_time": "13:37",
//               "placeholder": {
//                 "type": "plain_text",
//                 "text": "Select time",
//                 "emoji": true
//               },
//               "action_id": "actionId-0"
//             },
//             {
//               "type": "button",
//               "text": {
//                 "type": "plain_text",
//                 "text": "Start working",
//                 "emoji": true
//               },
//               "value": "click_me_123",
//               "action_id": "actionId-1"
//             }
//           ]
//         },
//         {
//           "type": "actions",
//           "elements": [
//             {
//               "type": "timepicker",
//               "initial_time": "13:37",
//               "placeholder": {
//                 "type": "plain_text",
//                 "text": "Select time",
//                 "emoji": true
//               },
//               "action_id": "actionId-0"
//             },
//             {
//               "type": "button",
//               "text": {
//                 "type": "plain_text",
//                 "text": "Finish working",
//                 "emoji": true
//               },
//               "value": "click_me_123",
//               "action_id": "actionId-1"
//             }
//           ]
//         }
//       ]
//     }]
//   };
//   return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
// }

// const doPost = (e) => {
//   const parameter = e.parameter
//   console.log(parameter);
//   try {
//     // 自分が作成したSlackアプリからのリクエストでない場合はエラー
//     if (SLACK_TOKEN!= parameter.token) throw new Error(parameter.token)

//     // モーダルを開くようにSlackへリクエスト
//     return openModal(parameter)
//     console.log("dcdcdcdcdcd");
//   } catch(error) {
//     console.log(error);
//     return ContentService.createTextOutput(error)
//   }
// }

// /**
//  * モーダルOpen
//  */
// const openModal = payload => {
//   const modalView = generateModalView()
//   const viewData = {
//     token: SLACK_TOKEN,
//     trigger_id: payload.trigger_id,
//     view: JSON.stringify(modalView)
//   }
//   const postUrl = 'https://slack.com/api/views.open'
//   const viewDataPayload = JSON.stringify(viewData)
//   const options = {
//     method: "post",
//     contentType: "application/json",
//     headers: { "Authorization": `Bearer ` + SLACK_TOKEN },
//     payload: viewDataPayload
//   }

//   UrlFetchApp.fetch(postUrl, options)
//   return ContentService.createTextOutput(generateModalView)
// }

// /**
//  * モーダルBlocks
//  */
// const generateModalView = () => {
//   return {
// 	"type": "modal",
// 	"title": {
// 		"type": "plain_text",
// 		"text": "👊👊Modify Punch👊👊",
// 		"emoji": true
// 	},
// 	"submit": {
// 		"type": "plain_text",
// 		"text": "Submit",
// 		"emoji": true
// 	},
// 	"close": {
// 		"type": "plain_text",
// 		"text": "Cancel",
// 		"emoji": true
// 	},
// 	"blocks": [
// 		{
// 			"type": "section",
// 			"text": {
// 				"type": "mrkdwn",
// 				"text": "choose the date when you want to modify data."
// 			}
// 		},
// 		{
// 			"type": "input",
// 			"element": {
// 				"type": "datepicker",
// 				"initial_date": "2024-01-09",
// 				"placeholder": {
// 					"type": "plain_text",
// 					"text": "Select a date",
// 					"emoji": true
// 				},
// 				"action_id": "timepicker-action"
// 			},
// 			"label": {
// 				"type": "plain_text",
// 				"text": "Rest time",
// 				"emoji": true
// 			}
// 		},
// 		{
// 			"type": "input",
// 			"element": {
// 				"type": "timepicker",
// 				"placeholder": {
// 					"type": "plain_text",
// 					"text": "Select start time",
// 					"emoji": true
// 				},
// 				"action_id": "timepicker-action"
// 			},
// 			"label": {
// 				"type": "plain_text",
// 				"text": "Select start time",
// 				"emoji": true
// 			}
// 		},
// 		{
// 			"type": "input",
// 			"element": {
// 				"type": "timepicker",
// 				"placeholder": {
// 					"type": "plain_text",
// 					"text": "Select finish time",
// 					"emoji": true
// 				},
// 				"action_id": "timepicker-action"
// 			},
// 			"label": {
// 				"type": "plain_text",
// 				"text": "Select finish time",
// 				"emoji": true
// 			}
// 		},
// 		{
// 			"type": "input",
// 			"element": {
// 				"type": "timepicker",
// 				"initial_time": "00:00",
// 				"placeholder": {
// 					"type": "plain_text",
// 					"text": "Select time",
// 					"emoji": true
// 				},
// 				"action_id": "timepicker-action"
// 			},
// 			"label": {
// 				"type": "plain_text",
// 				"text": "Rest time",
// 				"emoji": true
// 			}
// 		}
// 	]
// };
// }