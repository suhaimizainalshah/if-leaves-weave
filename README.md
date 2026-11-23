# If Leaves Weave

**If Leaves Weave** is a family of free, private tools that run entirely in your browser, like leaves of paper woven into one book: **If Leaves Weave PDF**, **Boards**, **Canvas**, **Maps**, **Sociogram**, **Genogram** and **Prototype**. There are no accounts, nothing is uploaded, and everything works offline once loaded. See *The If Leaves Weave family* below for all seven tools.

## If Leaves Weave PDF: free PDF editor that runs in your browser

Merge, split, reorder, rotate, sign, fill in, annotate, number, watermark, compress and convert PDFs. No account, no limits, no watermarks. Files are processed on the visitor's own device and never uploaded.

## Features
**Pages:** merge any number of PDFs and images, drag to reorder (or Move earlier/later on phones), rotate, duplicate, delete, insert blank pages, download selected pages as a new PDF.
**Edit and sign:** type text anywhere (Helvetica, Times or Courier, any size and colour, bold, italic), signatures (draw, type in a script font, or upload a photo with automatic background removal, saved on your device for next time), images, ticks and crosses for forms, highlighter, whiteout, freehand drawing, today's date. Move, resize, duplicate and delete anything; arrow keys nudge.
**Get it signed:** add up to five signers, mark where each one signs (signature, initials, date signed, full name or text), then download a signing file and email it. Signers open it in If Leaves Weave, are guided field by field, agree to sign electronically and download the signed PDF, which ends with a signing record page (document ID, original file fingerprint, who signed and when). With several signers the file passes from one to the next by email. No server is involved.
**Split:** every page, every N pages, or custom ranges like `1-3, 5, 7-9`. Several files download as one ZIP.
**Page numbers:** four styles, three positions, start number, skip cover pages.
**Watermark:** diagonal or straight text with adjustable strength.
**Convert:** save as a **Word document** (editable text with headings, paragraphs and bullet points, or an exact-look version with each page as a picture), a **PowerPoint** deck (one slide per page, with each page's text copied into the speaker notes), or JPG/PNG images. Works on all pages or only the ones you select.
**Fill form:** finds the PDF's own fillable fields (text boxes, tick boxes, drop-downs and option buttons), lets you complete them, and can lock the answers so they can't be changed.
**Redact:** in Edit and sign, drag a black box over anything sensitive. On download, every redacted page is rebuilt as an image, so the hidden text is permanently removed, not just covered.
**Document properties:** set the title, author, subject and keywords saved inside the PDF (in the Pages panel).
**Compress:** three levels for scanned or photo-heavy PDFs. If Leaves Weave refuses to download a "compressed" file that came out bigger.
**To images:** JPG or PNG at screen, standard or print quality, for all or selected pages.
Undo/redo for everything (Ctrl+Z / Ctrl+Shift+Z), Ctrl+S to download.

## Visitor and download counts
If Leaves Weave counts visits, downloads and signings anonymously with the free Abacus counter: no cookies, no names, nothing for browsers that send *Do Not Track* or *Global Privacy Control*. See your totals at `https://<you>.github.io/folio/#stats`. Change `COUNTER.ns` in `app.js` to your own name, or set `COUNTER.on` to `false`.

Click the If Leaves Weave logo to go back to the start screen.

## Limits worth knowing
- Signatures are *simple electronic signatures*: If Leaves Weave records the name and email each signer chose but does not verify identity. That is enough for many everyday agreements, but some documents (for example property deeds, wills or regulated contracts) need a qualified or witnessed signature. Check what applies to yours.
- If Leaves Weave adds new content on top of pages. It doesn't rewrite text that is already in a PDF; cover it with Whiteout and type over it.
- Password-protected PDFs need their password removed first.
- Text with characters outside Western European alphabets (for example Chinese, Arabic or emoji) is saved as a crisp image of the text, so it still displays correctly.
- Word conversion rebuilds text, headings and lists, not exact layouts such as columns, tables or images. Use "Exact look" when appearance matters more than editing. Scanned PDFs contain no text to extract.
- Compressing turns pages into images, so text in the compressed copy can't be selected or searched.

## Built with
pdf.js 4.10.38 (Apache-2.0), pdf-lib 1.17.1 (MIT), JSZip 3.10.1 (MIT), docx 9.0.2 (MIT) and PptxGenJS 3.12.0 (MIT), included in `vendor/` so the site has no outside dependencies apart from Google Fonts.

## Compare, Bates, flipbook and text recognition
- **Compare two versions:** finds every word added, removed or changed between the open document (or any PDF) and a revised PDF. See each change by page, then download the revised version with changes highlighted, the original with removals struck through, or a plain-text change report. Compares wording, not layout or images.
- **Bates numbering and stamps:** prefix, start number, digits and suffix (for example ABC000001), four positions, an optional stamp such as “CONFIDENTIAL”, and a white box for legibility. Number the open document, or many PDFs in sequence: they download as a ZIP with an `index.csv` of each file’s number range. Rotated pages are handled.
- **Flipbook:** turns the document into a single, self-contained HTML page with page-turning, two-page spreads on wide screens, swipe, arrow keys and full screen. Readers can **find text**, **jump to any page** from a page grid, **zoom and scroll**, and open a link to a specific page (for example `…flipbook.html#page-12`). Page text is included for screen readers and search. Images use WebP where the browser supports it; the original PDF can optionally be included for download. The header text adjusts to the chosen background colour. A **website folder** option exports `index.html` with one image file per page (loaded only when shown), a 1200 × 630 `preview.jpg`, and Open Graph tags, so links shared on LinkedIn and messaging apps show a preview card. Enter the web address where it will live so the preview image uses a full URL.
- **Read text (OCR):** recognises text in scanned pages in 12 languages and saves a searchable PDF (an invisible text layer over the original pages) or a text file. It uses Tesseract.js, which the browser downloads from jsDelivr the first time it is used (about 5 to 15 MB, including language data); the document itself never leaves the device. Searchable PDFs support Latin-script languages; Arabic and Chinese save as text files.
- **Classroom tools:** read the document aloud with the browser’s own voices (choose voice, speed and starting page); add paper pages (lined, narrow lined, handwriting practice, squared, graph, dotted, isometric, Cornell notes, music staves or blank, in A4 or US Letter); and record voice notes that are saved inside the PDF as attachments, with an optional label on page 1. Voice notes play in PDF apps that show attachments, such as Adobe Acrobat Reader.

## Compact mode
The **Compact** button in the header (or Ctrl+\ on Windows, Cmd+\ on a Mac) hides the side panel so the work area gets the full width, which helps in narrow windows. The panel then slides in as a drawer: open it from the header button, the **Tools** tab on the right edge, or by choosing a tool in the left rail, and close it with Esc, ✕ or a click outside. The choice is remembered in the browser. The code is in `compact.js`.

## What the counters record (and don’t)
- **Recorded:** anonymous totals only. Each visit (once per browser session) or action, such as a download, share, copy or export, adds 1 to a named total like “Photo booth: strips shared”. Nothing else is sent: no file names, no file contents, no text you type, no page addresses, and no identifiers.
- **Never recorded:** your files, photos, documents or answers. Lessons and flipbooks you share with others contain no counters at all, so students and readers are never counted.
- **How it’s sent:** each count is a small web request to the free Abacus counting service. Like any website, that service can see the visitor’s IP address and browser type while handling the request; the app itself stores no personal data and sets no cookies. Only `sessionStorage` is used, to avoid counting the same visit twice in one session.
- **Opting out:** nothing is counted for browsers that send *Do Not Track* or *Global Privacy Control*. The owner can also stop counting their own visits with the switch on the `#stats` page.
- **For site owners:** mention the counter in your site’s privacy notice. To keep counts entirely on infrastructure you control, replace the Abacus address with your own counter, or switch counting off with `COUNTER.on = false`.

## The If Leaves Weave family
If Leaves Weave is a family of free, private tools that run entirely in the browser. Nothing is uploaded, there are no accounts, and everything works offline once loaded. Switch between them with **Tools** in If Leaves Weave PDF, or **All If Leaves Weave tools** in the others.

| Tool | Page | What it does |
| --- | --- | --- |
| **If Leaves Weave PDF** | `index.html` | Edit, sign, fill, convert, compare, redact and protect PDFs (everything described above). |
| **If Leaves Weave Boards** | `boards.html` | One set of cards in **Kanban**, **Table** and **Timeline** views, with labels, owners, start and due dates, priorities, checklists, filters and CSV export. |
| **If Leaves Weave Canvas** | `canvas.html` | An endless whiteboard: sticky notes, text, shapes, frames, images, a pen, and connectors with labels and arrows. Templates for retrospectives and SWOT analyses. |
| **If Leaves Weave Maps** | `maps.html` | **Mind maps** built with the keyboard, and **concept maps** with linking phrases and labelled cross-links. Notes, tags and links on every idea, three layouts, an outline view, and Markdown export. |
| **If Leaves Weave Sociogram** | `sociogram.html` | **Paste responses from a Google Form** or any spreadsheet (name, up to 3 people to work with, up to 3 to avoid), or enter who chose whom and see the group as a network, target or circle. Plain-English insights and accurate measures for each person: betweenness, harmonic closeness, eigenvector centrality, PageRank, clustering, Louvain communities, cliques, and sociometric status (Coie, Dodge and Coppotelli, 1982). Checked against the NetworkX library. |
| **If Leaves Weave Genogram** | `genogram.html` | Genograms using widely used conventions (McGoldrick, Gerson and Petry): symbols, couple and child lines, twins, relationship lines, health shading, households (including non-family members such as a domestic helper), auto-layout, an automatic key and a privacy mode showing initials only. |
| **If Leaves Weave Prototype** | `prototype.html` | Phone screens from 14 parts, links between screens, Play mode, a “describe a screen” starter that works offline, and export as a working clickable HTML prototype. |

### Pasting class responses into Sociogram
Copy the rows from a Google Form’s response spreadsheet (or any spreadsheet) and choose **Paste responses** in the People tab.
- **Columns are recognised automatically:** a timestamp or email column is skipped; with a header row, columns are identified by their titles (such as “Your name”, “First choice” or “Prefer not to work with”); without one, the order is name, then up to 3 people to work with, then up to 3 to avoid. A preview shows each column and lets you change what it means. Tab-separated (copied from Sheets or Excel) and comma-separated text both work.
- **Names are matched forgivingly:** capitals and extra spaces are ignored, first names alone (“Ben” for “Ben Tan”) and small typos (“Aishah” for “Aisha Rahman”) match when only one pupil fits. Any name that still doesn’t match is listed with the closest pupil suggested, so it can be linked, added or ignored.
- **Messy data is handled:** blank cells are skipped, choosing oneself is ignored, a repeated name counts once, a name in both lists keeps the first answer, and a pupil who submitted twice is counted once using their latest answers.
- **Pupils who were named but didn’t respond** are added and marked, so they are never mistaken for pupils who chose no one, and their measures are based only on the choices they received.
- **The “prefer not” columns are optional.** Without them, the sociogram and every measure use positive choices only, and sociometric status (which needs both kinds of choice) is simply not shown. When some are given, they are recorded, with a reminder to handle them sensitively.

### Find and redact (If Leaves Weave PDF)
**Find and redact** searches the text of a PDF for personal details and marks them for redaction: Singapore NRIC and FIN numbers (including masked ones), Malaysian MyKad numbers, UK National Insurance numbers, phone numbers, email addresses and card numbers (checked with the Luhn test), and optionally long account or reference numbers, dates, Singapore postal codes and any words or names you type. Every match is listed, partly hidden for privacy, so you can untick anything that should stay visible and jump to its page. Marked pages are flattened on download, so the hidden text is permanently removed rather than covered. Boxes are measured from the real letter widths with a safety margin, so they cover the whole detail. Scanned PDFs need **Read text** first. No automatic search catches everything, so check each page before sharing.

### Ecomap (If Leaves Weave Genogram)
Each genogram has an **Ecomap** view (Genogram or Ecomap at the top). The household, or the index person’s close family, sits in the centre with their genogram symbols, surrounded by the systems around them. Add systems in one tap, with choices that suit Singapore casework (School, Childcare, Work, Extended family, Friends, Neighbours, Polyclinic or hospital, Mental health support, Faith community, Family Service Centre, Financial assistance (ComCare), Housing (HDB), Community (RC or CC), Recreation, Legal or court, and Social media), or add your own. For each, set the link as strong, moderate, tenuous or stressful, show which way support flows, link it to the whole family or one person, and add notes. Line styles follow Hartman’s ecomap conventions (1978), with a key; drag systems to rearrange. Ecomaps export and send to If Leaves Weave PDF like genograms.

### Redaction report (If Leaves Weave PDF)
In **Find and redact**, **Download redaction report** saves a plain-text record of what was removed: the document, when the redacted PDF was downloaded, its **SHA-256 fingerprint** (so anyone can confirm a file is the one described), the pages flattened, the number of boxes placed automatically and by hand, and the kinds of detail found on each page. It never includes the removed details themselves, so it can be kept on file or shared. Add an optional name and reason, such as a PDPA access request.

### Fonts and accessibility
All fonts are bundled in `fonts/` (SIL Open Font License, via Fontsource), so pages make no requests to Google. Every page passes the automated WCAG 2.x A and AA checks in axe-core, in light and dark mode.

### Word to PDF, and checking what files really are
- **Open a Word file** (`.docx`), or choose **Word to PDF** on the start screen, and it becomes PDF pages you can edit, sign, redact, compress or download. Text stays real and selectable; headings, lists, tables and images come through. The layout is simplified: text boxes, columns, headers and footers may differ, and standard PDF fonts cover Latin scripts only (the app warns when a document uses others). Uses mammoth (BSD-2-Clause), jsPDF (MIT) and html2canvas (MIT), bundled in `vendor/` and loaded only when a Word file is opened.
- **Every file is checked when it opens:** its first bytes show its real format, whatever its name says. Programs or web pages disguised as documents (for example a Windows program renamed `invoice.pdf`) are refused; misnamed files open as what they really are, with a note; older `.doc` files and HEIC photos get advice on what to do.

### Home page and navigation
`home.html` lists all seven tools and your recent work from the six document tools. The logo in every tool goes there; each tool’s **Home** button returns to that tool’s own start screen, with its templates and recent documents; and **Tools** or **All If Leaves Weave tools** switches directly between them.

**Working together:** from Canvas, Maps, Sociogram, Genogram and Prototype, **Send to If Leaves Weave PDF** opens the drawing in If Leaves Weave PDF as a page, ready to annotate, sign, redact or protect with a password. The hand-off stays on the device.

**Saving:** the six tools save automatically in the browser (IndexedDB), with undo and redo. **Back up** saves every document from all six tools to one file, and **Open file** restores it on any device. Sensitive work such as genograms and sociograms should be backed up and handled according to your organisation’s consent and data protection guidance (for example the PDPA in Singapore or UK GDPR).

**Files:** the six tools share the `studio/` folder (`studio.css` and `studio/js/`), with one page each at the top level.

### Flipbook preview (If Leaves Weave PDF)
Links to `index.html#flipbook` open the PDF tool ready to make a flipbook: the start screen says so, and the Flipbook tool opens as soon as a PDF is chosen or dropped. In **Flipbook**, **Preview first** opens the finished flipbook in a new tab before you save it. It is built in your browser, so nothing is uploaded.
