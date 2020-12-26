const http=require('http');
const fs=require('fs');
var requests = require('requests');


const homefile=fs.readFileSync('home.html','utf-8');

const repaval=(tempval,orgval)=>{
    let temperature= tempval.replace('{%tempval%}',(orgval.main.temp-273.15).toFixed(2));
    temperature= temperature.replace('{%tempmin%}',(orgval.main.temp_min-273.15).toFixed(2));
    temperature= temperature.replace('{%tempmax%}',(orgval.main.temp_max-273.15).toFixed(2));
    temperature= temperature.replace('{%location%}',orgval.name);
    temperature= temperature.replace('{%country%}',orgval.sys.country);
    temperature= temperature.replace('{%tempstatus%}',orgval.weather[0].main);

    return temperature;
};
const server=http.createServer((req,res)=>{
    if(req.url=='/'){
        requests('http://api.openweathermap.org/data/2.5/weather?q=rajastan&appid=22255e86151da71aca02fab48b1405d2')
        .on('data',  (chunk) => {
            const ObData=JSON.parse(chunk);
            const arData=[ObData];
            const realDt = arData.map((val)=> repaval(homefile,val)).join("");
            res.write(realDt);
        })
        .on('end',  (err)=> {
        if (err) return console.log('connection closed due to errors', err);
            res.end();
});
    }
});

server.listen(8000,'127.0.0.1');

