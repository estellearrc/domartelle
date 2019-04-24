function displayTime(timeMessage) {
  var time = Math.floor(Date.now() / 1000);
  var a = new Date(timeMessage * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();

  if (time - timeMessage >= 31536000) {
    time = month + " " + year;
  } else {
    if (time - timeMessage >= 86400) {
      time = date + " " + month + " " + hour + ":" + min;
    } else {
      time = hour + ":" + min;
    }
  }
  return time;
}

function read(type, n) {
  const numberOfSeconds = n * 24 * 3600;
  var dataset = [];
  var moments = [];
  var singleTemp = 0;
  //var d3 = require("d3");
  const path = "./logs/" + type + "_log.csv";
  return d3.csv(path).then(function(data) {
    //Your code
    data.forEach(row => {
      singleTemp = row.temperature;
      date = Number(row.timestamp);
      if (Math.floor(Date.now() / 1000) - numberOfSeconds <= date) {
        console.log("in");
        dataset.push(Number(row.temperature));
        moments.push(displayTime(date));
      }
    });
    tuple = [dataset, moments, singleTemp];
    console.log(tuple);
    display_data_n_days(tuple, type, n);
  });
}

function display_data_n_days(tuple, type, n) {
  //Affiche la tendance des donnees du type demande sur n jours
  data = tuple[0];
  moments = tuple[1];
  singleTemp = tuple[2];
  var myContext = document.getElementById("myChart");
  var myChartConfig = {
    type: "line",
    data: {
      labels: moments,
      datasets: [
        {
          label: "Temperature in °C",
          data: data,
          backgroundColor: "rgba(0, 0, 255, 0.2)",
          borderColor: "rgba(0, 0, 255, 1)"
        }
      ]
    }
  };
  new Chart(myContext, myChartConfig);
  document.getElementById("singleTemp").innerHTML =
    "Temperature: " + singleTemp + " °C";
}
