/**
 * Smart Tech Computer Center - Intelligent Offline & Client Knowledge Engine
 * Provides instant, high-quality, comprehensive responses when deployed to static
 * hosting (such as GitHub Pages) where no backend Node.js server is present,
 * or as an immediate fallback when Gemini client is not configured with an API key.
 */

export interface KnowledgeMatch {
  title?: string;
  response: string;
}

export function getSmartTechResponse(userQuery: string): string {
  const query = (userQuery || "").toLowerCase().trim();

  // 1. Creator, Owner, Developer checks (Strict Priority Directive)
  const isOwnerQuery =
    query.includes("kisne banaya") ||
    query.includes("malik kaun") ||
    query.includes("owner kaun") ||
    query.includes("owner") ||
    query.includes("creator") ||
    query.includes("who made you") ||
    query.includes("who built you") ||
    query.includes("who is your creator") ||
    query.includes("kiska ai") ||
    query.includes("kiska assistant") ||
    (query.includes("bhabani") && !query.includes("course")) ||
    (query.includes("pradeep") && !query.includes("course"));

  if (isOwnerQuery) {
    return "Smart Tech Computer Center ke owner **Bhabani Shit** hain! Aur mujhe **Smart Tech Team** ne develop kiya hai (Lead Developer: **Pradeep Shaw**).\n\nMain aapki computer education, coding aur padhai me madad ke liye hamesha taiyar hoon!";
  }

  // 2. Owner self-identification
  if (
    query.includes("malik mai hu") ||
    query.includes("main malik") ||
    query.includes("mai bhabani") ||
    query.includes("main bhabani") ||
    query.includes("mai pradeep") ||
    query.includes("main pradeep") ||
    query.includes("hum malik")
  ) {
    return "Ji bilkul, aapka hardik swagat hai Sir! Boliye Sir, main aapki padhai, computer education ya coding me kya madad kar sakta hoon?";
  }

  // 3. Source Code & Security Protection
  if (
    query.includes("source code") ||
    query.includes("prompt dikhao") ||
    query.includes("system prompt") ||
    query.includes("system instruction")
  ) {
    return "Suraksha aur gopniyata (Security & Privacy) ke tahat main apna internal system prompt ya source code share nahi kar sakta.\n\nLekin agar aapko koi website, software, HTML, CSS ya Python ka code seekhna ya likhna hai, toh bataiye, main turant code likhkar samjha dunga!";
  }

  // 4. Greetings
  if (
    query === "hi" ||
    query === "hello" ||
    query === "hey" ||
    query === "namaste" ||
    query === "namaskar" ||
    query.startsWith("hi ") ||
    query.startsWith("hello ")
  ) {
    return "Namaste! Main Smart Tech Computer Center ka official AI assistant hoon.\n\nAap mujhse computer courses, programming (HTML, Python, C++), Tally, Excel ya padhai ka koi bhi sawal pooch sakte hain. Boliye, main aapki kya madad karoon?";
  }

  if (query.includes("kaise ho") || query.includes("kya haal hai") || query.includes("how are you")) {
    return "Main bilkul badhiya hoon! Aapka bohot dhanyawad. Aap batayein, aaj computer education ya coding me aap kya naya seekhna chahte hain?";
  }

  if (query.includes("thank") || query.includes("dhanyawad") || query.includes("shukriya")) {
    return "Aapka bohot-bohot swagat hai! Smart Tech hamesha aapki safalta aur behtar education ke liye taiyar hai. Koi aur sawal ho toh zaroor poochhein!";
  }

  // 5. Computer Courses & Center Curriculum
  if (
    query.includes("course") ||
    query.includes("courses") ||
    query.includes("kya sikhate ho") ||
    query.includes("admission") ||
    query.includes("syllabus") ||
    query.includes("kya padhate ho")
  ) {
    if (query.includes("dca") && !query.includes("adca")) {
      return `### DCA (Diploma in Computer Applications)
**Duration:** 6 Months  
**Eligibility:** 10th Pass ya uske upar

**DCA Syllabus:**
1. **Computer Fundamentals:** Hardware, Software, Operating Systems (Windows 10/11)
2. **Microsoft Office Suite:**
   - **MS Word:** Document creation, formatting, reports & letter typing
   - **MS Excel:** Data entry, formulas, functions, spreadsheets & charts
   - **MS PowerPoint:** Presentations, slide animations & transitions
3. **Internet & Email:** Web browsing, online applications, email drafting & net security
4. **Typing Skills:** Fast Hindi & English typing mastery

**Career Opportunities:** Office Assistant, Computer Operator, Data Entry Executive.`;
    }

    if (query.includes("adca")) {
      return `### ADCA (Advanced Diploma in Computer Applications)
**Duration:** 12 Months (1 Year)  
**Eligibility:** 10th / 12th Pass

**Comprehensive Syllabus:**
1. **Semester 1:**
   - Computer Fundamentals & Operating Systems
   - Complete MS Office Suite (Word, Excel, PowerPoint, MS Access)
   - High-Speed Typing in English & Hindi
   - Internet, Cyber Ethics & Cloud Tools
2. **Semester 2:**
   - **Tally Prime with GST:** Complete accounting, voucher entry, invoicing & taxation
   - **Web Designing Basics:** HTML5, CSS3, basic JavaScript for creating web pages
   - **Desktop Publishing (DTP):** Adobe Photoshop, banner & poster editing
   - **Programming Concepts:** Introduction to C Programming & logic building

**Career Opportunities:** Senior Computer Operator, Accountant Assistant, Web Designer, IT Support Specialist.`;
    }

    if (query.includes("tally") || query.includes("accounting") || query.includes("gst")) {
      return `### Tally Prime with GST & Professional Accounting
**Duration:** 3 - 6 Months

**Key Learning Modules:**
1. **Accounting Basics:** Golden Rules of Accounting, Debit & Credit rules, Ledger creation
2. **Company Setup:** Creating company, groups, and stock ledgers in Tally Prime
3. **Voucher Entry:** Payment, Receipt, Contra, Sales, Purchase & Journal vouchers
4. **Inventory Management:** Stock items, units of measure, godown & batch tracking
5. **GST Implementation:** CGST, SGST, IGST calculations, e-way bills & GSTR reports
6. **Financial Statements:** Balance Sheet, Profit & Loss Account, Trial Balance analysis

Smart Tech Computer Center par practical hands-on training aur real-time bills ke saath practice karwayi jaati hai!`;
    }

    if (query.includes("python")) {
      return `### Python Programming Course at Smart Tech
**Duration:** 3 - 6 Months

**Why Learn Python?**
Python sabse popular aur beginner-friendly programming language hai. Iska upyog Data Science, Artificial Intelligence, Web Development (Django/Flask) aur Automation me hota hai.

**Syllabus:**
- Python Syntax, Variables, Data Types (List, Tuple, Dictionary, Set)
- Conditional Statements (if-else) & Loops (for, while)
- Functions, Lambda Expressions & Recursion
- Object-Oriented Programming (OOPs - Classes & Objects)
- File Handling & Error Management
- Real-World Mini Projects`;
    }

    // General Course List
    return `Smart Tech Computer Center par nimnlikhit professional aur job-oriented computer courses karwaye jaate hain:

1. **ADCA (Advanced Diploma in Computer Applications)** - 12 Months
   *MS Office, Tally Prime + GST, DTP (Photoshop), Web Designing (HTML/CSS), Programming*
2. **DCA (Diploma in Computer Applications)** - 6 Months
   *Fundamentals, Windows, Complete MS Office (Word, Excel, PowerPoint), Internet & Typing*
3. **Tally Prime with GST** - 3 to 6 Months
   *Professional Accounting, Ledger, Invoicing, Inventory & Tax Reports*
4. **Programming & Coding** - 3 to 6 Months
   *Python, C, C++, Core Java, aur Web Development (HTML, CSS, JS)*
5. **DTP (Desktop Publishing)** - 3 to 6 Months
   *Adobe Photoshop, CorelDRAW, PageMaker, Graphic & Banner Design*
6. **Basic Computer & Typing Specialization** - 3 Months
   *English & Hindi Typing, Internet, Official Computer Skills*

Aap kisi specific course (jaise DCA, ADCA, Tally ya Python) ke baare me detail jaan na chahein toh bas uska naam poochhein!`;
  }

  // 6. Computer Science Fundamentals
  if (query.includes("computer kya hai") || query.includes("what is computer") || query === "computer") {
    return `### Computer Kya Hai? (What is a Computer?)

**Computer** ek aisi advanced electronic device hai jo raw data ko **Input** ke roop me accept karti hai, use CPU ke madhyam se **Process** karti hai, aur humein meaningful **Output** (Result) pradan karti hai.

**Computer ka Core Principle (IPO Cycle):**
\`\`\`text
[ INPUT (Keyboard/Mouse) ] ---> [ PROCESSING (CPU) ] ---> [ OUTPUT (Monitor/Printer) ]
                                          |
                               [ STORAGE (HDD/SSD) ]
\`\`\`

**Computer ke Mukhya Bhaag (Main Components):**
1. **Hardware:** Physical bhaag jinhe hum chhu sakte hain (Monitor, Keyboard, Mouse, CPU cabinet, Motherboard).
2. **Software:** Programs aur instructions ka samuh jo computer ko batata hai ki kya karna hai (Operating System, MS Office, Browsers).
3. **Father of Computer:** Sir **Charles Babbage** ko computer ka pita kaha jaata hai jinhone Analytical Engine design kiya tha.`;
  }

  if (query.includes("ram") && query.includes("rom")) {
    return `### RAM aur ROM me Antar (Difference between RAM & ROM)

| Visheshata (Feature) | RAM (Random Access Memory) | ROM (Read Only Memory) |
| :--- | :--- | :--- |
| **Prakar (Nature)** | Volatile (Asthayi) - Power cut hone par data gayab ho jaata hai | Non-Volatile (Sthayi) - Data hamesha save rehta hai |
| **Karyapranali** | Read aur Write dono kiya ja sakta hai | Sirf Read kiya ja sakta hai |
| **Upyog** | Current running apps aur programs ko fast memory deta hai | Computer ko boot karne ke instructions (BIOS) store karta hai |
| **Speed** | ROM se bohot tez hoti hai | RAM se dhiimi hoti hai |
| **Capacity** | Aamtaur par 4GB, 8GB, 16GB, 32GB hoti hai | Aamtaur par 4MB se 8MB hoti hai |`;
  }

  if (query.includes("cpu kya hai") || query.includes("what is cpu")) {
    return `### CPU Kya Hai? (Central Processing Unit)

**CPU** ko computer ka **"Brain" (Dimag)** kaha jaata hai. Computer me hone wali saari calculations, decision making aur processing CPU hi sambhalta hai.

**CPU ke teen mukhya bhaag hote hain:**
1. **ALU (Arithmetic Logic Unit):** Ganitiye (Maths: +, -, *, /) aur logical (comparison: <, >, =) operations karta hai.
2. **CU (Control Unit):** Computer ke sabhi hardware devices aur data transfer ko manage aur control karta hai.
3. **MU / Registers (Memory Unit):** High-speed temporary memory jisme current process ka data store hota hai.`;
  }

  if (query.includes("shortcut") || query.includes("keys")) {
    return `### Most Important Computer Keyboard Shortcuts

**General & Editing Shortcuts:**
- **Ctrl + C** : Copy (Select kiye text/file ko copy karna)
- **Ctrl + X** : Cut (Text ya file ko cut karna)
- **Ctrl + V** : Paste (Copied ya cut data ko paste karna)
- **Ctrl + Z** : Undo (Aakhri action ko reverse karna)
- **Ctrl + Y** : Redo (Undo kiye action ko wapas lana)
- **Ctrl + A** : Select All (Saara content ek saath select karna)
- **Ctrl + S** : Save (Document ko save karna)
- **Ctrl + P** : Print (Document print karna)

**Windows System Shortcuts:**
- **Win + D** : Desktop par turant aana / Minimize all windows
- **Alt + Tab** : Open applications ke beech switch karna
- **Alt + F4** : Active program ko close karna ya PC shutdown window kholna
- **Win + L** : Computer ko lock karna
- **Win + Shift + S** : Screen ka screenshot lena`;
  }

  if (query.includes("html") && (query.includes("code") || query.includes("dikhao") || query.includes("kya hai"))) {
    return `### HTML (HyperText Markup Language)
HTML web pages banane ke liye sabse basic aur zaroori markup language hai.

Neeche ek complete aur functional HTML5 webpage ka code diya gaya hai:

\`\`\`html
<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smart Tech Computer Center</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #0f172a;
      color: #f8fafc;
      text-align: center;
    }
    .card {
      background-color: #1e293b;
      max-width: 500px;
      margin: 40px auto;
      padding: 30px;
      border-radius: 12px;
      border: 1px solid #334155;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    }
    h1 { color: #f59e0b; margin-bottom: 10px; }
    p { color: #94a3b8; font-size: 16px; line-height: 1.6; }
    .btn {
      display: inline-block;
      margin-top: 15px;
      padding: 10px 24px;
      background: #f59e0b;
      color: #000;
      text-decoration: none;
      font-weight: bold;
      border-radius: 6px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Smart Tech Computer Education</h1>
    <p>Humare center par ADCA, DCA, Tally Prime, aur Coding sikhayi jaati hai.</p>
    <a href="#" class="btn">Explore Courses</a>
  </div>
</body>
</html>
\`\`\`

Aap is code ko kisi bhi text editor (Notepad ya VS Code) me likhkar \`index.html\` naam se save karke browser me run kar sakte hain!`;
  }

  if (query.includes("python") && (query.includes("code") || query.includes("example") || query.includes("program"))) {
    return `### Python Basic Program Example: Simple Calculator

Neeche Python me do numbers ko add, subtract, multiply aur divide karne ka clean program diya gaya hai:

\`\`\`python
# Smart Tech Computer Center - Python Example Program

def calculator():
    print("=== Smart Tech Calculator ===")
    num1 = float(input("Pehla number daalein: "))
    op = input("Operator chunein (+, -, *, /): ")
    num2 = float(input("Dusra number daalein: "))

    if op == '+':
        result = num1 + num2
    elif op == '-':
        result = num1 - num2
    elif op == '*':
        result = num1 * num2
    elif op == '/':
        if num2 != 0:
            result = num1 / num2
        else:
            return "Error: Zero se divide nahi kar sakte!"
    else:
        return "Invalid Operator!"

    return f"Nateeja (Result): {result}"

# Program ko chalayein
if __name__ == "__main__":
    print(calculator())
\`\`\`

Is code ko chalane ke liye terminal me \`python filename.py\` command dein.`;
  }

  // 7. General Intelligent Fallback
  return `Aapka sawal mil gaya! Main **Smart Tech Computer Center** ka official AI assistant hoon.

Aap mujhse:
- **Computer Courses:** DCA, ADCA, Tally Prime + GST, PGDCA, DTP
- **Programming & Web:** Python, HTML, CSS, JavaScript, C/C++
- **Office Skills:** MS Excel formulas, MS Word, PowerPoint presentations
- **Center Information:** Course syllabus, center details aur certification

ke baare me detail me pooch sakte hain. Kripya apna prashna thoda vistar se likhein taaki main aapko behtareen aur step-by-step jankari de sakoon!`;
}
