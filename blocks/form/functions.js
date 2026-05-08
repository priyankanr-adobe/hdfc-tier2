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
  return "₹4,000";
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
/**
 * Verify OTP API call
 * @param {scope} globals
 * @returns {string}
 */
function handleOtpVerifyAPI(globals) {

  const otpPanel =
    globals.form.otp_verification_panel;

  const backBtn =
    otpPanel.back_button;

  const resendBtn =
    otpPanel.resend_otp;

  const submitBtn =
    otpPanel.otp_submit;

  /* HIDE BACK INITIALLY */

  if (backBtn) {

    globals.functions.setProperty(
      backBtn,
      {
        visible: false,
        enabled: false
      }
    );

  }

  const mobile =
    document.querySelector(
      'input[name="mobile"]'
    )?.value || "";

  const otp =
    document.querySelector(
      'input[name="entered_otp"]'
    )?.value || "";

  fetch(
    "https://junction-buffoon-amplify.ngrok-free.dev/verify-otp",
    {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        mobile,
        otp
      })

    }
  )

  .then((res) => res.json())

  .then((response) => {

    console.log(
      "VERIFY RESPONSE",
      response
    );

    globals.functions.setProperty(
      otpPanel.validation_message,
      {
        value: response.message,
        visible: true
      }
    );

    /* SUCCESS */

    if (response.success === true) {

      stopOtpTimer(globals);

      const customer =
        response.customer;

      /* FULL NAME */

      globals.functions.setProperty(
        globals.form.personal_info_details
          .customer_details.full_name,
        {
          value:
            customer.fullName || ""
        }
      );

      /* ADDRESS */

      globals.functions.setProperty(
        globals.form.personal_info_details
          .address_details.address_input,
        {
          value:
            customer.address || ""
        }
      );

      /* PAN */

      if (customer.pan) {

        globals.functions.setProperty(
          globals.form.personal_info_details
            .personal_details.pan_number,
          {
            value:
              customer.pan
          }
        );

      }

      /* HIDE OTP PANEL */

      globals.functions.setProperty(
        globals.form.otp_verification_panel,
        {
          visible: false
        }
      );

      /* SHOW NEXT PANEL */

      globals.functions.setProperty(
        globals.form.personal_info_details,
        {
          visible: true
        }
      );

    }

    /* INVALID OTP */

    else {

      window.otpAttempts =
        window.otpAttempts || 3;

      window.otpAttempts--;

      /* SHOW ATTEMPTS */

      globals.functions.setProperty(
        otpPanel.validation_message,
        {
          value:
            `Invalid OTP (${window.otpAttempts}/3 attempt(s) left)`,

          visible: true
        }
      );

      /* AFTER 3 ATTEMPTS */

      if (
        window.otpAttempts <= 0
      ) {

        /* DISABLE SUBMIT */

        globals.functions.setProperty(
          submitBtn,
          {
            enabled: false
          }
        );

        /* HIDE RESEND */

        globals.functions.setProperty(
          resendBtn,
          {
            visible: false,
            enabled: false
          }
        );

        /* SHOW BACK BUTTON */

        if (backBtn) {

          globals.functions.setProperty(
            backBtn,
            {
              visible: true,
              enabled: true
            }
          );

        }

        /* FINAL MESSAGE */

        globals.functions.setProperty(
          otpPanel.validation_message,
          {
            value:
              "Maximum attempts reached. Please go back.",

            visible: true
          }
        );

      }

    }

  })

  .catch((err) => {

    console.error(
      "OTP VERIFY ERROR",
      err
    );

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

  let seconds = 10;

  if (window.otpTimerInterval) {
    clearInterval(window.otpTimerInterval);
    window.otpTimerInterval = null;
  }

  globals.functions.setProperty(timerField, {
    value: "00:10"
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
 */
function generateEmailOtp(globals) {

  const otpField =
    globals.form.personal_info_details
      .personal_details.email_otp;

  const submitButton =
    globals.form.personal_info_details
      .personal_details.email_submit;

  const responseField =
    globals.form.personal_info_details
      .personal_details.email_response;

  /* VERIFIED CHECK */

  if (window.emailVerified === true) {

    globals.functions.setProperty(
      responseField,
      {
        visible: true,
        value: "Email already verified"
      }
    );

    return false;
  }

  /* ATTEMPT COUNT */

  window.emailOtpAttempts =
    window.emailOtpAttempts || 0;

  if (window.emailOtpAttempts >= 3) {

    globals.functions.setProperty(
      responseField,
      {
        visible: true,
        value: "Maximum OTP attempts reached"
      }
    );

    const verifyButton =
      document.querySelector(
        'button[name="verify_email"]'
      );

    if (verifyButton) {

      verifyButton.disabled = true;

      verifyButton.innerText =
        "Limit Reached";

      verifyButton.style.pointerEvents =
        "none";

      verifyButton.style.opacity =
        "0.7";

    }

    return false;
  }

  window.emailOtpAttempts++;

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

    if (
      response.success === true ||
      response.success === "true"
    ) {

      /* SHOW OTP FIELD */

      globals.functions.setProperty(
        otpField,
        {
          visible: true
        }
      );

      /* SHOW SUBMIT */

      globals.functions.setProperty(
        submitButton,
        {
          visible: true
        }
      );

      /* RESPONSE MESSAGE */

      globals.functions.setProperty(
        responseField,
        {
          visible: true,
          value:
            `OTP Sent Successfully (${3 - window.emailOtpAttempts} attempt(s) left)`
        }
      );

      /* SET OTP */

      setTimeout(() => {

        const otpInput =
          document.querySelector(
            'input[name="email_otp"]'
          );

        if (otpInput) {

          otpInput.value =
            response.otp || "";

          otpInput.dispatchEvent(
            new Event(
              "input",
              { bubbles: true }
            )
          );

        }

      }, 300);

    }

    else {

      globals.functions.setProperty(
        responseField,
        {
          visible: true,
          value:
            response.message ||
            "OTP generation failed"
        }
      );

    }

  })

  .catch((err) => {

    console.error(
      "EMAIL OTP ERROR",
      err
    );

    globals.functions.setProperty(
      responseField,
      {
        visible: true,
        value: "Something went wrong"
      }
    );

  });

  return true;
}


/**
 * Verify Email OTP
 */
function verifyEmailOtp(globals) {

  const otpField =
    globals.form.personal_info_details
      .personal_details.email_otp;

  const submitButton =
    globals.form.personal_info_details
      .personal_details.email_submit;

  const responseField =
    globals.form.personal_info_details
      .personal_details.email_response;

  const enteredOtp =
    document.querySelector(
      'input[name="email_otp"]'
    )?.value || "";

  /* EMPTY OTP */

  if (!enteredOtp.trim()) {

    globals.functions.setProperty(
      responseField,
      {
        visible: true,
        value: "Please enter OTP"
      }
    );

    return false;
  }

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

    console.log(
      "SUCCESS TYPE:",
      typeof response.success
    );

    console.log(
      "SUCCESS VALUE:",
      response.success
    );

    /* STRICT SUCCESS CHECK */

    if (response.success === true) {

      window.emailVerified = true;

      /* HIDE OTP FIELD */

      globals.functions.setProperty(
        otpField,
        {
          visible: false
        }
      );

      /* HIDE SUBMIT BUTTON */

      globals.functions.setProperty(
        submitButton,
        {
          visible: false
        }
      );

      /* SUCCESS MESSAGE */

      globals.functions.setProperty(
        responseField,
        {
          visible: true,
          value:
            "Email verified successfully"
        }
      );

      /* VERIFY BUTTON */

      setTimeout(() => {

        const verifyButton =
          document.querySelector(
            'button[name="verify_email"]'
          );

        if (verifyButton) {

          verifyButton.innerText =
            "Verified";

          verifyButton.disabled =
            true;

          verifyButton.style.pointerEvents =
            "none";

          verifyButton.style.opacity =
            "1";

          verifyButton.style.background =
            "#4CAF50";

          verifyButton.style.color =
            "#fff";

          verifyButton.style.border =
            "none";

          verifyButton.style.cursor =
            "not-allowed";

        }

      }, 300);

    }

    /* INVALID OTP */

    else {

      globals.functions.setProperty(
        responseField,
        {
          visible: true,
          value:
            response.message ||
            "Invalid OTP"
        }
      );

    }

  })

  .catch((err) => {

    console.error(
      "VERIFY EMAIL OTP ERROR",
      err
    );

    globals.functions.setProperty(
      responseField,
      {
        visible: true,
        value:
          "OTP verification failed"
      }
    );

  });

  return true;
}

