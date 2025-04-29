module.exports = {
  // Lint & Prettify TS and JS files
  "**/*.(ts|tsx|js)": (filenames) => [
    `prettier --write ${filenames.join(" ")}`,
    `eslint --fix ${filenames.join(" ")}`,
    `bash -c 'npm run type-check'`
  ],

  // Prettify only Markdown and JSON files
  "**/*.(md|json)": (filenames) => `prettier --write ${filenames.join(" ")}`
}; 