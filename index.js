function getTableFromSheet() {
  // first of all, you need to open files
  const SHEET_URL = "https://docs.google.com/spreadsheets/d/1cTrMPgXbIrRljvWX_AsoRZkXz6BWlK9tf7cPZqbXSnI/edit#gid=0";
  const SHEET_NAME = "testSheet";
  var spreadSheet = SpreadsheetApp.openByUrl(SHEET_URL);
  //specify the sheet that u want modify 
  var sheet = spreadSheet.getSheetByName(SHEET_NAME);
  
  //get elements 
  var table = sheet.getDataRange().getValues();

  //log
  Logger.log(table);

  // add elements(https://developers.google.com/apps-script/reference/spreadsheet/sheet?hl=ja#getrangerow,-column,-numrows)
  sheet.getRange(4, 1, 2, 3).setValues([[4, "Apple", 120],
                                      [5, "Orange", 200]]);
  sheet.appendRow([6, "Grape", 130]);


  
  // Prompt the user for the new sheet name
  var sheetName = Browser.inputBox('Enter the name for the new sheet:');
  
  // Add a new sheet with the specified name
  var newSheet = spreadSheet.insertSheet(sheetName);
  
  // Activate the new sheet
  spreadSheet.setActiveSheet(newSheet);

}
