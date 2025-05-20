const YEAR = 2025;

// Define holidays:
// - Single: 'YYYY-MM-DD': { type: '...', name: '...' }
// - Overlap: 'YYYY-MM-DD': [ { type: '...', name: '...' }, { type: '...', name: '...' } ]
const holidays = {
    "2025-01-01": [
        { type: "cl-irr", name: "Año Nuevo (CL)" },
        { type: "us-fed", name: "New Year's Day (US)" },
    ],
    "2025-01-20": { type: "us-fed", name: "MLK Jr. Day" },

    "2025-02-17": { type: "us-fed", name: "President's Day" },

    "2025-04-18": { type: "cl-rel", name: "Viernes Santo" },
    "2025-04-19": { type: "cl-rel", name: "Sábado Santo" },
    "2025-05-01": { type: "cl-irr", name: "Día del Trabajo" },

    "2025-05-21": { type: "cl-civ", name: "Día Glorias Navales" },
    "2025-05-26": { type: "us-fed", name: "Memorial Day" },

    "2025-06-19": { type: "us-fed", name: "Juneteenth" },
    "2025-06-20": {
        type: "cl-civ",
        name: "Día Nacional de los Pueblos Indígenas",
    },
    "2025-06-29": [
        {
            type: "cl-irr",
            name: "POR CONFIRMAR: Elecciones Primarias Presidenciales y Parlamentarias",
        },
        { type: "cl-rel", name: "San Pedro y San Pablo" },
    ],

    "2025-07-04": { type: "us-fed", name: "Independence Day" },
    "2025-07-16": { type: "cl-rel", name: "Día de la Virgen del Carmen" },
    "2025-08-15": { type: "cl-rel", name: "Asunción de la Virgen" },

    "2025-09-01": { type: "us-fed", name: "Labor Day" },
    "2025-09-18": { type: "cl-irr", name: "Independencia Nacional" },
    "2025-09-19": { type: "cl-irr", name: "Día de las Glorias del Ejército" },

    "2025-10-12": { type: "cl-civ", name: "Encuentro Dos Mundos" },
    "2025-10-13": { type: "us-fed", name: "Columbus Day" },

    "2025-10-31": {
        type: "cl-rel",
        name: "Día de las Iglesias Evangélicas y Protestantes",
    },
    "2025-11-01": { type: "cl-rel", name: "Día de Todos los Santos" },

    "2025-11-11": { type: "us-fed", name: "Veterans Day" },
    "2025-11-16": {
        type: "cl-irr",
        name: "Elecciones Presidenciales y Parlamentarias",
    },
    "2025-11-27": { type: "us-fed", name: "Thanksgiving Day" },

    "2025-12-08": { type: "cl-rel", name: "Inmaculada Concepción" },

    "2025-12-25": [
        { type: "cl-irr", name: "Navidad (CL)" },
        { type: "us-fed", name: "Christmas Day (US)" },
    ],
};

// Map holiday types to CSS classes
const holidayClasses = {
    "cl-irr": "holiday-cl-irr",
    "cl-civ": "holiday-cl-civ",
    "cl-rel": "holiday-cl-rel",
    "us-fed": "holiday-us-fed",
};

const holidayTypeNames = {
    "cl-irr": "Chilean Irrenunciable",
    "cl-civ": "Chilean Civil",
    "cl-rel": "Chilean Religious",
    "us-fed": "US Federal",
};

const calendarContainer = document.getElementById("calendar-container");
const yearHeading = document.getElementById("calendar-year");
const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TODAY = new Date();
const CURRENT_YEAR = TODAY.getFullYear();
const CURRENT_MONTH = TODAY.getMonth();
const CURRENT_DAY = TODAY.getDate();

