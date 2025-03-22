const fs = require('fs');
const path = require('path');

function renameToMjs(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(file => {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
            renameToMjs(filePath);
        } else if (file.name.endsWith('.js')) {
            fs.renameSync(filePath, filePath.replace('.js', '.mjs'));
        }
    });
}
renameToMjs('./build/mjs');