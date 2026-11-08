
document.addEventListener("DOMContentLoaded", function () {

    const completedContainer = document.getElementById("completedCourses");
    const availableContainer = document.getElementById("availableCourses");
    const planContainer = document.getElementById("coursePlan");
    const notesContainer = document.getElementById("courseNotes");
    const creditsDisplay = document.getElementById("planCredits");
    const statusDisplay = document.getElementById("advisorStatus");
    const clearButton = document.getElementById("clearPlanButton");

    let courses = [];
    let choiceGroups = [];
    let courseMap = new Map();
    let selectedCourseId = null;

    const completed = new Set();
    const planned = new Set();

    function createElement(tag, className, text) {
        const item = document.createElement(tag);

        if (className) {
            item.className = className;
        }

        if (text !== undefined) {
            item.textContent = text;
        }

        return item;
    }

    function getCourseName(id) {
        const course = courseMap.get(id);
        return course ? id + " - " + course.title : id;
    }

    function getChoiceGroup(course) {
        return choiceGroups.find(function (group) {
            return group.id === course.choiceGroup;
        });
    }

    function getChoiceConflict(course) {
        if (!course.choiceGroup) {
            return null;
        }

        return courses.find(function (other) {
            return (
                other.id !== course.id &&
                other.choiceGroup === course.choiceGroup &&
                (completed.has(other.id) || planned.has(other.id))
            );
        }) || null;
    }

    function requirementsMet(course) {
        const requirements = course.requires || [];

        return requirements.every(function (group) {
            return group.some(function (id) {
                return completed.has(id);
            });
        });
    }

    function missingRequirements(course) {
        const requirements = course.requires || [];

        return requirements.filter(function (group) {
            return !group.some(function (id) {
                return completed.has(id);
            });
        }).map(function (group) {
            return group.join(" OR ");
        });
    }

    function missingCorequisites(course) {
        return (course.corequisites || []).filter(function (id) {
            return !completed.has(id) && !planned.has(id);
        });
    }

    function getAvailability(course) {

        if (completed.has(course.id)) {
            return {
                eligible: false,
                reason: "Already completed"
            };
        }

        const conflict = getChoiceConflict(course);

        if (conflict) {
            return {
                eligible: false,
                reason: "Alternative already selected: " + conflict.id
            };
        }

        if (!requirementsMet(course)) {
            return {
                eligible: false,
                reason: "Missing prerequisite: " +
                    missingRequirements(course).join(" AND ")
            };
        }

        const missingCoreqs = missingCorequisites(course);

        if (missingCoreqs.length > 0) {
            return {
                eligible: false,
                reason: "Complete or plan corequisite: " +
                    missingCoreqs.join(", ")
            };
        }

        return {
            eligible: true,
            reason: "Prerequisite requirements satisfied"
        };
    }

    function updatePlanEligibility() {
        let changed = true;

        while (changed) {
            changed = false;

            Array.from(planned).forEach(function (id) {
                const course = courseMap.get(id);

                if (!course || !getAvailability(course).eligible) {
                    planned.delete(id);
                    changed = true;
                }
            });
        }
    }

    function renderCompleted() {
        completedContainer.replaceChildren();

        courses.forEach(function (course) {

            const row = createElement("div", "advisor-completed-row");
            const label = createElement("label", "advisor-checkbox-label");
            const checkbox = document.createElement("input");

            checkbox.type = "checkbox";
            checkbox.checked = completed.has(course.id);

            const conflict = getChoiceConflict(course);

            checkbox.disabled = Boolean(conflict);

            checkbox.addEventListener("change", function () {

                if (checkbox.checked) {
                    completed.add(course.id);
                    planned.delete(course.id);
                } else {
                    completed.delete(course.id);
                }

                updatePlanEligibility();
                renderAll();

                statusDisplay.textContent =
                    "Completed courses updated. Eligibility recalculated.";
            });

            label.appendChild(checkbox);

            label.appendChild(
                createElement(
                    "span",
                    "",
                    " " + getCourseName(course.id)
                )
            );

            row.appendChild(label);

            if (conflict) {
                row.appendChild(
                    createElement(
                        "small",
                        "advisor-note",
                        "Alternative to " + conflict.id
                    )
                );
            }

            completedContainer.appendChild(row);
        });
    }

    function showDetails(courseId) {
        selectedCourseId = courseId;
        renderDetails();
    }

    function renderDetails() {
        notesContainer.replaceChildren();

        if (!selectedCourseId) {
            notesContainer.appendChild(
                createElement("p", "", "No course selected.")
            );
            return;
        }

        const course = courseMap.get(selectedCourseId);

        if (!course) {
            return;
        }

        notesContainer.appendChild(
            createElement("h3", "", getCourseName(course.id))
        );

        notesContainer.appendChild(
            createElement(
                "p",
                "",
                "Category: " + course.category +
                " | Credits: " + course.credits
            )
        );

        const prerequisites = (course.requires || []).map(
            function (group) {
                return "(" + group.join(" OR ") + ")";
            }
        );

        notesContainer.appendChild(
            createElement(
                "p",
                "",
                "Prerequisites: " +
                (prerequisites.length
                    ? prerequisites.join(" AND ")
                    : "None listed")
            )
        );

        if (course.corequisites && course.corequisites.length) {
            notesContainer.appendChild(
                createElement(
                    "p",
                    "",
                    "Corequisites: " + course.corequisites.join(", ")
                )
            );
        }

        const choiceGroup = getChoiceGroup(course);

        if (choiceGroup) {
            notesContainer.appendChild(
                createElement("p", "advisor-note", choiceGroup.note)
            );
        }

        if (course.note) {
            notesContainer.appendChild(
                createElement("p", "advisor-note", course.note)
            );
        }

        if (course.manualReview) {
            notesContainer.appendChild(
                createElement(
                    "p",
                    "advisor-note",
                    "Manual catalog or advisor review is recommended."
                )
            );
        }

        notesContainer.appendChild(
            createElement(
                "p",
                "",
                "Status: " + getAvailability(course).reason
            )
        );
    }

    function addToPlan(courseId) {
        const course = courseMap.get(courseId);

        if (!course || planned.has(courseId)) {
            return;
        }

        const result = getAvailability(course);

        if (!result.eligible) {
            statusDisplay.textContent =
                courseId + " cannot be added. " + result.reason;
            return;
        }

        planned.add(courseId);
        renderAll();

        statusDisplay.textContent =
            courseId + " added to your course plan.";
    }

    function removeFromPlan(courseId) {
        planned.delete(courseId);
        updatePlanEligibility();
        renderAll();

        statusDisplay.textContent =
            courseId + " removed from your course plan.";
    }

    function makeDetailsButton(course) {
        const button = createElement(
            "button",
            "advisor-secondary-button",
            "Details"
        );

        button.type = "button";

        button.addEventListener("click", function () {
            showDetails(course.id);
        });

        return button;
    }

    function renderAvailable() {
        availableContainer.replaceChildren();

        const eligibleCourses = [];
        const unavailableCourses = [];

        courses.forEach(function (course) {
            if (completed.has(course.id)) {
                return;
            }

            if (getAvailability(course).eligible) {
                eligibleCourses.push(course);
            } else {
                unavailableCourses.push(course);
            }
        });

        availableContainer.appendChild(
            createElement(
                "h3",
                "",
                "Eligible Courses (" + eligibleCourses.length + ")"
            )
        );

        eligibleCourses.forEach(function (course) {
            const card = createElement("div", "advisor-course-card");

            card.appendChild(
                createElement("h4", "", getCourseName(course.id))
            );

            card.appendChild(
                createElement(
                    "p",
                    "",
                    course.credits + " credits | " + course.category
                )
            );

            card.draggable = !planned.has(course.id);

            card.addEventListener("dragstart", function (event) {
                event.dataTransfer.setData("text/plain", course.id);
                event.dataTransfer.effectAllowed = "move";
            });

            const addButton = createElement(
                "button",
                "",
                planned.has(course.id) ? "Added to Plan" : "Add to Plan"
            );

            addButton.type = "button";
            addButton.disabled = planned.has(course.id);

            addButton.addEventListener("click", function () {
                addToPlan(course.id);
            });

            card.appendChild(addButton);
            card.appendChild(makeDetailsButton(course));

            availableContainer.appendChild(card);
        });

        if (eligibleCourses.length === 0) {
            availableContainer.appendChild(
                createElement("p", "", "No eligible courses found.")
            );
        }

        availableContainer.appendChild(
            createElement(
                "h3",
                "",
                "Unavailable Courses (" + unavailableCourses.length + ")"
            )
        );

        unavailableCourses.forEach(function (course) {
            const card = createElement(
                "div",
                "advisor-course-card advisor-unavailable"
            );

            card.appendChild(
                createElement("h4", "", getCourseName(course.id))
            );

            card.appendChild(
                createElement(
                    "p",
                    "advisor-note",
                    getAvailability(course).reason
                )
            );

            card.appendChild(makeDetailsButton(course));

            availableContainer.appendChild(card);
        });
    }

    function renderPlan() {
        planContainer.replaceChildren();

        let totalCredits = 0;

        if (planned.size === 0) {
            planContainer.appendChild(
                createElement(
                    "p",
                    "",
                    "No courses added to your plan yet."
                )
            );
        }

        planned.forEach(function (id) {
            const course = courseMap.get(id);

            if (!course) {
                return;
            }

            totalCredits += course.credits;

            const card = createElement("div", "advisor-plan-card");

            card.appendChild(
                createElement("strong", "", getCourseName(id))
            );

            card.appendChild(
                createElement(
                    "p",
                    "",
                    course.credits + " credits"
                )
            );

            const removeButton = createElement(
                "button",
                "advisor-secondary-button",
                "Remove"
            );

            removeButton.type = "button";

            removeButton.addEventListener("click", function () {
                removeFromPlan(id);
            });

            card.appendChild(removeButton);
            card.appendChild(makeDetailsButton(course));

            planContainer.appendChild(card);
        });

        creditsDisplay.textContent = String(totalCredits);
    }

    function renderAll() {
        renderCompleted();
        renderAvailable();
        renderPlan();
        renderDetails();
    }

    planContainer.addEventListener("dragover", function (event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        planContainer.classList.add("advisor-drag-over");
    });

    planContainer.addEventListener("dragleave", function () {
        planContainer.classList.remove("advisor-drag-over");
    });

    planContainer.addEventListener("drop", function (event) {
        event.preventDefault();
        planContainer.classList.remove("advisor-drag-over");

        const courseId = event.dataTransfer.getData("text/plain");

        addToPlan(courseId);
    });

    clearButton.addEventListener("click", function () {
        planned.clear();
        renderAll();

        statusDisplay.textContent = "Course plan cleared.";
    });

    fetch("data/bsit-courses.json")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Unable to load course data.");
            }

            return response.json();
        })
        .then(function (data) {
            courses = data.courses;
            choiceGroups = data.choiceGroups || [];

            courseMap = new Map(
                courses.map(function (course) {
                    return [course.id, course];
                })
            );

            renderAll();

            statusDisplay.textContent =
                courses.length +
                " courses loaded successfully. Select completed courses.";
        })
        .catch(function (error) {
            statusDisplay.textContent =
                "Error loading course data. Check the JSON file and server.";

            console.error(error);
        });

});
