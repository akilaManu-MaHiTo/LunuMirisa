# LunuMirisa-newSSD - SE4030 Secure Software Development Assignment

> Restaurant management web app (MERN) - Hardened version for Secure Software Development coursework.

## 1. Group Members

| # | Name | Index Number | Contribution |
|---|------|--------------|--------------|
| 1 | [Member 1 Name] | [e.g. ITXXXXXXX] | - |
| 2 | L.S.B Hemarathne | IT22134776 | Sensitive Data Exposure + Security Misconfiguration + CORS, Broken Authentication, Unrestricted File Upload |
| 3 | [Member 3 Name] | [e.g. ITXXXXXXX] | - |
| 4 | [Member 4 Name] | [e.g. ITXXXXXXX] | - |

> Replace placeholders above before submission. Individual contribution will be assessed in viva.

## 2. Github Links (as required by assignment)

*   **Original project (before fixes):** https://github.com/akilaManu-MaHiTo/LunuMirisa  
*   **Modified project (after fixing vulnerabilities):** https://github.com/biteupLK/LunuMirisa-newSSD  
    *Branch for this submission:* `feat/security-hardening`  
    ```bash
    git clone https://github.com/biteupLK/LunuMirisa-newSSD.git
    git checkout feat/security-hardening
    git log --oneline  # detailed commit messages required for marking
    ```

## 3. YouTube Video (max 20 min)

**Link:** [Insert YouTube link here - unlisted/public] `https://youtu.be/XXXXXXXX`

Video covers:
1.  Vulnerabilities found (demo with ZAP / curl)
2.  Fixes applied (code walkthrough)
3.  OAuth / OpenID Connect implementation (Google)

## 4. Vulnerabilities Fixed

Full technical report: [`SECURITY_FIXES.md`](./SECURITY_FIXES_IT22134776.md)

| # | OWASP | Vulnerability | Status | Commit |
|---|-------|---------------|--------|--------|
| 1 | A01/A02/A05 | **Sensitive Data Exposure + Security Misconfiguration + CORS** - `.env` committed, hardcoded `MONGO_URI`/Gmail creds in `server/database.js:4` and `server/util/Email.js:1`, wildcard CORS `server/server.js:35` | **Fixed** | `9388acae` |
| 2 | A07 | **Broken Authentication** - plaintext `AddEmployee` passwords `server/models/AddEmployee.js:15`, `password===password` `server/controllers/LoginController.js:25`, credential logging, user enumeration via 400/404/505 | **Fixed** | `4adaee80` |
| 3 | A04/A08 | **Unrestricted File Upload** - `multer` without `fileFilter`/`limits` in `ProfilePictureController.js:17` and `AddMenuController.js:16`, raw `originalname` | **Fixed** | `af14973b` |
| 4 | - | OAuth env loading (`c74dea7d`) - `server/server.js:1` dotenv path fix for `GOOGLE_CLIENT_ID` | **Fixed** | `c74dea7d` |

Tools used per assignment references: `OWASP ZAP`, `OWASP Dependency-Check`, `sqlmap`, `OWASP Top 10`.

## 5. OAuth / OpenID Connect Implementation

*   **Grant:** Authorization Code flow via Google Identity Services
*   **Libraries:** `server/package.json:google-auth-library`, `client/package.json:@react-oauth/google`
*   **Flow:**
    1.  Client `client/src/main.jsx:10` wraps `<GoogleOAuthProvider clientId={VITE_API_GOOGLE_CLIENT_ID}>`
    2.  User clicks `GoogleLogin` `client/src/views/login.jsx:229` -> `credential` (ID token)
    3.  `POST /google-login` `server/controllers/LoginController.js:95` verifies with `OAuth2Client.verifyIdToken({audience: GOOGLE_CLIENT_ID})`, auto-creates `User` with `verified:true` and random hashed password, returns `JWT`
    4.  Protected routes via `server/middleware/AuthMiddleware.js:5` `protect` (Bearer verify)
*   **Config:** `server/.env` `GOOGLE_CLIENT_ID` (see `server/.env.example:13`), `client/.env` `VITE_API_GOOGLE_CLIENT_ID`

## 6. How to Run

```bash
# prerequisites: Node 18+, MongoDB
cp server/.env.example server/.env  # fill MONGO_URI, JWTPRIVATEKEY, GOOGLE_CLIENT_ID, CLIENT_URL
cp client/.env.example client/.env  # fill VITE_API_BASE_URL, VITE_API_GOOGLE_CLIENT_ID

cd server && npm install && npm start   # http://localhost:3000
cd client && npm install && npm run dev # http://localhost:5173
```

Test:
```bash
# file upload rejection
curl -F "image=@evil.exe" http://localhost:3000/ProfileImage  # -> 400
# auth enumeration generic
curl -X POST http://localhost:3000/loginUser -H "Content-Type: application/json" -d '{"email":"a@b.com","password":"x"}' # -> 401 Invalid email or password
```

## 7. Commit History (evidence)

```bash
git log --oneline feat/security-hardening
# 26a7ab45 docs(security): add detailed hardening report...
# c74dea7d fix(oauth): ensure dotenv loads from server/.env...
# af14973b fix(security): harden file uploads...
# 4adaee80 fix(security): secure authentication with bcrypt...
# 9388acae fix(security): harden secrets and CORS config...
```

Each fix is a separate commit with `fix(security):` prefix and OWASP refs as required.

## 8. Deliverables Checklist (assignment)

- [x] `README.md` + `readme.txt` (this file) with members, links, video
- [x] `SECURITY_FIXES.md` detailed report
- [ ] Zip `readme.txt` + `Report.pdf` to CourseWeb
- [ ] Prepare viva: individual contributions

## 9. References

1. https://owasp.org/www-project-top-ten/
2. https://www.zaproxy.org/
3. https://owasp.org/www-project-dependency-check/
4. https://owasp.org/www-project-java-encoder/

---
*This README satisfies SE4030 deliverable 1. Replace placeholders and generate PDF before final upload.*
