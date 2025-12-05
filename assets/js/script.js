// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCWILrDxT_u9Ak6DKfgnfUrV2Ugzqz8_d4",
    authDomain: "signaturepro-group60.firebaseapp.com",
    projectId: "signaturepro-group60",
    storageBucket: "signaturepro-group60.firebasestorage.app",
    messagingSenderId: "91815405270",
    appId: "1:91815405270:web:7761681fda89992f7e4b77"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Current user state
let currentUser = null;
let currentTemplate = 'modern';
let userInitials = '';

// Template configurations
const templates = {
    'modern': {
        name: 'Modern',
        icon: 'fas fa-layer-group',
        class: 'signature-modern'
    },
    'classic': {
        name: 'Classic',
        icon: 'fas fa-border-all',
        class: 'signature-classic'
    },
    'minimal': {
        name: 'Minimal',
        icon: 'fas fa-minus',
        class: 'signature-minimal'
    },
    'colorful': {
        name: 'Colorful',
        icon: 'fas fa-palette',
        class: 'signature-colorful'
    },
    'elegant': {
        name: 'Elegant',
        icon: 'fas fa-gem',
        class: 'signature-elegant'
    },
    'corporate': {
        name: 'Corporate',
        icon: 'fas fa-building',
        class: 'signature-corporate'
    }
};

// DOM Elements
const elements = {
    navButtons: document.getElementById('navButtons'),
    profileDropdown: document.getElementById('profileDropdown'),
    userAvatar: document.getElementById('userAvatar'),
    userDisplayName: document.getElementById('userDisplayName'),
    dropdownAvatar: document.getElementById('dropdownAvatar'),
    dropdownName: document.getElementById('dropdownName'),
    dropdownEmail: document.getElementById('dropdownEmail'),
    minimalAvatar: document.getElementById('minimalAvatar'),
    minimalDropdownAvatar: document.getElementById('minimalDropdownAvatar'),
    minimalDropdownName: document.getElementById('minimalDropdownName'),
    minimalDropdownEmail: document.getElementById('minimalDropdownEmail')
};

// Initialize application
function initApp() {
    // Check authentication state
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            userInitials = getInitials(user.displayName || user.email);
            updateUIForLoggedInUser();
            loadUserData();
        } else {
            currentUser = null;
            userInitials = '';
            updateUIForLoggedOutUser();
        }
    });

    // Initialize event listeners
    initEventListeners();
    
    // Initialize template options
    initTemplateOptions();
}

// Get user initials
function getInitials(name) {
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

// Update UI for logged-in user
function updateUIForLoggedInUser() {
    if (elements.navButtons) elements.navButtons.style.display = 'none';
    if (elements.profileDropdown) elements.profileDropdown.style.display = 'block';
    
    // Update user info in dropdowns
    updateUserInfo();
    
    // Pre-fill user email in signature builder
    prefillUserData();
}

// Update user information in UI
function updateUserInfo() {
    if (!currentUser) return;
    
    const userName = currentUser.displayName || currentUser.email.split('@')[0];
    const userEmail = currentUser.email;
    
    // Update main header dropdown
    if (elements.userAvatar) elements.userAvatar.textContent = userInitials;
    if (elements.userDisplayName) elements.userDisplayName.textContent = userName;
    if (elements.dropdownAvatar) elements.dropdownAvatar.textContent = userInitials;
    if (elements.dropdownName) elements.dropdownName.textContent = userName;
    if (elements.dropdownEmail) elements.dropdownEmail.textContent = userEmail;
    
    // Update minimal header dropdown
    if (elements.minimalAvatar) elements.minimalAvatar.textContent = userInitials;
    if (elements.minimalDropdownAvatar) elements.minimalDropdownAvatar.textContent = userInitials;
    if (elements.minimalDropdownName) elements.minimalDropdownName.textContent = userName;
    if (elements.minimalDropdownEmail) elements.minimalDropdownEmail.textContent = userEmail;
}

// Update UI for logged-out user
function updateUIForLoggedOutUser() {
    if (elements.navButtons) elements.navButtons.style.display = 'flex';
    if (elements.profileDropdown) elements.profileDropdown.style.display = 'none';
    
    // Hide dropdown if open
    hideAllDropdowns();
}

// Prefill user data in forms
function prefillUserData() {
    if (!currentUser) return;
    
    const emailInput = document.getElementById('email');
    const fullNameInput = document.getElementById('fullName');
    
    if (emailInput) emailInput.value = currentUser.email;
    if (fullNameInput && currentUser.displayName) {
        fullNameInput.value = currentUser.displayName;
    }
    
    updatePreview();
}

// Load user data into settings form
function loadUserData() {
    if (!currentUser) return;
    
    const profileNameInput = document.getElementById('profileName');
    const profileEmailInput = document.getElementById('profileEmail');
    
    if (profileNameInput) profileNameInput.value = currentUser.displayName || '';
    if (profileEmailInput) profileEmailInput.value = currentUser.email || '';
}

// Initialize event listeners
function initEventListeners() {
    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Active nav link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                navLink.classList.add('active');
            }
        });
    });

    // Update color value display
    const colorInput = document.getElementById('primaryColor');
    if (colorInput) {
        colorInput.addEventListener('input', (e) => {
            document.getElementById('colorValue').textContent = e.target.value;
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
        const dropdowns = document.querySelectorAll('.dropdown-content.show');
        dropdowns.forEach(dropdown => {
            const userInfo = dropdown.closest('.profile-dropdown').querySelector('.user-info');
            if (!userInfo.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.classList.remove('show');
            }
        });
    });
}

