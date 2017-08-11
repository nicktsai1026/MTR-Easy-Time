// #main > div > div.col9.last.Tcol12.Mcol12 > div > div.resultWrap > div > table > tbody > tr:nth-child(2) > td:nth-child(3)
// #main > div > div.col9.last.Tcol12.Mcol12 > div > div.resultWrap > div:nth-child(3)
// #main > div > div.col9.last.Tcol12.Mcol12 > div > div.resultWrap > div:nth-child(6)

const axios = require('axios')
const cheerio = require('cheerio');
var times = []
var maps = []
var mapsDirectionsToken = 'AIzaSyBoFN8cy4YjlKB8EF6mccM6Re4DOzzMn04'

var origin = 'Wan Chai Station'
var destination = 'Wong Tai Sin Station'

// axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + origin + 
// '&destination=' + destination + '&mode=transit&key=AIzaSyBoFN8cy4YjlKB8EF6mccM6Re4DOzzMn04')
//     .then((response) => {
//         console.log(response.data.routes[0].legs[0].duration.text)
//         console.log(response.data.routes[0])
//     })
//     .catch((err)=>{
//         console.log(err)
//     })

// axios.get('http://www.mtr.com.hk/en/customer/services/system_map.html')
//     .then((response)=>{
//         let $ = cheerio.load(response.data);
//         $.prototype.logHtml = function () {
//             console.log(this.html());
//         };
//         // $('div.').logHtml();
//         var allLinks = $('.pulldownTableBox a');
//         maps.push(allLinks)
//         for (var i = 0; i < 150; i++){
//             console.log(allLinks[i].attribs.href)
//         }
//     })
//     .catch((err)=>{
//         console.log(err)
//     })

axios.get('http://www.mtr.com.hk/en/customer/services/service_hours_search.php?query_type=search&station=8')
    .then((response) => {
        let $ = cheerio.load(response.data);
        $.prototype.logHtml = function () {
            console.log(this.html());
        };
        $('.resultWrap').logHtml();
        // var count = $('.resultWrap div:nth-child(6) table tr').children().length;
        // console.log(count)
        $('div.resultWrap div:nth-child(3) table tr:nth-child(2)').logHtml();
        $('div.resultWrap div:nth-child(6) table tr:nth-child(2)').logHtml();
        // $('div.resultWrap div:nth-child(6) table tr:nth-child(3)').logHtml();
        // var first = $('tr:nth-child(2) td:nth-child(2)').text();
        // var last = $('tr:nth-child(2) td:nth-child(3)').text();
        // times.push(first)
        // times.push(last)
        // console.log(times)
    })