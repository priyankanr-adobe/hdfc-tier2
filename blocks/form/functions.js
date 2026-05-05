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

/*offer detail function */
/**
 * @param {scope} globals
 * @returns {string}
 */
function updateLoanDisplay(globals) {
  const data = globals.functions.exportData();

  const loanAmount = Number(data.loan_amount || 0);

  return loanAmount > 0
    ? `₹${loanAmount.toLocaleString('en-IN')}`
    : '';
}

/**
 * @param {scope} globals
 * @returns {string}
 */
function updateLoanDetails(globals) {
  const data = globals.functions.exportData();

  const loanAmount = Number(data.loan_amount || 0);
  const tenure = Number(data.loan_tenure || 0);

  if (!loanAmount || !tenure) return '';

  const rate = 10.97;
  const monthlyRate = rate / (12 * 100);

  const emi =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1);

  return `₹${Math.round(emi).toLocaleString('en-IN')}`;
}

/**
 * @returns {string}
 */
function getRate() {
  return '10.97%';
}

/**
 * @returns {string}
 */
function getTax() {
  const data = globals.functions.exportData();

  const loanAmount = Number(data.loan_amount || 0);

  if (!loanAmount) return '';

  const processingFee = loanAmount * 0.02;   // 2%
  const gst = processingFee * 0.18;          // 18% GST

  const totalCharges = processingFee + gst;

  return `₹${Math.round(totalCharges).toLocaleString('en-IN')}`
}

/*API Generate and Verify*/

/**
 * Generate OTP API call
 * @param {scope} globals
 * @returns {string}
 */
function handleOtpGenerateAPI(globals) {
  const otpPanel = globals.form.otp_verification_panel;

  const data = globals.functions.exportData();
  console.log("FORM DATA:", data);

  const mobile =
    data.mobile ||
    document.querySelector('input[name="mobile"]')?.value ||
    "";

  const dob =
    data.date_of_birt ||
    document.querySelector('input[name="date_of_birt"]')?.value ||
    "";

  const pan =
    data.pan_card ||
    document.querySelector('input[name="pan_card"]')?.value ||
    "";

  const selected = document.querySelector('input[name="id_type"]:checked');

  const loginType =
    selected?.value === "pan_card" ||
    selected?.value === "pan"
      ? "PAN"
      : "DOB";

  const payload = {
    loginType,
    mobile
  };

  if (loginType === "DOB") {
    payload.dateOfBirth = dob;
  }

  if (loginType === "PAN") {
    payload.pan = pan.toUpperCase();
  }

  console.log("Generate OTP payload:", payload);

  fetch("https://junction-buffoon-amplify.ngrok-free.dev/generate-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then((res) => res.json())
    .then((response) => {
      console.log("Generate OTP response:", response);

      globals.functions.setProperty(otpPanel.validation_message, {
        value: response.message,
        visible: true
      });

      if (response.success) {
        globals.functions.setProperty(otpPanel.entered_otp, {
          value: response.otp
        });
      }
    })
    .catch((error) => {
      console.error("Generate OTP error:", error);

      globals.functions.setProperty(otpPanel.validation_message, {
        value: "OTP generation failed",
        visible: true
      });
    });

  return "OTP request sent";
}


/**
 * Verify OTP API call
 * @param {scope} globals
 * @returns {string}
 */
function handleOtpVerifyAPI(globals) {
  const otpPanel = globals.form.otp_verification_panel;

  const mobile =
    document.querySelector('input[name="mobile"]')?.value || "";

  const otp =
    document.querySelector('input[name="entered_otp"]')?.value || "";

  const payload = {
    mobile,
    otp
  };

  console.log("Verify OTP payload:", payload);

  fetch("https://junction-buffoon-amplify.ngrok-free.dev/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then((res) => res.json())
    .then((response) => {
      console.log("Verify OTP response:", response);

      globals.functions.setProperty(otpPanel.validation_message, {
        value: response.message,
        visible: true
      });
    })
    .catch((error) => {
      console.error("Verify OTP error:", error);

      globals.functions.setProperty(otpPanel.validation_message, {
        value: "OTP verification failed",
        visible: true
      });
    });

  return "OTP verify request sent";
}


/**
 * Start OTP timer
 * @param {scope} globals
 * @returns {string}
 */
function startOtpTimer(globals) {
  const panel = globals.form.otp_verification_panel;

  const timerField = panel.timer;
  const resendBtn = panel.resend_otp;

  let seconds = 30;

  if (window.otpTimerInterval) {
    clearInterval(window.otpTimerInterval);
  }

  globals.functions.setProperty(timerField, {
    value: "00:30"
  });

  globals.functions.setProperty(resendBtn, {
    visible: false,
    enabled: false
  });

  window.otpTimerInterval = setInterval(() => {
    seconds -= 1;

    globals.functions.setProperty(timerField, {
      value: seconds >= 10 ? `00:${seconds}` : `00:0${seconds}`
    });

    if (seconds <= 0) {
      clearInterval(window.otpTimerInterval);
      window.otpTimerInterval = null;

      globals.functions.setProperty(timerField, {
        value: "Time expired"
      });

      globals.functions.setProperty(resendBtn, {
        visible: true,
        enabled: true
      });
    }
  }, 1000);

  return "Timer started";
}

/**
 * Stop OTP timer
 * @param {scope} globals
 * @returns {string}
 */
function stopOtpTimer(globals) {
  if (window.otpTimerInterval) {
    clearInterval(window.otpTimerInterval);
    window.otpTimerInterval = null;
  }

  return "Timer stopped";
}


// eslint-disable-next-line import/prefer-default-export
export {
  getFullName, days, submitFormArrayToString, maskMobileNumber, updateLoanDetails,
  updateLoanDisplay, getRate, getTax, handleOtpGenerateAPI,
  handleOtpVerifyAPI, startOtpTimer,
stopOtpTimer,
};
