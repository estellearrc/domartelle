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
  var sec = a.getSeconds();

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
      time = date + " " + month + " " + hour + ":" + min + ":" + sec;
    } else {
      time = hour + ":" + min + ":" + sec;
    }
  }
  return time;
}

function read(type, n) {
  const numberOfSeconds = n * 24 * 3600;
  var datasets = [];
  var rooms = [];
  var moments = [];
  var currentData = 0;
  //var d3 = require("d3");
  const path = "./logs/" + type + "_log.csv";
  return d3.csv(path).then(function(data) {
    data.forEach(row => {
      currentData = row.value;
      date = Number(row.timestamp);
      room = row.room;
      alreadyExistRoom = rooms.find(r => r === room);

      if (!alreadyExistRoom) {
        //si la pièce n'a pas encore été rencontrée dans les données
        rooms.push(room);
        options = get_chart_options(type, room);
        datasets.push({
          label: options.label,
          steppedLine: options.steppedLine,
          data: [],
          backgroundColor: options.backgroundColor,
          borderColor: options.borderColor
        });
      }

      if (Math.floor(Date.now() / 1000) - numberOfSeconds <= date) {
        rightDataset = datasets.find(d => d.label === room);
        rightDataset.data.push({ x: displayTime(date), y: Number(row.value) });
        moments.push(displayTime(date));
      }
    });
    tuple = [datasets, moments, currentData];
    display_data_n_days(tuple, type);
  });
}

function display_data_n_days(tuple, type) {
  //Affiche la tendance des donnees du type demande sur n jours
  datasets = tuple[0];
  moments = tuple[1];
  currentData = tuple[2];
  options = get_chart_options(type, room);
  var myContext = document.getElementById(options.idChart);
  var myChartConfig = {
    type: options.chartType,
    data: {
      labels: moments,
      datasets: datasets
    }
  };
  new Chart(myContext, myChartConfig);
  if (type === "motion") {
    if (currentData === "1") {
      currentData = "true";
    } else {
      currentData = "false";
    }
  }
  document.getElementById(options.idCurrentData).innerHTML =
    options.beginHeader + currentData + options.endHeader;
}

function get_chart_options(type, room) {
  if (type === "temperature") {
    options = {
      idChart: type,
      idCurrentData: "currentTemp",
      steppedLine: false,
      chartType: "line",
      backgroundColor: suffleColor(0.1), //"rgba(0, 0, 255, 0.2)",
      borderColor: suffleColor(1), //"rgba(0, 0, 255, 1)",
      label: room,
      beginHeader: "Temperature: ",
      endHeader: " °C"
    };
    return options;
  } else {
    if (type === "luminosity") {
      options = {
        idChart: type,
        idCurrentData: "currentLum",
        steppedLine: false,
        chartType: "line",
        backgroundColor: suffleColor(0.1), //"rgba(127, 191, 63, 0.2)",
        borderColor: suffleColor(1), //"rgba(127, 191, 63, 1)",
        label: room,
        beginHeader: "Luminosity: ",
        endHeader: " lux"
      };
      return options;
    } else {
      if (type === "humidity") {
        options = {
          idChart: type,
          idCurrentData: "currentHum",
          steppedLine: false,
          chartType: "line",
          backgroundColor: suffleColor(0.1), //"rgba(127, 63, 191, 0.2)",
          borderColor: suffleColor(1), //"rgba(127, 63, 191, 1)",
          label: room,
          beginHeader: "Humidity: ",
          endHeader: " %"
        };
        return options;
      } else {
        options = {
          idChart: type,
          idCurrentData: "currentMo",
          steppedLine: true,
          chartType: "line",
          backgroundColor: suffleColor(0.1), //"rgba(255, 215, 0, 0.2)",
          borderColor: suffleColor(1), //"rgba(255, 215, 0, 1)",
          label: room,
          beginHeader: "Motion: ",
          endHeader: ""
        };
        return options;
      }
    }
  }
}

function submitInput(id, type) {
  document.getElementById(id).addEventListener("input", e => {
    const nbDays = e.target.value;
    if (nbDays > 0) {
      read(type, nbDays);
    }
  });
}

function suffleColor(a) {
  r = getRandomInt(255);
  g = getRandomInt(255);
  b = getRandomInt(255);
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
