function startWorkProcess(logSheet,actionTs) {
  // Convert epoch time to milliseconds
  const epochTimeInMilliseconds = actionTs * 1000;
  // Create a new Date object with the converted milliseconds
  const stopTime = new Date(epochTimeInMilliseconds);
  stopTime.setMilliseconds(0);
  logSheet.appendRow([stopTime, "stop"]);
  return ContentService.createTextOutput();
}