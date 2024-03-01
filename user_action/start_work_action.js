function startWorkProcess(logSheet, actionTs) {
  // Convert the actionTs to a JavaScript Date object
  const actionDate = new Date(parseFloat(actionTs) * 1000);
  actionDate.setMilliseconds(0);
  logSheet.appendRow([actionDate, "stop"]);
  return ContentService.createTextOutput();
}