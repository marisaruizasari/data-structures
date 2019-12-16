var data = [
    { sensorDay: 1, sensorHr: 0, sensorVal: 79 },
    { sensorDay: 1, sensorHr: 1, sensorVal: 78 },
    { sensorDay: 1, sensorHr: 2, sensorVal: 80 },
    { sensorDay: 1, sensorHr: 3, sensorVal: 82 },
    { sensorDay: 2, sensorHr: 0, sensorVal: 92 },
    { sensorDay: 2, sensorHr: 1, sensorVal: 68 },
    { sensorDay: 2, sensorHr: 2, sensorVal: 83 },
    { sensorDay: 2, sensorHr: 3, sensorVal: 87 },
]


var allData = [];


[{ 0: 79, 1: 78, 2: 80, 3: 82 }, { 0: 92, 1: 68, 2: 83, 3: 87 }]

for (var i = 0; i < 2; i++) {
    var day = data.filter(x => {
        if (x.sensorDay == i + 1) {
            return x
        }
    })

    allData.push(day)
}

console.log(allData)

var completeData = [];

allData.forEach(day => {
    var dayObj = {};
    day.forEach(hour => {
        dayObj[hour.sensorHr] = hour.sensorVal
    })
    completeData.push(dayObj)
})

console.log(completeData)
