# If Leaves Weave

**If Leaves Weave** is a family of seven free, private tools for documents, plans and people, like separate pages woven into one book. Everything runs in your browser: there are no accounts, nothing is uploaded, and the tools work offline once loaded.

## The tools at a glance

| Tool | Page | What it is for |
| --- | --- | --- |
| **If Leaves Weave PDF** | `index.html` | Edit, sign, fill, convert, compare, redact and organise PDFs, and turn Word files into PDFs |
| **Boards** | `boards.html` | Plan work in Kanban, Table and Timeline views |
| **Canvas** | `canvas.html` | An endless whiteboard for brainstorms and retrospectives |
| **Maps** | `maps.html` | Mind maps and concept maps |
| **Sociogram** | `sociogram.html` | See how a group connects, from nominations or a Google Form |
| **Genogram** | `genogram.html` | Family maps and ecomaps for casework |
| **Prototype** | `prototype.html` | Clickable app screens |

The **home page** (`home.html`) lists every tool and your recent work.

## If Leaves Weave PDF

### Pages and editing
- **Pages:** merge any number of PDFs, images and Word files; drag to reorder (or Move earlier and Move later on phones); rotate, duplicate, delete and insert blank pages; download selected pages as a new PDF.
- **Edit and sign:** type text anywhere (Helvetica, Times or Courier, any size and colour, bold or italic); add signatures (draw, type in a script font, or upload a photo with its background removed, saved on your device for next time), images, ticks and crosses, highlighter, whiteout, freehand drawing and today’s date. Move, resize, duplicate and delete anything; arrow keys nudge.
- **Fill form:** finds the PDF’s own fillable fields (text boxes, tick boxes, drop-downs and option buttons) and can lock the answers.
- **Document properties:** title, author, subject and keywords, in the Pages panel.
- **Undo and redo** for everything (Ctrl+Z and Ctrl+Shift+Z), and Ctrl+S to download.

### Signing with others
- **Get it signed:** add up to five signers and mark where each one signs (signature, initials, date signed, full name or text), then download a signing file and email it.
- **Guided signing:** signers open the file in If Leaves Weave, are guided field by field, agree to sign electronically, and download the signed PDF. It ends with a signing record page (document ID, the original file’s fingerprint, who signed and when). With several signers, the file passes from one to the next by email. No server is involved.

### Splitting, numbering and stamping
- **Split:** every page, every N pages, or ranges such as `1-3, 5, 7-9`. Several files download as one ZIP.
- **Page numbers:** four styles, three positions, a start number, and cover pages skipped.
- **Watermark:** diagonal or straight text, with adjustable strength.
- **Bates numbering and stamps:** prefix, start number, digits and suffix (for example ABC000001), four positions, an optional stamp such as “CONFIDENTIAL”, and a white box for legibility. Number many PDFs in sequence: they download as a ZIP with an `index.csv` of each file’s range.

### Converting
- **Word to PDF:** open a `.docx`, or choose **Word to PDF** on the start screen, and it becomes PDF pages to edit, sign or redact. Text stays real and selectable; headings, lists, tables and images come through, in a simplified layout.
- **PowerPoint to PDF:** open a `.pptx`, or choose **PowerPoint to PDF** on the start screen, and each slide becomes a PDF page, with searchable text. Text boxes, titles and bullets (with sizes, bold, colours and alignment, and positions from the slide layout or master), shapes, pictures and slide backgrounds come through; charts, SmartArt, tables, gradients, theme colours and animations are not drawn. Older `.ppt` files need saving as `.pptx` first.
- **PDF to Word, PowerPoint or images:** a Word document (editable text, or an exact-look version with each page as a picture), a PowerPoint deck (one slide per page, with the page’s text in the speaker notes), or JPG and PNG images at screen, standard or print quality.
- **Compress:** three levels for scanned or photo-heavy PDFs. A “compressed” file that comes out bigger is never downloaded.

### Checking and comparing
- **Compare two versions:** every word added, removed or changed between two PDFs, page by page. Download the revised version with changes highlighted, the original with removals struck through, or a plain-text report.
- **Read text (OCR):** recognises text in scanned pages in 12 languages and saves a searchable PDF (an invisible text layer over the original pages) or a text file.

### Redacting
- **Redact by hand:** in Edit and sign, drag a black box over anything sensitive.
- **Find and redact (optional):** switch it on under **Pages → Optional tools**. It finds Singapore NRIC and FIN numbers (including masked ones), Malaysian MyKad numbers, UK National Insurance numbers, phone numbers, email addresses and card numbers (checked with the Luhn test), and optionally long account numbers, dates, Singapore postal codes and any names you type. Every match is listed, partly hidden, so you can untick anything that should stay visible.
- **True removal:** on download, every redacted page is rebuilt as an image, so hidden text is permanently removed, not just covered. Boxes are measured from the real letter widths, with a safety margin.
- **Redaction report:** a plain-text record of what was removed, on which pages and when, with the redacted PDF’s **SHA-256 fingerprint** and an optional name and reason (such as a PDPA access request). It never includes the removed details.

