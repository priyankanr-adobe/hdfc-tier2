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

  /* GET REAL LOAN VALUE */
  const loanInput =
    document.querySelector(
      '[name="loan_amount"]'
    ) ||
    document.querySelector(
      '[name="loan_amount_inr"]'
    );

  const loanAmount = Number(
    loanInput?.dataset?.actualValue ||
    data.loan_amount ||
    0
  );

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

  /* REAL LOAN AMOUNT */
  const loanInput =
    document.querySelector(
      '[name="loan_amount"]'
    ) ||
    document.querySelector(
      '[name="loan_amount_inr"]'
    );

  const loanAmount = Number(
    loanInput?.dataset.actualValue || 0
  );

  /* TENURE */
  const tenureInput =
    document.querySelector(
      '[name="loan_tenure"]'
    ) ||
    document.querySelector(
      '[name="loan_tenure_months"]'
    );

  const tenure = Number(
    tenureInput?.value || 0
  );

  if (!loanAmount || !tenure) {
    return '';
  }

  /* INTEREST */
  const annualRate = 10.97;

  const monthlyRate =
    annualRate / 12 / 100;

  /* EMI */
  const emi =
    (
      loanAmount *
      monthlyRate *
      Math.pow(
        1 + monthlyRate,
        tenure
      )
    ) /
    (
      Math.pow(
        1 + monthlyRate,
        tenure
      ) - 1
    );

  return `₹${Math.round(emi).toLocaleString('en-IN')}`;
}

/**
 * @returns {string}
 */
function getRate(globals) {
  return '10.97%';
}

/**
 * @returns {string}
 */
