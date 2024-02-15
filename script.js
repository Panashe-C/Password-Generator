const MIN_LENGTH = 8;
const MAX_LENGTH = 256;

function clampValueInRange(value, minValue, maxValue) {
    const parsedInput = parseInt(value);
    if (isNaN(parsedInput)) return minValue;
    return Math.min(Math.max(parsedInput, minValue), maxValue);
}

function generatePassword() {
    const passwordLengthInput = document.getElementById("password-length");
    const repeatCharactersCheckbox = document.getElementById("repeat-characters");
    const specialCharactersCheckbox = document.getElementById("special-characters");
    const ambiguousCharactersCheckbox = document.getElementById("ambiguous-characters");
    const includeNumbersCheckbox = document.getElementById("include-numbers");
    const includeLettersCheckbox = document.getElementById("include-letters");
    const randomPasswordContainer = document.getElementById("random-password");
    const errorMessage = document.getElementById("error-message");

    const characters = [
        "@", "!", "#", "$", "?", ".", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p",
        "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
        "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    ];

    const pwLength = clampValueInRange(passwordLengthInput.value, MIN_LENGTH, MAX_LENGTH);
    if (pwLength < MIN_LENGTH || pwLength > MAX_LENGTH) {
        errorMessage.textContent = "You must pick a password between " + MIN_LENGTH + " and " + MAX_LENGTH;
        return;
    }

    let filteredCharacters = characters.slice();
    if (!specialCharactersCheckbox.checked) filteredCharacters = filteredCharacters.filter(char => !["@","!","#","$","?","."].includes(char));
    if (!includeNumbersCheckbox.checked) filteredCharacters = filteredCharacters.filter(char => isNaN(char));
    if (!includeLettersCheckbox.checked) filteredCharacters = filteredCharacters.filter(char => isNaN(char) || typeof char === "string");
    if (!ambiguousCharactersCheckbox.checked) filteredCharacters = filteredCharacters.filter(char => !["1", "I", "l", "o", "0"].includes(char.toString()));

    if (!repeatCharactersCheckbox.checked && pwLength > filteredCharacters.length) {
        errorMessage.textContent = "There are not enough unique characters to fulfill the password length requirement.";
        return;
    }

    errorMessage.textContent = "";
    const passwordArray = [];
    while (passwordArray.length < pwLength) {
        const randomIndex = Math.floor(Math.random() * filteredCharacters.length);
        passwordArray.push(filteredCharacters[randomIndex]);
    }

    randomPasswordContainer.textContent = passwordArray.join("");
}

function copyToClip() {
    const randomPasswordContainer = document.getElementById("random-password");
    const passwordValue = randomPasswordContainer.textContent;
    const tempInput = document.createElement("input");
    tempInput.value = passwordValue;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    alert("Password Copied!");
}

function passwordScore(password) {
    let score = 0;
    if (password.length >= MIN_LENGTH) score++;
    if (password.length > 8) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (password.length > 24) score++;
    return score;
}

function updatePasswordStrength() {
    const passwordTest = document.getElementById("password-test").value.trim();
    const passwordIndicator = document.getElementById("password-indicator");
    const passwordStrength = document.getElementById("password-strength");

    if (passwordTest.length === 0) {
        passwordIndicator.className = "";
        passwordStrength.textContent = "";
    } else {
        const score = passwordScore(passwordTest);
        switch (score) {
            case 0:
                passwordIndicator.className = "weak";
                passwordStrength.textContent = "Weak";
                break;
            case 1:
                passwordIndicator.className = "average";
                passwordStrength.textContent = "Average";
                break;
            case 2:
            case 3:
                passwordIndicator.className = "good";
                passwordStrength.textContent = "Good";
                break;
            case 4:
            case 5:
                passwordIndicator.className = "strong";
                passwordStrength.textContent = "Strong";
                break;
            default:
                passwordIndicator.className = "";
                passwordStrength.textContent = "";
                break;
        }
    }
}

function togglePasswordVisibility() {
    const passwordTest = document.getElementById("password-test");
    const passwordToggle = document.getElementById("password-toggle");

    if (passwordTest.type === "password") {
        passwordTest.type = "text";
        passwordToggle.textContent = "hide";
    } else {
        passwordTest.type = "password";
        passwordToggle.textContent = "show";
    }
}

document.getElementById("password-test").addEventListener("input", updatePasswordStrength);
document.getElementById("password-toggle").addEventListener("click", togglePasswordVisibility);
