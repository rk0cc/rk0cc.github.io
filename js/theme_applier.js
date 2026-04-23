"use strict";

const currentDate = new Date();
const htmlDOM = document.querySelector("html");

const appliedThemeProperties = (function () {
    function validateDatePattern(date) {
        const dateRegex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])$/;

        if (!dateRegex.test(date)) {
            throw new Error(`Invalid date representation: ${date}`);
        }
    }

    const htmlData = htmlDOM.dataset;

    var themeMode = htmlData.rk0ccThemeMode;
    var startAt = htmlData.rk0ccThemeAppliedSince;
    var endAt = htmlData.rk0ccThemeAppliedUntil;

    if (!themeMode || !startAt) {
        return null;
    }

    validateDatePattern(startAt);
    var startDate = new Date(`${startAt}T00:00:00+08:00`);

    var endDate = null;
    if (endAt) {
        validateDatePattern(endAt);
        endDate = new Date(`${endAt}T00:00:00+08:00`);

        if (startDate >= endDate) {
            throw new Error("Illegal date range applied");
        }
    }
    
    return Object.freeze({
        mode: themeMode,
        start: startDate,
        end: endDate
    });
})();

(function () {
    if (!appliedThemeProperties) {
        return;
    }

    var canApplyTheme = appliedThemeProperties.start <= currentDate;
    if (appliedThemeProperties.end) {
        canApplyTheme = canApplyTheme && appliedThemeProperties.end > currentDate;
    }

    if (!canApplyTheme) {
        return;
    }

    const themeClass = [];
    switch (appliedThemeProperties.mode) {
        case "memorial-semi":
            themeClass.push("memorial-gray", "semi-gray");
            break;
        case "memorial-full":
            themeClass.push("memorial-gray", "full-gray");
            break;
    }

    htmlDOM.classList.add(...themeClass);
})();
