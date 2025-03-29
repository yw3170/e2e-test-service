const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Cypressが自動で読み取るテストファイルの場所と形式を指定
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: false,

    // 任意でベースURLを指定（ない場合は cy.visit() にフルURL書けばOK）
    // baseUrl: "http://localhost:3000",

    setupNodeEvents(on, config) {
      // 必要であればイベントハンドラを書く
    },
  },
});

