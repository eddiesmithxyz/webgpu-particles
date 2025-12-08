
import fs from 'fs'


export const copyFiles = () => {
    fs.copyFile('src/index.html', 'dist/index.html', (err) => {
    if (err) throw err;
    });
}
