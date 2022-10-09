
![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/Parth-25m/f14607376f172e8ff8bd099b3c287034/raw/test.json)

<h3 align="center">
  
  <img src="/docs/documentation_photos/project_name.jpg" alt="drawing" width="450"/>    

  <a href="README.md">Overview</a>     |     <a href="INSTALL.md">Installation</a>    |       <a href="project_roadmap.md">Long Term Objectives</a>    
  
  [![Build](https://github.com/SiddarthR56/spark/actions/workflows/build.yml/badge.svg)](https://github.com/SiddarthR56/spark/actions/workflows/build.yml)
[![Lint](https://github.com/SiddarthR56/spark/actions/workflows/lint.yml/badge.svg)](https://github.com/SiddarthR56/spark/actions/workflows/lint.yml)
[![Coverage](https://github.com/SiddarthR56/spark/actions/workflows/test.yml/badge.svg)](https://github.com/SiddarthR56/spark/actions/workflows/test.yml)
[![DOI](https://zenodo.org/badge/540260143.svg)](https://zenodo.org/badge/latestdoi/540260143)
 [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  
</h3>

We have the best hands free solution to your presentation needs! Have you ever presented to an audience and not had the ability to interact and change your meeting controls on the go? Spark is a solution to use gestures to change your volume and screen sharing settings while you present. You no longer need to type a value, instead just give your camera a gesture and keep on presenting. We guarantee it will *spark* new conversations and be the most seemless, hands-free presentation you have had! 

## Capabilities 

- Allows two users to join a video conferencing web application
- Provides capabilities for user to be able to use gestures to manipulate the web conferencing interface.
    - Show a thumbs up __to change volume__ 
    - Swipe left or right to interact with your __screen sharing capabilities__. 

<h1 align="center"> 

<img src="/docs/documentation_photos/swipe.jpeg" alt="drawing" width="300" height="200"/>    
<img src="/docs/documentation_photos/thumbs-up-thumbs-down.gif" width="300" height="200"/>   

<h1>

## Demo Video 

<h1 align="center"> 

![Spark Demo](https://user-images.githubusercontent.com/99683342/194715093-3fbc1bc9-7690-4edb-b8bb-5594ba029bb7.mp4) 

<h1>

## Worked Examples

1. User is directed to the homepage where they are asked to enter a room number they would like to join. If the room does not already exist, a new room will be created for the user, for example, Room 2 is created in our case here.

<img src="/docs/documentation_photos/ChooseRoomNo.png" alt="drawing" width="480" /> 

2. If another person wishes to join the room, they can simply enter the same room number to join the room. Currently, the application supports volume functions for mute/ unmute, video on/off, and screen share functionality. Gesture recognition is enabled by default for the mute/unmute and screen sharing functionalities.

<img src="/docs/documentation_photos/RoomWithOne.png" alt="drawing" width="480" /> 

3. By showing thumbs up/ down action towards the camera, either of the two users will be able to mute/ unmute their microphones. Similarly swipe left/ right action towards the camera will allow the users to share their screens with each other. In addition, users will also be able to disable gesture recognition by clicking the <b>Disable Gestures<b> button.

<img src="/docs/documentation_photos/MeetingWithTwo.png" alt="drawing" width="480" /> 

<img src="/docs/documentation_photos/ScreenSharing.png" alt="drawing" width="480" /> 

## Use 

Setup and installation instructions can be found in the [user-friendly install guide](INSTALL.md)

## Testing 

Run ```TODO``` in the command line to run the tests under the test folder.

Test results

### Code Coverage 

TODO

## Directory Structure 

```
.
|   .eslintrc.json
|   .gitignore
|   CITATION.cff
|   CODE_OF_CONDUCT.md
|   CONTRIBUTING.md
|   LICENSE
|   INSTALL.md
|   README.md
|   package.json
|   package-lock.json
|   server.js 
|   client.js
|   webrtcpage.html
|   
+---.github
|   \---workflows
|           build.yml
|           test.yml
|           lint.yml
|           codeql-analysis.yml
|   \---ISSUE_TEMPLATE
|           bug_report.md
|           feature_request.md
|      
+---static
|   \---css
|       | style.css
|      
+---docs
|   |   filetree.txt
|   |   project_roadmap.md
|   |   self_evaluation.md
|   |   troubleshooting_guide.md
|   \---documentation_photos
|           *lots of photos listed not shown here*
|   
+---out 
|   |   index.html
|   \---fonts
|   \---scripts 
|   \---styles
|                    
\---test
    |   test.js
```

## Contributing

Are you interested in contributing to this project? Visit [our contribution](CONTRIBUTING.md) documentation. 
  
Need some ideas on what to contribute? Visit our [project roadmap](https://github.com/SiddarthR56/spark/blob/main/docs/project_roadmap.md) to get some ideas or jump on over to our [development project board](https://github.com/users/SiddarthR56/projects/1) for specific issues we are tracking. 

This project is made possible by the incredible donation of time from NC State Project Contributors and the advice/support of CSC 510 teaching staff. NC State University has made the resources for this project possible, and will continue to support CSC 510 projects for the forseeable future. 

## Help 

View some common issues users have identified in our [troubleshooting guide](https://github.com/SiddarthR56/spark/blob/main/docs/troubleshooting_guide.md). We list tips and tricks for identifying where the issue may be coming from. Issue reports may be linked to this guide if you identify a bug that is a software limitation. 
  
Need more support? Our primary method for addressing bugs and feature requests should be through submitting an issue ticket in the "Issues" tab. If you need additional support, please reach out to our development email develop.nak@gmail.com and a member of the team will be in contact with you shortly.