### Sharing and teaching
- **Flipbook:** a self-contained page-turning HTML file, with spreads on wide screens, swipe, keys, full screen, find text, a page grid, zoom and links to a page (`…#page-12`). Page text is included for screen readers and search. **Preview first** opens it in a new tab before saving. A **website folder** option exports one image per page, a 1200 × 630 `preview.jpg` and link-preview tags. Links to `index.html#flipbook` open the tool ready to make one. Optionally, add a **Listen** button that reads the pages aloud with the reader’s own device voices (voice and speed choices, pause, and turning pages automatically); it is off unless you tick it. With it, you can add a short **spoken introduction**, heard once before the cover when someone starts listening from the first page and not shown on the pages, and optionally a **recording** of it in your own voice (record it in the browser or upload an audio file). The recording plays instead of the device voice; if it can’t play, the typed introduction is spoken. Single-file flipbooks carry the recording inside them; website folders save it as its own `intro` file.
- **Classroom:** read the document aloud with the browser’s voices; add paper pages (lined, handwriting, squared, graph, dotted, isometric, Cornell notes, music staves or blank, in A4 or US Letter); and record voice notes saved inside the PDF as attachments.

## The six document tools

### Boards
- **Three views of the same cards:** Kanban, Table and Timeline.
- **Cards:** labels, owner, start and due dates, priority (low, medium, high or urgent) and checklists, with filters and CSV export.
- **Templates:** project plan and sprint board.
- **Action boards from AI Benar:** an AI Benar audit can open here as a board of fixes, through a link that never reaches a server.

### Canvas
- **Tools:** sticky notes, text, rectangles, ellipses, diamonds, frames, images, a pen, and connectors with labels, arrows, and dashed or curved lines.
- **Arranging:** align and spread evenly; keyboard shortcuts (S, T, R, O, D, C, P, F, I, V and H).
- **Templates:** team retrospective and SWOT analysis.

### Maps
- **Mind maps by keyboard:** Tab adds a child idea, Enter a sibling, the arrow keys move, Space folds and F2 edits.
- **Concept maps:** linking phrases and labelled cross-links.
- **Details:** notes, tags, links, done marks and colours on every idea; three layouts (balanced, right and top-down); an outline view.
- **Export:** PNG, SVG and Markdown.

### Sociogram
- **Paste responses from a Google Form** or any spreadsheet: a name, up to three people to work with and up to three to avoid. Columns are recognised automatically, with a preview to correct them.
- **Forgiving name matching:** capitals, extra spaces, first names alone and small typos are matched when only one pupil fits; any remaining names are listed with the closest pupil suggested.
- **Messy data handled:** blank cells, choosing oneself, repeated names and repeat submissions (the latest answers count). Pupils named but who didn’t respond are added and marked.
- **The “prefer not” answers are optional:** without them, every measure uses positive choices only.
- **Layouts:** network, target and circle, with size and colour options.
- **Measures:** in-degree, out-degree, mutual choices, betweenness, harmonic closeness, eigenvector centrality, PageRank, clustering, Louvain communities, cliques and sociometric status (Coie, Dodge and Coppotelli, 1982), checked against the NetworkX library, with plain-English insights.
- **CSV import and export.**

### Genogram
- **Standard conventions** (McGoldrick, Gerson and Petry): symbols, couple and child lines, twins, relationship lines (close, distant, conflict, cut off, abuse and more), health shading, households (including non-family members such as a domestic helper), automatic layout and an automatic key.
- **Ecomap view:** the household in the centre, with systems around it (School, Work, Family Service Centre, ComCare, HDB, Faith community, RC or CC and more, or your own), each linked as strong, moderate, tenuous or stressful, with arrows for the flow of support (after Hartman, 1978).
- **Privacy mode:** initials only, for sharing.
- **Export:** PNG, SVG and a plain-text summary.

### Prototype
- **Screens from 14 parts,** with links between screens and a Play mode.
- **Describe a screen:** a starter that builds a screen from a sentence, by rules, offline (no AI).
- **Export:** a working clickable HTML prototype, or PNG pictures of screens.

## Across all seven tools
- **Home and navigation:** the logo in every tool goes to the home page; each tool’s **Home** button returns to its own templates and recent work; **Tools** (in the PDF tool) and **All If Leaves Weave tools** switch directly between tools.
- **Document actions:** every document has a **⋯** menu in the sidebar, on the home screen and in the top bar, with **Rename**, **Duplicate**, **Download as a file** and **Delete**. Deleting asks first and offers **Undo** for a few seconds. On a selected document, F2 renames it and the Delete key deletes it.
- **Saving:** the six document tools save automatically in the browser, with undo and redo. **Back up** saves every document from all six to one file, and **Open file** restores it on any device.
- **Send to If Leaves Weave PDF:** from Canvas, Maps, Sociogram, Genogram and Prototype, open the drawing as a PDF page to annotate, sign or redact. The hand-off stays on the device.
- **Checking what files really are:** every file’s first bytes show its real format, whatever its name says. Programs or web pages disguised as documents (such as a Windows program renamed `invoice.pdf`) are refused; misnamed files open as what they really are, with a note; older `.doc` files and HEIC photos get advice.
- **Compact mode:** **Compact** in the header (Ctrl+\ on Windows, Cmd+\ on a Mac) hides the side panel, which then slides in as a drawer.
- **Navigation aids:** menus open where they fit, flipping upward near the bottom of the screen.

