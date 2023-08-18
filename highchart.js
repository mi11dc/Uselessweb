function renderChart(moodScores) {
    var chart1 = new Highcharts.Chart({
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45
            },
            renderTo: 'sentimentChart'
        },
        credits:{
            enabled: false
        },
        title: {
            text: 'Sentiment Chart'
        },
        subtitle: {
            text: ''
        },
        plotOptions: {
            pie: {
                innerSize: 100,
                depth: 50
            }
        },
        series: [{
            name: 'Text analysis',
            data: getChartData(moodScores)
        }]
    });
}

function getChartData(moodScores) {
    let arr = [];

    for (var key in moodScores) {
        let arr1 = [];
        arr1.push(key);
        arr1.push(moodScores[key]);

        arr.push(arr1);
    }

    return arr;
}