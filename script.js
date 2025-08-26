/*
  Davis Debts Time Value of Money Calculator
  This script computes the current value of a debt based on the date the debt was incurred
  and a fixed annual interest rate of 10%. The calculation uses simple interest: FV = PV * (1 + r * (t/365)),
  where r is the annual rate (0.10) and t is the number of days since the debt was owed.
*/

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('debt-form');
  const resultDiv = document.getElementById('result');

  /**
   * Compute the accrued value using weekly penalties.
   * A full week past the owed date incurs $1, two weeks incurs $2, etc.
   */
  function computeAccrued(principal, owedDateStr) {
    const owedDate = new Date(owedDateStr);
    const now = new Date();
    const diffTime = now.getTime() - owedDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    if (diffDays < 7) {
      return { accrued: principal, weeksLate: 0, penalty: 0 };
    }
    const fullWeeksLate = Math.floor(diffDays / 7);
    // Calculate cumulative penalty using triangular number formula: n(n+1)/2
    const penalty = (fullWeeksLate * (fullWeeksLate + 1)) / 2;
    const accrued = principal + penalty;
    return { accrued, weeksLate: fullWeeksLate, penalty };
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const principalInput = document.getElementById('principal');
    const owedDateInput = document.getElementById('owed-date');

    const principal = parseFloat(principalInput.value);
    const owedDateValue = owedDateInput.value;

    // Validate inputs
    if (!owedDateValue || isNaN(principal) || principal <= 0) {
      resultDiv.textContent = 'Please enter a valid amount and date.';
      return;
    }

    // Compute accrued amount, weeks late and cumulative penalty
    const { accrued, weeksLate, penalty } = computeAccrued(principal, owedDateValue);
    const owedDate = new Date(owedDateValue);
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const principalFormatted = formatter.format(principal);
    const accruedFormatted = formatter.format(accrued);
    resultDiv.textContent = `${principalFormatted} owed on ${owedDate.toLocaleDateString('en-US')} is now worth ${accruedFormatted}. Weeks late: ${weeksLate} week${weeksLate === 1 ? '' : 's'}, penalty applied (cumulative): $${penalty}.`;
    // Reset form for next entry
    form.reset();
  });

  // Register service worker for PWA functionality if supported
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function (err) {
      console.log('ServiceWorker registration failed:', err);
    });
  });
});