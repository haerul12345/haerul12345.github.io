
document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".btn");

  buttons.forEach(button => {
    button.addEventListener("click", function () {
      const screenId = this.getAttribute("data-screen");
      showScreen(screenId);
    });
  });
});

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