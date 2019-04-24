function displayTime(timeData) {
  var time = Math.floor(Date.now() / 1000);
  var a = new Date(timeData * 1000);
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

  if (time - timeData >= 31536000) {
    //si c'est plus long qu'un an
    time = month + " " + year;
  } else {
    //si c'est plus long qu'un mois
    if (time - timeData >= 30 * 24 * 3600) {
      time = date + " " + month + " " + year;
    }
    if (time - timeData >= 86400) {
      //si c'est plus long qu'un jour
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
  var currentData = 0;
  //var d3 = require("d3");
  const path = "./logs/" + type + "_log.csv";
  return d3.csv(path).then(function(data) {
    data.forEach(row => {
      currentData = row.value;
      date = Number(row.timestamp);
      if (Math.floor(Date.now() / 1000) - numberOfSeconds <= date) {
        dataset.push(Number(row.value));
        moments.push(displayTime(date));
      }
    });
    tuple = [dataset, moments, currentData];
    console.log(tuple);
    display_data_n_days(tuple, type);
  });
}

function display_data_n_days(tuple, type) {
  //Affiche la tendance des donnees du type demande sur n jours
  data = tuple[0];
  moments = tuple[1];
  currentData = tuple[2];
  options = get_chart_options(type);
  var myContext = document.getElementById(options.idChart);
  var myChartConfig = {
    type: options.chartType,
    data: {
      labels: moments,
      datasets: [
        {
          label: options.label,
          data: data,
          backgroundColor: options.backgroundColor,
          borderColor: options.borderColor
        }
      ]
    }
  };
  new Chart(myContext, myChartConfig);
  document.getElementById(options.idCurrentData).innerHTML =
    options.beginHeader + currentData + options.endHeader;
}

function get_chart_options(type) {
  if (type === "temperature") {
    options = {
      idChart: type,
      idCurrentData: "currentTemp",
      chartType: "line",
      backgroundColor: "rgba(0, 0, 255, 0.2)",
      borderColor: "rgba(0, 0, 255, 1)",
      label: "Temperature in °C",
      beginHeader: "Temperature: ",
      endHeader: " °C"
    };
    return options;
  } else {
    if (type === "luminosity") {
      options = {
        idChart: type,
        idCurrentData: "currentLum",
        chartType: "line",
        backgroundColor: "rgba(127, 191, 63, 0.2)",
        borderColor: "rgba(127, 191, 63, 1)",
        label: "Luminosity in %",
        beginHeader: "Luminosity: ",
        endHeader: " %"
      };
      return options;
    } else {
      if (type === "humidity") {
        options = {
          idChart: type,
          idCurrentData: "currentHum",
          chartType: "line",
          backgroundColor: "rgba(127, 63, 191, 0.2)",
          borderColor: "rgba(127, 63, 191, 1)",
          label: "Humidity in %",
          beginHeader: "Humidity: ",
          endHeader: " %"
        };
        return options;
      } else {
        options = {
          idChart: type,
          idCurrentData: "currentMo",
          chartType: "scatter",
          backgroundColor: "rgba(255, 215, 0, 0.2)",
          borderColor: "rgba(255, 215, 0, 1)",
          label: "Motion",
          beginHeader: "Motion: ",
          endHeader: ""
        };
        return options;
      }
    }
  }
}
