var buildings_info;
var request = new XMLHttpRequest();
request.open('GET', 'main.json');
request.send();
request.onload = function() {
    buildings_info = request.response;
    buildings_info = JSON.parse(buildings_info);
};

setTimeout(function () {ymaps.ready(init);}, 500);
function init() {
    var myMap = new ymaps.Map('map', {
        center: [59.790793, 30.121823],
        zoom: 11,
        controls: []
    },
    // {
    //     restrictMapArea: [
    //         [59.682345, 29.911108],
    //         [59.905611, 30.342852],
    //     ]
    // }
    );

    var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        '<h2 class=ballon_header>{{ properties.balloonHead|raw }}</h2>' +
        '<div class=ballon_body>{{ properties.balloonContent|raw }}</div>'
    );

    clusterer = new ymaps.Clusterer({
        clusterIconLayout: 'default#pieChart',
        clusterIconPieChartRadius: 25,
        clusterIconPieChartCoreRadius: 10,
        clusterIconPieChartStrokeWidth: 3,
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonAccordion',
        clusterBalloonItemContentLayout: customItemContentLayout,
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 300,
        clusterBalloonContentLayoutHeight: 200,
    });
    let count1970 = 0;
    let count1990 = 0;
    let count2010 = 0;
    let count2020 = 0;
    for (var i = 0; i < buildings_info.buildings.length; i++) {
        // for (var i = 0; i < 10; i++) {
        let address = buildings_info.buildings[i].address;
        let year = buildings_info.buildings[i].year;
        let information = buildings_info.buildings[i].serie;
        let presetStyle = 'islands#magentaStretchyIcon';
        let additionalInformation = buildings_info.series[0][information.toString()];
        if (additionalInformation === undefined) {
            additionalInformation = 'Отсутствует'
        }
        ymaps.geocode(address.toString(), {
            results: 1
        }).then(function (res) {
            var geoObjectInstance = res.geoObjects.get(0),
                coords = geoObjectInstance.geometry.getCoordinates();
                if (Number(year) < 1917) {
                    presetStyle = 'islands#lightGrayStretchyIcon'; 
                }
            else if (Number(year) < 1970 && Number(year) >= 1918) {
                presetStyle = 'islands#blueStretchyIcon';
                count1970 = count1970 + 1;
            } else if (Number(year) >= 1970 && Number(year) <= 1990) {
                presetStyle =  'islands#redStretchyIcon';
                count1990 = count1990 + 1;
            } else if (Number(year) >= 1991 && Number(year) <= 2010) {
                presetStyle =  'islands#orangeStretchyIcon';
                count2010 = count2010 + 1;
            } else {
                presetStyle =  'islands#greenStretchyIcon';
                count2020 = count2020 + 1;
            }
            var myPlacemark = new ymaps.Placemark(coords, {
                iconContent: '',
                balloonContentHeader: geoObjectInstance.getAddressLine().toString().replace("Россия, Санкт-Петербург, ", ""),
                balloonContent:  'Серия: ' + information + '<br>Год постройки: ' + year +
                    '<br>Дополнительная ифнормация о серии:<br>' + additionalInformation,
                balloonHead: geoObjectInstance.getAddressLine()
            }, {
                preset: presetStyle
            });


            clusterer.add(myPlacemark);
        })
    }
    myMap.geoObjects.add(clusterer);

    google.charts.load('current', {'packages':['corechart']});

      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {

        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Временной период');
        data.addColumn('number', 'Количество зданий, возведенных');
        data.addRows([
          ['До 1970 года', count1970],
          ['В период с 1970 по 1990', count1990],
          ['В период с 1991 по 2010', count2010],
          ['В период с 2011 по наше время', count2020]
        ]);

        var options = {'title':'Количество жилых зданий в Красносельском районе',
                       'width':400,
                       'height':300};

        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }

      let mask = document.querySelector('.mask');

      window.addEventListener('load', () => {
        mask.classList.add('hide')
        setTimeout(() => {
            mask.remove();
        }, 600)
      });
}