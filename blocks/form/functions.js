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

/* function initBankUI() {
  const select = document.querySelector("select[name='salary_bank']");
  if (!select || select.dataset.init === "true") return;

  select.dataset.init = "true";

  const banks = [
    ['hdfc_bank','HDFC','/content/dam/pnr-hdfc/hdfc.png'],
    ['icici_bank','ICICI','/content/dam/pnr-hdfc/icici.png'],
    ['axis_bank','Axis','/content/dam/pnr-hdfc/axis.png'],
    ['kotak_bank','Kotak','/content/dam/pnr-hdfc/kotak.png'],
    ['sbi','SBI','/content/dam/pnr-hdfc/sbi.png'],
    ['bank_of_baroda','BOB','/content/dam/pnr-hdfc/bob.jpeg'],
    ['idfc_first_bank','IDFC','/content/dam/pnr-hdfc/idfc.png']
  ];

  const container = document.createElement("div");
  container.className = "bank-row";

  banks.forEach(([val,label,img]) => {
    const item = document.createElement("div");
    item.className = "bank-logo";
    item.dataset.value = val;

    item.innerHTML = `<img src="${img}" alt="${label}">`;

    item.onclick = () => {
      select.value = val;
      select.dispatchEvent(new Event('change', { bubbles:true }));
      updateUI();
    };

    container.appendChild(item);
  });

  select.parentNode.insertBefore(container, select);

  function updateUI() {
  const value = select.value || 'hdfc_bank';

  container.querySelectorAll('.bank-logo').forEach((el) => {
    const isHdfc = el.dataset.value === 'hdfc_bank';

    // 1. Default → only HDFC
    if (!value || value === 'hdfc_bank') {
      el.style.display = isHdfc ? 'flex' : 'none';
    }

    // 2. When "Other Bank" selected → show all
    else if (value === 'other_bank') {
      el.style.display = 'flex';
    }

    // 3. If user selects any bank from dropdown → show all
    else {
      el.style.display = 'flex';
    }

    // highlight selected
    el.classList.toggle('active', el.dataset.value === value);
  });
}

  select.addEventListener("change", updateUI);

  updateUI();
}

// SAFE init for AEM
if (typeof window !== "undefined") {
  setTimeout(initBankUI, 1500);
}
 */
// eslint-disable-next-line import/prefer-default-export
export {
  getFullName, days, submitFormArrayToString, maskMobileNumber, 
};
