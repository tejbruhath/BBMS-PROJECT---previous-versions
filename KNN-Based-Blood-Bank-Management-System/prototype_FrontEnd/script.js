// API connection setup
const API_URL = 'http://localhost:5000/api';

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize ripple effect for buttons
    const rippleButtons = document.querySelectorAll('.ripple');
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Fetch initial data
    fetchDonors();
    fetchPatients();
    fetchInventory();
    
    // Event listeners for forms
    const donorForm = document.getElementById('donor-form');
    if (donorForm) {
        donorForm.addEventListener('submit', handleDonorSubmit);
    }
    
    const patientForm = document.getElementById('patient-form');
    if (patientForm) {
        patientForm.addEventListener('submit', handlePatientSubmit);
    }
    
    const findDonorForm = document.getElementById('find-donor-form');
    if (findDonorForm) {
        findDonorForm.addEventListener('submit', handleFindDonorSubmit);
    }
    
    const refreshInventoryBtn = document.getElementById('refresh-inventory');
    if (refreshInventoryBtn) {
        refreshInventoryBtn.addEventListener('click', fetchInventory);
    }
});

// API Functions
async function fetchDonors() {
    try {
        const response = await fetch(`${API_URL}/donors`);
        const data = await response.json();
        console.log("Donor data:", data); // Debug log
        updateDonorList(data);
    } catch (error) {
        showNotification('Error fetching donors', 'error');
        console.error('Error fetching donors:', error);
    }
}

async function fetchPatients() {
    try {
        const response = await fetch(`${API_URL}/patients`);
        const data = await response.json();
        console.log("Patient data:", data); // Debug log
        updatePatientList(data);
    } catch (error) {
        showNotification('Error fetching patients', 'error');
        console.error('Error fetching patients:', error);
    }
}

async function fetchInventory() {
    try {
        const response = await fetch(`${API_URL}/blood`);
        const data = await response.json();
        console.log("Inventory data:", data); // Debug log
        updateInventoryList(data);
    } catch (error) {
        showNotification('Error fetching inventory', 'error');
        console.error('Error fetching inventory:', error);
    }
}

// Form Handlers
function handleDonorSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const donor = {
        first_name: formData.get('first_name'),
        middle_name: formData.get('middle_name'),
        last_name: formData.get('last_name'),
        dob: formData.get('dob'),
        weight: parseFloat(formData.get('weight')),
        gender: formData.get('gender'),
        blood_group: formData.get('blood_type').charAt(0),
        rh_factor: formData.get('blood_type').includes('+') ? 'Positive' : 'Negative',
        city: formData.get('city'),
        mobile: formData.get('mobile')
    };
    
    fetch(`${API_URL}/donors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donor)
    })
    .then(response => response.json())
    .then(data => {
        fetchDonors();
        showNotification('Donor added successfully', 'success');
    })
    .catch(error => {
        showNotification('Error adding donor', 'error');
        console.error('Error adding donor:', error);
    });
    
    e.target.reset();
}

function handlePatientSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const patient = {
        name: formData.get('name'),
        gender: formData.get('gender'),
        dob: formData.get('dob'),
        blood_group: formData.get('blood_group'),
        quantity: parseInt(formData.get('quantity')),
        hospital_name: formData.get('hospital_name'),
        place: formData.get('place')
    };
    
    fetch(`${API_URL}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient)
    })
    .then(response => response.json())
    .then(data => {
        fetchPatients();
        showNotification('Patient added successfully', 'success');
    })
    .catch(error => {
        showNotification('Error adding patient', 'error');
        console.error('Error adding patient:', error);
    });
    
    e.target.reset();
}

function handleFindDonorSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const request = {
        blood_group: formData.get('blood_group'),
        rh_factor: formData.get('rh_factor'),
        city: formData.get('city'),
        k: parseInt(formData.get('k'))
    };
    
    fetch(`${API_URL}/knn/find-donors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
    })
    .then(response => response.json())
    .then(data => {
        console.log("KNN results:", data); // Debug log
        updateNearestDonors(data);
        showNotification('Donors found successfully', 'success');
    })
    .catch(error => {
        showNotification('Error finding donors', 'error');
        console.error('Error finding donors:', error);
    });
}

// UI Update Functions
function updateDonorList(donors) {
    const donorList = document.getElementById('donor-list');
    if (!donorList) return;
    
    donorList.innerHTML = donors.length === 0 
        ? '<p class="text-muted">No donors found.</p>' 
        : donors.map(donor => `
            <div class="donor-card">
                <h4>${donor.first_name || ''} ${donor.middle_name || ''} ${donor.last_name || ''}</h4>
                <p><strong>Blood Type:</strong> ${donor.blood_group || ''}${donor.rh_factor === 'Positive' ? '+' : '-'}</p>
                <p><strong>Gender:</strong> ${donor.gender === 'M' ? 'Male' : donor.gender === 'F' ? 'Female' : 'Other'}</p>
                <p><strong>City:</strong> ${donor.city || ''}</p>
                <p><strong>Contact:</strong> ${donor.mobile || ''}</p>
            </div>
        `).join('');
}

function updatePatientList(patients) {
    const patientList = document.getElementById('patient-list');
    if (!patientList) return;
    
    patientList.innerHTML = patients.length === 0 
        ? '<p class="text-muted">No patients found.</p>' 
        : patients.map(patient => `
            <div class="patient-card">
                <h4>${patient.name || ''}</h4>
                <p><strong>Blood Type Needed:</strong> ${patient.blood_group || ''}</p>
                <p><strong>Quantity:</strong> ${patient.quantity || 0} units</p>
                <p><strong>Hospital:</strong> ${patient.hospital_name || ''}</p>
                <p><strong>Location:</strong> ${patient.place || ''}</p>
            </div>
        `).join('');
}

function updateInventoryList(inventory) {
    const inventoryList = document.getElementById('inventory-list');
    if (!inventoryList) return;
    
    inventoryList.innerHTML = inventory.length === 0
        ? '<p class="text-muted">No inventory found.</p>'
        : inventory.map(item => `
            <div class="inventory-card">
                <span class="blood-type blood-type-${(item.blood_type || '').toLowerCase().replace('+', '-pos').replace('-', '-neg')}">
                    ${item.blood_type || ''}
                </span>
                <h4>${item.quantity || 0} units</h4>
            </div>
        `).join('');
}

function updateNearestDonors(nearestDonors) {
    const nearestDonorsList = document.getElementById('nearest-donors');
    if (!nearestDonorsList) return;
    
    nearestDonorsList.innerHTML = nearestDonors.length === 0 
        ? '<p class="text-muted">No matching donors found.</p>' 
        : nearestDonors.map(donor => `
            <div class="donor-card">
                <h4>${donor.first_name || ''} ${donor.last_name || ''}</h4>
                <p><strong>Blood Type:</strong> ${donor.blood_group || ''}${donor.rh_factor === 'Positive' ? '+' : '-'}</p>
                <p><strong>City:</strong> ${donor.city || ''}</p>
                <p><strong>Distance Score:</strong> ${donor.distance ? donor.distance.toFixed(2) : 'N/A'}</p>
                <p><strong>Contact:</strong> ${donor.mobile || ''}</p>
            </div>
        `).join('');
}

// Utility Functions
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    const notificationIcon = notification.querySelector('.notification-icon');
    const notificationMessage = notification.querySelector('.notification-message');
    
    notificationIcon.className = 'notification-icon fas';
    notificationIcon.classList.add(type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle');
    notificationIcon.classList.add(type === 'success' ? 'success' : 'error');
    
    notificationMessage.textContent = message;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
