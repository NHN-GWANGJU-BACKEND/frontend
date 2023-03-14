const dateList1 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 윤년 x
const dateList2 = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 윤년 o

const today = new Date();

let currentYear = today.getFullYear();
let currentMonth = today.getMonth() + 1;
let dayPeriod = dateList1[currentMonth - 1];    // 현재 년도,월 default값 설정

let prev = document.getElementById("previous");
let next = document.getElementById("next");

prev.addEventListener('click', prevClick);
next.addEventListener('click', nextClick);

google.charts.load('current', {
    packages: ['corechart', 'line']
});


function YMD(day) {
    if (currentMonth < 10 && currentMonth[0] !== '0') {
        currentMonth = '0' + currentMonth;
    }
    return currentYear + "" + currentMonth + "" + day;
}

function isLeapYear() {
    if ((currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0)) {
        dayPeriod = dateList2[currentMonth - 1];
    } else {
        dayPeriod = dateList1[currentMonth - 1]
    }
}

function prevClick() {
    if (currentMonth === "01") {
        currentYear -= 1;
        currentMonth = 12;
    } else {
        currentMonth -= 1;
    }

    isLeapYear();
    monthContainer();
    getData();
}

function nextClick() {
    if (currentMonth === 12) {
        currentYear += 1;
        currentMonth = 1;
    } else {
        currentMonth -= 1;
        currentMonth += 2;
    }

    isLeapYear();
    monthContainer();
    getData();
}


function monthContainer() {
    let present = document.getElementById("present");
    present.innerHTML = currentYear + "년" + currentMonth + "월";

    if (currentYear === today.getFullYear() &&currentMonth === today.getMonth() + 1) {
        next.style.display = "none";
    } else {
        next.style.display = "flex";
    }
}

let dayPerInfect;

function getData() {
    const promise = new Promise((resolve, reject) => {
        dayPerInfect = [];

        let startCreateDt = YMD("01");
        let endCreateDt = YMD(dayPeriod)

        const xhr = new XMLHttpRequest();
        let serviceKey = "hHLAjVcJYvlI0p8PWtd2NXUS9C7hjAlvYkvla2iIBsQ6LIISjWbOI961vvPlTA5S5nkfOe1tbODRfWhgEs3F6Q%3D%3D";

        let url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson';

        let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + serviceKey;
        queryParams += '&' + encodeURIComponent('pageNo') + '=1';
        queryParams += '&' + encodeURIComponent('numOfRows') + '=10';
        queryParams += '&' + encodeURIComponent('startCreateDt') + `=${startCreateDt}`;
        queryParams += '&' + encodeURIComponent('endCreateDt') + `=${endCreateDt}`;

        xhr.open("GET", url + queryParams);

        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                console.log('Status: ' + this.status);

                let parser = new DOMParser();
                let xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                let items = xmlDoc.getElementsByTagName("item");

                let itemList = [];
                for (let i = 0; i < items.length; i++) {
                    let decideCnt = items[i].getElementsByTagName('decideCnt')[0].innerHTML;
                    let deathDt = items[i].getElementsByTagName('deathCnt')[0].innerHTML;
                    let createDt = items[i].getElementsByTagName('createDt')[0].innerHTML;
                    let updateDt = items[i].getElementsByTagName("updateDt");

                    let chartX = items[i].getElementsByTagName('stateDt')[0].innerHTML;

                    if (!updateDt[0]) {
                        updateDt = " ";
                    } else {
                        updateDt = items[i].getElementsByTagName("updateDt")[0].innerHTML;
                    }
                    let item = {
                        createDt,
                        decideCnt,
                        deathDt,
                        updateDt
                    }

                    let intDecideCnt = parseInt(decideCnt);
                    let intDeathCnt = parseInt(deathDt);

                    let chartItem = {
                        chartX,
                        intDecideCnt,
                        intDeathCnt
                    }

                    dayPerInfect.push(chartItem);
                    itemList.push(item);
                }

                itemList.reverse();
                dayPerInfect.reverse();
                paintTable(itemList, itemList.length);
            }
        }
        xhr.send('');

    })
}

function paintTable(itemList, length) {
    let tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = null;

    for (let i = 0; i < length; i++) {
        let divInner =
            `<div class = "tableContent">
        <div class = "reference">${itemList[i].createDt}</div>
        <div class = "confirm">${itemList[i].decideCnt}</div>
        <div class = "dead">${itemList[i].deathDt}</div>
        <div class = "update">${itemList[i].updateDt}</div>    
        </div>`

        let div = document.createElement('div');
        div.innerHTML = divInner;

        tableBody.appendChild(div);
    }

    drawBackgroundColor();
}

function drawBackgroundColor() {
    let data = new google.visualization.DataTable();
    data.addColumn('string', 'Day');
    data.addColumn('number', 'decideCnt');
    data.addColumn('number','deathCnt');


    let dataList = []
    dayPerInfect.forEach((item)=>{
        dataList.push(Array(item.chartX,item.intDecideCnt,item.intDeathCnt));
    })
    data.addRows(dataList);

    const options = {
        hAxis: {
            title: 'Day'
        },
        vAxis: {
            title: 'person'
        },
        series: {
            1: {curveType: 'function'}
        },
        title : 'month per decideCnt',
        height:400,
        width:'100%',
        pointSize : 5,
    };

    const chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data,options);
}


function main() {
    isLeapYear();
    monthContainer();
    getData();
}


main();