## Compatibility
- **Browsers:** current versions of Chrome, Edge, Firefox and Safari, on computers, tablets and phones.
- **How to open it:** from a website (such as GitHub Pages) or a local web server. Browsers block parts of it when the files are opened directly from the computer.
- **Offline:** everything works offline once loaded, except **Read text**, which downloads its recognition engine the first time it is used.
- **Files it opens:** PDF; JPG, PNG, WebP, GIF, BMP and AVIF images; Word `.docx`; and PowerPoint `.pptx`.
- **Files it saves:** PDF, Word (`.docx`), PowerPoint (`.pptx`), JPG, PNG, SVG, CSV, Markdown, plain text, ZIP, HTML (flipbooks and prototypes) and If Leaves Weave files (`.ifleavesweave.json`).
- **Languages and scripts:** the interface is in English. Text recognition supports 12 languages. In PDFs it creates, non-Latin text (such as Chinese or Arabic) is saved as a crisp image of the text; Word to PDF warns when a document uses such scripts.
- **Accessibility:** every page passes the automated WCAG 2.x A and AA checks in axe-core, in light and dark mode. Menus, documents and most actions work with a keyboard (drawing with the pen needs a mouse, pen or touch). Every tool follows the system’s dark mode and respects reduced-motion settings.

## Privacy
- **Your files stay on your device:** documents, photos, drawings and answers are processed in the browser and never uploaded.
- **Anonymous counts:** visits and actions (such as downloads) are counted as anonymous totals with the free Abacus counter: no cookies, no names, no file names or contents, and no identifiers. Nothing is counted for browsers that send *Do Not Track* or *Global Privacy Control*, and the owner can stop counting their own visits on the `#stats` page. Like any web service, the counter sees the visitor’s IP address while handling a request.
- **Never counted:** flipbooks and other files you share contain no counters.
- **Sensitive work:** handle genograms, sociograms and redacted documents according to your organisation’s consent and data protection rules (for example the PDPA in Singapore or UK GDPR), and keep backups.

## Honest limits
- **Signatures are simple electronic signatures:** signers’ names and emails are recorded, not verified. Some documents (such as property deeds, wills or regulated contracts) need a qualified or witnessed signature.
- **Editing adds on top:** existing text in a PDF isn’t rewritten; cover it with whiteout and type over it.
- **Password-protected PDFs** need their password removed first. If Leaves Weave does not add passwords to PDFs.
- **Word to PDF simplifies layouts:** text boxes, columns, headers and footers may differ.
- **PDF to Word rebuilds text, headings and lists,** not exact layouts; use Exact look when appearance matters. Scanned PDFs contain no text to extract until **Read text** is used.
- **Compressing turns pages into images,** so their text can’t be selected or searched.
- **Automatic searches can miss details,** such as names in images: check each page before sharing a redacted document.

## Third-party code
All bundled in `vendor/` unless noted, and loaded only when needed.

| Library | Used for | Licence |
| --- | --- | --- |
| pdf.js 4.10.38 | Reading and showing PDFs | Apache 2.0 |
| pdf-lib 1.17.1 | Building PDFs | MIT |
| JSZip 3.10.1 | ZIP files | MIT |
| docx 9.0.2 | Word export | MIT |
| PptxGenJS 3.12.0 | PowerPoint export | MIT |
| mammoth 1.13.0 | Reading Word files | BSD 2-Clause |
| jsPDF 4.2.1 and html2canvas 1.4.1 | Laying out Word files as PDF | MIT |
| Tesseract.js | Text recognition (downloaded from jsDelivr on first use) | Apache 2.0 |
| Hanken Grotesk, Caveat, Dancing Script and Great Vibes (via Fontsource) | Fonts, bundled in `fonts/` | SIL Open Font License 1.1 |

Licence texts for the Word libraries are in `vendor/LICENSE-*.txt`.

## Files
- **Home page:** `home.html`, for all seven tools.
- **If Leaves Weave PDF:** `index.html`, `app.js`, `extras.js` and `compact.js`.
- **Document tools:** `boards.html`, `canvas.html`, `maps.html`, `sociogram.html`, `genogram.html` and `prototype.html`, sharing `studio/` (`studio.css` and `studio/js/`).
- **Libraries and fonts:** `vendor/` and `fonts/`.

## Licence
This repository does not yet include a licence file, so by default all rights are reserved. To let others reuse the code, add a `LICENSE` file (for example the MIT licence). The bundled third-party libraries keep their own licences, listed above.
