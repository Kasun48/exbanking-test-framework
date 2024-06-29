module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest.setup.js'],
    reporters: [
      "default",
      ["jest-html-reporter", {
        "pageTitle": "Test Report",
        "outputPath": "./reports/test-report.html"
      }]
    ]
  };
  