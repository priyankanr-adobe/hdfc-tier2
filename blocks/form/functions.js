/**
 * Get Full Name
 * @name getFullName Concats first name and last name
 * @param {string} firstname in Stringformat
 * @param {string} lastname in Stringformat
 * @return {string}
 */
function getFullName(firstname, lastname) {
  return `${firstname} ${lastname}`.trim();
}

/**
 * Custom submit function
 * @param {scope} globals
 */
function submitFormArrayToString(globals) {
  const data = globals.functions.exportData();
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      data[key] = data[key].join(',');
    }
  });
  globals.functions.submitForm(data, true, 'application/json');
}

/**
 * Calculate the number of days between two dates.
 * @param {*} endDate
 * @param {*} startDate
 * @returns {number} returns the number of days between two dates
 */
function days(endDate, startDate) {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  // return zero if dates are valid
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const diffInMs = Math.abs(end.getTime() - start.getTime());
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

/**
* Masks the first 5 digits of the mobile number with *
* @param {*} mobileNumber
* @returns {string} returns the mobile number with first 5 digits masked
*/
function maskMobileNumber(mobileNumber) {
  if (!mobileNumber) {
    return '';
  }
  const value = mobileNumber.toString();
  // Mask first 5 digits and keep the rest
  return ` ${'*'.repeat(5)}${value.substring(5)}`;
}

/**
 * Render bank logo row beside salary bank dropdown
 * @param {scope} globals
 * @returns {string}
 */
function renderBankImages(globals) {
  setTimeout(() => {
    const dropdown = document.querySelector('select[name="salary_bank"]');

    if (!dropdown || dropdown.dataset.bankImagesReady === 'true') return;

    dropdown.dataset.bankImagesReady = 'true';

    const banks = [
      { value: 'hdfc_bank', label: 'HDFC Bank', img: '/content/dam/pnr-hdfc/hdfc.png' },
      { value: 'icici_bank', label: 'ICICI Bank', img: '/content/dam/pnr-hdfc/icici.png' },
      { value: 'axis_bank', label: 'Axis Bank', img: '/content/dam/pnr-hdfc/axis.png' },
      { value: 'kotak_bank', label: 'Kotak', img: '/content/dam/pnr-hdfc/kotak.png' },
      { value: 'sbi', label: 'SBI', img: '/content/dam/pnr-hdfc/sbi.png' },
      { value: 'bank_of_baroda', label: 'Bank of Baroda', img: '/content/dam/pnr-hdfc/bob.jpeg' },
      { value: 'idfc_first_bank', label: 'IDFC First', img: '/content/dam/pnr-hdfc/idfc.png' },
    ];

    const row = document.createElement('div');
    row.className = 'bank-ui-row';

    const logos = document.createElement('div');
    logos.className = 'bank-logo-list';

    banks.forEach((bank) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'bank-logo-item';
      item.dataset.bank = bank.value;

      item.innerHTML = `
        <span class="bank-logo-box">
          <img src="${bank.img}" alt="${bank.label}">
        </span>
        <span class="bank-logo-name">${bank.label}</span>
        <span class="bank-logo-dot"></span>
      `;

      item.addEventListener('click', () => {
        dropdown.value = bank.value;
        dropdown.dispatchEvent(new Event('change', { bubbles: true }));
        updateSelected();
      });

      logos.appendChild(item);
    });

    const dropdownWrap = document.createElement('div');
    dropdownWrap.className = 'bank-dropdown-wrap';

    dropdown.parentElement.insertBefore(row, dropdown);
    row.appendChild(logos);
    row.appendChild(dropdownWrap);
    dropdownWrap.appendChild(dropdown);

    function updateSelected() {
      logos.querySelectorAll('.bank-logo-item').forEach((item) => {
        item.classList.toggle('selected', item.dataset.bank === dropdown.value);
      });
    }

    dropdown.addEventListener('change', updateSelected);
    updateSelected();
  }, 800);

  return 'Bank images rendered';
}


// eslint-disable-next-line import/prefer-default-export
export {
  getFullName, days, submitFormArrayToString, maskMobileNumber, renderBankImages, 
};
