import fs from 'node:fs';

const files = ['ai-film-preproduction.html', 'ai-image-4k-restoration.html'];
const anchor = '<div style="padding:10px 16px;background:#0c0c10;border-bottom:1px solid rgba(255,255,255,.12)"><a href="index.html" aria-label="返回主页面" style="display:inline-flex;align-items:center;gap:7px;padding:7px 11px;border:1px solid rgba(255,255,255,.22);border-radius:999px;color:#fff;text-decoration:none;font-size:13px;font-weight:800">← 返回主页面</a></div>';

for (const file of files) {
  const original = fs.readFileSync(file);
  const marker = Buffer.from('<body>');
  const at = original.indexOf(marker);
  if (at < 0) throw new Error(`${file}: body marker not found`);
  if (original.includes(Buffer.from('aria-label="返回主页面"'))) continue;
  const eol = original.includes(Buffer.from('\r\n')) ? '\r\n' : '\n';
  const insertAt = at + marker.length + Buffer.byteLength(eol);
  const updated = Buffer.concat([
    original.subarray(0, insertAt),
    Buffer.from(`${anchor}${eol}`),
    original.subarray(insertAt),
  ]);
  fs.writeFileSync(file, updated);
}
