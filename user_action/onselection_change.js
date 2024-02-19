// function onSelectionChange(e) {
//   // Check if e and e.source are not null
//   if (e && e.source) {
//     const sheets = e.source.getSheets();
//     const logSheet = "";
//     const summarySheets = "";
//     sheets.forEach(sheet => {
//       if (sheet.getName() === "log_sheet") {
//         logSheet = sheet;
//       } else if (sheet.getName.includes("summary")) {
//         summarySheets.push(sheet);
//       }
//     })

//     var logTable = logSheet.getDataRange().getValues();
//     console.log(logTable);
//     let restSum = 0;
//     let hasModify = false;
//     //TODO:debug
//     for (let i = 0; i < logTable.length - 2; i++) {
//       if (logTable[i][1] === "modify-start" && logTable[i + 1][1] === "modify-stop" && logTable[i + 2][1] === "rest") {
//         // in first seach,since he doesn't know exsistance of "modify-stop", this is needed
//         hasModify = true;
//       }
//     }
//     for (let i = 0; i < logTable.length - 2; i++) {
//       if (hasModify) {
//         if (logTable[i][1] === "modify-start" && logTable[i + 1][1] === "modify-stop" && logTable[i + 2][1] === "rest") {
//           let timestamp = logTable[i][0];
//           const timestampArr = timestamp.split("/");
//           timestampArr.pop();
//           //ex:) summary sheet "summary_2024/2" includes timestampArr (2024/2) 
//           timestampArr.join("/")
//           summarySheets.forEach((summarySheet) => {
//             const summaryTable = summarySheet.getRange().getValues();
//             const summaryTableDate = summaryTable[i][4];
//             const logTableDateProcess = logTable[i][0];
//             const temp = logTableDateProcess.split(" ").shift();
//             // 2024/08/24 => 24
//             //TODO:
//             // const date = "2000/01/09 8:00:00";
//             // const newD = new Date(date);
//             // console.log(`${newD.getFullYear()}` + "/" + `${String(newD.getMonth() + 1).padStart(2, '0')}`);
//             const logTableDate = temp.split("/").pop();
//             // cannot update skip free days beacause of append
//             //TODO just look for start
//             //start date in summary 
//             if (summarySheet.includes(timestampArr) && summaryTableDate == logTableDate) {
//               summarySheet.appendRow([table[i][1], table[i + 1][1], table[i + 2][1]]);
//             }
//           })
//           break;
//         }
//       } else {
//         const startWork = table[0][0];
//         console.log(startWork);
//         sheet.getRange("F1").setValue(startWork);
//         //const label = table[table.length - 1][1]; // start or stop
//         const finishWork = table[table.length - 2][0];
//         console.log(finishWork);
//         //setting time user finishes working
//         sheet.getRange("F2").setValue(finishWork);
//         if (table[i][1] === "stop" && table[i + 1][1] === "start") {
//           restSum += timeDifference(table[i][0], table[i + 1][0]);
//           //setting rest sum
//           sheet.getRange("F3").setValue(restSum);
//         }
//       }
//     }



//     // const logSheets = sheets.filter((sheet) => sheet.getName().includes("log") && !sheet.getName().includes("sample"));
//     // const summarySheets = sheets.filter((sheet) => sheet.getName().includes("summary") && !sheet.getName().includes("sample"));


//   }
// }
// function timeDifference(date1, date2) {

//   // Convert the strings to JavaScript Date objects
//   var dateObject1 = new Date(date1);
//   var dateObject2 = new Date(date2);

//   // Calculate the time difference in milliseconds
//   var timeDifferenceMillis = Math.abs(dateObject1 - dateObject2);

//   // Convert milliseconds to hours and minutes
//   var hours = Math.floor(timeDifferenceMillis / 3600000);
//   var minutes = Math.floor((timeDifferenceMillis % 3600000) / 60000);

//   // Output the result
//   console.log("Time Difference: " + hours + " hours, " + minutes + " minutes");
// }

