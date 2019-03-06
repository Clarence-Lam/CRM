const city = require('./city.json');
const fs = require('fs');

const data = [];
city.map(item => {
  const children1 = [];
  item.children.map(s => {
    const children2 = [];
    s.children.map(c => {
      children1.push({
        value: c.label,
        label: c.label,
      });
    });
    children1.push({
      value: s.label,
      label: s.label,
      children: children2,
    });
  });
  data.push({
    value: item.label,
    label: item.label,
    children: children1,
  });
});
const str = JSON.stringify(data);
fs.writeFileSync('test1.json', str);
console.log(data);

