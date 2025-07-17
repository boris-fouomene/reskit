const plugin = require("tailwindcss/plugin");

const animationsPlugin = plugin(
    function ({ addUtilities, theme }) {
        const newUtilities = {};
        //addUtilities(newUtilities);
    },
    {
        theme: {
            extend: {
                ...require("./build/animations/tailwind-plugin"),
            },
        },
    }
);

module.exports = animationsPlugin;