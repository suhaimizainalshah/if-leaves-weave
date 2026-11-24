/* If Leaves Weave question bank: formatted Excel files written and read without a library (JSZip does the ZIP).
   Writes a heading row (bold, coloured, frozen, with filters), wrapped text and set column widths.
   Reads the first sheet of any .xlsx, including Excel’s own files (shared strings) and ours (inline strings). */
(function () {
  const x = s => String(s ?? "").replace(/[<>&"]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c])).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
  const col = n => { let s = ""; n++; while (n) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = (n - m - 1) / 26; } return s; };
  async function write(headers, rows, widths, sheet = "Questions") {
    const cell = (v, r, c) => { const ref = col(c) + (r + 1), st = r === 0 ? 1 : 2; return typeof v === "number" && isFinite(v) ? `<c r="${ref}" s="${st}"><v>${v}</v></c>` : `<c r="${ref}" t="inlineStr" s="${st}"><is><t xml:space="preserve">${x(v)}</t></is></c>`; };
    const all = [headers, ...rows], body = all.map((row, r) => `<row r="${r + 1}">${row.map((v, c) => cell(v, r, c)).join("")}</row>`).join("");
    const cols = `<cols>${headers.map((_, i) => `<col min="${i + 1}" max="${i + 1}" width="${widths[i] || 14}" customWidth="1"/>`).join("")}</cols>`;
    const zip = new JSZip();
    zip.file("[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>');
    zip.file("_rels/.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');
    zip.file("xl/workbook.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${x(sheet)}" sheetId="1" r:id="rId1"/></sheets></workbook>`);
    zip.file("xl/_rels/workbook.xml.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>');
    zip.file("xl/styles.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1F3A8A"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="2"><border/><border><bottom style="thin"><color rgb="FFD0D5DD"/></bottom></border></borders><cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="3"><xf/><xf fontId="1" fillId="2" borderId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf><xf borderId="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>');
    zip.file("xl/worksheets/sheet1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>${cols}<sheetData>${body}</sheetData>${all.length > 1 ? `<autoFilter ref="A1:${col(headers.length - 1)}${all.length}"/>` : ""}</worksheet>`);
    return zip.generateAsync({ type: "blob", compression: "DEFLATE", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  }
  async function read(file) {
    const zip = await JSZip.loadAsync(await file.arrayBuffer()), dom = t => new DOMParser().parseFromString(t, "application/xml");
    const ss = zip.file("xl/sharedStrings.xml") ? [...dom(await zip.file("xl/sharedStrings.xml").async("string")).getElementsByTagName("si")].map(si => [...si.getElementsByTagName("t")].map(t => t.textContent).join("")) : [];
    const name = Object.keys(zip.files).filter(n => /^xl\/worksheets\/sheet\d+\.xml$/.test(n)).sort()[0]; if (!name) throw new Error("no sheet");
    const rows = []; for (const r of dom(await zip.file(name).async("string")).getElementsByTagName("row")) { const out = [];
      for (const c of r.getElementsByTagName("c")) { const ref = c.getAttribute("r") || "", letters = ref.replace(/\d+/g, ""); let idx = 0; for (const ch of letters) idx = idx * 26 + ch.charCodeAt(0) - 64; idx = letters ? idx - 1 : out.length;
        const t = c.getAttribute("t"), v = c.getElementsByTagName("v")[0]?.textContent ?? ""; out[idx] = t === "s" ? ss[+v] ?? "" : t === "inlineStr" ? [...c.getElementsByTagName("t")].map(e => e.textContent).join("") : v; }
      rows.push([...out].map(v => v ?? "")); }
    return rows;
  }
  function readCSV(text) { const rows = []; let row = [], cur = "", q = false; text = text.replace(/^\ufeff/, "");
    for (let i = 0; i < text.length; i++) { const ch = text[i]; if (q) { if (ch === '"' && text[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') q = false; else cur += ch; } else if (ch === '"') q = true; else if (ch === ",") { row.push(cur); cur = ""; } else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(cur); rows.push(row); row = []; cur = ""; } else cur += ch; }
    if (cur || row.length) { row.push(cur); rows.push(row); } return rows.filter(r => r.some(v => String(v).trim())); }
  window.QBankXLSX = { write, read, readCSV };
})();