// Initialize template options
function initTemplateOptions() {
    const templateSelector = document.getElementById('templateSelector');
    if (!templateSelector) return;
    
    templateSelector.innerHTML = '';
    
    Object.entries(templates).forEach(([key, template]) => {
        const option = document.createElement('div');
        option.className = 'template-option';
        option.onclick = () => selectTemplate(key);
        option.innerHTML = `
            <input type="radio" name="template" value="${key}" id="temp-${key}" ${key === currentTemplate ? 'checked' : ''}>
            <label for="temp-${key}">
                <i class="${template.icon}"></i>
                <span>${template.name}</span>
            </label>
        `;
        templateSelector.appendChild(option);
    });
}

// Navigation Functions
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Toggle dropdowns
function toggleDropdown() {
    const dropdown = document.getElementById('dropdownMenu');
    if (dropdown) dropdown.classList.toggle('show');
}

function toggleMinimalDropdown() {
    const dropdown = document.getElementById('minimalDropdownMenu');
    if (dropdown) dropdown.classList.toggle('show');
}

// Hide all dropdowns
function hideAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-content');
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
    });
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
    hideAllDropdowns();
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function switchModal(closeModalId, openModalId) {
    closeModal(closeModalId);
    openModal(openModalId);
}

// Open profile settings
function openProfileSettings(tab = 'profile') {
    loadUserData();
    openModal('settingsModal');
    switchTab(tab);
}

