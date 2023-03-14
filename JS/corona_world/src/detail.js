const urlAndParams = new URLSearchParams(location.search);
const area = urlAndParams.get("area");

function getDetailData() {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        let serviceKey = "PWqyhJDQrC7Dyl4bplmmrhbG6%2FX0O%2Fevtgze8XGAWSQmskxek6hk2skJaH%2B987yuibu1Dig%2FkvVskQfszYXmrQ%3D%3D";

        let url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19NatInfStateJson';

        let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + serviceKey;
        queryParams += '&' + encodeURIComponent('pageNo') + '=1';
        queryParams += '&' + encodeURIComponent('numOfRows') + '=10';
        queryParams += '&' + encodeURIComponent('startCreateDt') + `=20220901`;
        queryParams += '&' + encodeURIComponent('endCreateDt') + `=20220930`;

        xhr.open("GET", url + queryParams);

        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                console.log('Status: ' + this.status);

                let parser = new DOMParser();
                let xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                let items = xmlDoc.getElementsByTagName("item");

                let itemList = [];
                for (let i = 0; i < items.length; i++) {
                    let nationNm = items[i].getElementsByTagName('nationNm')[0].innerHTML;
                    if(nationNm!==area) continue;

                    let areaNm = items[i].getElementsByTagName('areaNm')[0].innerHTML;
                    let natDeathCnt = items[i].getElementsByTagName('natDeathCnt')[0].innerHTML;
                    let createDt = items[i].getElementsByTagName('createDt')[0].innerHTML;
                    let natDefCnt = items[i].getElementsByTagName('natDefCnt')[0].innerHTML;

                    let item = {
                        areaNm,
                        natDefCnt,
                        natDeathCnt,
                        createDt,
                    }

                    itemList.push(item);
                }
                itemList.reverse();
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
        <div class = "stdDay">${itemList[i].createDt}</div>
        <div class = "confirm">${itemList[i].natDefCnt}</div>
        <div class = "dead">${itemList[i].natDeathCnt}</div>
        <div class = "areaNm">${itemList[i].areaNm}</div>    
        </div>`

        let div = document.createElement('div');
        div.innerHTML = divInner;

        tableBody.appendChild(div);
    }
}

function setArea(){
    let setArea = document.getElementById("area");
    setArea.innerHTML = area;
}


function main() {
    setArea()
    getDetailData();
}


main();