import fs from 'fs';
import puppeteer from 'puppeteer';

(async () => {
  const data = JSON.parse(fs.readFileSync('result.json', 'utf8'));
  data.sort((a,b) => b.cbt1Score - a.cbt1Score);
  const tbody = data.map((u, i) => `
    <tr>
      <td>${i+1}</td>
      <td><strong>${u.name || (u.rank + ' ' + u.name)}</strong></td>
      <td>${u.serviceNumber || 'N/A'}</td>
      <td>${u.email}</td>
      <td class="score">${u.cbt1Score.toFixed(2)}%</td>
      <td class="${u.cbt1Status === 'passed' ? 'status-pass' : 'status-fail'}">${u.cbt1Status.toUpperCase()}</td>
    </tr>
  `).join('\n');
  const html = `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; margin: 0; padding: 40px; }
.header { display: flex; justify-content: space-between; border-bottom: 4px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
.title-area h1 { margin: 0; color: #0f172a; font-size: 32px; letter-spacing: -0.5px; }
.title-area h2 { margin: 5px 0 0 0; color: #2563eb; font-size: 20px; font-weight: 500; }
.meta-area { text-align: right; color: #64748b; font-size: 14px; display: flex; flex-direction: column; justify-content: flex-end; }
.summary { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 30px; display: flex; gap: 40px; }
.sum-item { display: flex; flex-direction: column; }
.sum-label { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px; }
.sum-value { font-size: 24px; color: #0f172a; font-weight: bold; margin-top: 4px; }
table { width: 100%; border-collapse: collapse; margin-top: 10px; }
th { background-color: #f1f5f9; color: #475569; text-align: left; padding: 14px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #cbd5e1; }
td { padding: 14px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
tr:nth-child(even) { background-color: #f8fafc; }
.score { font-family: monospace; font-size: 15px; font-weight: bold; }
.status-pass { color: #16a34a; font-weight: bold; font-size: 13px; }
.status-fail { color: #dc2626; font-weight: bold; font-size: 13px; }
.footer { margin-top: 50px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
</style>
</head>
<body>
  <div class="header">
    <div class="title-area">
      <h1>Briech UAS Academy</h1>
      <h2>Part 1 CBT Assessment - First Trial Results</h2>
    </div>
    <div class="meta-area">
      <div><strong>Date Generated:</strong> ${new Date().toLocaleDateString()}</div>
      <div><strong>Status:</strong> CONFIDENTIAL</div>
    </div>
  </div>
  <div class="summary">
    <div class="sum-item">
      <span class="sum-label">Total Candidates</span>
      <span class="sum-value">${data.length}</span>
    </div>
    <div class="sum-item">
      <span class="sum-label">Pass Rate</span>
      <span class="sum-value">${((data.filter(d => d.cbt1Status === 'passed').length / data.length) * 100).toFixed(1)}%</span>
    </div>
    <div class="sum-item">
      <span class="sum-label">Average Score</span>
      <span class="sum-value">${(data.reduce((acc, d) => acc + d.cbt1Score, 0) / data.length).toFixed(1)}%</span>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>S/N</th>
        <th>Candidate Name</th>
        <th>Service Number</th>
        <th>Email Account</th>
        <th>Score</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${tbody}
    </tbody>
  </table>
  <div class="footer">
    <p>This document contains the verified "truth scores" accurately capturing the first-trial attempts for all participants.</p>
    <p>System Generated Report &copy; 2026 Briech UAS Academy</p>
  </div>
</body>
</html>`;
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ path: 'Test_Scores_Report_Part1.pdf', format: 'A4', printBackground: true, margin: { top: '30px', bottom: '30px' } });
  await browser.close();
  console.log('PDF Generated Successfully!');
})();
