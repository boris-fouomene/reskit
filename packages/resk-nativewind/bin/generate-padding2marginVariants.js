const paddingClasses = {
    none: 'p-0',
    px: 'p-px',
    1: 'p-1',       // 4px
    2: 'p-2',       // 8px
    3: 'p-3',		// 12px
    4: 'p-4',       // 16px
    5: 'p-5',       // 24px
    6: 'p-6',
    8: 'p-8',
    10: 'p-10',
    12: 'p-12',
    16: 'p-16',
    20: 'p-20',
    24: 'p-24',
    "auto": "p-auto",
    "5px": "p-[5px]",
    "10px": "p-[10px]",
    "15px": "p-[15px]",
    "20px": "p-[20px]",
    "25px": "p-[25px]",
    "30px": "p-[30px]",
    "35px": "p-[35px]",
    "40px": "p-[40px]",
    "45px": "p-[45px]",
    "50px": "p-[50px]",
    "55px": "p-[55px]",
    "60px": "p-[60px]",
    "65px": "p-[65px]",
    "70px": "p-[70px]",
    "75px": "p-[75px]",
    "80px": "p-[80px]",
    "85px": "p-[85px]",
    "90px": "p-[90px]",
    "95px": "p-[95px]",
    "100px": "p-[100px]",
    "105px": "p-[105px]",
    "110px": "p-[110px]",
    "115px": "p-[115px]",
    "120px": "p-[120px]",
    "125px": "p-[125px]",
    "130px": "p-[130px]",
    "135px": "p-[135px]",
    "140px": "p-[140px]",
    "145px": "p-[145px]",
    "150px": "p-[150px]",
    "155px": "p-[155px]",
    "160px": "p-[160px]",
    "165px": "p-[165px]",
    "170px": "p-[170px]",
    "175px": "p-[175px]",
    "180px": "p-[180px]",
    "185px": "p-[185px]",
    "190px": "p-[190px]",
    "195px": "p-[195px]",
    "200px": "p-[200px]",
}

const padding2marginClasses = {
    padding: paddingClasses,
    paddingX: Object.fromEntries(Object.entries(paddingClasses).map(([key, value]) => [key, value.replace("p-", "px-")])),
    paddingY: Object.fromEntries(Object.entries(paddingClasses).map(([key, value]) => [key, value.replace("p-", "py-")])),
    paddingLeft: Object.fromEntries(Object.entries(paddingClasses).map(([key, value]) => [key, value.replace("p-", "pl-")])),
    paddingRight: Object.fromEntries(Object.entries(paddingClasses).map(([key, value]) => [key, value.replace("p-", "pr-")])),
    paddingTop: Object.fromEntries(Object.entries(paddingClasses).map(([key, value]) => [key, value.replace("p-", "pt-")])),
    paddingBottom: Object.fromEntries(Object.entries(paddingClasses).map(([key, value]) => [key, value.replace("p-", "pb-")])),
    marginX: Object.fromEntries(Object.entries(paddingClasses).map(([key, value]) => [key, value.replace("p-", "px-").replace("px-", "mx-")])),
    marginY: Object.fromEntries(Object.entries(paddingClasses).map(([key, value]) => [key, value.replace("p-", "py-").replace("py-", "my-")])),
    marginLeft: Object.fromEntries(Object.entries(paddingClasses).map(([key, value]) => [key, value.replace("p-", "pl-").replace("pl-", "ml-")])),  
    marginRight: Object.fromEntries(Object.entries(paddingClasses).map(([key, value]) =>[key, value.replace("p-", "pl-").replace("pl-", "ml-")])),
    marginTop: Object.fromEntries(Object.entries(paddingClasses).map(([key, value]) => [key, value.replace("p-", "pt-").replace("pt-", "mt-")])),
    marginBottom: Object.fromEntries(Object.entries(paddingClasses).map(([key, value]) => [key, value.replace("p-", "pb-").replace("pb-", "mb-")])),
}

const fs = require('fs');
const path = require('path');
const outputDir = path.resolve(__dirname, '../src/variants/variantsFactory');
const outPath = path.join(outputDir,'padding2margin.ts')

if(fs.existsSync(outputDir)) {
    fs.writeFileSync(outPath, `export const padding2marginClasses = ${JSON.stringify(padding2marginClasses, null, 4)};`, 'utf8');
    console.log(`padding2margin.ts generated successfully at ${outPath}`);
}
