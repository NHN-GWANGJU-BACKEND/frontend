const urlAndParams = new URLSearchParams(location.search);
const area = urlAndParams.get("location");

function getDetailData() {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        let serviceKey = "hHLAjVcJYvlI0p8PWtd2NXUS9C7hjAlvYkvla2iIBsQ6LIISjWbOI961vvPlTA5S5nkfOe1tbODRfWhgEs3F6Q%3D%3D";

        let url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson';

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
                    let gubun = items[i].getElementsByTagName('gubun')[0].innerHTML;
                    if(gubun!==area) continue;
                    let defCnt = items[i].getElementsByTagName('defCnt')[0].innerHTML;
                    console.log(defCnt);
                    let deathCnt = items[i].getElementsByTagName('deathCnt')[0].innerHTML;
                    let stdDay = items[i].getElementsByTagName('stdDay')[0].innerHTML;
                    let incDec = items[i].getElementsByTagName("incDec")[0].innerHTML;

                    let item = {
                        defCnt,
                        deathCnt,
                        stdDay,
                        incDec,
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
        <div class = "stdDay">${itemList[i].stdDay}</div>
        <div class = "confirm">${itemList[i].defCnt}</div>
        <div class = "dead">${itemList[i].deathCnt}</div>
        <div class = "incDec">${itemList[i].incDec}</div>    
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