function getTax(globals) {
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

  const mobile = data.mobile || document.querySelector('input[name="mobile"]')?.value || "";
  const dob = data.date_of_birt || document.querySelector('input[name="date_of_birt"]')?.value || "";
  const pan = data.pan_card || document.querySelector('input[name="pan_card"]')?.value || "";

  const selected = document.querySelector('input[name="id_type"]:checked');
  const loginType =
    selected?.value === "pan_card" || selected?.value === "pan"
      ? "PAN"
      : "DOB";

  const payload = { loginType, mobile };

  if (loginType === "DOB") payload.dateOfBirth = dob;
  if (loginType === "PAN") payload.pan = pan.toUpperCase();

  fetch("https://junction-buffoon-amplify.ngrok-free.dev/generate-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then((res) => res.json())
    .then((response) => {
      globals.functions.setProperty(otpPanel.validation_message, {
        value: response.message,
        visible: true
      });

      if (response.success) {
        globals.functions.setProperty(otpPanel.entered_otp, {
          value: response.otp
        });

        window.otpResendAttemptsLeft = window.otpResendAttemptsLeft ?? 3;

         globals.functions.setProperty(otpPanel.attempt_info, {
            value: `${window.otpResendAttemptsLeft}/3 attempt(s) left`
        });

        startOtpTimer(globals);
      }
    });

  return "OTP request sent";
}

/**
 * Verify OTP API call
 * @param {scope} globals
 * @returns {string}
 */
function handleOtpVerifyAPI(globals) {
debugger;
  const otpPanel = globals.form.otp_verification_panel;

  const mobile =
    document.querySelector('input[name="mobile"]')?.value || "";

  const otp =
    document.querySelector('input[name="entered_otp"]')?.value || "";

  fetch("https://junction-buffoon-amplify.ngrok-free.dev/verify-otp", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      mobile,
      otp
    })

  })

    .then((res) => res.json())

    .then((response) => {

      console.log("VERIFY RESPONSE", response);

      globals.functions.setProperty(
        otpPanel.validation_message,
        {
          value: response.message,
          visible: true
        }
      );

      if (response.success === true) {

        stopOtpTimer(globals);

        const customer = response.customer;

        console.log("CUSTOMER DATA", customer);

        // Full Name
        globals.functions.setProperty(
          globals.form.personal_info_details.customer_details.full_name,
          {
            value: customer.fullName || ""
          }
        );

        // Address
        globals.functions.setProperty(
          globals.form.personal_info_details.address_details.address_input,
          {
            value: customer.address || ""
          }
        );

        // PAN
        if (customer.pan) {

          globals.functions.setProperty(
            globals.form.personal_info_details.personal_details.pan_number,
            {
              value: customer.pan
            }
          );

        }

        // Hide OTP panel
        globals.functions.setProperty(
          globals.form.otp_verification_panel,
          {
            visible: false
          }
        );

        // Show customer details panel
        globals.functions.setProperty(
          globals.form.personal_info_details,
          {
            visible: true
          }
        );

      }

    })

    .catch((err) => {

      console.error("OTP VERIFY ERROR", err);

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
    window.otpTimerInterval = null;
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

/**
 * Resend OTP API call
 * @param {scope} globals
 * @returns {string}
 */
function handleOtpResendAPI(globals) {
  const otpPanel = globals.form.otp_verification_panel;

  const resendBtn = otpPanel.resend_otp;
  const submitBtn = otpPanel.otp_submit;
  const validationMessage = otpPanel.validation_message;
  const attemptInfo = otpPanel.attempt_info;

  window.otpResendAttemptsLeft = window.otpResendAttemptsLeft ?? 3;

  // reduce first
  window.otpResendAttemptsLeft -= 1;

  globals.functions.setProperty(attemptInfo, {
    value: `${window.otpResendAttemptsLeft}/3 attempt(s) left`
  });

  // if no attempts left, stop everything
  if (window.otpResendAttemptsLeft <= 0) {
    globals.functions.setProperty(validationMessage, {
      value: "No attempts left",
      visible: true
    });

    globals.functions.setProperty(resendBtn, {
      visible: false,
      enabled: false
    });

    globals.functions.setProperty(submitBtn, {
      enabled: false
    });

    stopOtpTimer(globals);

    return "No attempts left";
  }

  // clear old message
  globals.functions.setProperty(validationMessage, {
    value: "",
    visible: false
  });

  // disable resend while timer runs
  globals.functions.setProperty(resendBtn, {
    visible: false,
    enabled: false
  });

  // generate new OTP
  handleOtpGenerateAPI(globals);

  return `${window.otpResendAttemptsLeft}/3 attempt(s) left`;
}



/**
 * Fetch Review Details API
 * @param {scope} globals
 * @returns {string}
 */

function fetchReviewDetailsAPI(globals) {

  const form = globals.form;

  const phone =
    document.querySelector('input[name="mobile"]')
      ?.value || "";

  fetch(
    "https://junction-buffoon-amplify.ngrok-free.dev/review-details",
    {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        phone
      })

    }
  )

    .then((res) => res.json())

    .then((response) => {

      console.log(
        "REVIEW DETAILS RESPONSE",
        response
      );

      if (!response.success) {
        return;
      }

      const data = response.data;

      /* =========================
         EXTRA DETAILS ONLY
      ========================= */

      // Owned By parents
      globals.functions.setProperty(
        globals.form.review_details.personal_details.owned_by_parents,
        {
          value: data.ownedByParents
        }
      );

      // Type Of Loan
      globals.functions.setProperty(
        globals.form.review_details.loan_details.type_of_loan,
        {
          value: data.typeOfLoan
        }
      );

      // Processing Fee
      globals.functions.setProperty(
        globals.form.review_details.loan_details.processing_fee,
        {
          value: data.processingFees
        }
      );

      // Schedule Of Charges
      globals.functions.setProperty(
        globals.form.review_details.loan_details.scheme_of_charges_link,
        {
          value: data.scheduleOfCharges
        }
      );


      // Salary Account Number
      globals.functions.setProperty(
        globals.form.review_details.salary_account_details.salary_account_number,
        {
          value: data.salaryAccountNumber
        }
      );

      // IFSC
      globals.functions.setProperty(
        globals.form.review_details.salary_account_details.ifsc,
        {
          value: data.ifsc
        }
      );

      // Bank Name
      globals.functions.setProperty(
        globals.form.review_details.salary_account_details.bank_name,
        {
          value: data.bankName
        }
      );

      // Office Address
      globals.functions.setProperty(
        globals.form.review_details.office_address.current_employer_address,
        {
          value: data.officeAddress
        }
      );

      // Reference Name
      globals.functions.setProperty(
        globals.form.review_details.reference_details.reference_name,
        {
          value: data.referenceName
        }
      );

      // Reference Mobile
      globals.functions.setProperty(
        globals.form.review_details.reference_details.reference_mobile_number,
        {
          value: data.referenceMobile
        }
      );

      console.log(
        "Extra review details populated"
      );

    })

    .catch((err) => {

      console.error(
        "REVIEW DETAILS ERROR",
        err
      );

    });

  return "Review details requested";

}



