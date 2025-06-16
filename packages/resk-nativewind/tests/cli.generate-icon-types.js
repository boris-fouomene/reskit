const { execa } = require('execa');

(async () => {
    try {
        const { stdout } = await execa('node', ['bin/index.js', 'generate-icon-types', 'material,fa6,ionic,antd,feather,foundation,octicons']);
        console.log('✅', stdout);
    } catch (error) {
        console.error('❌ CLI test failed.', error);
        process.exit(1);
    }
})();
