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
  
  updateHorizontalBar('steps');
  updateVerticalBar('elevationGain');
  updateVerticalBar('activeMinutes');
  updateBattery();
}

clock.ontick = () => updateClock();

let oHeartRate = new HeartRateSensor();
let elHeart = document.getElementById("heart");
let elHRRest = document.getElementById("resting-heart");
oHeartRate.onreading = function() {
  let iHeartRate = oHeartRate.heartRate;
  let iHRFontSize = Math.min(Math.round(iHeartRate/190*80), 80)
  elHeart.text = iHeartRate;
  elHeart.style.fill = util.heartRateColour(iHeartRate);
  elHeart.style.fontSize = iHRFontSize;

  elHRRest.text = '('+user.restingHeartRate+')';

  elHRRest.y = elHeart.getBBox().y + elHRRest.getBBox().height+5;
  
  let iHRRestFontSize = iHRFontSize - (iHeartRate-user.restingHeartRate)/2;
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

function updateVerticalBar(sTodayStat)
{
  let iStat = (today.local[sTodayStat] || 0);
  let iGoal = (goals[sTodayStat] || 0);
  let iPercent = Math.floor(iStat/iGoal*100);
  
  var el = document.getElementById(sTodayStat);
  var elBG = document.getElementById("background");
  var iScreenHeight = elBG.getBBox().height;
  var iBarHeight = Math.floor(iPercent * (iScreenHeight/100));
  el.height = iBarHeight;
  el.y = iScreenHeight-iBarHeight;
  
  colourStat(el, iPercent);
}

function updateHorizontalBar(sTodayStat)
{
  let iStat = (today.local[sTodayStat] || 0);
  let iGoal = (goals[sTodayStat] || 0);
  let iPercent = Math.floor(iStat/iGoal*100);
  
  var el = document.getElementById(sTodayStat);
  var elBG = document.getElementById("background");
  var iScreenWidth = elBG.getBBox().width;
  var iBarWidth = Math.floor(iPercent * (iScreenWidth/100));
  el.width = iBarWidth;
  
  colourStat(el, iPercent);
}

function colourStat(el, iPercentage)
{
  let dtDate = new Date();
  let iHours = dtDate.getHours();
  let iDayPercent = Math.floor(iHours/24*100);

  if (iPercentage > iDayPercent)
  {
    el.style.fill = "fb-cyan";
  }
  else
  {
    let iPercentDiff = iDayPercent - iPercentage;
    if (iPercentDiff < 0)
    {
      el.style.fill = "fb-mint";
    }
    else if (iPercentDiff < 10)
    {
      el.style.fill = "fb-yellow";
    }
    else if (iPercentDiff < 20)
    {
      el.style.fill = "fb-orange";
    }
    else
    {
      el.style.fill = "fb-red";
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