console.log("Solve2Git extension loaded!");
console.log("Current page:", window.location.href);


// ========================================
// GET SOLUTION CODE
// ========================================

function getSolutionCode() {

    const editor = document.querySelector(".monaco-editor");

    if (!editor) {

        console.log("Solve2Git: Monaco editor not found.");

        return null;
    }


    const textarea = editor.querySelector("textarea");

    if (!textarea) {

        console.log("Solve2Git: Editor textarea not found.");

        return null;
    }


    textarea.focus();

    const code = textarea.value;


    console.log("Solve2Git: Code extracted:");
    console.log(code);


    return code;
}


// ========================================
// GET PROGRAMMING LANGUAGE
// ========================================

function getLanguage() {

    const buttons = document.querySelectorAll("button");


    for (const button of buttons) {

        const text = button.innerText.trim();


        if (
            text === "Java" ||
            text === "Python" ||
            text === "C++" ||
            text === "C" ||
            text === "JavaScript" ||
            text === "TypeScript" ||
            text === "Go" ||
            text === "Rust"
        ) {

            console.log(
                "Solve2Git: Language detected:",
                text
            );

            return text;
        }
    }


    console.log(
        "Solve2Git: Language not detected."
    );


    return null;
}


// ========================================
// GET PROBLEM NAME
// ========================================

function getProblemName() {

    const title = document.title;


    const problemName = title
        .replace(" - LeetCode", "")
        .trim();


    console.log(
        "Solve2Git: Problem detected:",
        problemName
    );


    return problemName;
}


// ========================================
// CHECK IF ACCEPTED
// ========================================

function isAccepted() {

    const pageText = document.body.innerText;


    const accepted = pageText.includes("Accepted");


    console.log(
        "Solve2Git: Accepted:",
        accepted
    );


    return accepted;
}


// ========================================
// FIND SUBMIT BUTTON
// ========================================

function findSubmitButton() {

    const buttons = document.querySelectorAll("button");


    for (const button of buttons) {

        const text = button.innerText.trim();


        if (text === "Submit") {

            return button;
        }
    }


    return null;
}


// ========================================
// WAIT FOR SUBMISSION RESULT
// ========================================

function waitForSubmissionResult(
    code,
    language,
    problemName
) {

    console.log(
        "⏳ Solve2Git: Waiting for submission result..."
    );


    let attempts = 0;

    const maxAttempts = 30;


    const interval = setInterval(() => {

        attempts++;


        const pageText = document.body.innerText;


        // --------------------------------
        // ACCEPTED
        // --------------------------------

        if (pageText.includes("Accepted")) {

            clearInterval(interval);


            console.log(
                "🎉 Solve2Git: Submission ACCEPTED!"
            );


            chrome.runtime.sendMessage({

                type: "SOLUTION_ACCEPTED",

                data: {

                    problemName: problemName,

                    language: language,

                    code: code
                }

            });


            console.log(
                "📤 Solve2Git: Accepted solution sent to background.js"
            );


            return;
        }


        // --------------------------------
        // FAILED SUBMISSION
        // --------------------------------

        if (
            pageText.includes("Wrong Answer") ||
            pageText.includes("Runtime Error") ||
            pageText.includes("Compile Error")
        ) {

            clearInterval(interval);


            console.log(
                "❌ Solve2Git: Submission failed."
            );


            return;
        }


        // --------------------------------
        // TIMEOUT
        // --------------------------------

        if (attempts >= maxAttempts) {

            clearInterval(interval);


            console.log(
                "⚠️ Solve2Git: Submission result timeout."
            );
        }

    }, 1000);
}


// ========================================
// SETUP SUBMIT BUTTON LISTENER
// ========================================

function setupSubmitListener() {

    const observer = new MutationObserver(() => {


        const submitButton = findSubmitButton();


        if (!submitButton) {

            return;
        }


        // Prevent attaching the listener
        // multiple times

        if (
            submitButton.dataset.solve2gitAttached === "true"
        ) {

            return;
        }


        submitButton.dataset.solve2gitAttached = "true";


        console.log(
            "Solve2Git: Submit button found!"
        );


        submitButton.addEventListener(
            "click",
            () => {

                console.log(
                    "🚀 Solve2Git: Submit button clicked!"
                );


                // --------------------------------
                // CAPTURE SOLUTION
                // --------------------------------

                const code = getSolutionCode();

                const language = getLanguage();

                const problemName = getProblemName();


                // --------------------------------
                // VALIDATE DATA
                // --------------------------------

                if (
                    code &&
                    language &&
                    problemName
                ) {

                    console.log(
                        "✅ Solve2Git: Solution captured!"
                    );


                    console.log(
                        "📝 Problem:",
                        problemName
                    );


                    console.log(
                        "📝 Language:",
                        language
                    );


                    // --------------------------------
                    // WAIT FOR LEETCODE RESULT
                    // --------------------------------

                    waitForSubmissionResult(
                        code,
                        language,
                        problemName
                    );

                } else {

                    console.log(
                        "❌ Solve2Git: Could not capture solution data."
                    );
                }

            }
        );

    });


    observer.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );


    console.log(
        "Solve2Git: Watching for Submit button..."
    );
}


// ========================================
// START EXTENSION
// ========================================

setupSubmitListener();