# Pothole-Detection-Website
This is the website interface for ODOT employees to access data from potholes that were detected by the pothole detection iOS app (github.com/cade-conklin/Pothole-Detection)

## Installation
I included the node_modules in my commit so you shouldn't need to install anything, simply clone the repository to your machine. If you have issues with dependencies, delete the node_modules folder and run: 
``` bash
npm install
```

## Running
I am currently just running this on localhost. You can run it on your own computer by navigating to the directory and running:
``` bash
node server.js
```
Then visit localhost:3000/active_potholes. If you have issues with the port you can change the port number in Pothole-Detection-Website/server.js
