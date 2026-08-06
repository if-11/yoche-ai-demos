import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const htmlFiles = fs.readdirSync(root).filter(file => file.endsWith('.html')).sort();
const errors = [];
const returnAnchor = '<div style="padding:10px 16px;background:#0c0c10;border-bottom:1px solid rgba(255,255,255,.12)"><a href="index.html" aria-label="返回主页面" style="display:inline-flex;align-items:center;gap:7px;padding:7px 11px;border:1px solid rgba(255,255,255,.22);border-radius:999px;color:#fff;text-decoration:none;font-size:13px;font-weight:800">← 返回主页面</a></div>';

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${file}: missing title`);
  if (file !== 'index.html' && !html.includes('href="index.html"')) errors.push(`${file}: missing home link`);

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const ref = match[1];
    if (/^(?:https?:|data:|#|mailto:|javascript:)/.test(ref)) continue;
    const clean = decodeURIComponent(ref.split('#')[0].split('?')[0]);
    if (!clean) continue;
    if (!fs.existsSync(path.join(root, clean))) errors.push(`${file}: missing asset ${ref}`);
  }

  for (const match of html.matchAll(/data-copy-target="([^"]+)"/g)) {
    if (!html.includes(`id="${match[1]}"`)) errors.push(`${file}: missing copy target ${match[1]}`);
  }
}

const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const topicCount = [...index.matchAll(/class="topic-card"/g)].length;
if (topicCount !== 13) errors.push(`index.html: expected 13 topic cards, got ${topicCount}`);

const postPages = ['post-material-management.html','post-audio.html','post-editing.html','post-finishing-delivery.html'];
for (const file of postPages) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  if (!html.includes('待完善')) errors.push(`${file}: missing draft status`);
}

const baselines = {
  'ai-film-preproduction.html': '5bc673d2528c71aa04ff396a235a25f64a60ff9c',
  'ai-image-4k-restoration.html': '6d509106411ee09bff3769d7a46a4f2cf19545da',
};
for (const [file, expected] of Object.entries(baselines)) {
  const current = fs.readFileSync(path.join(root, file));
  const marker = Buffer.from(returnAnchor);
  const at = current.indexOf(marker);
  const following = at < 0 ? Buffer.alloc(0) : current.subarray(at + marker.length, at + marker.length + 2);
  const eolBytes = following[0] === 13 && following[1] === 10 ? 2 : 1;
  const normalized = at < 0 ? current : Buffer.concat([current.subarray(0, at), current.subarray(at + marker.length + eolBytes)]);
  const actual = crypto.createHash('sha1').update(normalized).digest('hex');
  if (actual !== expected) errors.push(`${file}: existing content changed (${actual})`);
}

const skillFiles = [
  'downloads/skills/direct-reference-visuals-SKILL.md',
  'downloads/skills/quill-image-prompt-director-pro-3.2.md',
  'downloads/skills/video-prompt-director-SKILL.md',
];
for (const file of skillFiles) if (!fs.existsSync(path.join(root, file))) errors.push(`${file}: missing download`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Validated ${htmlFiles.length} HTML files, ${topicCount} topic cards, ${skillFiles.length} Skill downloads.`);
