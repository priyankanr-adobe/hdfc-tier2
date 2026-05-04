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
 * @param {scope} globals
 * @returns {string}
 */
function renderBankSelector(globals) {
  const dropdown =
    document.querySelector('select[name="salary_bank"]') ||
    document.querySelector('#dropdown-91e44c1eef');

  if (!dropdown || dropdown.dataset.bankSelectorReady === 'true') {
    return 'Bank selector already initialized or dropdown not found';
  }

  dropdown.dataset.bankSelectorReady = 'true';

  const banks = [
    { value: 'hdfc_bank', label: 'HDFC Bank', img: '/content/dam/pnr-hdfc/hdfc.png' },
    { value: 'icici_bank', label: 'ICICI Bank', img: '/content/dam/pnr-hdfc/icici.png' },
    { value: 'axis_bank', label: 'Axis Bank', img: '/content/dam/pnr-hdfc/axis.png' },
    { value: 'kotak_bank', label: 'Kotak', img: '/content/dam/pnr-hdfc/kotak.png' },
    { value: 'sbi', label: 'SBI', img: '/content/dam/pnr-hdfc/sbi.png' },
    { value: 'bank_of_baroda', label: 'Bank of Baroda', img: '/content/dam/pnr-hdfc/bob.jpeg' },
    { value: 'idfc_first_bank', label: 'IDFC First', img: '/content/dam/pnr-hdfc/idfc.png' },
  ];

  const bankRow = document.createElement('div');
  bankRow.className = 'bank-logo-row';

  banks.forEach((bank) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'bank-logo-card';
    card.dataset.value = bank.value;

    card.innerHTML = `
      <span class="bank-logo-img-wrap">
        <img src="${bank.img}" alt="${bank.label}">
      </span>
      <span class="bank-logo-label">${bank.label}</span>
      <span class="bank-selected-dot"></span>
    `;

    card.addEventListener('click', () => {
      dropdown.value = bank.value;
      dropdown.dispatchEvent(new Event('change', { bubbles: true }));
      updateActive();
    });

    bankRow.appendChild(card);
  });

  dropdown.parentElement.insertBefore(bankRow, dropdown);

  function updateActive() {
    bankRow.querySelectorAll('.bank-logo-card').forEach((card) => {
      card.classList.toggle('active', card.dataset.value === dropdown.value);
    });
  }

  dropdown.addEventListener('change', updateActive);
  updateActive();

  return 'Bank selector rendered successfully';
}



// eslint-disable-next-line import/prefer-default-export
export {
  getFullName, days, submitFormArrayToString, maskMobileNumber, renderBankSelector, 
};
