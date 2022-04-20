// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: cog;


// Create folder to store data
let fm = FileManager.local();
const iCloudUsed = fm.isFileStoredIniCloud(module.filename);
fm = iCloudUsed ? FileManager.iCloud() : fm;
const widgetFolder = "Futcal";
const offlinePath = fm.joinPath(fm.documentsDirectory(), widgetFolder);
if (!fm.fileExists(offlinePath)) fm.createDirectory(offlinePath);


var defaultJSON = {
    teamId: "10260",
    timeZone: "Asia/Seoul",
    language: "system",
    showMatchesRound: false,
    showMatchesTeamsNames: true,
    showMatchesTeamsBadges: false,
    showMatchesOnlyOpposition: false,
    showHomeOrAway: false,
    matchesTwelveHourClock: false,
    showMatchesDayOfWeek: true,
    showMatchesLiveTime: false,
    showLeagueSubtitle: false,
    showCirclePositionHighlight: true,
    showRowPositionHighlight: false,
    dateFormatWithWeekday : "MM/dd(EEE)",
    dateFormatWithoutWeekday : "MM/dd"
};	

var optionName = {
    teamId: "Team ID",
    timeZone: "TimeZone",
    language: "Language",
    showMatchesRound: "Show Match Round",
    showMatchesTeamsNames: "Show Team Name",
    showMatchesTeamsBadges: "Show Team Badge",
    showMatchesOnlyOpposition: "Show Opponent Only",
    showHomeOrAway: "Show Home and Away",
    matchesTwelveHourClock: "Show Time as 12hours Format",
    showMatchesDayOfWeek: "Show Day of Week",
    showMatchesLiveTime: "Show the Live Clock of Match (If it is in live)",
    showLeagueSubtitle: "Show League Sub Title",
    showCirclePositionHighlight: "Highlight My Team with a Circle",
    showRowPositionHighlight: "Highlight the Row My Team at",
    dateFormatWithWeekday : "Date Format with Weekday",
    dateFormatWithoutWeekday : "Date Format without Weekday"
}

var optionFormat = {
    teamId: "Number of your Team's ID (in FotMob)",
    timeZone: "e.g. Europe/London, America/New_York, Asia/Seoul.. (Find at https://timezonedb.com)",
    language: "'system' will follow your iOS system language (if your system language is not supported, default language will be set to English",
    showMatchesRound: "true or false",
    showMatchesTeamsNames: "true or false",
    showMatchesTeamsBadges: "true or false",
    showMatchesOnlyOpposition: "true or false",
    showHomeOrAway: "true or false",
    matchesTwelveHourClock: "true or false",
    showMatchesDayOfWeek: "true or false",
    showMatchesLiveTime: "true or false",
    showLeagueSubtitle: "true or false",
    showCirclePositionHighlight: "true or false",
    showRowPositionHighlight: "true or false",
    dateFormatWithWeekday : "month : M, day : d (use double symbol to display a single digit to double digit (ex. M/d for 1/1 and MM/dd for 01/01)",
    dateFormatWithoutWeekday : "month and day is same as above and for day of week as following - EEE(Mon), EEEE(Monday), EEEEE(M)"
};

// Edit Preferences

let userParameter = defaultJSON;
let settingfile = JSON.parse(fm.readString(fm.joinPath(offlinePath, "userParameter.json")));
if (!settingfile)
	settingfile = defaultJSON;

for (key in defaultJSON) {
  if (settingfile[key] != null) {
    userParameter[key] = settingfile[key];
  }
}


let settings = new UITable()
settings.showSeparators = true

function loadAllRows() {  
	let header = new UITableRow()
	header.isHeader = true;
	headerCell1 = UITableCell.text("Setting","");
	headerCell1.widthWeight = 60;
	header.addCell(headerCell1);
	headerCell2 = UITableCell.text("Value","");
	headerCell2.rightAligned();
	headerCell2.widthWeight = 40;
	header.addCell(headerCell2);
	settings.addRow(header);	
	
	let optionList = [];
	for(title in userParameter){
	// Settings List
		let option = new UITableRow();
		optionList.push(title);
		option.dismissOnSelect = false;
		option.height = 100;
		optionCell1 = UITableCell.text(optionName[title], optionFormat[title]); 
		optionCell1.widthWeight = 70;
		option.addCell(optionCell1);
		
		optionCell2 = UITableCell.text(userParameter[title].toString(),"")      ;       
		optionCell2.rightAligned();
		optionCell2.widthWeight = 30;
		option.addCell(optionCell2);
		settings.addRow(option);
		option.onSelect = async (number) => {
			let n = number - 1;
			if (optionFormat[optionList[n]] == "true or false")	{
				let editAlert = new Alert();
				editAlert.title = optionName[optionList[n]];
				editAlert.message = optionFormat[optionList[n]];
				editAlert.addAction("true");
				editAlert.addAction("false");
				editAlert.addCancelAction("Cancel");
		
				let response = await editAlert.present();
				if(response != -1) {
					userParameter[optionList[n]] = response ? "false" : "true";
					refreshAllRows();
				}			
			}
			else if (optionName[optionList[n]] == "Language") {
				let editAlert = new Alert();
				editAlert.title = optionName[optionList[n]];
				editAlert.message = optionFormat[optionList[n]];
				editAlert.addAction("system");
				editAlert.addAction("Czech");
				editAlert.addAction("English");
				editAlert.addAction("French");
				editAlert.addAction("German");
				editAlert.addAction("Korean");
				editAlert.addAction("Portuguese");
				editAlert.addAction("Spanish");
				editAlert.addCancelAction("Cancel");
				let langArray = ["system", "Czech", "English", "French", "German", "Korean", "Portuguese", "Spanish"];
				let response = await editAlert.present();
				if(response != -1) {					
					userParameter[optionList[n]] = langArray[response];
					refreshAllRows();
				}					
			}
			else {
				let editAlert = new Alert()
				editAlert.title = "Edit " + optionName[optionList[n]]
				editAlert.addTextField(optionFormat[optionList[n]], userParameter[optionList[number-1]].toString())
				editAlert.addCancelAction("Cancel");
				editAlert.addAction("Done");
				if(await editAlert.present() == 0){
					let editVal
					if (editAlert.textFieldValue()=="true") {
					editVal = true;
					}
					else if (editAlert.textFieldValue()=="false") {
					editVal = false;
					}
					else {
					editVal = editAlert.textFieldValue();
					}		
					userParameter[optionList[n]] = editVal;
					refreshAllRows();         
				}
			}
		}
	}
}	
		
loadAllRows();

await settings.present();

fm.writeString(fm.joinPath(offlinePath, "userParameter.json"), JSON.stringify(userParameter));
Script.complete();



function refreshAllRows() {
  settings.removeAllRows();
  loadAllRows();
  settings.reload();
}

/*
async function generateAlert(title,message,options) {
  let alert = new Alert()
  alert.title = title
  alert.message = message
  
  for (const option of options) {
    alert.addAction(option)
  }
  
  let response = await alert.presentAlert()
  return response
}
*/