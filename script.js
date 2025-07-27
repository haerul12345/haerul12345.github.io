
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

  // AXL Input EventListener
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

  // DE22 Input EventListener
  const de22Input = document.getElementById('de22-input');
  if (de22Input) {
    de22Input.addEventListener('input', displayParsedData);
  }

  // Button Display Definition EventListener
  const definitionButton = document.getElementById("definitionButton");
  if (definitionButton) {
    definitionButton.addEventListener("click", displayDefinitions);
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

// DE22 Parser code
function resizeparsedDataOutput() {
  const parsedDataOutput = document.getElementById('parse-output');
  parsedDataOutput.style.height = 'auto';
  parsedDataOutput.style.height = parsedDataOutput.scrollHeight + 'px';
}

let wasPreviouslyFilled = false;

function displayParsedData() {
  const cardData = document.getElementById('de22-input').value;

  if (!cardData) {
    if (!wasPreviouslyFilled) {
      alert("DE22 data is empty. Please enter the data.");
    }
    return;
  }
  wasPreviouslyFilled = true;

  const parsedData = parseCardData(cardData);
  let output = '';
  for (const [key, value] of Object.entries(parsedData)) {
    output += `${key} > ${value}\n`;
  }
  document.getElementById('parse-output').value = output;
  resizeparsedDataOutput();
}

function parseCardData(cardData) {
  const definitions = {
    cardDataInputCapability: {
      '0': 'Unknown',
      '1': 'Manual, no terminal',
      '2': 'Magnetic stripe read',
      '3': 'Bar code',
      '4': 'OCR',
      '5': 'Integrate circuit card (ICC)',
      '6': 'Key entered',
      'A': 'Contactless ICC',
      'B': 'Contactless magnetic stripe'
    },
    cardholderAuth: {
      '0': 'No electronic authentication',
      '1': 'PIN',
      '2': 'Electronic signature analysis',
      '3': 'Biometrics',
      '4': 'Biographic',
      '5': 'Electronic authentication inoperative',
      '6': 'Other'
    },
    cardCapture: {
      '0': 'None',
      '1': 'Capture'
    },
    operatingEnvironment: {
      '0': 'No terminal used',
      '1': 'On premises of card acceptor, attended',
      '2': 'On premises of card acceptor, unattended',
      '3': 'Off premises of card acceptor, attended',
      '4': 'Off premises of card acceptor, unattended',
      '5': 'On premises of cardholder, attended'
    },
    cardholderPresent: {
      '0': 'Cardholder present',
      '1': 'Cardholder not present, unspecified',
      '2': 'Cardholder not present, mail order',
      '3': 'Cardholder not present, telephone',
      '4': 'Cardholder not present, standing authorisation'
    },
    cardPresent: {
      '0': 'Card not present',
      '1': 'Card present'
    },
    cardDataInputMode: {
      '0': 'Unspecified',
      '1': 'Manual, no terminal',
      '2': 'Magnetic stripe read',
      '3': 'Bar code',
      '4': 'OCR',
      '5': 'Integrate circuit card (ICC)',
      '6': 'Key entered',
      '7': 'Contactless ICC',
      '8': 'Contactless magnetic stripe'
    },
    cardholderAuthMethod: {
      '0': 'Not authenticated',
      '1': 'PIN',
      '2': 'Electronic signature analysis',
      '3': 'Biometrics',
      '4': 'Biographic',
      '5': 'Manual signature verification',
      '6': 'Other manual verification'
    },
    cardholderAuthEntity: {
      '0': 'Not authenticated',
      '1': 'Integrated circuit card',
      '2': 'Terminal',
      '3': 'Authorising agent',
      '4': 'Merchant',
      '5': 'Other'
    },
    cardDataOutput: {
      '0': 'Unknown',
      '1': 'None',
      '2': 'Magnetic stripe write',
      '3': 'Integrate circuit card (ICC)'
    },
    terminalOutput: {
      '0': 'Unknown',
      '1': 'None',
      '2': 'Printing',
      '3': 'Display',
      '4': 'Printing and display'
    },
    pinCapture: {
      '0': 'No PIN capture capability',
      '1': 'Device PIN capture capability unknown',
      '4': 'Four characters',
      '5': 'Five characters',
      '6': 'Six characters',
      '7': 'Seven characters',
      '8': 'Eight characters',
      '9': 'Nine characters',
      'A': 'Ten characters',
      'B': 'Eleven characters',
      'C': 'Twelve characters'
    },
    terminalOperator: {
      '0': 'Customer operated',
      '1': 'Card acceptor operated',
      '2': 'Administrative'
    },
    terminalType: {
      '00': 'Administrative terminal',
      '01': 'POS terminal',
      '02': 'ATM',
      '03': 'Home terminal',
      '04': 'Electronic cash register (ECR)',
      '05': 'Dial terminal',
      '06': 'Travellers check machine',
      '07': 'Fuel machine',
      '08': 'Scrip machine',
      '09': 'Coupon machine',
      '10': 'Ticket machine',
      '11': 'Point-of-Banking terminal',
      '12': 'Teller',
      '13': 'Franchise teller',
      '14': 'Personal banking',
      '15': 'Public utility',
      '16': 'Vending',
      '17': 'Self-service',
      '18': 'Authorization',
      '19': 'Payment',
      '20': 'VRU',
      '21': 'Smart phone',
      '22': 'Interactive television',
      '23': 'Personal digital assistant',
      '24': 'Screen phone',
      '90': 'E-commerce - No encryption; no authentication',
      '91': 'E-commerce - SET/3D-Secure encryption; cardholder certificate not used (non-authenticated)',
      '92': 'E-commerce - SET/3D-Secure encryption; cardholder certificate used (authenticated)',
      '93': 'E-commerce - SET encryption, chip cryptogram used; cardholder certificate not used',
      '94': 'E-commerce - SET encryption, chip cryptogram used; cardholder certificate used',
      '95': 'Channel encryption (SSL); cardholder certificate not used (non-authenticated)',
      '96': 'E-commerce - Channel encryption (SSL); chip cryptogram used, cardholder certificate not used'
    }
  };

  const parsedData = {
    'Pos 1 ': `(${cardData[0]}) ${definitions.cardDataInputCapability[cardData[0]]}`,
    'Pos 2 ': `(${cardData[1]}) ${definitions.cardholderAuth[cardData[1]]}`,
    'Pos 3 ': `(${cardData[2]}) ${definitions.cardCapture[cardData[2]]}`,
    'Pos 4 ': `(${cardData[3]}) ${definitions.operatingEnvironment[cardData[3]]}`,
    'Pos 5 ': `(${cardData[4]}) ${definitions.cardholderPresent[cardData[4]]}`,
    'Pos 6 ': `(${cardData[5]}) ${definitions.cardPresent[cardData[5]]}`,
    'Pos 7 ': `(${cardData[6]}) ${definitions.cardDataInputMode[cardData[6]]}`,
    'Pos 8 ': `(${cardData[7]}) ${definitions.cardholderAuthMethod[cardData[7]]}`,
    'Pos 9 ': `(${cardData[8]}) ${definitions.cardholderAuthEntity[cardData[8]]}`,
    'Pos 10': `(${cardData[9]}) ${definitions.cardDataOutput[cardData[9]]}`,
    'Pos 11': `(${cardData[10]}) ${definitions.terminalOutput[cardData[10]]}`,
    'Pos 12': `(${cardData[11]}) ${definitions.pinCapture[cardData[11]]}`,
    'Pos 13': `(${cardData[12]}) ${definitions.terminalOperator[cardData[12]]}`,
    'Pos 14-15': `(${cardData.substring(13, 15)}) ${definitions.terminalType[cardData.substring(13, 15)]}`
  };

  return parsedData;
}

const posDataDefinitions = {
  '(Pos 1) The card data input capability  of the terminal': {
    '0': 'Unknown',
    '1': 'Manual, no terminal',
    '2': 'Magnetic stripe read',
    '3': 'Bar code',
    '4': 'OCR',
    '5': 'Integrate circuit card (ICC)',
    '6': 'Key entered',
    'A': 'Contactless ICC',
    'B': 'Contactless magnetic stripe'
  },
  '(Pos 2) The cardholder authentication capability of the terminal': {
    '0': 'No electronic authentication',
    '1': 'PIN',
    '2': 'Electronic signature analysis',
    '3': 'Biometrics',
    '4': 'Biographic',
    '5': 'Electronic authentication inoperative',
    '6': 'Other'
  },
  '(Pos 3) The card capture capability of the terminal': {
    '0': 'None',
    '1': 'Capture'
  },
  '(Pos 4) The operating environment of the terminal': {
    '0': 'No terminal used',
    '1': 'On premises of card acceptor, attended',
    '2': 'On premises of card acceptor, unattended',
    '3': 'Off premises of card acceptor, attended',
    '4': 'Off premises of card acceptor, unattended',
    '5': 'On premises of cardholder, attended'
  },
  '(Pos 5) Indicates whether the cardholder is present': {
    '0': 'Cardholder present',
    '1': 'Cardholder not present, unspecified',
    '2': 'Cardholder not present, mail order',
    '3': 'Cardholder not present, telephone',
    '4': 'Cardholder not present, standing authorisation'
  },
  '(Pos 6) Indicates whether the card is present': {
    '0': 'Card not present',
    '1': 'Card present'
  },
  '(Pos 7) The actual card data input mode of the transaction': {
    '0': 'Unspecified',
    '1': 'Manual, no terminal',
    '2': 'Magnetic stripe read',
    '3': 'Bar code',
    '4': 'OCR',
    '5': 'Integrate circuit card (ICC)',
    '6': 'Key entered',
    '7': 'Contactless ICC',
    '8': 'Contactless magnetic stripe'
  },
  '(Pos 8) The actual cardholder authentication method of the transaction': {
    '0': 'Not authenticated',
    '1': 'PIN',
    '2': 'Electronic signature analysis',
    '3': 'Biometrics',
    '4': 'Biographic',
    '5': 'Manual signature verification',
    '6': 'Other manual verification'
  },
  '(Pos 9) The cardholder authentication entity of the transaction': {
    '0': 'Not authenticated',
    '1': 'Integrated circuit card',
    '2': 'Terminal',
    '3': 'Authorising agent',
    '4': 'Merchant',
    '5': 'Other'
  },
  '(Pos 10) The card data output capability of the terminal': {
    '0': 'Unknown',
    '1': 'None',
    '2': 'Magnetic stripe write',
    '3': 'Integrate circuit card (ICC)'
  },
  '(Pos 11) The terminal output capability of the terminal': {
    '0': 'Unknown',
    '1': 'None',
    '2': 'Printing',
    '3': 'Display',
    '4': 'Printing and display'
  },
  '(Pos 12) The PIN capture capability of the terminal': {
    '0': 'No PIN capture capability',
    '1': 'Device PIN capture capability unknown',
    '4': 'Four characters',
    '5': 'Five characters',
    '6': 'Six characters',
    '7': 'Seven characters',
    '8': 'Eight characters',
    '9': 'Nine characters',
    'A': 'Ten characters',
    'B': 'Eleven characters',
    'C': 'Twelve characters'
  },
  '(Pos 13) Terminal operator': {
    '0': 'Customer operated',
    '1': 'Card acceptor operated',
    '2': 'Administrative'
  },
  '(Pos 14-15) Terminal type': {
    '00': 'Administrative terminal',
    '01': 'POS terminal',
    '02': 'ATM',
    '03': 'Home terminal',
    '04': 'Electronic cash register (ECR)',
    '05': 'Dial terminal',
    '06': 'Travellers check machine',
    '07': 'Fuel machine',
    '08': 'Scrip machine',
    '09': 'Coupon machine',
    '10': 'Ticket machine',
    '11': 'Point-of-Banking terminal',
    '12': 'Teller',
    '13': 'Franchise teller',
    '14': 'Personal banking',
    '15': 'Public utility',
    '16': 'Vending',
    '17': 'Self-service',
    '18': 'Authorization',
    '19': 'Payment',
    '20': 'VRU',
    '21': 'Smart phone',
    '22': 'Interactive television',
    '23': 'Personal digital assistant',
    '24': 'Screen phone',
    '90': 'E-commerce - No encryption; no authentication',
    '91': 'E-commerce - SET/3D-Secure encryption; cardholder certificate not used (non-authenticated)',
    '92': 'E-commerce - SET/3D-Secure encryption; cardholder certificate used (authenticated)',
    '93': 'E-commerce - SET encryption, chip cryptogram used; cardholder certificate not used',
    '94': 'E-commerce - SET encryption, chip cryptogram used; cardholder certificate used',
    '95': 'Channel encryption (SSL); cardholder certificate not used (non-authenticated)',
    '96': 'E-commerce - Channel encryption (SSL); chip cryptogram used, cardholder certificate not used'
  }
};

function displayDefinitions() {
  const existingContainer = document.getElementById('definitionsContainer');
  const button = document.getElementById('definitionButton');

  if (existingContainer) {
    existingContainer.remove();
    button.textContent = 'Show Definitions';
  } else {
    const container = document.createElement('div');
    container.id = 'definitionsContainer';
    container.style.position = 'absolute';
    container.style.bottom = '80px';
    container.style.left = '30px';
    container.style.right = '30px';
    container.style.height = '40%';
    container.style.height = container.scrollHeight + '40%';
    container.style.overflowY = 'auto';
    container.style.backgroundColor = '#f9f9f9';
    container.style.border = '1px solid #ccc';
    container.style.padding = '15px';
    container.style.width = 'auto'; // Wider to accommodate 3 columns
    container.style.zIndex = '1000';
    container.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    container.style.fontFamily = 'monospace';
    container.style.fontSize = '10px';
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';
    container.style.gap = '15px';
    container.style.borderRadius = '5px';


    for (const [title, definitions] of Object.entries(posDataDefinitions)) {
      const section = document.createElement('div');
      section.style.flex = '1 1 calc(33.333% - 10px)';
      section.style.boxSizing = 'border-box';
      section.style.marginBottom = '10px';

      const heading = document.createElement('strong');
      heading.textContent = title;
      section.appendChild(heading);

      const list = document.createElement('ul');
      list.style.margin = '5px 0 0 15px';
      list.style.padding = '0';

      for (const [code, meaning] of Object.entries(definitions)) {
        const item = document.createElement('li');
        item.textContent = `${code}: ${meaning}`;
        list.appendChild(item);
      }

      section.appendChild(list);
      container.appendChild(section);
    }

    document.body.appendChild(container);
    button.textContent = 'Hide Definitions';
  }
}