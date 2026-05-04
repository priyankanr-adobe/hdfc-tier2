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

function getBankLogo(bank) {
  const logos = {
    hdfc_bank: '/content/dam/pnr-hdfc/hdfc.png',
    icici_bank: '/content/dam/pnr-hdfc/icici.png',
    axis_bank: '/content/dam/pnr-hdfc/axis.png',
    kotak_bank: '/content/dam/pnr-hdfc/kotak.png',
    sbi: '/content/dam/pnr-hdfc/sbi.png',
    bank_of_baroda: '/content/dam/pnr-hdfc/bob.jpeg',
    idfc_first_bank: '/content/dam/pnr-hdfc/idfc.png',
  };

  return logos[bank] || '';
}

/**
 * @param {scope} globals
 * @returns {string}
 */
function renderSalaryBankLogos(globals) {
  try {
    setTimeout(() => {
      const originalSelect = document.querySelector("select[name='salary_bank']");

      if (!originalSelect) {
        console.warn('salary_bank dropdown not found');
        return;
      }

      if (originalSelect.dataset.logoUiMounted === 'true') return;

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

      const dropdownWrapper = document.createElement('div');
      dropdownWrapper.className = 'bank-dropdown-wrap';

      const updateActive = (value) => {
        logoWrapper.querySelectorAll('.bank-item').forEach((item) => {
          item.classList.toggle('active', item.dataset.bankValue === value);
        });
      };

      bankValues.forEach((value) => {
        const option = Array.from(originalSelect.options).find((opt) => opt.value === value);
        if (!option) return;

        const imgPath = getBankLogo(value);
        if (!imgPath) return;

        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'bank-item';
        item.dataset.bankValue = value;

        item.innerHTML = `
          <span class="bank-logo-box">
            <img src="${imgPath}" alt="${option.text || value}">
          </span>
          <span class="bank-name">${option.text || value}</span>
        `;

        item.addEventListener('click', () => {
          originalSelect.value = value;
          originalSelect.dispatchEvent(new Event('change', { bubbles: true }));
          visibleSelect.value = value;
          updateActive(value);
        });

        logoWrapper.appendChild(item);
      });

      const visibleSelect = originalSelect.cloneNode(true);
      visibleSelect.className = 'bank-other-dropdown';
      visibleSelect.removeAttribute('id');
      visibleSelect.removeAttribute('name');

      visibleSelect.addEventListener('change', () => {
        originalSelect.value = visibleSelect.value;
        originalSelect.dispatchEvent(new Event('change', { bubbles: true }));
        updateActive(visibleSelect.value);
      });

      originalSelect.addEventListener('change', () => {
        visibleSelect.value = originalSelect.value;
        updateActive(originalSelect.value);
      });

      layout.appendChild(logoWrapper);
      layout.appendChild(dropdownWrapper);
      dropdownWrapper.appendChild(visibleSelect);

      originalSelect.parentElement.insertBefore(layout, originalSelect);
      originalSelect.style.display = 'none';

      const initialValue = originalSelect.value || 'hdfc_bank';
      originalSelect.value = initialValue;
      visibleSelect.value = initialValue;
      updateActive(initialValue);
    }, 1000);

    return 'Salary bank logos initialized';
  } catch (error) {
    console.error('renderSalaryBankLogos error:', error);
    return 'Salary bank logos failed';
  }
}



// eslint-disable-next-line import/prefer-default-export
export {
  getFullName, days, submitFormArrayToString, maskMobileNumber, renderSalaryBankLogos,
};
