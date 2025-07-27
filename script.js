
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

  // OK Button on Alert EventListener
  const okButton = document.getElementById('alert-ok-button');
  if (okButton) {
    okButton.addEventListener('click', closeAlert);
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

// Alert Icon def
const alertIcons = {
  error: `<div style="font-size: 2.5em; text-align: center;">  
	<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
	  <line x1="18" y1="6" x2="6" y2="18" />
	  <line x1="6" y1="6" x2="18" y2="18" />
	</svg>
  </div>`,

  success: `<div style="font-size: 2.5em; text-align: center;">
	  <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
	  <polyline points="20 6 9 17 4 12" />
	  </svg>
  </div>`,

  warning: `<div style="font-size: 2.5em; text-align: center;">  
		
	<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="orange" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
	  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
	  <line x1="12" y1="9" x2="12" y2="13" />
	  <line x1="12" y1="17" x2="12.01" y2="17" />
	</svg>
  </div>`,

  info: `<div style="font-size: 2.5em; text-align: center;">
	<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="blue" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		<circle cx="12" cy="12" r="10"/>
		<line x1="12" y1="7" x2="12" y2="13"/>
		<line x1="12" y1="17" x2="12.01" y2="17"/>
	</svg>
  </div>`
};

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
