const usernameInput = document.getElementById("username");
const repositoryInput = document.getElementById("repository");
const tokenInput = document.getElementById("token");

const saveButton = document.getElementById("saveButton");
const testButton = document.getElementById("testButton");
const writeTestButton = document.getElementById("writeTestButton");

const status = document.getElementById("status");


saveButton.addEventListener("click", async () => {

    const username = usernameInput.value.trim();
    const repository = repositoryInput.value.trim();
    const token = tokenInput.value.trim();

    if (!username || !repository || !token) {
        status.textContent = "Please fill all fields.";
        return;
    }

    await chrome.storage.local.set({
        githubUsername: username,
        githubRepository: repository,
        githubToken: token
    });

    status.textContent = "Settings saved successfully!";
});


testButton.addEventListener("click", async () => {

    status.textContent = "Testing GitHub connection...";

    chrome.runtime.sendMessage(
        {
            type: "TEST_GITHUB"
        },
        (response) => {

            if (chrome.runtime.lastError) {

                status.textContent =
                    "Error: " + chrome.runtime.lastError.message;

                return;
            }

            if (response && response.success) {

                status.textContent =
                    "✅ GitHub connection successful!";

            } else {

                status.textContent =
                    "❌ GitHub connection failed: " +
                    (response?.error || "Unknown error");

            }
        }
    );
});
writeTestButton.addEventListener("click", async () => {

    status.textContent = "Testing GitHub write access...";

    chrome.runtime.sendMessage(
        {
            type: "TEST_GITHUB_WRITE"
        },
        (response) => {

            if (chrome.runtime.lastError) {

                status.textContent =
                    "Error: " + chrome.runtime.lastError.message;

                return;
            }

            if (response && response.success) {

                status.textContent =
                    "✅ GitHub write successful!";

            } else {

                status.textContent =
                    "❌ GitHub write failed: " +
                    (response?.error || "Unknown error");
            }
        }
    );
});