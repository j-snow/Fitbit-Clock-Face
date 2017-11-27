import clock from "clock";
import document from "document";
import { HeartRateSensor } from "heart-rate";
import { user } from "user-profile";
import { battery } from "power";
import { charger } from "power";
import { goals } from "user-activity";
import { today } from "user-activity";

import * as util from "../common/utils";

clock.granularity = "minutes";

let elTime = document.getElementById("time");
let elDate = document.getElementById("date");

function updateClock() {
  let dtDate = new Date();
  let iHours = dtDate.getHours();
  let iMins = util.zeroPad(dtDate.getMinutes());
  
  iHours = iHours % 12;
  iHours = iHours ? iHours : 12;

  elTime.text = `${iHours}:${iMins}`;
  
  elDate.text = `${util.getDay3(dtDate.getDay())} ${dtDate.getDate()} ${util.getMonth3(dtDate.getMonth())}`;
  
  updateSteps();
  updateBattery();
}

clock.ontick = () => updateClock();

let oHeartRate = new HeartRateSensor();
let elHeart = document.getElementById("heart");
let elHRRest = document.getElementById("resting-heart");
oHeartRate.onreading = function() {
  let iHeartRate = oHeartRate.heartRate;
  elHeart.text = iHeartRate;
  elHeart.style.fill = util.heartRateColour(iHeartRate);
  
  let iHRFontSize = Math.min(Math.round(iHeartRate/180*80), 80)
  elHeart.style.fontSize = iHRFontSize;
  elHRRest.text = '('+user.restingHeartRate+')';
  
  let iHRwidth = elHeart.getBBox().width;
  elHRRest.x = iHRwidth+10;
  
  let iHRRestFontSize = iHRFontSize - iHeartRate/5;
  elHRRest.style.fontSize = iHRRestFontSize;
  elHRRest.style.fill = "fb-mint";
  
  if (iHRRestFontSize <=10)
  {
    elHRRest.style.display = "none";
  }
  else
  {
    elHRRest.style.display = "inline";
  }
}
oHeartRate.start();

function updateSteps()
{
  
  let iSteps = (today.local.steps || 0);
  let iStepGoal = (goals.steps || 0);
  let iStepPercent = Math.floor(iSteps/iStepGoal*100);
  
  let elSteps = document.getElementById("stepPercent");
  elSteps.text = iStepPercent + '%';
  
  let dtDate = new Date();
  let iHours = dtDate.getHours();
  let iDayPercent = Math.floor(iHours/24*100);

  
  if (iStepPercent > iDayPercent)
  {
    elSteps.style.fill = "fb-mint";
  }
  else
  {
    let iPercentDiff = iDayPercent - iStepPercent;
    if (iPercentDiff < 10)
    {
      elSteps.style.fill = "fb-yellow";
    }
    else if (iPercentDiff < 20)
    {
      elSteps.style.fill = "fb-orange";
    }
    else
    {
      elSteps.style.fill = "fb-red";
    }
  }
}

function updateBattery()
{
  let elBattery = document.getElementById("battery");
  if (battery.chargeLevel > 50)
  {
    elBattery.style.display = "none";
  }
  else
  {
    elBattery.text = Math.floor(battery.chargeLevel) + '%';
    elBattery.style.display = "inline";
  }
}