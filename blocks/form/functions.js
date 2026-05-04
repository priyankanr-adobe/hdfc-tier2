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
function renderSalaryBankLogos(globals) {
  try {
    setTimeout(function () {
      var select = document.querySelector("select[name='salary_bank']");
      if (!select) return;

      if (select.getAttribute("data-logo-ready") === "true") return;
      select.setAttribute("data-logo-ready", "true");

      var parent = select.parentNode;
      if (!parent) return;

      var row = document.createElement("div");
      row.className = "bank-list";

      var banks = [
        ["hdfc_bank", "HDFC Bank", "/content/dam/pnr-hdfc/hdfc.png"],
        ["icici_bank", "ICICI Bank", "/content/dam/pnr-hdfc/icici.png"],
        ["axis_bank", "Axis Bank", "/content/dam/pnr-hdfc/axis.png"],
        ["kotak_bank", "Kotak", "/content/dam/pnr-hdfc/kotak.png"],
        ["sbi", "SBI", "/content/dam/pnr-hdfc/sbi.png"],
        ["bank_of_baroda", "Bank of Baroda", "/content/dam/pnr-hdfc/bob.jpeg"],
        ["idfc_first_bank", "IDFC First", "/content/dam/pnr-hdfc/idfc.png"]
      ];

      banks.forEach(function (bank) {
        var item = document.createElement("button");
        item.type = "button";
        item.className = "bank-item";
        item.setAttribute("data-bank-value", bank[0]);

        item.innerHTML =
          '<span class="bank-logo-box"><img src="' + bank[2] + '" alt="' + bank[1] + '"></span>' +
          '<span class="bank-name">' + bank[1] + '</span>';

        item.onclick = function () {
          select.value = bank[0];
          select.dispatchEvent(new Event("change", { bubbles: true }));
          updateActive();
        };

        row.appendChild(item);
      });

      parent.insertBefore(row, select);

      function updateActive() {
        row.querySelectorAll(".bank-item").forEach(function (item) {
          item.classList.toggle(
            "active",
            item.getAttribute("data-bank-value") === select.value
          );
        });
      }

      select.addEventListener("change", updateActive);
      updateActive();
    }, 1000);

    return "Bank logos initialized";
  } catch (e) {
    console.error("renderSalaryBankLogos failed", e);
    return "Bank logos failed";
  }
}

// eslint-disable-next-line import/prefer-default-export
export {
  getFullName, days, submitFormArrayToString, maskMobileNumber, renderSalaryBankLogos,
};
