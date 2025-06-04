// Dummy data for Bank -> State -> Branch -> IFSC mapping
const bankData = {
    "Demo Bank": {
        "Karnataka": {
            "Bangalore Main": "DEMO0001",
            "Mysore": "DEMO0002"
        },
        "Maharashtra": {
            "Mumbai": "DEMO0003"
        }
    },
    "Test Bank": {
        "Delhi": {
            "Connaught Place": "TEST0001"
        }
    }
};

// Elements
const byIfscTab = document.getElementById('by-ifsc-tab');
const byBranchTab = document.getElementById('by-branch-tab');
const searchByIfsc = document.getElementById('search-by-ifsc');
const searchByBranch = document.getElementById('search-by-branch');
const ifscInput = document.getElementById('ifsc-input');
const ifscSearchButton = document.getElementById('ifsc-search-button');
const bankSelect = document.getElementById('bank-select');
const stateSelect = document.getElementById('state-select');
const branchSelect = document.getElementById('branch-select');
const branchSearchButton = document.getElementById('branch-search-button');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');
const copyBtn = document.getElementById('copy-btn');

const bankNameEl = document.getElementById('bank-name');
const branchNameEl = document.getElementById('branch-name');
const ifscCodeEl = document.getElementById('ifsc-code');
const micrEl = document.getElementById('micr');
const addressEl = document.getElementById('address');
const contactEl = document.getElementById('contact');
const cityEl = document.getElementById('city');
const stateEl = document.getElementById('state');

// Initialize dropdowns
function initBankDropdown() {
    for (const bank in bankData) {
        const opt = document.createElement('option');
        opt.value = bank;
        opt.textContent = bank;
        bankSelect.appendChild(opt);
    }
}

initBankDropdown();

// Toggle search methods
byIfscTab.addEventListener('click', () => {
    byIfscTab.classList.add('active');
    byBranchTab.classList.remove('active');
    searchByIfsc.classList.remove('hidden');
    searchByBranch.classList.add('hidden');
    errorDiv.classList.add('hidden');
    resultDiv.classList.add('hidden');
});

byBranchTab.addEventListener('click', () => {
    byBranchTab.classList.add('active');
    byIfscTab.classList.remove('active');
    searchByBranch.classList.remove('hidden');
    searchByIfsc.classList.add('hidden');
    errorDiv.classList.add('hidden');
    resultDiv.classList.add('hidden');
});

// Populate states when bank changes
bankSelect.addEventListener('change', () => {
    stateSelect.innerHTML = '<option value="">Select State</option>';
    branchSelect.innerHTML = '<option value="">Select Branch</option>';
    branchSelect.disabled = true;
    branchSearchButton.disabled = true;
    const bank = bankSelect.value;
    if (bank) {
        const states = Object.keys(bankData[bank]);
        states.forEach(state => {
            const opt = document.createElement('option');
            opt.value = state;
            opt.textContent = state;
            stateSelect.appendChild(opt);
        });
        stateSelect.disabled = false;
    } else {
        stateSelect.disabled = true;
    }
});

// Populate branches when state changes
stateSelect.addEventListener('change', () => {
    branchSelect.innerHTML = '<option value="">Select Branch</option>';
    branchSearchButton.disabled = true;
    const bank = bankSelect.value;
    const state = stateSelect.value;
    if (bank && state) {
        const branches = Object.keys(bankData[bank][state]);
        branches.forEach(branch => {
            const opt = document.createElement('option');
            opt.value = branch;
            opt.textContent = branch;
            branchSelect.appendChild(opt);
        });
        branchSelect.disabled = false;
    } else {
        branchSelect.disabled = true;
    }
});

branchSelect.addEventListener('change', () => {
    branchSearchButton.disabled = !branchSelect.value;
});

// Fetch details from API
async function fetchIfscDetails(ifsc) {
    errorDiv.classList.add('hidden');
    resultDiv.classList.add('hidden');
    try {
        const response = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
        if (!response.ok) throw new Error('Invalid IFSC code');
        const data = await response.json();
        displayResult(data);
    } catch (err) {
        errorDiv.textContent = err.message;
        errorDiv.classList.remove('hidden');
    }
}

// Display result
function displayResult(data) {
    bankNameEl.textContent = data.BANK;
    branchNameEl.textContent = data.BRANCH;
    ifscCodeEl.textContent = data.IFSC;
    micrEl.textContent = data.MICR || 'N/A';
    addressEl.textContent = data.ADDRESS;
    contactEl.textContent = data.CONTACT || 'N/A';
    cityEl.textContent = data.CITY;
    stateEl.textContent = data.STATE;
    resultDiv.classList.remove('hidden');
}

// Event listeners for search buttons
ifscSearchButton.addEventListener('click', () => {
    const ifsc = ifscInput.value.trim().toUpperCase();
    if (ifsc) {
        fetchIfscDetails(ifsc);
    }
});

branchSearchButton.addEventListener('click', () => {
    const bank = bankSelect.value;
    const state = stateSelect.value;
    const branch = branchSelect.value;
    if (bank && state && branch) {
        const ifsc = bankData[bank][state][branch];
        fetchIfscDetails(ifsc);
    }
});

// Copy IFSC to clipboard
copyBtn.addEventListener('click', () => {
    const ifsc = ifscCodeEl.textContent;
    if (ifsc) {
        navigator.clipboard.writeText(ifsc);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => (copyBtn.textContent = 'Copy'), 1500);
    }
});
