const flags = require("./flags");
const countries = require("./countries");
const path = require("path");
const fs = require("fs");


toCamelCase = (text)=> {
    text = text.trim();
    return text.charAt(0).toUpperCase() + text.replace(/(_\w)/g, k => k[1].toUpperCase()).substring(1);
}

function convertSvgToReact(svgString) {
    return svgString
      // Remove XML namespaces and doctype (not needed in React)
      .replace(/<\?xml.*?\?>|<!DOCTYPE.*?>/g, '')
      .replace(/\sxmlns(:\w+)?="[^"]*"/g, '')
  
      // Convert inline styles to React-friendly format
      .replace(/style="([^"]+)"/g, (_, styles) => {
        const reactStyle = styles
          .split(';')
          .filter(Boolean)
          .map(s => {
            let [key, value] = s.split(':').map(str => str.trim());
            if (!key || !value) return '';
            key = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()); // Convert to camelCase
            return `${key}: "${value}"`;
          })
          .join(', ');
        return `style={{ ${reactStyle} }}`;
      })
  
      // Convert self-closing tags
      .replace(/<(\w+)([^>]*)>\s*<\/\1>/g, '<$1$2 />')
  
      // Convert property names to camelCase
      .replace(/(\s)([a-z]+-[a-z-]+)/g, (_, space, attr) => {
        const camelCaseAttr = attr.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        return space + camelCaseAttr;
      });
}

const notFound = {};
const result = {};
let foundFlags = "";
for(let i in flags){
    const flag = flags[i];
    let countryFlag = null;
    for(let j in countries){
        const country = countries[j];
        const countryName = String(country.name).toLowerCase().trim();
        const flagName = i.toLowerCase().trim();
        if(countryName.startsWith(flagName)){
            countryFlag = country;
            break;
        }
    }
    const flagName = toCamelCase(i.trim().replace(/\s/g,"_"));
    if(!countryFlag){
        notFound[i] = flag;
    } else {
        /*foundFlags += `\n${countryFlag.code} : function ${flagName}Flag(props){
            return ${convertSvgToReact(flag)};
        },`;*/
        foundFlags += `\n${countryFlag.code} : ${flag},`;
        result[countryFlag.code] = flag;
    }
}

fs.writeFileSync(path.join(__dirname,"parsed-flags.js"),`module.exports = {${foundFlags}};`);
fs.writeFileSync(path.join(__dirname,"parsed-notFound.json"),`module.exports = ${JSON.stringify(notFound,null,2)}`);