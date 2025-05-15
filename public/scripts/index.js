'use strict';

// Function for getting date year, month, day.

const dateInfo = function (yourDate) {
    return [yourDate.getFullYear(), yourDate.getMonth(), yourDate.getDate()];
};

// Function for clearing input fields.

const clearInput = function (arr) {
    arr.forEach((el, i) => {
        el.value = '';
        if (!i) el.focus();
    });
};

// Function for error styling.

const ifErrorStyle = function (isError, inputs, labels, spans) {
    inputs.forEach((input, i) => {
        let hasError1 = i === isError?.type || isError?.type === 3;
        let hasError2 = i === isError?.type || isError?.type % 3 === i;
        input.classList.toggle('errorColor', hasError1);
        input.classList.toggle('errorBorder', hasError1);
        labels[i].classList.toggle('errorColor', hasError1);
        spans[i].classList.toggle('errorColor', hasError2);
        spans[i].classList.toggle('errorDisplay', hasError2);
        if (hasError2) spans[i].textContent = isError.message;
    });
};

// Function for changing H1's

const changeDisplay = (elem, ar) => elem.forEach((el, i) => (el.textContent = ar[i]));

// Function for error checking.

const errorCheck = function (inputDate) {
    const [day, month, year] = inputDate;
    const errorObj = [
        { type: 0, message: `Must be between 1 and 31.` },
        { type: 1, message: `Must be between 1 and 12.` },
        { type: 2, message: 'Must be more than 1900.' },
        { type: 3, message: `Date doesn't exist.` },
        { type: 3, message: 'Future date not allowed.' },
    ];

    if (day <= 0 || day > 31) return errorObj[0];
    if (month <= 0 || month > 12) return errorObj[1];
    if (year < 1900) return errorObj[2];

    const currDate = new Date();
    const userDate = new Date(year, month - 1, day);

    if (userDate.getDate() !== day || userDate.getMonth() !== month - 1) return errorObj[3];
    if (userDate > currDate) return errorObj[4];

    return;
};

// Function for calculating age

const calcAge = function (userDate, currDate) {
    const leapCheck = year => year % 4 === 0 || year % 400 === 0;
    const yearNormal = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    const [birthYear, birthMonth, birthDay] = dateInfo(userDate);
    const [currYear, currMonth, currDay] = dateInfo(currDate);

    let totalYears = currYear - birthYear - 1 <= 0 ? 0 : currYear - birthYear - 1;
    let totalMonths = (birthYear !== currYear ? 12 : 0) + currMonth - 1 - birthMonth;
    let totalDays = 0;

    if (currDay >= birthDay) {
        totalDays = currDay - birthDay;
        totalMonths++;
    } else {
        let days = leapCheck(birthYear) && birthMonth === 1 ? 29 : yearNormal[birthMonth];
        let remDays = days - birthDay;
        totalDays = remDays + currDay;
    }

    if (totalMonths >= 12) {
        totalMonths -= 12;
        totalYears++;
    }
    return [totalYears, totalMonths, totalDays];
};

// Event listener for form submission.

document.querySelector('.app-form').addEventListener('submit', function (evt) {
    evt.preventDefault();

    const inputs = this.querySelectorAll('input');
    const labels = this.querySelectorAll('label');
    const spans = this.querySelectorAll('span');
    const h2s = document.querySelectorAll('.app-answer');

    const inputDate = [...inputs].map(input => +input.value);
    const isError = errorCheck(inputDate);

    ifErrorStyle(isError, inputs, labels, spans);

    changeDisplay(h2s, new Array(3).fill('--'));

    if (isError) return;

    let [day, month, year] = inputDate;

    let userDate = new Date(year, --month, day);
    let currDate = new Date();

    changeDisplay(h2s, calcAge(userDate, currDate));

    clearInput(inputs);
});
