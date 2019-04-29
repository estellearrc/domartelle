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
      time =
        date +
        " " +
        month +
        " " +
        zeroPadding(hour.toString()) +
        ":" +
        zeroPadding(min.toString()) +
        ":" +
        zeroPadding(sec.toString());
    } else {
      time =
        zeroPadding(hour.toString()) +
        ":" +
        zeroPadding(min.toString()) +
        ":" +
        zeroPadding(sec.toString());
    }
  }
  return time;
}

function displayTodayDate() {
  var time = Date.now();
  var d = new Date(time);
  var year = d.getFullYear();
  var month = zeroPadding((d.getMonth() + 1).toString());
  var date = zeroPadding(d.getDate().toString());
  console.log(year + "-" + month + "-" + date);
  return year + "-" + month + "-" + date;
}

function zeroPadding(str) {
  if (str.length < 2) {
    return "0" + str;
  } else {
    return str;
  }
}

function read(type, beginTimestamp, endTimestamp) {
  //const numberOfSeconds = n * 24 * 3600;
  var datasets = [];
  var rooms = [];
  var moments = [];
  var currentData = 0;
  //var d3 = require("d3");
  const path = "./logs/" + type + "_log.csv";
  d3.csv(path).then(function(data) {
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
      if (beginTimestamp <= date && date <= endTimestamp) {
        //Math.floor(Date.now() / 1000) - numberOfSeconds
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
    [r, g, b] = suffleColor();
    options = {
      idChart: type,
      idCurrentData: "currentTemp",
      steppedLine: false,
      chartType: "line",
      backgroundColor: "rgba(" + r + "," + g + "," + b + ",0.2)", //"rgba(0, 0, 255, 0.2)",
      borderColor: "rgba(" + r + "," + g + "," + b + ",1)", //"rgba(0, 0, 255, 1)",
      label: room,
      beginHeader: "Temperature: ",
      endHeader: " °C"
    };
    return options;
  } else {
    if (type === "luminosity") {
      [r, g, b] = suffleColor();
      options = {
        idChart: type,
        idCurrentData: "currentLum",
        steppedLine: false,
        chartType: "line",
        backgroundColor: "rgba(" + r + "," + g + "," + b + ",0.2)", //"rgba(127, 191, 63, 0.2)",
        borderColor: "rgba(" + r + "," + g + "," + b + ",1)", //"rgba(127, 191, 63, 1)",
        label: room,
        beginHeader: "Luminosity: ",
        endHeader: " lux"
      };
      return options;
    } else {
      if (type === "humidity") {
        [r, g, b] = suffleColor();
        options = {
          idChart: type,
          idCurrentData: "currentHum",
          steppedLine: false,
          chartType: "line",
          backgroundColor: "rgba(" + r + "," + g + "," + b + ",0.2)", //"rgba(127, 63, 191, 0.2)",
          borderColor: "rgba(" + r + "," + g + "," + b + ",1)", //"rgba(127, 63, 191, 1)",
          label: room,
          beginHeader: "Humidity: ",
          endHeader: " %"
        };
        return options;
      } else {
        [r, g, b] = suffleColor();
        options = {
          idChart: type,
          idCurrentData: "currentMo",
          steppedLine: true,
          chartType: "line",
          backgroundColor: "rgba(" + r + "," + g + "," + b + ",0.2)", //"rgba(255, 215, 0, 0.2)",
          borderColor: "rgba(" + r + "," + g + "," + b + ",1)", //"rgba(255, 215, 0, 1)",
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
  var beginDate = new Date(document.getElementById("begin" + id).value);
  if (!beginDate) {
    beginDate = new Date(Date.now());
  }
  var endDate = new Date(document.getElementById("end" + id).value);
  if (!beginDate) {
    beginDate = new Date(Date.now());
  }
  beginTimestamp = Math.floor(beginDate.getTime() / 1000);
  endTimestamp = Math.floor(endDate.getTime() / 1000);
  read(type, beginTimestamp, endTimestamp);
}

function suffleColor() {
  r = getRandomInt(255);
  g = getRandomInt(255);
  b = getRandomInt(255);
  return [r, g, b];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
