# Solve2Git 🚀

Automatically save your accepted LeetCode solutions to GitHub.

Solve2Git is a Chrome extension that detects accepted LeetCode submissions, captures the solution code, programming language, and problem name, and automatically commits the solution to a GitHub repository.

## ✨ Features

- Automatically detects LeetCode submissions
- Detects when a submission is accepted
- Extracts the submitted source code
- Detects the programming language
- Detects the LeetCode problem name
- Automatically creates solution files in GitHub
- Uses the GitHub Contents API
- Stores GitHub configuration using Chrome Storage
- Supports a GitHub fine-grained Personal Access Token

## 🔄 How It Works

```text
LeetCode
   │
   │ Submit solution
   ▼
content.js
   │
   │ Detect Accepted
   │ Extract code
   │ Detect language
   │ Detect problem
   ▼
background.js
   │
   │ GitHub API
   ▼
GitHub Repository
   │
   ▼
Problem Name/
└── Solution.java
```

## 📁 Example

After submitting an accepted solution:

```
Leetcode_problems/
└── Longest Substring Without Repeating Characters/
    └── Solution.java
```

## 🛠️ Technologies

- JavaScript
- Chrome Extensions Manifest V3
- Chrome Storage API
- MutationObserver
- Monaco Editor DOM
- GitHub REST API
- GitHub Contents API

## 🧩 Project Structure

```
Solve2Git/
├── manifest.json
├── content.js
├── background.js
├── popup.html
├── popup.js
├── icon.png
└── README.md
```

### `content.js`

Runs on LeetCode pages.

Responsibilities:

- Detect Submit button
- Extract source code
- Detect programming language
- Detect problem name
- Detect submission result
- Send accepted solutions to `background.js`

### `background.js`

Runs as the extension service worker.

Responsibilities:

- Receive accepted solutions
- Read GitHub configuration
- Encode source code
- Communicate with GitHub REST API
- Create solution files
- Create GitHub commits

### `popup.html`

Provides the extension settings interface.

Users can configure:

- GitHub username
- GitHub repository
- GitHub token

### `popup.js`

Handles:

- Saving GitHub settings
- Testing GitHub connection
- Testing GitHub write access

## ⚙️ Installation

**1. Clone the repository**

```bash
git clone https://github.com/prem-kumar3405/Solve2Git.git
```

**2. Open Chrome Extensions**

Go to:

```
chrome://extensions
```

**3. Enable Developer Mode**

Turn on:

```
Developer mode
```

**4. Load the extension**

Click:

```
Load unpacked
```

Select the `Solve2Git` project folder.

## 🔐 GitHub Configuration

Create a GitHub fine-grained Personal Access Token.

The token should have access only to the repository where you want to store your solutions.

Required repository permission:

```
Contents → Read and write
```

Metadata read access is required by GitHub.

Enter the following in the Solve2Git popup:

```
GitHub Username
GitHub Repository
GitHub Token
```

Then click:

```
Save Settings
```

Use:

```
Test GitHub Connection
```

to verify access.

## 🚀 Usage

1. Open a LeetCode problem.
2. Write your solution.
3. Click Submit.
4. Solve2Git waits for the actual submission result.
5. If LeetCode reports Accepted, Solve2Git captures the solution.
6. The solution is sent to the background service worker.
7. Solve2Git creates the solution file in GitHub.

Example:

```
Accepted
   ↓
Longest Substring Without Repeating Characters
   ↓
Java
   ↓
Solution.java
   ↓
GitHub commit
```

## 📌 Current Version

Version: 1.0.0

Version 1 currently supports:

- LeetCode accepted submission detection
- Java solution extraction
- GitHub repository connection
- GitHub write access
- Automatic Java solution upload
- Automatic GitHub commit creation

## 🔮 Future Improvements

Planned improvements include:

- [ ] Support Python
- [ ] Support C++
- [ ] Support JavaScript
- [ ] Support TypeScript
- [ ] Support Go
- [ ] Support Rust
- [ ] Handle existing files and update them safely
- [ ] Prevent duplicate commits
- [ ] Add submission metadata
- [ ] Improve GitHub authentication security
- [ ] Add better error handling
- [ ] Add extension success/failure notifications
- [ ] Improve popup UI
- [ ] Add configuration for repository folder structure

## 🔒 Security

Never commit your GitHub token to this repository.

The token should only be stored locally through Chrome extension storage.

Do not place the token directly inside:

- `manifest.json``
- `content.js`
- `background.js`
- `popup.js`

If a GitHub token is accidentally exposed, revoke it immediately and create a new one.

## 📄 License

This project is currently intended for personal learning and development.