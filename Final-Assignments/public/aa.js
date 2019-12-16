var nowDay = moment().day().toString()

var nowDayString;

var allWeekDays = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays']

for (var x = 0; x < allWeekDays.length; x++) {
    if (nowDay == x.toString()) {
        nowDayString = allWeekDays[x]
    }
}

var weekdayToggles = $(".btn-secondary")

for (const toggle of weekdayToggles) {
    if (toggle.querySelector("input").id == nowDayString) {
        toggle.classList.add("selected")
    }
    else {
        toggle.classList.remove("active")
    }
}

var nowHour = moment().hour().toString()

console.log(nowDay);
console.log(nowHour);

var slider = $("#appearance1").roundSlider();
let markers;

$("#appearance1").roundSlider({
    sliderType: "range",
    handleSize: "20",
    handleShape: "round",
    showTooltip: true,
    radius: 90,
    value: `${nowHour},${parseInt(nowHour)+4}`,
    min: "0",
    max: "24",
    width: 15,
    startAngle: 89,
    lineCap: "round",
    mouseScrollAction: true,

    drag: function (args) {
        // handle the drag event here
    },
    change: function (args) {
        // handle the change event here
    }
});

var sliderVals = $("#appearance1").roundSlider("option", "value").split(',');




function checkToggle() {
    nowDayString = [];
    for (const toggle of weekdayToggles) {
        console.log(toggle)
        if (toggle.classList.contains("selected")) {
            // console.log("active")
            nowDayString.push(toggle.querySelector("input").id)
        }
    }
    console.log("days of week selected")
    console.log(nowDayString)
}




$(function () {


    $("#appearance1").roundSlider({
        change: function (args) {
            // console.log(vals)
            checkToggle()
            sliderVals = $("#appearance1").roundSlider("option", "value").split(',');
            // console.log(sliderVals)
            getResults(sliderVals, nowDayString)
        }
    });

    weekdayToggles.click(function () {
        // console.log('clicked')
        this.classList.toggle("selected");
        checkToggle()
        sliderVals = $("#appearance1").roundSlider("option", "value").split(',');
        getResults(sliderVals, nowDayString)
    });

});

function getResults(sliderVals, nowDayString) {

    sliderVals = $("#appearance1").roundSlider("option", "value").split(',');

    var parameters = { weekDays: nowDayString, lowerTimeBound: sliderVals[0], upperTimeBound: sliderVals[1] };
    console.log(parameters)

    //call endpoint on the server
    $.get('/aa', parameters, function (data) {

        // console.log(data)

        markers.clearLayers();

        var meetingDivs = document.querySelectorAll('.meeting-div')

        if (meetingDivs.length > 1) {
            meetingDivs.forEach(meeting => {
                // console.log(meeting)
                meeting.parentNode.removeChild(meeting)
            })
        }

        data.forEach(item => {
            console.log(item)

            var popupInfo = `<p class='add-title'>${item.meeting[0].streetaddress}</p>`;

            var ada = "Not Wheelchair Accessible";
            if (item.ada == "true") {
                ada = "Wheelchair Accessible"
            }

            for (const meeting of item.meeting) {

                popupInfo += `<br> <p class='grp-name'>${meeting.groupname}</p> <p>${meeting.weekday} from ${meeting.starttime} to ${meeting.endtime} ${meeting.ampm}</p>`;
                var parentDiv = document.createElement('div')
                parentDiv.className = "meeting-div"

                var meetingInfo = document.createElement('div')
                meetingInfo.className = "meeting-info"
                meetingInfo.setAttribute('addr', `${meeting.streetaddress.toLowerCase().split("new")[0]}`)
                meetingInfo.innerHTML = `<h3>${meeting.groupname}</h3><br><p class='mtg-type'>${meeting.typename} <br> ${meeting.interest}</p><br><p>${meeting.weekday} from ${meeting.starttime} to ${meeting.endtime} ${meeting.ampm}</p><br><p class="address">${meeting.streetaddress.toLowerCase().split("new")[0]}<br></p><p>${meeting.city}, ${meeting.state} ${meeting.zipcode}</p><br><p class='ada'>*${ada}</p>`

                parentDiv.appendChild(meetingInfo)

                meetingInfo.addEventListener('click', function () {
                    var address = this.getAttribute('addr')

                    $.each(map._layers, function (i, item) {
                        if (this._leaflet_id == address) {
                            this.openPopup();
                            console.log(map);
                            map.setView(this._latlng, 14)
                        }
                    });
                })

                var meetingsDiv = document.querySelector(".meetings")
                meetingsDiv.appendChild(parentDiv)
            }

            var mark = L.marker([item.lat, item.long])
            mark._leaflet_id = `${item.meeting[0].streetaddress.toLowerCase().split("new")[0]}`;
            mark.bindPopup(popupInfo).addTo(markers);


        })


    });
}


var map;

function init() {


    map = L.map('map').setView([40.756902, -73.980421], 13);


    var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    });

    CartoDB_Positron.addTo(map);
    markers = L.layerGroup().addTo(map);

    getResults(sliderVals, nowDayString)
}


init()
