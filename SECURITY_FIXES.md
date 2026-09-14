# SE4030 Secure Software Development - Security Hardening Report

**Branch:** `feat/security-hardening`  
**App:** LunuMirisa-newSSD (MERN - `client/` Vite+React, `server/` Express+Mongoose)  
**Fixes covered:** 1, 2, 7 (distinct OWASP Top 10 2021) + OAuth hotfix  
**Date:** 2026-05-11

---

## 1) Sensitive Data Exposure + Security Misconfiguration + CORS (OWASP A01 / A02 / A05)

** Commit:** `9388acae` - `fix(security): harden secrets and CORS config (OWASP A01/A02/A05)`

### 1.1 What was vulnerable

| Location | Issue |
|---|---|
| `server/.env:1-12`, `client/.env:1`, `server/util/.env:1-13` | Committed to git (`git ls-files` showed all three). Contains `JWTPRIVATEKEY`, `MONGO_URI` with embedded `akilamanujith_db_user:akilamanu@cluster0...`, Gmail `USER/PASS=ujci ltpk tfxe qiaf`. |
| `server/database.js:4` | Fallback `process.env.MONGO_URI || 'mongodb+srv://akilaman...@cluster0...'` - hardcoded creds leak even if env missing. |
| `server/util/Email.js:1-16` | Hardcoded `host/user/pass` in code + `console.log` of creds. |
| `server/server.js:35-39` | `cors({ origin:"*", credentials:true })` - wildcard with creds is both invalid and insecure, allows any origin to send credentialed requests. |
| `server/server.js:40` | `express.json()` no body limit -> DoS via large payloads. |
| `server/server.js:1` | `require('dotenv').config()` without path -> fails when CWD != `server/` (e.g. run from root), so `GOOGLE_CLIENT_ID` etc. missing. Later fixed in `c74dea7d`. |
| `.gitignore:1-5` | No `.env` pattern, so secrets staged by default. |

**Risk:** Anyone cloning repo gets DB, JWT signing key, and email app password. Can forge JWTs (`server/models/Users.js:17` uses `JWTPRIVATEKEY`), dump DB, send mail as app. CORS wildcard enables credential theft from attacker origin.

### 1.2 How to exploit (proof)

```bash
git ls-files | grep .env
# client/.env
# server/.env
# server/util/.env
cat server/.env  # leaked key
# JWTPRIVATEKEY=f13efc77bb...
git show HEAD:server/database.js | grep MONGO_URI
# fallback connection string visible
```

ZAP/Dependency-Check flag `A01:2021 Broken Access Control`, `A02 Cryptographic Failures`, `A05 Misconfiguration`.

### 1.3 Fix

1. **Remove from index, keep locally**
   ```bash
   git rm --cached -f server/.env client/.env server/util/.env
   ```
   Files deleted from git index but recreated locally (now gitignored, `git status` clean).

2. **`.gitignore:6-13`**
   ```gitignore
   .env
   *.env
   server/.env
   server/util/.env
   client/.env
   !.env.example
   !*.env.example
   ```

3. **Templates**
   - `server/.env.example:1-14` and `client/.env.example:1-3` with placeholders (`MONGO_URI=mongodb+srv://<user>...`, `GOOGLE_CLIENT_ID=your-...`). No secrets.

4. **`server/database.js:3-12`**
   ```js
   const URL = process.env.MONGO_URI;
   if (!URL) console.error('FATAL: MONGO_URI not set...');
   module.exports = () => {
     if (!URL) return Promise.reject(new Error('MONGO_URI not configured'));
     return mongoose.connect(URL, ...);
   }
   ```
   No hardcoded fallback.

5. **`server/util/Email.js:1-22`**
   ```js
   require('dotenv').config();
   const host = process.env.HOST || "smtp.gmail.com";
   const user = process.env.USER;
   const pass = process.env.PASS;
   if (!user || !pass) throw new Error('Email credentials not configured');
   // removed console.log(user/pass)
   ```

6. **`server/server.js:1,35-47`**
   ```js
   require('dotenv').config({ path: require('path').join(__dirname, '.env') });
   const allowedOrigins = (process.env.CLIENT_URL || process.env.BASE_URL || 'http://localhost:5173').split(',')...
   app.use(cors({
     origin: (origin, cb) => {
       if (!origin || allowedOrigins.includes(origin)) return cb(null,true);
       return cb(new Error(`CORS blocked for origin: ${origin}`));
     },
     credentials:true
   }));
   app.use(express.json({ limit: '100kb' }));
   ```

### 1.4 Verification

```bash
git ls-files | grep .env
# only *.env.example
git check-ignore -v server/.env
# .gitignore:8:server/.env server/.env
node -c server/database.js && node -c server/server.js && node -c server/util/Email.js
# syntax ok
# after restart, unauth origin blocked:
curl -H "Origin: https://evil.com" http://localhost:3000/ -v  # -> CORS blocked
```

### 1.5 Best practice to prevent

