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



/*Pan and DOB*/
/**
 * Toggle PAN / DOB fields based on selected radio
 * @param {scope} globals
 * @returns {string}
 */
function toggleIdTypeFields(globals) {
  const form = globals.form;

  const dobField = form.personal_loan_offer.date_of_birth;
  const panField = form.personal_loan_offer.pan_card;

  const selectedInput = document.querySelector(
    'input[name="id_type"]:checked'
  );

  const selectedValue = selectedInput ? selectedInput.value : "date_of_birth";

  if (selectedValue === "pan_card") {
    globals.functions.setProperty(dobField, {
      visible: false
    });

    globals.functions.setProperty(panField, {
      visible: true
    });

    return "PAN selected";
  }

  globals.functions.setProperty(dobField, {
    visible: true
  });

  globals.functions.setProperty(panField, {
    visible: false
  });

  return "DOB selected";
}

// eslint-disable-next-line import/prefer-default-export
export {
  getFullName, days, submitFormArrayToString, maskMobileNumber, toggleIdTypeFields,
};
