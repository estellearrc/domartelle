# domartelle

#----------------------------------------------------------
Socket IO Client

npm i --save socket.io-client

#-----------------------------------------------------------
Library Adafruit_DHT

git clone https://github.com/adafruit/Adafruit_Python_DHT.git
cd Adafruit_Python_DHT
sudo apt-get update
sudo apt-get install build-essential python-dev python-openssl
sudo python setup.py install

#-----------------------------------------------------------
Library Chart.js

npm install chart.js --save

Stand-Alone Build
Files:

- dist/Chart.js
- dist/Chart.min.js

The stand-alone build includes Chart.js as well as the color parsing library. If this version is used, you are required to include Moment.js before Chart.js for the functionality of the time axis.

Bundled Build
Files:

- dist/Chart.bundle.js
- dist/Chart.bundle.min.js

The bundled build includes Moment.js in a single file. You should use this version if you require time axes and want to include a single file. You should not use this build if your application already included Moment.js. Otherwise, Moment.js will be included twice which results in increasing page load time and possible version compatibility issues. The Moment.js version in the bundled build is private to Chart.js so if you want to use Moment.js yourself, it's better to use Chart.js (non bundled) and import Moment.js manually.

#--------------------------------------------------------------------
Local Development
Browsers enforce strict security permissions to prevent you from reading files out of the local file system. To develop locally, you must run a local web server rather than using file://…. Node’s http-server is recommended. To install:

npm install -g http-server
To run:

http-server "&"

This will start the server on http://localhost:8080 from the current working directory.

Liste déroulante pour choisir la pièce
Input numérique pour avoir le nombre de jours de la plage à afficher
