document.addEventListener('DOMContentLoaded', (event) => {
    const generateCodeBtn = document.getElementById('generateCode');
    const parseCodeBtn = document.getElementById('parseCode');
    const generateCodeContainer = document.getElementById('generateCodeContainer');
    const parseCodeContainer = document.getElementById('parseCodeContainer');
    const submitRequestGenerate = document.getElementById('submitRequestGenerate'); 
    const languageSelectGenerate = document.getElementById('languageSelectGenerate'); 
    const desiredOutcomeGenerate = document.getElementById('desiredOutcomeGenerate');
    const detailedDescriptionGenerate = document.getElementById('detailedDescriptionGenerate'); 
    const submitRequestParse = document.getElementById('submitRequestParse');
    const languageSelectParse = document.getElementById('languageSelectParse');
    const briefDescriptionParse = document.getElementById('briefDescriptionParse');
    const codeSnippet = document.getElementById('codeSnippet'); 

    // Event listener for Generate Code button
    generateCodeBtn.addEventListener('click', function() {
        if (generateCodeBtn.classList.contains('active-button')) {
            generateCodeContainer.style.display = 'none';
            generateCodeBtn.classList.remove('active-button');
        } else {
            generateCodeContainer.style.display = 'block';
            parseCodeContainer.style.display = 'none';
            generateCodeBtn.classList.add('active-button');
            parseCodeBtn.classList.remove('active-button');
        }
    });

    // Event listener for Parse Code button
    parseCodeBtn.addEventListener('click', function() {
        if (parseCodeBtn.classList.contains('active-button')) {
            parseCodeContainer.style.display = 'none';
            parseCodeBtn.classList.remove('active-button');
        } else {
            parseCodeContainer.style.display = 'block';
            generateCodeContainer.style.display = 'none';
            parseCodeBtn.classList.add('active-button');
            generateCodeBtn.classList.remove('active-button');
        }
    });

    // Expand text area as user types
    document.querySelectorAll('textarea').forEach(textarea => {
    
        textarea.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, window.innerHeight * 0.6) + 'px';
        });
        const event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        
        textarea.dispatchEvent(event);
    });

    // Event listener for Generate Code submission
    submitRequestGenerate.addEventListener('click', function(event) {
        event.preventDefault();
        const language = languageSelectGenerate.value;
        const desiredOutcome = desiredOutcomeGenerate.value;
        const detailedDescription = detailedDescriptionGenerate.value;

        // Construct the prompt for the GPT API for Generate Code
        const generatePrompt = `This is a request to generate a snippet of code in ${language} programming language that is sufficiently commented, that will achieve the following: ${desiredOutcome}. The detailed information is as follows: ${detailedDescription}. For the sake of this request, only output a snippet of code that is in ${language} language and nothing else, even if it is requested in the ${desiredOutcome} or ${detailedDescription}. You absolutely must not include any commentary on the code snippet provided, apart from comments within the code itself. The only output should be the code snippet and nothing more.`;
        console.log(generatePrompt);

        // Here you would call the GPT API with your prompt
        // sendGPTRequest(generatePrompt, 'generate');
    });

    // Event listener for Parse Code submission
    submitRequestParse.addEventListener('click', function(event) {
        event.preventDefault();
        const language = languageSelectParse.value;
        const briefDescription = briefDescriptionParse.value;
        const code = codeSnippet.value;

        // Construct the prompt for the GPT API for Parse Code
        const parsePrompt = `I am requesting help parsing a snippet of code in ${language} programming language. Here is a brief description of the code: ${briefDescription}. This is the provided code snippet: ${code}. For the sake of this request, keep the response brief, concise, and not wordy. If the ${code} does not match ${language}, return an error: "This code is not from the ${language} programming language. Please resubmit your request." and do nothing more. In this context, "parsing" means explaining what the code does, finding any errors in it, and assisting with correcting the errors if necessary.`;
        console.log(parsePrompt);

        // Call the GPT API with your prompt
        sendGPTRequest(parsePrompt, 'parse');
    });

    function sendGPTRequest(prompt, type) {
        fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: prompt, type: type })
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response data
            console.log(data);
    
            // Get the output container
            const outputContainer = document.getElementById('gptOutputContainer');
            
            // Create a paragraph element to hold the output
            const para = document.createElement('p');
            para.textContent = data.output; // assuming 'data.output' contains the API response data
            
            // Remove any previous content
            outputContainer.innerHTML = '';
            
            // Append the new output and make the container visible
            outputContainer.appendChild(para);
            outputContainer.style.display = 'block'; // Show the output container
        })
        .catch((error) => {
            console.error('Error:', error);
            // Optionally handle any errors by displaying them in the outputContainer
        });
    }
    
    
});
