
document.addEventListener("DOMContentLoaded", function () {
  
  // Button EventListener
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach(button => {
    button.addEventListener("click", function () {
      const screenId = this.getAttribute("data-screen");
      console.log("Button clicked, screenId:", screenId); // Add this line
      showScreen(screenId);
    });
  });

  // Input EventListener
  const input = document.getElementById("json-input");
  if (input) {
    input.addEventListener("input", parseAXL);
    console.log("Data entered, input:", input); // Add this line
  }

  // Copy Button EventListener
  const copyButton = document.getElementById("copy-button");
  if (copyButton) {
    copyButton.addEventListener("click", copyTable);
    console.log("Copy Button clicked"); // Add this line
  }


});

// Screen handling
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
    document.getElementById('tabWrapper').style.display = 'none';
  });

  // Show the selected screen
  document.getElementById(screenId).classList.add('active');

  // Hide definitions if visible
  const definitionsContainer = document.getElementById('definitionsContainer');
  const definitionButton = document.getElementById('definitionButton');
  if (definitionsContainer) {
    definitionsContainer.remove();
    if (definitionButton) {
      definitionButton.textContent = 'Show Definitions';
    }
  }

  const input = document.getElementById('json-input');
  if (input) input.value = '';

  // Clear the output container
  const output = document.getElementById('json-output');
  const copyButton = document.getElementById('copy-button');
  if (output) {
    copyButton.style.display = 'none';
    output.innerHTML = '';
  }

  const tableResponse = document.getElementById('responseTable');
  const tableRequest = document.getElementById('requestTable');
  if (tableResponse) {
    tableResponse.innerHTML = '';
  }
  if (tableRequest) {
    tableRequest.innerHTML = '';
  }
  const inputMTI = document.getElementById('combinedInput');
  if (inputMTI) inputMTI.value = '';

}

// AXL Parser code
function parseAXL() {
  const input = document.getElementById('json-input').value;
  const output = document.getElementById('json-output');
  const copyButton = document.getElementById('copy-button');
  try {
    const jsonData = JSON.parse(input);
    if (jsonData.event && jsonData.event.resource) {
      output.innerHTML = generateTable(jsonData.event.resource);
      output.style.display = 'block'; // Show the copy button
      copyButton.style.display = 'block'; // Show the copy button
    } else {
      output.textContent = 'No resource key found in the JSON data';
      copyButton.style.display = 'none'; // Hide the copy button
    }

  } catch (e) {
    //output.textContent = 'Invalid JSON data';
    showAlert(`Invalid format`, "error");
    output.style.display = 'none'; // Show the copy button
    copyButton.style.display = 'none'; // Hide the copy button
  }
}

function generateTable(data) {
  let table = '<table><thead><tr><th class="key-column">Key</th><th class="value-column">Value</th></thead><tbody>';
  table += formatTableRows(data);
  table += '</tbody></table>';
  return table;
}

function formatTableRows(data, indentLevel = 0) {
  let rows = '';
  const indent = '&nbsp;'.repeat(indentLevel * 4);

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];
      if (typeof value === 'object' && value !== null) {
        rows += `<tr><td>${indent}${key}</td><td></td></tr>`;
        rows += formatTableRows(value, indentLevel + 1);
      } else {
        rows += `<tr><td>${indent}${key}</td><td>${value}</td></tr>`;
      }
    }
  }
  return rows;
}

function copyTable() {
  const table = document.querySelector('#json-output table');
  if (table) {
    const range = document.createRange();
    range.selectNode(table);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    //alert('Table copied to clipboard!');
    showAlert(`Table copied to clipboard!`, "success");
  } else {
    //alert('No table to copy');
    showAlert(`Oops!  No table to copy`, "error");
  }
}

// Alert Message function
function showAlert(message, type = 'info') {
  const icon = alertIcons[type] || alertIcons.info;
  const alertText = document.getElementById("alertText");
  alertText.innerHTML = icon + `<div style="text-align: center;">${message}</div>`;
  document.getElementById("overlay").style.display = "block";
  document.getElementById('customAlert').style.display = 'block';
}

function closeAlert() {
  document.getElementById('customAlert').style.display = 'none';
  document.getElementById("overlay").style.display = "none";
}
