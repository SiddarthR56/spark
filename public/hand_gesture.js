/* Copyright (C) 2022 Kraft, Royapally, Sarthi, Ramaswamy, Maduru, Harde- All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the MIT license that can be found in the LICENSE file or
 * at https://opensource.org/licenses/MIT.
 * You should have received a copy of the MIT license with
 * this file. If not, please write to: develop.nak@gmail.com, or visit https://github.com/SiddarthR56/spark/blob/main/README.md.
 */

/* eslint-disable no-unused-vars */
var start_tracking = false;
var gesturesEnabled = true;
var x1 = 0;
var x2 = 0;

const Gesture = Object.freeze({
  RightSwipe: 1,
  LeftSwipe: 2,
  All5Fingers: 3,
  ThumbsDown: 4,
  ThumbsUp: 5,
  NoDetection: 6,
});

function onResults(results) {
  if (results.multiHandLandmarks.length != 0) {
    var [lsit, box] = findhandpos(results.multiHandLandmarks[0]);
  } else {
    lsit = [];
    if (start_tracking == true) {
      //Stop Tracking
      start_tracking = false;
      if (gesturesEnabled == true) {
        if (x1[0] > x2[0]) {
          //Gesture 1 'right swipe';
          return Gesture.RightSwipe;
        } else {
          //Gesture 2 'left swipe'
          return Gesture.LeftSwipe;
        }
      }
    }
  }

  if (lsit.length != 0) {
    var fings = detect_fingersup(lsit);

    // console.log(fings);

    if (fings[1] == true && fings[3] == false && fings[4] == false) {
      if (start_tracking == false) {
        //start tracking
        start_tracking = true;
        x1 = lsit[8].slice(1, 2);
        //console.log(x1)
      } else {
        x2 = lsit[8].slice(1, 2);
      }
    } else {
      start_tracking = false;

      if (fings[0] == true && fings[1] == true && fings[2] == true && fings[3] == true && fings[4] == true) {
        //Gesture 3 'all five fingers';
        return Gesture.All5Fingers;
      } else if (fings[0] == true && fings[1] == false && fings[2] == false && fings[3] == false && fings[4] == false) {
        var y1 = lsit[4].slice(2, 3);
        var y2 = lsit[2].slice(2, 3);
        if (gesturesEnabled == true) {
          if (y1[0] > y2[0]) {
            //Gesture 4 'Thumbs Down';
            return Gesture.ThumbsDown;
          } else {
            //Gesture 5 'Thumbs Up';
            return Gesture.ThumbsUp;
          }
        }
      }
    }
  }

  return Gesture.NoDetection;
}

function findhandpos(landmarks) {
  var xlist = [];
  var ylist = [];
  var lmlist = [];
  var bbox = [];
  for (const [index, element] of landmarks.entries()) {
    var [h, w, c] = [900, 1600, 3];
    var cx = parseInt(element.x * w);
    var cy = parseInt(element.y * h);
    xlist.push(cx);
    ylist.push(cy);
    lmlist.push([index, cx, cy]);
  }
  var xmin = Math.min(xlist);
  var xmax = Math.max(xlist);
  var ymin = Math.min(ylist);
  var ymax = Math.max(ylist);
  bbox = [xmin, ymin, xmax, xmin];

  return [lmlist, bbox];
}

function detect_fingersup(lmlist) {
  var fingers = [];
  var ids = [4, 8, 12, 16, 20];
  if (lmlist[ids[0]][1] < lmlist[ids[0] - 2][1]) {
    fingers.push(1);
  } else {
    fingers.push(0);
  }
  for (let i = 1; i < 5; i++) {
    if (lmlist[ids[i]][2] < lmlist[ids[i] - 2][2]) {
      fingers.push(1);
    } else {
      fingers.push(0);
    }
  }
  return fingers;
}

try {
  module.exports = { onResults, Gesture };
} catch (error) {
  //pass
}
