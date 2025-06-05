// IFSC Finder script using Razorpay API
// Handles both dropdown-based search and direct IFSC search

// Keep meta data for the currently selected bank
let stateMap = {};
let districtMap = {};
let branchMap = {};

// Initialize when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    loadBanks();

    // Tab controls
    const selectTab = document.getElementById('by-select-tab');
    const ifscTab = document.getElementById('by-ifsc-tab');
    const selectSection = document.getElementById('select-search');
    const ifscSection = document.getElementById('ifsc-search');

    selectTab.addEventListener('click', () => {
        selectTab.classList.add('active');
        ifscTab.classList.remove('active');
        selectSection.classList.add('active');
        ifscSection.classList.remove('active');
    });

    ifscTab.addEventListener('click', () => {
        ifscTab.classList.add('active');
        selectTab.classList.remove('active');
        ifscSection.classList.add('active');
        selectSection.classList.remove('active');
    });

    // Dropdown handlers
    document.getElementById('bank-select').addEventListener('change', loadStates);
    document.getElementById('state-select').addEventListener('change', loadDistricts);
    document.getElementById('district-select').addEventListener('change', loadBranches);
    document.getElementById('branch-select').addEventListener('change', () => {
        document.getElementById('select-submit').disabled = !document.getElementById('branch-select').value;
    });

    document.getElementById('select-submit').addEventListener('click', getIfscDetails);
    document.getElementById('ifsc-submit').addEventListener('click', searchByIFSC);
});

// Fetch list of banks
async function loadBanks() {
    try {
        const res = await fetch('https://ifsc.razorpay.com/meta/banks');
        const banks = await res.json();
        const sel = document.getElementById('bank-select');
        sel.innerHTML = '<option value="">Select Bank</option>';
        banks.forEach(bank => sel.appendChild(new Option(bank, bank)));
    } catch (err) {
        showError('Unable to load banks');
    }
}

// Load states for selected bank
async function loadStates() {
    resetSections('state');
    const bank = document.getElementById('bank-select').value;
    if (!bank) return;
    try {
        const res = await fetch(`https://ifsc.razorpay.com/meta/${encodeURIComponent(bank)}`);
        stateMap = await res.json();
        const sel = document.getElementById('state-select');
        sel.innerHTML = '<option value="">Select State</option>';
        Object.keys(stateMap).forEach(state => sel.appendChild(new Option(state, state)));
        sel.disabled = false;
    } catch (err) {
        showError('Unable to load states');
    }
}

// Load districts for selected state
function loadDistricts() {
    resetSections('district');
    const state = document.getElementById('state-select').value;
    if (!state) return;
    districtMap = stateMap[state] || {};
    const sel = document.getElementById('district-select');
    sel.innerHTML = '<option value="">Select District</option>';
    Object.keys(districtMap).forEach(d => sel.appendChild(new Option(d, d)));
    sel.disabled = false;
}

// Load branches for selected district
function loadBranches() {
    resetSections('branch');
    const district = document.getElementById('district-select').value;
    if (!district) return;
    branchMap = districtMap[district] || {};
    const sel = document.getElementById('branch-select');
    sel.innerHTML = '<option value="">Select Branch</option>';
    Object.keys(branchMap).forEach(b => sel.appendChild(new Option(b, b)));
    sel.disabled = false;
}

// Fetch details based on dropdown selection
async function getIfscDetails() {
    const branch = document.getElementById('branch-select').value;
    if (!branch || !branchMap[branch]) return;
    const ifsc = branchMap[branch];
    fetchAndDisplay(ifsc);
}

// Search details by direct IFSC input
async function searchByIFSC() {
    const ifsc = document.getElementById('ifsc-input').value.trim().toUpperCase();
    if (!ifsc) {
        showError('Enter IFSC code');
        return;
    }
    fetchAndDisplay(ifsc);
}

// Common fetch function to display IFSC details
async function fetchAndDisplay(ifsc) {
    clearOutput();
    try {
        const res = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
        if (!res.ok) throw new Error('Invalid IFSC code');
        const data = await res.json();
        const out = document.getElementById('resultOutput');
        out.innerHTML =
            `<div><strong>BANK:</strong> ${data.BANK}</div>`+
            `<div><strong>BRANCH:</strong> ${data.BRANCH}</div>`+
            `<div><strong>ADDRESS:</strong> ${data.ADDRESS}</div>`+
            `<div><strong>CITY:</strong> ${data.CITY}</div>`+
            `<div><strong>STATE:</strong> ${data.STATE}</div>`+
            `<div><strong>MICR:</strong> ${data.MICR}</div>`+
            `<div><strong>IFSC:</strong> ${data.IFSC}</div>`;
    } catch (err) {
        showError(err.message);
    }
}

// Helpers to manage UI states
function resetSections(level) {
    if (level === 'state') {
        document.getElementById('state-select').innerHTML = '<option value="">Select State</option>';
        document.getElementById('state-select').disabled = true;
    }
    if (level === 'state' || level === 'district') {
        document.getElementById('district-select').innerHTML = '<option value="">Select District</option>';
        document.getElementById('district-select').disabled = true;
    }
    document.getElementById('branch-select').innerHTML = '<option value="">Select Branch</option>';
    document.getElementById('branch-select').disabled = true;
    document.getElementById('select-submit').disabled = true;
}

function showError(msg) {
    const err = document.getElementById('error-message');
    err.textContent = msg;
}

function clearOutput() {
    showError('');
    document.getElementById('resultOutput').innerHTML = '';
}
