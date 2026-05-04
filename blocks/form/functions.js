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

function bankLogoPath(value) {
  const logoMap = {
    hdfc_bank: '/content/dam/pnr-hdfc/hdfc.png',
    icici_bank: '/content/dam/pnr-hdfc/icici.png',
    axis_bank: '/content/dam/pnr-hdfc/axis.png',
    kotak_bank: '/content/dam/pnr-hdfc/kotak.png',
    sbi: '/content/dam/pnr-hdfc/sbi.png',
    bank_of_baroda: '/content/dam/pnr-hdfc/bob.jpeg',
    idfc_first_bank: '/content/dam/pnr-hdfc/idfc.png',
  };

  return logoMap[value] || '';
}

function markSelectedBank(bankValue, logoWrapper) {
  logoWrapper.querySelectorAll('.bank-item').forEach((card) => {
    card.classList.toggle('active', card.dataset.bankValue === bankValue);
  });
}

function buildBankCard(option, originalSelect, logoWrapper) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'bank-item';
  card.dataset.bankValue = option.value;

  card.innerHTML = `
    <span class="bank-logo-box">
      <img src="${bankLogoPath(option.value)}" alt="${option.text}">
    </span>
    <span class="bank-name">${option.text}</span>
  `;

  card.addEventListener('click', () => {
    originalSelect.value = option.value;
    originalSelect.dispatchEvent(new Event('change', { bubbles: true }));
    markSelectedBank(option.value, logoWrapper);
  });

  return card;
}

function mountSalaryBankUI() {
  const originalSelect = document.querySelector("select[name='salary_bank']");
  if (!originalSelect || originalSelect.dataset.logoUiMounted === 'true') return;

  const parentPanel = originalSelect.closest('.field-salary-bank-selection');
  if (!parentPanel) return;

  originalSelect.dataset.logoUiMounted = 'true';

  const bankValues = [
    'hdfc_bank',
    'icici_bank',
    'axis_bank',
    'kotak_bank',
    'sbi',
    'bank_of_baroda',
    'idfc_first_bank',
  ];

  const layout = document.createElement('div');
  layout.className = 'bank-ui';

  const logoWrapper = document.createElement('div');
  logoWrapper.className = 'bank-list';

  const selectWrapper = document.createElement('div');
  selectWrapper.className = 'bank-dropdown-wrap';

  bankValues.forEach((value) => {
    const matchingOption = Array.from(originalSelect.options)
      .find((option) => option.value === value);

    if (matchingOption) {
      logoWrapper.appendChild(
        buildBankCard(matchingOption, originalSelect, logoWrapper)
      );
    }
  });

  const visibleSelect = originalSelect.cloneNode(true);
  visibleSelect.className = 'bank-other-dropdown';
  visibleSelect.removeAttribute('id');

  visibleSelect.addEventListener('change', () => {
    originalSelect.value = visibleSelect.value;
    originalSelect.dispatchEvent(new Event('change', { bubbles: true }));
    markSelectedBank(visibleSelect.value, logoWrapper);
  });

  originalSelect.addEventListener('change', () => {
    visibleSelect.value = originalSelect.value;
    markSelectedBank(originalSelect.value, logoWrapper);
  });

  layout.appendChild(logoWrapper);
  layout.appendChild(selectWrapper);
  selectWrapper.appendChild(visibleSelect);

  originalSelect.parentElement.insertBefore(layout, originalSelect);
  originalSelect.style.display = 'none';

  const initialValue = originalSelect.value || 'hdfc_bank';
  originalSelect.value = initialValue;
  visibleSelect.value = initialValue;
  markSelectedBank(initialValue, logoWrapper);
}

/**
 * @param {scope} globals
 * @returns {string}
 */
function renderSalaryBankLogos(globals) {
  setTimeout(() => {
    mountSalaryBankUI();
  }, 700);

  return 'Salary bank logo UI rendered';
}




// eslint-disable-next-line import/prefer-default-export
export {
  getFullName, days, submitFormArrayToString, maskMobileNumber, renderSalaryBankLogos,
};
