function startWorkProcess(logSheet, actionTs) {
  // Convert epoch time to milliseconds
  console.log("actionTs");
  console.log(actionTs);
  // Convert the actionTs to a JavaScript Date object
  const actionDate = new Date(parseFloat(actionTs) * 1000);
  actionDate.setMilliseconds(0);
  logSheet.appendRow([actionDate, "stop"]);
  return ContentService.createTextOutput();
}