- Add `.env` to `.gitignore` on `git init`; use pre-commit hook (`git-secrets`, `gitleaks`).
- Fail-fast on missing env, no fallback creds; rotate leaked secrets immediately (DB password, JWT key, app password).
- Whitelist CORS, use `helmet`, limit body size, use `dotenv` with explicit path.
- History still contains secrets - purge with `git filter-repo --path server/.env --invert-paths` + force push if needed.

---

## 2) Broken Authentication - Plaintext Employee Passwords + Credential Leakage + User Enumeration (OWASP A07)

** Commit:** `4adaee80` - `fix(security): secure authentication with bcrypt...`

### 2.1 What was vulnerable

| Location | Issue |
|---|---|
| `server/models/AddEmployee.js:1-16` | `password:String` stored plaintext, no hashing. |
| `server/controllers/LoginController.js:16` | `console.log('Login attempt:', { email, password })` logs plaintext passwords. |
| `server/controllers/LoginController.js:25` | `if (addEmployee.password === password)` direct string compare. |
| `server/controllers/AddEmployee.js:8` | `new AddEmployeeModel(req.body)` saves raw password; `PUT /employee/:id:45` via `findByIdAndUpdate` bypasses any hook. |
| `server/controllers/LoginController.js:35-79` | Distinct status codes: `400` bad creds, `404` user not found, `505` not verified, `201/202/203/204` by role - enables enumeration. Returns full `user` object with `password` hash. |

**Risk:** DB leak -> all employee passwords readable. Logs leak creds to stdout aggregators. Attacker can enumerate valid emails and brute-force without rate limit.

### 2.2 How to exploit

```bash
# Create employee via POST /addemployee { EmployeeEmail, password: "123" }
mongo -> db.addemployees.findOne()  # password === "123" plaintext
# Login enumeration
curl -X POST /loginUser -d '{"email":"nope@x.com","password":"x"}' # 404
curl -X POST /loginUser -d '{"email":"exists@x.com","password":"wrong"}' # 400
```

### 2.3 Fix

1. **`server/models/AddEmployee.js:3,18-28`** - bcrypt pre-save hook
   ```js
   const bcrypt = require('bcryptjs');
   AddEmployeeSchema.pre('save', async function(next) {
     if (!this.isModified('password') || !this.password) return next();
     if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) return next();
     this.password = await bcrypt.hash(this.password, Number(process.env.SALT)||10);
     next();
   });
   ```

2. **`server/controllers/LoginController.js:13-88`** - secure compare + migration
   ```js
   if (!email || !password) return 400;
   const stored = addEmployee.password || '';
   const isHashed = stored.startsWith('$2a$') || stored.startsWith('$2b$');
   let isMatch = isHashed ? await bcrypt.compare(password, stored) : (stored===password);
   if (isMatch && !isHashed) { // migrate legacy
     addEmployee.password = await bcrypt.hash(password, saltRounds);
     await addEmployee.save();
   }
   if (isMatch) { const safe= addEmployee.toObject(); delete safe.password; return 201/202/203... }
   else return 401 { message:'Invalid email or password' } // generic
   // same generic 401 for User/Supplier, strip password, 401 for not-verified
   ```

3. **`server/controllers/AddEmployee.js:1-12,43-60`**
   ```js
   const bcrypt = require('bcryptjs');
   // POST
   const saved = await new AddEmployeeModel(req.body).save(); // hook hashes
   const safe = saved.toObject(); delete safe.password; return 201 safe;
   // PUT - manual hash because findByIdAndUpdate bypasses hook
   if (update.password && !(update.password.startsWith('$2a$')...)) 
     update.password = await bcrypt.hash(update.password, saltRounds);
   ```

### 2.4 Verification

```bash
node -c server/models/AddEmployee.js && node -c server/controllers/LoginController.js
# create employee, check DB: password startsWith $2b$
# login with old plaintext employee -> succeeds once and DB entry becomes hashed
# curl wrong password -> always 401 'Invalid email or password' (no 404/505 difference)
# response JSON no password field
```

### 2.5 Best practice

- Never store plaintext; hash with `bcrypt`/`argon2` with per-password salt.
- No credential logging; generic auth errors; rate limit + lockout; use `helmet`, `express-rate-limit`.
- Return minimal payload, use JWT `httpOnly` cookies.
- `findByIdAndUpdate` bypasses hooks -> handle hashing manually or use `save()`.

---

## 7) Unrestricted File Upload (OWASP A04 / A08)

** Commit:** `af14973b` - `fix(security): harden file uploads...`

### 2.1 What was vulnerable

| Location | Issue |
|---|---|
| `server/controllers/ProfilePictureController.js:7-19` | `multer({ storage })` no `fileFilter`, no `limits`. `filename: file.fieldname+"_"+Date.now()+path.extname(originalname)` uses raw `originalname` ext. `destination: 'public/Images'` relative, no dir ensure. |
| `server/controllers/AddMenuController.js:7-16` | Same. Any file type (` .exe`, `.js`, `.html`) or size accepted. No `req.file` check, so `null` stored. |