/**
 * Hide Email OTP Fields
 * @param {scope} globals
 */
function hideEmailOtp(globals) {

  setTimeout(() => {

    const personalDetails =
      globals.form.personal_info_details
        ?.personal_details;

    /* HIDE OTP FIELD */

    if (personalDetails?.email_otp) {

      globals.functions.setProperty(
        personalDetails.email_otp,
        {
          visible: false
        }
      );

    }

    /* HIDE SUBMIT BUTTON */

    if (personalDetails?.email_submit) {

      globals.functions.setProperty(
        personalDetails.email_submit,
        {
          visible: false
        }
      );

    }

    /* HIDE RESPONSE FIELD */

    if (personalDetails?.email_response) {

      globals.functions.setProperty(
        personalDetails.email_response,
        {
          visible: false
        }
      );

    }

  }, 300);

}
 

/**
 * Generate Work Email OTP
 * @param {scope} globals
 */
function generateWorkEmailOtp(globals) {

  const otpField =
    globals.form.personal_info_details
      .personal_details.work_otp;

  const submitButton =
    globals.form.personal_info_details
      .personal_details.work_submit;

  const responseField =
    globals.form.personal_info_details
      .personal_details.work_response;

  /* VERIFIED CHECK */

  if (window.workEmailVerified === true) {

    globals.functions.setProperty(
      responseField,
      {
        visible: true,
        value: "Work email already verified"
      }
    );

    return false;
  }

  /* ATTEMPT COUNT */

  window.workEmailOtpAttempts =
    window.workEmailOtpAttempts || 0;

  if (window.workEmailOtpAttempts >= 3) {

    globals.functions.setProperty(
      responseField,
      {
        visible: true,
        value: "Maximum OTP attempts reached"
      }
    );

    const verifyButton =
      document.querySelector(
        'button[name="verify_work_email"]'
      );

    if (verifyButton) {

      verifyButton.disabled = true;

      verifyButton.innerText =
        "Limit Reached";

      verifyButton.style.pointerEvents =
        "none";

      verifyButton.style.opacity =
        "0.7";
    }

    return false;
  }

  window.workEmailOtpAttempts++;

  const email =
    document.querySelector(
      'input[name="work_email"]'
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

    if (
      response.success === true ||
      response.success === "true"
    ) {

      globals.functions.setProperty(
        otpField,
        {
          visible: true
        }
      );

      globals.functions.setProperty(
        submitButton,
        {
          visible: true
        }
      );

      globals.functions.setProperty(
        responseField,
        {
          visible: true,
          value:
            `OTP Sent Successfully (${3 - window.workEmailOtpAttempts} attempt(s) left)`
        }
      );

      setTimeout(() => {

        const otpInput =
          document.querySelector(
            'input[name="work_otp"]'
          );

        if (otpInput) {

          otpInput.value =
            response.otp || "";

          otpInput.dispatchEvent(
            new Event(
              "input",
              { bubbles: true }
            )
          );
        }

      }, 300);

    } else {

      globals.functions.setProperty(
        responseField,
        {
          visible: true,
          value:
            response.message ||
            "OTP generation failed"
        }
      );
    }

  })

  .catch((err) => {

    console.error(err);

    globals.functions.setProperty(
      responseField,
      {
        visible: true,
        value: "Something went wrong"
      }
    );

  });

  return true;
}

