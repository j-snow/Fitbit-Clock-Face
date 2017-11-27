import { user } from "user-profile";

// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

export function getDay3(index) {
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[index];
}

export function getMonth3(index) {
  let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[index];
}

export function heartRateColour(iHeartRate)
{
  switch(user.heartRateZone(iHeartRate))
   {
     case 'out-of-range':
       return 'fb-white';
     case 'fat-burn':
       return 'fb-yellow';
     case 'cardio':
       return 'fb-orange';
     case 'peak':
       return 'fb-red';
       
     // Not sure what to do with the custom colours yet
     // Just leave as white, yellow, red 
     case 'below-custom':
       return 'fb-white';
     case 'custom':
       return 'fb-yellow';
     case 'above-custom':
       return 'fb-red';
   }
}