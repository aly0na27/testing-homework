module.exports = {
    sets: {
        desktop: {
            files: "test/testplane",
        },
    },

    browsers: {
        chrome: {
            automationProtocol: "devtools",
            headless: false,
            desiredCapabilities: {
                browserName: "chrome",
            },
            windowSize: "800x1000"
        },
    },

    plugins: {
        "html-reporter/testplane": {
            enabled: true,
        },
    },
};
