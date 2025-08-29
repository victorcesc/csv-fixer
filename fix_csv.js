function fixCorruptedCSV(csvContent) {
  // Remove BOM (Byte Order Mark) from the beginning
  let cleaned = csvContent.replace(/^\uFEFF/, "");

  // Split into lines and filter out empty lines
  const lines = cleaned.split("\n").filter((line) => line.trim());

  if (lines.length === 0) {
    throw new Error("Empty CSV file");
  }

  // Find the header line by looking for a line with multiple quoted fields
  let headerLine = "";
  let dataStartIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Count quoted fields - headers typically have multiple quoted fields
    const quotedFields = (line.match(/"[^"]*"/g) || []).length;

    if (quotedFields >= 3) {
      // Assume header has at least 3 fields
      headerLine = line;
      dataStartIndex = i + 1;
      break;
    }
  }

  // Fix the header line to have proper quotes around each field
  if (headerLine) {
    // Replace double quotes with single quotes
    headerLine = headerLine.replace(/""/g, '"');

    // Fix the first field to have proper quotes
    // Convert "TB_ID,"CEP_INICIAL" to "TB_ID","CEP_INICIAL"
    const firstFieldMatch = headerLine.match(/^"([^"]*),(.*)/);
    if (firstFieldMatch) {
      const fieldName = firstFieldMatch[1];
      const restOfLine = firstFieldMatch[2];
      headerLine = `"${fieldName}","${restOfLine}`;
    }

    // Remove extra quote at the end of header
    headerLine = headerLine.replace(/""$/, '"');

    // Fix the extra quote before CEP_INICIAL
    headerLine = headerLine.replace(/",""/, '","');
  }

  // Process data lines
  const fixedLines = [headerLine];

  for (let i = dataStartIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      // Replace double quotes with single quotes
      let fixedLine = line.replace(/""/g, '"');

      // Remove extra quote at the beginning of data lines
      if (fixedLine.startsWith('""')) {
        fixedLine = fixedLine.substring(1);
      }

      // Ensure the first field is empty (as in your example)
      if (fixedLine.startsWith('",')) {
        fixedLine = '""' + fixedLine;
      }

      // Remove any extra quotes at the end of the line
      fixedLine = fixedLine.replace(/""$/, '"');

      // Fix the extra quote after the first comma in data lines
      fixedLine = fixedLine.replace(/",""/, '","');

      // Fix the specific issue: remove extra quote after first comma
      fixedLine = fixedLine.replace(/""","/, '"","');

      fixedLines.push(fixedLine);
    }
  }

  return fixedLines.join("\n");
}

// Usage example:
function processCSVFile() {
  const fs = require("fs");

  // Get command line arguments
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage: node fix_csv.js <input_file> [output_file]");
    console.error("Example: node fix_csv.js target.csv target-fixed.csv");
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1] || inputFile.replace(/\.csv$/, "-fixed.csv");

  try {
    // Check if input file exists
    if (!fs.existsSync(inputFile)) {
      console.error(`Error: Input file '${inputFile}' not found.`);
      process.exit(1);
    }

    // Read the corrupted file
    const corruptedContent = fs.readFileSync(inputFile, "utf8");

    // Fix it
    const fixedContent = fixCorruptedCSV(corruptedContent);

    // Save the fixed file
    fs.writeFileSync(outputFile, fixedContent, "utf8");

    console.log(`CSV file fixed successfully!`);
    console.log(`Input: ${inputFile}`);
    console.log(`Output: ${outputFile}`);

    // Optional: Display first few lines to verify
    const lines = fixedContent.split("\n");
    console.log("\nFirst 3 lines of fixed file:");
    lines.slice(0, 3).forEach((line, index) => {
      console.log(`${index + 1}: ${line}`);
    });
  } catch (error) {
    console.error("Error processing file:", error.message);
    process.exit(1);
  }
}

processCSVFile();
