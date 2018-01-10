const csv = require("fast-csv");
const jsonfile = require('jsonfile');
const d3 = require('d3');

const ndx = require('./../app/scripts/definitions.js').ndx;

let header = null;
csv.fromPath('cube/ndx.csv')
  .on('data', data => {
    if (!header) {
      header = data;
    } else {
      const fact = {};
      for (let i = 0; i < header.length; i++) {
        fact[header[i]] = data[i];
      }

      // Since its a csv file we need to format the data a bit.
      const dateFormat = d3.time.format('%m/%d/%Y');

      fact.dd = dateFormat.parse(fact.date);
      fact.month = d3.time.month(fact.dd); // pre-calculate month for better performance
      fact.close = +fact.close; // coerce to number
      fact.open = +fact.open;
      fact.volume = +fact.volume;

      ndx.add(fact);
    }
  })
  .on('end', () => {
    jsonfile.writeFile('app/cube.json', ndx.cube);
  });



