const SLACK_TOKEN = PropertiesService.getScriptProperties().getProperty("SLACK_TOKEN");
function doPost(e) {
  const parameter = e.parameter;
  console.log("modify parameter");
  console.log(parameter);

  try {
    openModal(parameter);
  } catch (error) {
    console.log(error);
    return ContentService.createTextOutput(error)
  }
  return ContentService.createTextOutput("");
}

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

  const res = UrlFetchApp.fetch(postUrl, options);
};