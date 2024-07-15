const path = require("path");
const { exec } = require("child_process");

// Ścieżka do pliku dist/index.js
const scriptPath = path.resolve(__dirname, "dist/index.js");

// Uruchomienie skryptu za pomocą node
exec(`node ${scriptPath}`, (error, stdout, stderr) => {
  const date = new Date().toLocaleString("pl-PL");
  if (error) {
    console.error(`${date} | Błąd uruchomienia skryptu: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`${date} | Błąd w skrypcie: ${stderr}`);
    return;
  }
  console.log(`${date} | Wynik: ${stdout}`);
});
