document.addEventListener('DOMContentLoaded', () => {
    const monthlyInput = document.getElementById('monthlyAmount');
    const rateInput = document.getElementById('annualRate');
    const yearsInput = document.getElementById('years');
    const calcBtn = document.getElementById('calcBtn');
    const resultsDiv = document.getElementById('results');

    const totalPrincipalEl = document.getElementById('totalPrincipal');
    const totalInterestEl = document.getElementById('totalInterest');
    const finalValueEl = document.getElementById('finalValue');

    calcBtn.addEventListener('click', () => {
        const monthly = parseFloat(monthlyInput.value);
        const annualRate = parseFloat(rateInput.value);
        const years = parseFloat(yearsInput.value);

        if (isNaN(monthly) || isNaN(annualRate) || isNaN(years) || monthly <= 0 || years <= 0) {
            alert('請輸入有效的數值！');
            return;
        }

        const result = calculateCompoundInterest(monthly, annualRate, years);
        displayResults(result);
    });

    function calculateCompoundInterest(monthly, annualRate, years) {
        const months = years * 12;
        const monthlyRate = annualRate / 100 / 12;

        let futureValue;
        let totalPrincipal = monthly * months;

        if (annualRate === 0) {
            futureValue = totalPrincipal;
        } else {
            // Formula: FV = P * (((1 + r)^n - 1) / r) * (1 + r)
            // Assuming investment is made at the beginning of each period (Annuity Due)
            // If end of period (Ordinary Annuity), remove the final * (1 + r)
            // Usually for "periodic investment", it's often treated as beginning of month or end. 
            // Let's use Annuity Due (beginning of month) as it's common for "pay first".
            // Actually, standard bank calculators often use Ordinary Annuity (end of month).
            // Let's stick to the formula: FV = P * ((1+r)^n - 1) / r
            // If we want beginning of month: FV = P * ((1+r)^n - 1) / r * (1+r)

            // Let's use the End of Month formula (Ordinary Annuity) for simplicity unless specified.
            // FV = P * ((1 + r)^n - 1) / r

            futureValue = monthly * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;

            // If we want to be precise about "invest at start of month", we multiply by (1+r)
            futureValue *= (1 + monthlyRate);
        }

        const totalInterest = futureValue - totalPrincipal;

        return {
            principal: Math.round(totalPrincipal),
            interest: Math.round(totalInterest),
            total: Math.round(futureValue)
        };
    }

    function displayResults(data) {
        totalPrincipalEl.textContent = formatCurrency(data.principal);
        totalInterestEl.textContent = formatCurrency(data.interest);
        finalValueEl.textContent = formatCurrency(data.total);

        resultsDiv.classList.remove('hidden');

        // Smooth scroll to results on mobile if needed
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function formatCurrency(num) {
        return 'NT$ ' + num.toLocaleString('zh-TW');
    }
});