/* Loan application number */
/**
 * Proceed API
 * @param {scope} globals
 * @returns {string}
 */
function handleProceedAPI(globals) {

  const mobile =
    document.querySelector('input[name="mobile"]')?.value || "";

  fetch("https://junction-buffoon-amplify.ngrok-free.dev/proceed", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      mobile
    })

  })

    .then((res) => res.json())

    .then((response) => {

      console.log("Proceed Response:", response);

      if (!response.success) return;

      const applicationNumber =
        response.data.loanApplicationNumber;

      /* SET APPLICATION NUMBER */

      globals.functions.setProperty(

        globals.form.loan_success_page
          .main_success_card
          .text_input1777273799589,

        {
          value: applicationNumber
        }

      );

      /* HIDE REVIEW PANEL */

      globals.functions.setProperty(

        globals.form.review_details,

        {
          visible: false
        }

      );

      /* SHOW SUCCESS PAGE */

      globals.functions.setProperty(

        globals.form.loan_success_page,

        {
          visible: true
        }

      );

    })

    .catch((err) => {

      console.error(
        "PROCEED ERROR",
        err
      );

    });

  return "Proceed API called";

}


/**
 * Generate Email OTP
 * @param {scope} globals
 * @returns {string}
 */
function generateEmailOtp(globals) {

  const email =
    document.querySelector(
      'input[name="email_id"]'
    )?.value || "";

  const mobile =
    document.querySelector(
      'input[name="mobile"]'
    )?.value || "";

  fetch(
    "https://junction-buffoon-amplify.ngrok-free.dev/generate-email-otp",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        mobile
      })
    }
  )

    .then((res) => res.json())

    .then((response) => {

      console.log(
        "EMAIL OTP RESPONSE",
        response
      );

      if (response.success) {

        alert(
          "OTP sent successfully to mobile"
        );

        /* SHOW OTP FIELD */

        globals.functions.setProperty(
          globals.form.email_otp,
          {
            visible: true
          }
        );

        /* SHOW SUBMIT BUTTON */

        globals.functions.setProperty(
          globals.form.email_submit,
          {
            visible: true
          }
        );

      } else {

        alert(response.message);

      }

    })

    .catch((err) => {

      console.error(
        "EMAIL OTP ERROR",
        err
      );

    });

  return "Email OTP API called";
}



/**
 * Verify Email OTP
 * @param {scope} globals
 * @returns {string}
 */
function verifyEmailOtp(globals) {

  const enteredOtp =
    document.querySelector(
      'input[name="email_otp"]'
    )?.value || "";

  const mobile =
    document.querySelector(
      'input[name="mobile"]'
    )?.value || "";

  fetch(
    "https://junction-buffoon-amplify.ngrok-free.dev/verify-email-otp",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mobile,
        otp: enteredOtp
      })
    }
  )

    .then((res) => res.json())

    .then((response) => {

      console.log(
        "VERIFY EMAIL OTP",
        response
      );

      if (response.success) {

        alert("Email verified");

        /* HIDE OTP FIELD */

        globals.functions.setProperty(
          globals.form.email_otp,
          {
            visible: false
          }
        );

        /* HIDE SUBMIT BUTTON */

        globals.functions.setProperty(
          globals.form.email_submit,
          {
            visible: false
          }
        );

        /* CHANGE VERIFY BUTTON */

        globals.functions.setProperty(
          globals.form.verify_email,
          {
            title: "Verified",
            enabled: false
          }
        );

      } else {

        alert("Invalid OTP");

      }

    })

    .catch((err) => {

      console.error(
        "VERIFY EMAIL OTP ERROR",
        err
      );

    });

  return "Verify Email OTP API called";
}

// eslint-disable-next-line import/prefer-default-export
export {
  getFullName, days, submitFormArrayToString, maskMobileNumber, updateLoanDetails,
  updateLoanDisplay, getRate, getTax, handleOtpGenerateAPI,
handleOtpVerifyAPI,
handleOtpResendAPI,
startOtpTimer,
stopOtpTimer, fetchReviewDetailsAPI, handleProceedAPI, verifyEmailOtp, generateEmailOtp,
};