/**
 * Verify Work Email OTP
 * @param {scope} globals
 */
function verifyWorkEmailOtp(globals) {

  const otpField =
    globals.form.personal_info_details
      .personal_details.work_otp;

  const submitButton =
    globals.form.personal_info_details
      .personal_details.work_submit;

  const responseField =
    globals.form.personal_info_details
      .personal_details.work_response;

  const enteredOtp =
    document.querySelector(
      'input[name="work_otp"]'
    )?.value || "";

  /* EMPTY OTP */

  if (!enteredOtp.trim()) {

    globals.functions.setProperty(
      responseField,
      {
        visible: true,
        value: "Please enter OTP"
      }
    );

    return false;
  }

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

    if (response.success === true) {

      window.workEmailVerified = true;

      /* HIDE OTP FIELD */

      globals.functions.setProperty(
        otpField,
        {
          visible: false
        }
      );

      /* HIDE SUBMIT BUTTON */

      globals.functions.setProperty(
        submitButton,
        {
          visible: false
        }
      );

      /* SUCCESS MESSAGE */

      globals.functions.setProperty(
        responseField,
        {
          visible: true,
          value:
            "Work email verified successfully"
        }
      );

      /* VERIFY BUTTON */

      setTimeout(() => {

        const verifyButton =
          document.querySelector(
            'button[name="verify_work_email"]'
          );

        if (verifyButton) {

          verifyButton.innerText =
            "✓ Verified";

          verifyButton.disabled =
            true;

          verifyButton.classList.add(
            "verified"
          );

          verifyButton.style.pointerEvents =
            "none";

          verifyButton.style.opacity =
            "1";

          verifyButton.style.background =
            "#16a34a";

          verifyButton.style.color =
            "#fff";

          verifyButton.style.border =
            "none";

          verifyButton.style.cursor =
            "not-allowed";
        }

      }, 300);

    }

    /* INVALID OTP */

    else {

      globals.functions.setProperty(
        responseField,
        {
          visible: true,
          value:
            response.message ||
            "Invalid OTP"
        }
      );
    }

  })

  .catch((err) => {

    console.error(err);

    globals.functions.setProperty(
      responseField,
      {
        visible: true,
        value:
          "OTP verification failed"
      }
    );

  });

  return true;
}


// eslint-disable-next-line import/prefer-default-export
export {
  getFullName, days, submitFormArrayToString, maskMobileNumber, updateLoanDetails,
  updateLoanDisplay, getRate, getTax, handleOtpGenerateAPI,
handleOtpVerifyAPI,
handleOtpResendAPI,
startOtpTimer,
stopOtpTimer, fetchReviewDetailsAPI, handleProceedAPI, verifyEmailOtp, generateEmailOtp,
 hideEmailOtp, generateWorkEmailOtp, verifyWorkEmailOtp,
};
