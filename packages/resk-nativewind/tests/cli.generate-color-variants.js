const { execa } = require('execa');
(async () => {
    try {
        const { stdout } = await execa('node', ['bin/index.js', 'generate-variants']);
        console.log('✅', stdout);
    } catch (error) {
        console.error('❌ CLI test failed.', error);
        process.exit(1);
    }
})();
