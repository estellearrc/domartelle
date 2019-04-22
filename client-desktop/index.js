function display_data(type, room, id, value) {
  //Affiche les donnees unitaires
  if (type === "temperature") {
    console.log(
      "The temperature in the " + room + " is " + value + " Celsius degrees"
    );
  }
  if (type === "luminosity") {
    console.log("The luminosity in the " + room + " is " + value + " %");
  }
  if (type === "motion") {
    if (value === 1) {
      console.log("Someone is in the " + room + "...");
    } else {
      console.log("The " + room + " is empty");
    }
  }
  if (type === "humidity") {
    console.log("The humidity rate in the " + room + " is " + value + " %");
  }
  if (type === "led") {
    if (value === 1) {
      console.log("The light in the " + room + " is on");
    } else {
      console.log("The light in the " + room + " is off");
    }
  }
  if (type === "servo") {
    if (value === 0) {
      console.log("The door or the window in the " + room + " is closed");
    } else {
      console.log("The door or the window in the " + room + " is open");
    }
  } else {
    console.log("Unknown data type");
  }
}

function display_data_n_days(type, n) {
  //Affiche la tendance des donnees du type demande sur n jours
  data = read(type, n);
  var myContext = document.getElementById("myChart");
  var myChartConfig = {
    type: "line",
    data: {
      datasets: [
        {
          label: "Temperature",
          data: data,
          backgroundColor: ["green"]
        }
      ]
    }
  };
  new Chart(myContext, myChartConfig);
}

function read(type, n) {
  const numberOfSeconds = n * 24 * 3600;
  var dataset = [];
  const csv = require("csv-parser");
  const fs = require("fs");
  const path = "./logs/" + type + "_log.csv";

  fs.createReadStream(path)
    .pipe(csv())
    .on("data", row => {
      date = Number(row.timestamp);
      if (Date.now() - numberOfSeconds < date) {
        dataset.push(row);
      }
    })
    .on("end", () => {
      console.log("CSV file successfully processed");
    });
  return dataset;
}

function save_data(type, value) {
  const path = "./logs/" + type + "_log.csv";
  //Sauvegarde les donnees dans un fichier csv
  const createCsvWriter = require("csv-writer").createObjectCsvWriter({
    append: true
  });
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

module.exports = { display_data: display_data };
module.exports = { display_data_n_days: display_data_n_days };
