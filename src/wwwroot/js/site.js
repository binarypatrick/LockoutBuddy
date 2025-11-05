// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
/**
 * Watches a phone input field and validates it in real-time
 * @param {string|HTMLElement} input - CSS selector or DOM element for the input
 * @param {Object} options - Configuration options
 * @param {Function} options.onValid - Callback when phone is valid
 * @param {Function} options.onInvalid - Callback when phone is invalid
 * @param {boolean} options.autoFormat - Auto-format as user types (default: false)
 * @param {boolean} options.preventInvalid - Prevent invalid characters (default: false)
 * @returns {Object} - Object with destroy method to remove listeners
 */
function watchPhoneInput(input, options = {}) {
    // Get the input element
    const inputEl = typeof input === 'string'
        ? document.querySelector(input)
        : input;

    if (!inputEl) {
        console.error('Phone input element not found');
        return;
    }
    
    // Default options
    const config = {
        onValid: () => {},
        onInvalid: () => {},
        autoFormat: true,
        preventInvalid: true,
        ...options
    };

    // Phone validation regex patterns
    const patterns = {
        // Matches: (555) 123-4567, 555-123-4567, 555.123.4567, 5551234567, +1 555 123 4567
        full: /^(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
        // For checking if input contains only valid characters
        validChars: /^[\d\s\-\.\(\)\+]*$/
    };

    /**
     * Validates a phone number
     * @param {string} value - The phone number to validate
     * @returns {boolean} - True if valid
     */
    function isValidPhone(value) {
        // Remove all whitespace and special characters for validation
        const cleaned = value.replace(/[\s\-\.\(\)]/g, '');

        // Check if it matches US phone number format (10 digits, optional +1)
        return patterns.full.test(value) ||
            (cleaned.length === 10 && /^\d{10}$/.test(cleaned)) ||
            (cleaned.length === 11 && /^1\d{10}$/.test(cleaned));
    }

    /**
     * Formats phone number as (555) 123-4567
     * @param {string} value - Raw phone number
     * @returns {string} - Formatted phone number
     */
    function formatPhone(value) {
        // Remove all non-digit characters
        const cleaned = value.replace(/\D/g, '');

        // Format based on length
        if (cleaned.length <= 3) {
            return cleaned;
        } else if (cleaned.length <= 6) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
        } else if (cleaned.length <= 10) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        } else {
            // Handle country code
            return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 11)}`;
        }
    }

    /**
     * Handle input event
     */
    function handleInput(e) {
        let value = e.target.value;

        // Prevent invalid characters if option is enabled
        if (config.preventInvalid && !patterns.validChars.test(value)) {
            e.target.value = value.replace(/[^\d\s\-\.\(\)\+]/g, '');
            return;
        }

        // Auto-format if option is enabled
        if (config.autoFormat && value) {
            const cursorPos = e.target.selectionStart;
            const oldLength = value.length;
            const formatted = formatPhone(value);
            e.target.value = formatted;

            // Adjust cursor position after formatting
            const newLength = formatted.length;
            const diff = newLength - oldLength;
            e.target.setSelectionRange(cursorPos + diff, cursorPos + diff);
            value = formatted;
        }

        // Validate
        const valid = value.trim() !== '' && isValidPhone(value);

        // Add visual feedback classes
        inputEl.classList.remove('valid', 'invalid');
        if (value.trim() !== '') {
            inputEl.classList.add(valid ? 'valid' : 'invalid');
        }

        // Call callbacks
        if (valid) {
            config.onValid(value, inputEl);
        } else if (value.trim() !== '') {
            config.onInvalid(value, inputEl);
        }
    }

    /**
     * Handle blur event (when user leaves the field)
     */
    function handleBlur(e) {
        const value = e.target.value.trim();
        if (value !== '' && !isValidPhone(value)) {
            inputEl.classList.add('invalid');
            config.onInvalid(value, inputEl);
        }
    }

    // Attach event listeners
    inputEl.addEventListener('input', handleInput);
    inputEl.addEventListener('blur', handleBlur);

    // Return object with destroy method
    return {
        destroy() {
            inputEl.removeEventListener('input', handleInput);
            inputEl.removeEventListener('blur', handleBlur);
            inputEl.classList.remove('valid', 'invalid');
        },
        validate() {
            return isValidPhone(inputEl.value);
        },
        getValue() {
            return inputEl.value;
        }
    };
}
