// Salary calculation rules
const BASIC_PERCENTAGE = 0.5; // 50% of wage
const HRA_PERCENTAGE = 0.2; // 20% of wage
const ALLOWANCES_PERCENTAGE = 0.1; // 10% of wage
const PF_PERCENTAGE = 0.12; // 12% of Basic Salary

/**
 * Calculates tax based on the annual wage.
 * @param {number} annualWage - The annual wage.
 * @returns {number} The calculated annual tax.
 */
const calculateTax = (annualWage) => {
  let tax = 0;
  if (annualWage > 500000 && annualWage <= 1000000) {
    tax = (annualWage - 500000) * 0.1;
  } else if (annualWage > 1000000) {
    tax = 50000 + (annualWage - 1000000) * 0.2;
  }
  return tax;
};

/**
 * Calculates all salary components based on the wage.
 * @param {number} wage - The monthly wage.
 * @returns {object} An object containing all calculated salary components.
 */
export const calculateSalaryComponents = (wage) => {
  const basic = wage * BASIC_PERCENTAGE;
  const hra = wage * HRA_PERCENTAGE;
  const allowances = wage * ALLOWANCES_PERCENTAGE;

  const grossSalary = basic + hra + allowances;

  const pf = basic * PF_PERCENTAGE;

  const annualWage = wage * 12;
  const annualTax = calculateTax(annualWage);
  const monthlyTax = annualTax / 12;

  const deductions = pf + monthlyTax;

  const netSalary = grossSalary - deductions;

  return {
    basic,
    hra,
    allowances,
    grossSalary,
    pf,
    tax: monthlyTax,
    netSalary,
    ctc: wage,
  };
};