**Risk:** Attacker uploads `shell.php`, `xxs.html` with malicious `mimetype`, or 1GB file -> RCE if server serves `public/`, XSS, DoS via disk fill, path traversal via `originalname` containing `../`.

### 2.2 How to exploit

```bash
curl -F "userId=123" -F "image=@evil.exe" http://localhost:3000/ProfileImage  # accepted, saved as image_...exe
curl -F "image=@huge.bin" --limit 2GB  # no limit, fills disk
```

### 2.3 Fix

Both controllers now share hardened config (`ProfilePictureController.js:1-42`, `AddMenuController.js:1-42`):

```js
const ALLOWED_MIME = new Set(['image/jpeg','image/png','image/jpg','image/webp']);
const ALLOWED_EXT = new Set(['.jpg','.jpeg','.png','.webp']);
const MAX_SIZE = 2*1024*1024;
const uploadDir = path.join(__dirname,'..','public','Images');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir,{recursive:true});
const storage = multer.diskStorage({
  destination: (req,file,cb)=>cb(null, uploadDir),
  filename: (req,file,cb)=>{
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ALLOWED_EXT.has(ext) ? ext : '.jpg';
    const safeName = `${file.fieldname}_${Date.now()}_${crypto.randomBytes(8).toString('hex')}${safeExt}`;
    cb(null, safeName);
  }
});
function fileFilter(req,file,cb){
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_MIME.has(file.mimetype) || !ALLOWED_EXT.has(ext))
    return cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'), false);
  cb(null,true);
}
const upload = multer({ storage, limits:{fileSize:MAX_SIZE}, fileFilter });
```

Route wrapper (`ProfilePictureController.js:44-78`, `AddMenuController.js:44-78`):

```js
router.post("/ProfileImage", (req,res,next)=>{
  upload.single('image')(req,res,err=>{
    if(err){
      if(err.code==='LIMIT_FILE_SIZE') return 400 {msg:'Image too large (max 2MB)'}
      return 400 {msg: err.message}
    }
    next();
  });
}, async (req,res)=>{
  if(!req.file) return 400 {msg:'Image file is required (jpg, jpeg, png, webp, max 2MB)'}
  if(!userId) return 400 {msg:'userId is required'}
  // save
});
```

### 2.4 Verification

```bash
node -c server/controllers/ProfilePictureController.js && node -c server/controllers/AddMenuController.js
curl -F "image=@test.exe" http://localhost:3000/ProfileImage # -> 400 Only image files...
curl -F "image=@large.jpg" # >2MB -> 400 Image too large
curl -F "image=@valid.jpg" -F "userId=..." # -> 200, filename like image_171542..._a1b2c3d4e5f6a7b8.jpg
ls server/public/Images # no .exe
```

### 2.5 Best practice

- Whitelist MIME + ext, verify magic bytes, limit size, randomize names, store outside webroot or serve with `Content-Disposition`.
- Validate auth before upload, scan with AV, use `express-rate-limit`.

---

## OAuth Hotfix (Related)

** Commit:** `c74dea7d` - `fix(oauth): ensure dotenv loads...`

`server/.env` had `GOOGLE_SECRET=` not `GOOGLE_CLIENT_ID=`; `server/server.js:1` `dotenv.config()` without path failed when run from root -> `LoginController.js:98` returned `Google sign-in is not configured`. Fix: `server/.env:13` set `GOOGLE_CLIENT_ID=10562785785-...apps.googleusercontent.com`, `server/server.js:1` use `config({path: join(__dirname,'.env')})`. Client `client/.env:2` `VITE_API_GOOGLE_CLIENT_ID` already correct. Restart both servers required.

---

## How secrets were removed from GitHub (full steps)

```bash
# 1. Update .gitignore (commit 9388acae)
# .gitignore now has .env patterns with !.env.example negation

# 2. Untrack but keep locally
git rm --cached -f server/.env client/.env server/util/.env
# files deleted from index only, working copy remains until recreation

# 3. Add templates
git add .gitignore server/.env.example client/.env.example server/database.js server/util/Email.js server/server.js
git commit -m "fix(security): harden secrets and CORS config..."

# 4. Recreate local envs (ignored now)
# server/.env, client/.env exist but git check-ignore -v shows ignored, git ls-files shows only *.example

# 5. Push
git push origin feat/security-hardening
# GitHub latest no longer contains secrets; history still has them -> rotate JWTPRIVATEKEY/MONGO_URI/Gmail PASS and consider:
# git filter-repo --path server/.env --invert-paths  # then force push (coordinate with team)
```

---

## Recommendations for remaining assignment

- Apply same pattern to remaining OWASP items (helmet, rate-limit, `express-mongo-sanitize`, `xss-clean`, input validation with `joi`).
- Enable `protect` middleware on all `/updateUser`, `/allUsers`, etc.
- Record ZAP scan before/after screenshots and `npm audit` diff for report PDF.
- Record YouTube demo showing enumeration blocked and upload rejection.

