# Direct Google Sheets Integration Guide

With this setup, every time a user completes the charisma assessment, their result is automatically added as a new row in your **Google Sheet** in real time.

---

### Step 1: Create Your Google Sheet
1. Open [Google Sheets](https://sheets.new) and create a new sheet (e.g., `Charisma Assessment Responses`).
2. Add these column headers in row 1:
   - **A1**: `Timestamp`
   - **B1**: `Name`
   - **C1**: `Email`
   - **D1**: `Primary Archetype`
   - **E1**: `Primary Score %`
   - **F1**: `Secondary Wing`
   - **G1**: `Secondary Score %`
   - **H1**: `Hybrid Title`
   - **I1**: `Dolphin %`
   - **J1**: `Fox %`
   - **K1**: `Lion %`
   - **L1**: `Owl %`
   - **M1**: `Peacock %`
   - **N1**: `Bear/Wolf %`
   - **O1**: `Accuracy Rating (1-10)`

---

### Step 2: Add Google Apps Script
1. In your Google Sheet menu, click **Extensions** &rarr; **Apps Script**.
2. Delete any code in the editor and paste the following:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.participant_name || 'Anonymous',
      data.participant_email || '',
      data.primary_archetype || '',
      data.primary_score || '',
      data.secondary_wing || 'None',
      data.secondary_score || '',
      data.hybrid_title || '',
      data.dolphin_pct || '',
      data.fox_pct || '',
      data.lion_pct || '',
      data.owl_pct || '',
      data.peacock_pct || '',
      data.bear_wolf_pct || '',
      data.accuracy_rating || '8 / 10'
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click the **Save** icon (disk).

---

### Step 3: Deploy as Web App
1. At the top right, click **Deploy** &rarr; **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in:
   - **Description**: `Charisma Results Webhook`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` *(Important: allows the assessment website to send results)*
4. Click **Deploy**.
5. Grant permissions if prompted.
6. Copy the **Web App URL** (looks like `https://script.google.com/macros/s/AKfycb.../exec`).

---

### Step 4: Paste URL into `web/app.js`
Open [`web/app.js`](file:///c:/Users/u1233270/Downloads/Personal%20Apps/Charisma/web/app.js) and paste your URL into line 370:

```javascript
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

---

### Step 5: Host the Web App for Free on GitHub Pages (Zero Server Needed!)
Because Google Sheets handles the backend, you can host the website completely free on **GitHub Pages**:

1. In your GitHub repo settings, go to **Settings** &rarr; **Pages**.
2. Under **Build and deployment**, select:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / folder: `/web` (or root)
3. Click **Save**.

Your assessment will be live immediately at:
`https://<your-username>.github.io/<repo-name>/`
with all results writing directly into your Google Sheet!
