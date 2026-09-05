console.log("Solve2Git background service started");


chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {

        // ========================================
        // TEST GITHUB CONNECTION
        // ========================================

        if (message.type === "TEST_GITHUB") {

            testGitHubConnection()
                .then(result => {
                    sendResponse(result);
                })
                .catch(error => {

                    sendResponse({
                        success: false,
                        error: error.message
                    });

                });

            return true;
        }


        // ========================================
        // TEST GITHUB WRITE
        // ========================================

        if (message.type === "TEST_GITHUB_WRITE") {

            testGitHubWrite()
                .then(result => {
                    sendResponse(result);
                })
                .catch(error => {

                    sendResponse({
                        success: false,
                        error: error.message
                    });

                });

            return true;
        }


        // ========================================
        // ACCEPTED LEETCODE SOLUTION
        // ========================================

        if (message.type === "SOLUTION_ACCEPTED") {

            console.log(
                "📥 Solve2Git: Solution received!"
            );

            console.log(
                "Problem:",
                message.data.problemName
            );

            console.log(
                "Language:",
                message.data.language
            );

            console.log(
                "Code:"
            );

            console.log(
                message.data.code
            );


            saveSolutionToGitHub(message.data)
                .then(result => {

                    if (result.success) {

                        console.log(
                            "🎉 Solve2Git: Solution saved to GitHub!"
                        );

                    } else {

                        console.error(
                            "❌ Solve2Git: Failed to save solution:",
                            result.error
                        );
                    }

                })
                .catch(error => {

                    console.error(
                        "❌ Solve2Git: GitHub error:",
                        error.message
                    );

                });


            sendResponse({
                success: true
            });

            return true;
        }

    }
);


// ========================================
// TEST GITHUB CONNECTION
// ========================================

async function testGitHubConnection() {

    const settings = await chrome.storage.local.get([
        "githubUsername",
        "githubRepository",
        "githubToken"
    ]);


    const username = settings.githubUsername;
    const repository = settings.githubRepository;
    const token = settings.githubToken;


    if (!username || !repository || !token) {

        return {
            success: false,
            error: "GitHub settings are missing."
        };
    }


    const url =
        `https://api.github.com/repos/${username}/${repository}`;


    const response = await fetch(url, {

        method: "GET",

        headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28"
        }

    });


    if (!response.ok) {

        const errorData = await response.json();


        return {
            success: false,
            error:
                `HTTP ${response.status}: ` +
                `${errorData.message || "GitHub API request failed."}`
        };
    }


    const repositoryData = await response.json();


    console.log(
        "Solve2Git: GitHub repository found:",
        repositoryData.full_name
    );


    return {
        success: true
    };
}


// ========================================
// TEST GITHUB WRITE
// ========================================

async function testGitHubWrite() {

    const settings = await chrome.storage.local.get([
        "githubUsername",
        "githubRepository",
        "githubToken"
    ]);


    const username = settings.githubUsername;
    const repository = settings.githubRepository;
    const token = settings.githubToken;


    if (!username || !repository || !token) {

        return {
            success: false,
            error: "GitHub settings are missing."
        };
    }


    const filePath = "Solve2Git-test.txt";


    const fileContent =
        "Solve2Git GitHub write test successful!";


    const encodedContent =
        btoa(
            unescape(
                encodeURIComponent(fileContent)
            )
        );


    const url =
        `https://api.github.com/repos/${username}/${repository}/contents/${filePath}`;


    const response = await fetch(url, {

        method: "PUT",

        headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            message: "Test Solve2Git GitHub write",

            content: encodedContent

        })

    });


    const data = await response.json();


    if (!response.ok) {

        console.log(
            "GitHub write status:",
            response.status
        );

        console.log(
            "GitHub write response:",
            data
        );


        return {
            success: false,
            error:
                `HTTP ${response.status}: ` +
                `${data.message || "GitHub write failed."}`
        };
    }


    console.log(
        "Solve2Git: Test file created:",
        data.content?.path
    );


    return {
        success: true
    };
}


// ========================================
// SAVE ACCEPTED SOLUTION TO GITHUB
// ========================================

async function saveSolutionToGitHub(solution) {

    const settings = await chrome.storage.local.get([
        "githubUsername",
        "githubRepository",
        "githubToken"
    ]);


    const username = settings.githubUsername;
    const repository = settings.githubRepository;
    const token = settings.githubToken;


    if (!username || !repository || !token) {

        return {
            success: false,
            error: "GitHub settings are missing."
        };
    }


    // ----------------------------------------
    // GET SOLUTION INFORMATION
    // ----------------------------------------

    const problemName = solution.problemName;
    const language = solution.language;
    const code = solution.code;


    // ----------------------------------------
    // CURRENTLY SUPPORT JAVA
    // ----------------------------------------

    let extension = "txt";


    if (language === "Java") {
        extension = "java";
    }


    // ----------------------------------------
    // CREATE FILE PATH
    // ----------------------------------------

    const filePath =
        `${problemName}/Solution.${extension}`;


    console.log(
        "📁 GitHub file path:",
        filePath
    );


    // ----------------------------------------
    // ENCODE SOURCE CODE
    // ----------------------------------------

    const encodedContent =
        btoa(
            unescape(
                encodeURIComponent(code)
            )
        );


    // ----------------------------------------
    // GITHUB CONTENTS API
    // ----------------------------------------

    const url =
        `https://api.github.com/repos/${username}/${repository}/contents/${encodeURIComponent(problemName)}/Solution.${extension}`;


    const response = await fetch(url, {

        method: "PUT",

        headers: {

            "Accept":
                "application/vnd.github+json",

            "Authorization":
                `Bearer ${token}`,

            "X-GitHub-Api-Version":
                "2022-11-28",

            "Content-Type":
                "application/json"
        },

        body: JSON.stringify({

            message:
                `Add solution: ${problemName}`,

            content:
                encodedContent

        })

    });


    const data = await response.json();


    // ----------------------------------------
    // HANDLE ERROR
    // ----------------------------------------

    if (!response.ok) {

        console.error(
            "GitHub API status:",
            response.status
        );

        console.error(
            "GitHub API response:",
            data
        );


        return {

            success: false,

            error:
                `HTTP ${response.status}: ` +
                `${data.message || "GitHub API request failed."}`
        };
    }


    // ----------------------------------------
    // SUCCESS
    // ----------------------------------------

    console.log(
        "✅ GitHub file created:",
        data.content?.path
    );


    console.log(
        "🔗 Commit:",
        data.commit?.html_url
    );


    return {
        success: true
    };
}