function generateCalendar(year) {
    yearHeading.textContent = `Chile & US Holidays ${year}`;
    calendarContainer.innerHTML = "";

    for (let month = 0; month < 12; month++) {
        const monthDiv = document.createElement("div");
        monthDiv.classList.add("month");
        const monthTitle = document.createElement("h2");
        monthTitle.classList.add("month-title");
        monthTitle.textContent = monthNames[month];
        monthDiv.appendChild(monthTitle);

        const daysGrid = document.createElement("div");
        daysGrid.classList.add("days-grid");

        dayNames.forEach((dayName) => {
            const dayHeader = document.createElement("div");
            dayHeader.classList.add("day-header");
            dayHeader.textContent = dayName;
            daysGrid.appendChild(dayHeader);
        });

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.classList.add("day", "empty-day");
            daysGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement("div");
            dayCell.classList.add("day");

            const daySpan = document.createElement("span");
            daySpan.textContent = day;
            dayCell.appendChild(daySpan);

            const currentDate = new Date(year, month, day);
            const dayOfWeek = currentDate.getDay();
            const dateString = `${year}-${String(month + 1).padStart(
                2,
                "0"
            )}-${String(day).padStart(2, "0")}`;

            if (
                year === CURRENT_YEAR &&
                month === CURRENT_MONTH &&
                day === CURRENT_DAY
            ) {
                dayCell.classList.add("current-day");
                daySpan.title = "Today";
            }

            if (year === CURRENT_YEAR) {
                if (
                    month < CURRENT_MONTH ||
                    (month === CURRENT_MONTH && day < CURRENT_DAY)
                ) {
                    dayCell.classList.add("past-day");
                }
            }

            if (dayOfWeek === 0 || dayOfWeek === 6) {
                dayCell.classList.add("weekend");
            }

            // --- Updated Holiday Handling ---
            const holidayDataForDay = holidays[dateString];
            if (holidayDataForDay) {
                let primaryHolidayInfo;
                let tooltipText = "";
                let isOverlap = false;

                if (Array.isArray(holidayDataForDay)) {
                    // Overlap case
                    isOverlap = true;
                    primaryHolidayInfo = holidayDataForDay[0];
                    dayCell.classList.add("holiday-overlap");

                    // Combine tooltips
                    tooltipText = holidayDataForDay
                        .map((h) => {
                            const typeName =
                                holidayTypeNames[h.type] || "Holiday";
                            return `${typeName}: ${h.name}`;
                        })
                        .join("\n");
                } else {
                    primaryHolidayInfo = holidayDataForDay;
                    const typeName =
                        holidayTypeNames[primaryHolidayInfo.type] || "Holiday";
                    tooltipText = `${typeName}: ${primaryHolidayInfo.name}`;
                }

                dayCell.classList.add("holiday");
                if (holidayClasses[primaryHolidayInfo.type]) {
                    dayCell.classList.add(
                        holidayClasses[primaryHolidayInfo.type]
                    );
                }
                dayCell.dataset.tooltip = tooltipText;
            }

            daysGrid.appendChild(dayCell);
        }
        monthDiv.appendChild(daysGrid);
        calendarContainer.appendChild(monthDiv);
    }
}

function calculateHolidayWorkdayCounts(holidayData, year) {
    const counts = {
        "holiday-cl-irr": 0,
        "holiday-cl-civ": 0,
        "holiday-cl-rel": 0,
        "holiday-us-fed": 0,
    };

    for (const dateString in holidayData) {
        const entry = holidayData[dateString];
        const dateParts = dateString.split("-").map(Number);
        const holidayDate = new Date(year, dateParts[1] - 1, dateParts[2]);
        const dayOfWeek = holidayDate.getDay();

        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            const holidaysOnThisDay = Array.isArray(entry) ? entry : [entry];

            holidaysOnThisDay.forEach((holidayInfo) => {
                const cssClass = holidayClasses[holidayInfo.type];
                if (cssClass && counts.hasOwnProperty(cssClass)) {
                    counts[cssClass]++;
                }
            });
        }
    }
    return counts;
}

function updateLegendCounts(counts) {
    const legendItems = document.querySelectorAll("#legend .legend-item");
    legendItems.forEach((item) => {
        const colorSpan = item.querySelector(".legend-color");
        const countSpan = item.querySelector(".legend-count");
        const targetClass = colorSpan?.dataset.targetClass;

        if (targetClass && countSpan && counts.hasOwnProperty(targetClass)) {
            countSpan.textContent = `(${counts[targetClass]})`;
        } else if (countSpan) {
            countSpan.textContent = "";
        }
    });
}

function setupLegendInteraction() {
    const legendItems = document.querySelectorAll("#legend .legend-item");
    const allCalendarDays = document.querySelectorAll(
        "#calendar-container .day"
    );

    legendItems.forEach((item) => {
        const colorSpan = item.querySelector(".legend-color");
        const targetClass = colorSpan?.dataset.targetClass;

        if (!targetClass) return;

        item.addEventListener("mouseenter", () => {
            calendarContainer.classList.add("is-highlighting");
            allCalendarDays.forEach((day) => {
                if (day.classList.contains(targetClass)) {
                    day.classList.add("highlight-active");
                }
                if (
                    day.classList.contains("holiday-overlap") &&
                    day.classList.contains(targetClass)
                ) {
                    day.classList.add("highlight-active");
                }
            });
        });

        item.addEventListener("mouseleave", () => {
            calendarContainer.classList.remove("is-highlighting");
            allCalendarDays.forEach((day) => {
                day.classList.remove("highlight-active");
            });
        });
    });
}

generateCalendar(YEAR);
const workdayCounts = calculateHolidayWorkdayCounts(holidays, YEAR);
updateLegendCounts(workdayCounts);
setupLegendInteraction();
