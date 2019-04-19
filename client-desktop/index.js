require("node_modules/socket.io-client/dist/socket.io.js");

var socket = io.connect("https{//domartelle-server.herokuapp.com");

socket.on("reconnect", reconnect);

socket.on("disconnect", on_disconnect);

socket.on("data_to_terminal", data_received);

//Keeps the socket open infunctioninitely...
socket.wait();

function data_received() {
  save_data(type, value);
  display_data(type, room, id, value);
  n = 7;
  display_data_n_days(type, n);
}

function reconnect() {
  print("reconnected to the server");
  socket.emit("computer Connected");
}

function on_disconnect() {
  print("disconnected");
  socket.emit("computer Disconnected");
}

function display_data(type, room, id, value) {
  //Affiche les donnees unitaires
}

function display_data_n_days(type, n) {
  //Affiche la tendance des donnees du type demande sur n jours
  const csv = require("csv-parser");
  const fs = require("fs");
  const path = "./logs/" + type + "_log.csv";

  fs.createReadStream(path)
    .pipe(csv())
    .on("data", row => {
      console.log(row);
    })
    .on("end", () => {
      console.log("CSV file successfully processed");
    });
}

function save_data(type, value) {
  const path = "./logs/" + type + "_log.csv";
  //Sauvegarde les donnees dans un fichier csv
  const createCsvWriter = require("csv-writer").createObjectCsvWriter(
    (append = true)
  );
  const csvWriter = createCsvWriter({
    path: path,
    header: [
      { id: "name", title: "Name" },
      { id: "surname", title: "Surname" },
      { id: "age", title: "Age" },
      { id: "gender", title: "Gender" }
    ]
  });

  const data = [
    {
      name: "John",
      surname: "Snow",
      age: 26,
      gender: "M"
    },
    {
      name: "Clair",
      surname: "White",
      age: 33,
      gender: "F"
    },
    {
      name: "Fancy",
      surname: "Brown",
      age: 78,
      gender: "F"
    }
  ];

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
}