// Switch settings tab
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabName}Tab`) {
            content.classList.add('active');
        }
    });
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    showLoading(true);
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            showLoading(false);
            showToast('Login successful! Welcome back!', 'success');
            closeModal('loginModal');
            event.target.reset();
        })
        .catch((error) => {
            showLoading(false);
            showToast('Error: ' + error.message, 'error');
        });
}

// Handle Signup
function handleSignup(event) {
    event.preventDefault();
    showLoading(true);
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            return userCredential.user.updateProfile({
                displayName: name
            });
        })
        .then(() => {
            showLoading(false);
            showToast('Account created successfully!', 'success');
            closeModal('signupModal');
            event.target.reset();
        })
        .catch((error) => {
            showLoading(false);
            showToast('Error: ' + error.message, 'error');
        });
}

// Update profile
function updateProfile(event) {
    event.preventDefault();
    showLoading(true);
    
    const name = document.getElementById('profileName').value;
    const email = document.getElementById('profileEmail').value;

    const promises = [];
    
    if (name !== currentUser.displayName) {
        promises.push(currentUser.updateProfile({ displayName: name }));
    }
    
    if (email !== currentUser.email) {
        promises.push(currentUser.updateEmail(email));
    }
    
    Promise.all(promises)
        .then(() => {
            showLoading(false);
            showToast('Profile updated successfully!', 'success');
            updateUserInfo();
            closeModal('settingsModal');
        })
        .catch((error) => {
            showLoading(false);
            showToast('Error: ' + error.message, 'error');
        });
}

// Change password
function changePassword(event) {
    event.preventDefault();
    showLoading(true);
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        showLoading(false);
        showToast('New passwords do not match!', 'error');
        return;
    }

    const credential = firebase.auth.EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
    );

    currentUser.reauthenticateWithCredential(credential)
        .then(() => {
            return currentUser.updatePassword(newPassword);
        })
        .then(() => {
            showLoading(false);
            showToast('Password changed successfully!', 'success');
            event.target.reset();
        })
        .catch((error) => {
            showLoading(false);
            showToast('Error: ' + error.message, 'error');
        });
}

// Logout
function logout() {
    auth.signOut()
        .then(() => {
            showToast('Logged out successfully!', 'success');
            backToHome();
        })
        .catch((error) => {
            showToast('Error: ' + error.message, 'error');
        });
}

// Check authentication before creating signature
function checkAuthAndCreate() {
    if (currentUser) {
        showBuilder();
    } else {
        showToast('Please login to create your signature!', 'warning');
        openModal('loginModal');
    }
}

// Show builder with minimal header
function showBuilder() {
    // Hide main sections
    document.querySelectorAll('section:not(#builderSection)').forEach(section => {
        section.style.display = 'none';
    });
    
    // Hide main navbar and footer
    document.querySelector('.navbar').style.display = 'none';
    document.querySelector('.footer').style.display = 'none';
    
    // Show minimal header
    document.getElementById('builderHeaderMinimal').style.display = 'flex';
    
    // Show builder
    document.getElementById('builderSection').style.display = 'block';
    window.scrollTo(0, 0);
    updatePreview();
}

// Back to home
function backToHome() {
    // Hide minimal header
    document.getElementById('builderHeaderMinimal').style.display = 'none';
    
    // Show all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'block';
    });
    
    // Show main navbar and footer
    document.querySelector('.navbar').style.display = 'block';
    document.querySelector('.footer').style.display = 'block';
    
    // Hide builder
    document.getElementById('builderSection').style.display = 'none';
    window.scrollTo(0, 0);
}

// Template Selection
function selectTemplate(template) {
    currentTemplate = template;
    updatePreview();
    
    // Update radio button
    const radio = document.getElementById(`temp-${template}`);
    if (radio) {
        radio.checked = true;
    }
}

// Update signature preview
function updatePreview() {
    const preview = document.getElementById('signaturePreview');
    if (!preview) return;
    
    // Get input values
    const fullName = document.getElementById('fullName').value;
    const jobTitle = document.getElementById('jobTitle').value;
    const companyName = document.getElementById('companyName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const website = document.getElementById('website').value;
    const linkedin = document.getElementById('linkedin').value;
    const twitter = document.getElementById('twitter').value;
    const facebook = document.getElementById('facebook').value;
    const instagram = document.getElementById('instagram').value;
    const primaryColor = document.getElementById('primaryColor').value;
    const fontSize = document.getElementById('fontSize').value;

    // Only show fields that have values
    const hasPersonalInfo = fullName || jobTitle || companyName;
    const hasContactInfo = email || phone || website;
    const hasSocialInfo = linkedin || twitter || facebook || instagram;

    // If no data is entered, show empty preview
    if (!hasPersonalInfo && !hasContactInfo && !hasSocialInfo) {
        preview.innerHTML = '<div style="color: #999; text-align: center;">Start typing to see your signature preview...</div>';
        return;
    }

    // Calculate font size multiplier
    let fontMultiplier = 1;
    if (fontSize === 'small') fontMultiplier = 0.85;
    if (fontSize === 'large') fontMultiplier = 1.15;

    // Generate signature HTML
    let signatureHTML = generateSignatureHTML({
        fullName: fullName || '',
        jobTitle: jobTitle || '',
        companyName: companyName || '',
        email: email || '',
        phone: phone || '',
        website: website || '',
        linkedin: linkedin || '',
        twitter: twitter || '',
        facebook: facebook || '',
        instagram: instagram || '',
        primaryColor: primaryColor,
        fontMultiplier: fontMultiplier
    });

    preview.innerHTML = signatureHTML;
}

// Generate signature HTML based on template
function generateSignatureHTML(data) {
    const { fullName, jobTitle, companyName, email, phone, website, linkedin, twitter, facebook, instagram, primaryColor, fontMultiplier } = data;
    
    let signatureHTML = '';
    
    switch(currentTemplate) {
        case 'modern':
            signatureHTML = `
                <div class="signature-modern" style="font-family: Arial, sans-serif; max-width: 500px;">
                    <div style="border-left: 4px solid ${primaryColor}; padding-left: 15px;">
                        ${fullName ? `<div style="font-size: ${1.3 * fontMultiplier}rem; font-weight: bold; color: ${primaryColor};">${fullName}</div>` : ''}
                        ${jobTitle ? `<div style="font-size: ${1 * fontMultiplier}rem; color: #666; margin: 5px 0;">${jobTitle}</div>` : ''}
                        ${companyName ? `<div style="font-size: ${1.1 * fontMultiplier}rem; font-weight: 600; color: #333; margin: 10px 0;">${companyName}</div>` : ''}
                        ${(email || phone || website) ? `
                            <div style="font-size: ${0.9 * fontMultiplier}rem; color: #555; line-height: 1.8;">
                                ${email ? `📧 ${email}<br>` : ''}
                                ${phone ? `📱 ${phone}<br>` : ''}
                                ${website ? `🌐 ${website}` : ''}
                            </div>
                        ` : ''}
                        ${(linkedin || twitter || facebook || instagram) ? `
                            <div style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
                                ${linkedin ? `<a href="${linkedin}" style="color: ${primaryColor}; text-decoration: none; font-size: ${0.85 * fontMultiplier}rem;">🔗 LinkedIn</a>` : ''}
                                ${twitter ? `<a href="https://twitter.com/${twitter.replace('@', '')}" style="color: ${primaryColor}; text-decoration: none; font-size: ${0.85 * fontMultiplier}rem;">🐦 Twitter</a>` : ''}
                                ${facebook ? `<a href="${facebook}" style="color: ${primaryColor}; text-decoration: none; font-size: ${0.85 * fontMultiplier}rem;">👤 Facebook</a>` : ''}
                                ${instagram ? `<a href="https://instagram.com/${instagram.replace('@', '')}" style="color: ${primaryColor}; text-decoration: none; font-size: ${0.85 * fontMultiplier}rem;">📷 Instagram</a>` : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            break;
            
        case 'classic':
            signatureHTML = `
                <div class="signature-classic" style="font-family: Georgia, serif; max-width: 500px; border: 2px solid ${primaryColor}; padding: 20px; border-radius: 10px;">
                    <div style="text-align: center;">
                        ${fullName ? `<div style="font-size: ${1.5 * fontMultiplier}rem; font-weight: bold; color: ${primaryColor}; margin-bottom: 5px;">${fullName}</div>` : ''}
                        ${jobTitle ? `<div style="font-size: ${1 * fontMultiplier}rem; font-style: italic; color: #666; margin-bottom: 10px;">${jobTitle}</div>` : ''}
                        ${companyName ? `<div style="font-size: ${1.1 * fontMultiplier}rem; font-weight: 600; color: #333; margin-bottom: 15px;">${companyName}</div>` : ''}
                        <div style="border-top: 1px solid #ddd; padding-top: 15px;">
                            ${(email || phone || website) ? `
                                <div style="font-size: ${0.9 * fontMultiplier}rem; color: #555;">
                                    ${email ? `${email} ` : ''}
                                    ${email && phone ? '| ' : ''}
                                    ${phone ? `${phone} ` : ''}
                                    ${(email || phone) && website ? '| ' : ''}
                                    ${website ? website : ''}
                                </div>
                            ` : ''}
                            ${(linkedin || twitter || facebook || instagram) ? `
                                <div style="margin-top: 10px; font-size: ${0.85 * fontMultiplier}rem;">
                                    ${linkedin ? `<a href="${linkedin}" style="color: ${primaryColor}; text-decoration: none;">LinkedIn</a>` : ''}
                                    ${linkedin && twitter ? ' • ' : ''}
                                    ${twitter ? `<a href="https://twitter.com/${twitter.replace('@', '')}" style="color: ${primaryColor}; text-decoration: none;">Twitter</a>` : ''}
                                    ${(linkedin || twitter) && facebook ? ' • ' : ''}
                                    ${facebook ? `<a href="${facebook}" style="color: ${primaryColor}; text-decoration: none;">Facebook</a>` : ''}
                                    ${(linkedin || twitter || facebook) && instagram ? ' • ' : ''}
                                    ${instagram ? `<a href="https://instagram.com/${instagram.replace('@', '')}" style="color: ${primaryColor}; text-decoration: none;">Instagram</a>` : ''}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'minimal':
            signatureHTML = `
                <div class="signature-minimal" style="font-family: Helvetica, sans-serif; max-width: 500px;">
                    ${fullName ? `<div style="font-size: ${1.2 * fontMultiplier}rem; font-weight: bold; color: #333;">${fullName}</div>` : ''}
                    ${(jobTitle || companyName) ? `<div style="font-size: ${0.95 * fontMultiplier}rem; color: #666; margin: 3px 0;">${jobTitle ? jobTitle : ''}${jobTitle && companyName ? ' at ' : ''}${companyName ? companyName : ''}</div>` : ''}
                    ${(email || phone || website) ? `
                        <div style="font-size: ${0.9 * fontMultiplier}rem; color: #555; margin-top: 10px;">
                            ${email ? email : ''}
                            ${email && phone ? ' • ' : ''}
                            ${phone ? phone : ''}
                            ${(email || phone) && website ? ' • ' : ''}
                            ${website ? website : ''}
                        </div>
                    ` : ''}
                    ${(linkedin || twitter || facebook || instagram) ? `
                        <div style="margin-top: 10px; font-size: ${0.85 * fontMultiplier}rem;">
                            ${linkedin ? `<a href="${linkedin}" style="color: ${primaryColor}; text-decoration: none;">LinkedIn</a>` : ''}
                            ${linkedin && twitter ? ' • ' : ''}
                            ${twitter ? `<a href="https://twitter.com/${twitter.replace('@', '')}" style="color: ${primaryColor}; text-decoration: none;">Twitter</a>` : ''}
                            ${(linkedin || twitter) && facebook ? ' • ' : ''}
                            ${facebook ? `<a href="${facebook}" style="color: ${primaryColor}; text-decoration: none;">Facebook</a>` : ''}
                            ${(linkedin || twitter || facebook) && instagram ? ' • ' : ''}
                            ${instagram ? `<a href="https://instagram.com/${instagram.replace('@', '')}" style="color: ${primaryColor}; text-decoration: none;">Instagram</a>` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
            break;
            
        case 'colorful':
            signatureHTML = `
                <div class="signature-colorful" style="font-family: 'Segoe UI', sans-serif; max-width: 600px; background: linear-gradient(135deg, ${primaryColor}, #48dbfb); color: white; padding: 25px; border-radius: 15px;">
                    <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
                        <div style="flex: 1;">
                            ${fullName ? `<div style="font-size: ${1.5 * fontMultiplier}rem; font-weight: bold; margin-bottom: 5px;">${fullName}</div>` : ''}
                            ${jobTitle ? `<div style="font-size: ${1.1 * fontMultiplier}rem; opacity: 0.9; margin-bottom: 10px;">${jobTitle}</div>` : ''}
                            ${companyName ? `<div style="font-size: ${1.2 * fontMultiplier}rem; font-weight: 600; margin-bottom: 15px;">${companyName}</div>` : ''}
                            ${(email || phone || website) ? `
                                <div style="font-size: ${0.9 * fontMultiplier}rem; opacity: 0.8;">
                                    ${email ? `📧 ${email}<br>` : ''}
                                    ${phone ? `📱 ${phone}<br>` : ''}
                                    ${website ? `🌐 ${website}` : ''}
                                </div>
                            ` : ''}
                        </div>
                        ${(linkedin || twitter || facebook || instagram) ? `
                            <div style="display: flex; gap: 15px; margin-top: 15px;">
                                ${linkedin ? `<a href="${linkedin}" style="color: white; font-size: 1.5rem;"><i class="fab fa-linkedin"></i></a>` : ''}
                                ${twitter ? `<a href="https://twitter.com/${twitter.replace('@', '')}" style="color: white; font-size: 1.5rem;"><i class="fab fa-twitter"></i></a>` : ''}
                                ${facebook ? `<a href="${facebook}" style="color: white; font-size: 1.5rem;"><i class="fab fa-facebook"></i></a>` : ''}
                                ${instagram ? `<a href="https://instagram.com/${instagram.replace('@', '')}" style="color: white; font-size: 1.5rem;"><i class="fab fa-instagram"></i></a>` : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            break;
            
        case 'elegant':
            signatureHTML = `
                <div class="signature-elegant" style="font-family: Georgia, serif; max-width: 550px; border: 1px solid #ddd; padding: 30px; border-radius: 10px;">
                    <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                        <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, ${primaryColor}, #9b59b6); display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; font-weight: bold;">${fullName ? fullName.charAt(0) : '?'}</div>
                        <div>
                            ${fullName ? `<div style="font-size: ${1.4 * fontMultiplier}rem; font-weight: bold; color: ${primaryColor}; margin-bottom: 5px;">${fullName}</div>` : ''}
                            ${jobTitle ? `<div style="font-size: ${1 * fontMultiplier}rem; color: #666; font-style: italic;">${jobTitle}</div>` : ''}
                        </div>
                    </div>
                    <div style="border-top: 2px solid ${primaryColor}; padding-top: 20px;">
                        ${companyName ? `<div style="font-size: ${1.1 * fontMultiplier}rem; font-weight: 600; color: #333; margin-bottom: 10px;">${companyName}</div>` : ''}
                        ${(email || phone || website) ? `
                            <div style="font-size: ${0.9 * fontMultiplier}rem; color: #555; line-height: 1.8;">
                                ${email ? `<i class="fas fa-envelope"></i> ${email}<br>` : ''}
                                ${phone ? `<i class="fas fa-phone"></i> ${phone}<br>` : ''}
                                ${website ? `<i class="fas fa-globe"></i> ${website}` : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            break;
            
        case 'corporate':
            signatureHTML = `
                <div class="signature-corporate" style="font-family: Arial, sans-serif; max-width: 500px; background: #2c3e50; color: white; padding: 25px; border-radius: 10px;">
                    ${fullName ? `<div style="font-size: ${1.3 * fontMultiplier}rem; font-weight: bold; color: white; margin-bottom: 5px;">${fullName}</div>` : ''}
                    ${jobTitle ? `<div style="font-size: ${1 * fontMultiplier}rem; color: #bdc3c7; margin-bottom: 10px;">${jobTitle}</div>` : ''}
                    ${companyName ? `<div style="font-size: ${1.1 * fontMultiplier}rem; font-weight: 600; color: white; margin-bottom: 15px;">${companyName}</div>` : ''}
                    ${(email || phone || website) ? `
                        <div style="font-size: ${0.9 * fontMultiplier}rem; color: #95a5a6; line-height: 1.8; border-top: 1px solid #34495e; padding-top: 15px;">
                            ${email ? `📧 ${email}<br>` : ''}
                            ${phone ? `📱 ${phone}<br>` : ''}
                            ${website ? `🌐 ${website}` : ''}
                        </div>
                    ` : ''}
                    ${(linkedin || twitter || facebook || instagram) ? `
                        <div style="margin-top: 15px; display: flex; gap: 15px;">
                            ${linkedin ? `<a href="${linkedin}" style="color: #3498db; font-size: 1.2rem;"><i class="fab fa-linkedin"></i></a>` : ''}
                            ${twitter ? `<a href="https://twitter.com/${twitter.replace('@', '')}" style="color: #3498db; font-size: 1.2rem;"><i class="fab fa-twitter"></i></a>` : ''}
                            ${facebook ? `<a href="${facebook}" style="color: #3498db; font-size: 1.2rem;"><i class="fab fa-facebook"></i></a>` : ''}
                            ${instagram ? `<a href="https://instagram.com/${instagram.replace('@', '')}" style="color: #3498db; font-size: 1.2rem;"><i class="fab fa-instagram"></i></a>` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
            break;
    }
    
    return signatureHTML;
}

// Copy signature to clipboard
function copySignature() {
    const signatureHTML = document.getElementById('signaturePreview').innerHTML;
    
    // Check if there's actual content to copy
    if (!signatureHTML || signatureHTML.includes('Start typing')) {
        showToast('Please add some content to your signature first!', 'warning');
        return;
    }
    
    const textarea = document.createElement('textarea');
    textarea.value = signatureHTML;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showToast('Signature HTML copied to clipboard!', 'success');
    } catch (err) {
        showToast('Failed to copy. Please try again.', 'error');
    }
    
    document.body.removeChild(textarea);
}

// Download signature as HTML file
function downloadSignature() {
    const signatureHTML = document.getElementById('signaturePreview').innerHTML;
    
    // Check if there's actual content to download
    if (!signatureHTML || signatureHTML.includes('Start typing')) {
        showToast('Please add some content to your signature first!', 'warning');
        return;
    }
    
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Signature</title>
    <style>
        body { 
            margin: 0; 
            padding: 20px; 
            background: #f5f5f5; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            min-height: 100vh; 
        }
        .signature-container { 
            background: white; 
            padding: 20px; 
            border-radius: 10px; 
            box-shadow: 0 5px 15px rgba(0,0,0,0.1); 
        }
    </style>
</head>
<body>
    <div class="signature-container">
        ${signatureHTML}
    </div>
</body>
</html>`;
    
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-signature.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Signature downloaded as HTML!', 'success');
}

// Download signature as image
function downloadAsImage() {
    const signatureElement = document.getElementById('signaturePreview');
    
    // Check if there's actual content to download
    if (!signatureElement.innerHTML || signatureElement.innerHTML.includes('Start typing')) {
        showToast('Please add some content to your signature first!', 'warning');
        return;
    }
    
    showLoading(true);
    
    html2canvas(signatureElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
    }).then(canvas => {
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'email-signature.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showLoading(false);
            showToast('Signature downloaded as image!', 'success');
        });
    }).catch(error => {
        showLoading(false);
        showToast('Failed to export image. Please try again.', 'error');
    });
}

// Handle Contact Form
function handleContactForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
    
    // Reset form
    event.target.reset();
}

// Handle Newsletter
function handleNewsletter(event) {
    event.preventDefault();
    
    const email = event.target.querySelector('input[type="email"]').value;
    
    showToast('Successfully subscribed to newsletter!', 'success');
    event.target.reset();
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.style.display = 'flex';
    
    // Change color based on type
    if (type === 'error') {
        toast.style.background = 'linear-gradient(135deg, #ff4757, #ff3838)';
        toast.querySelector('i').className = 'fas fa-exclamation-circle';
    } else if (type === 'warning') {
        toast.style.background = 'linear-gradient(135deg, #ffa502, #ff6348)';
        toast.querySelector('i').className = 'fas fa-exclamation-triangle';
    } else {
        toast.style.background = 'linear-gradient(135deg, #2ed573, #26de81)';
        toast.querySelector('i').className = 'fas fa-check-circle';
    }
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Show/Hide Loading
function showLoading(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = show ? 'flex' : 'none';
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);