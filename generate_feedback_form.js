import fs from 'fs';
import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
  // Read and encode logos as base64
  const encodeImage = (filePath) => {
    try {
      const data = fs.readFileSync(filePath);
      const ext = path.extname(filePath).slice(1);
      return `data:image/${ext === 'svg' ? 'svg+xml' : ext};base64,${data.toString('base64')}`;
    } catch (e) {
      console.warn(`Could not load image: ${filePath}`);
      return '';
    }
  };

  const logoBriech = encodeImage('C:/Users/Administrator/Downloads/Briech UAS (1).png');
  const logoEIB = encodeImage('C:/Users/Administrator/Downloads/EIB Group (1).png');
  const logoArmy = encodeImage('C:/Users/Administrator/Downloads/download.png');

  const html = `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; margin: 0; padding: 30px; line-height: 1.4; font-size: 13px; }
  .header { border-bottom: 2px solid #2563eb; padding-bottom: 15px; margin-bottom: 20px; }
  .logos { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
  .logo-img { height: 70px; max-width: 200px; object-fit: contain; }
  .logo-eib { 
    background-color: #e01d7b; 
    mask-repeat: no-repeat; 
    -webkit-mask-repeat: no-repeat;
    mask-size: contain; 
    -webkit-mask-size: contain;
    width: 150px;
    display: inline-block;
  }
  
  .title-block { text-align: center; margin-bottom: 20px; }
  .title-block h1 { margin: 0; color: #0f172a; font-size: 24px; letter-spacing: -0.5px; text-transform: uppercase; }
  .title-block h2 { margin: 5px 0 0 0; color: #2563eb; font-size: 16px; font-weight: 700; text-transform: uppercase; border-top: 1px solid #e2e8f0; padding-top: 5px; display: inline-block; }
  .training-target { margin-top: 10px; font-size: 13px; font-weight: 800; color: #1e40af; background: #eff6ff; padding: 10px; border-radius: 6px; border: 1px solid #bfdbfe; line-height: 1.2; }
  
  .instruction { background: #f8fafc; border-left: 4px solid #2563eb; padding: 12px; margin-bottom: 20px; font-size: 13px; font-style: italic; }
  
  .section { margin-bottom: 20px; }
  .section-title { font-size: 15px; font-weight: bold; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding: 6px 12px; margin-bottom: 12px; background: #f1f5f9; border-radius: 4px; }
  
  .form-group { margin-bottom: 12px; display: flex; gap: 20px; }
  .field { flex: 1; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; min-height: 20px; }
  .label { font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; }
  
  table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
  th { text-align: left; padding: 8px; background: #f8fafc; font-size: 11px; color: #475569; border-bottom: 2px solid #e2e8f0; }
  td { padding: 10px 8px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
  
  .circle { width: 16px; height: 16px; border: 1.5px solid #94a3b8; border-radius: 50%; display: inline-block; vertical-align: middle; }
  
  .open-question { margin-top: 12px; }
  .textarea-box { border: 1px solid #e2e8f0; height: 60px; margin-top: 6px; border-radius: 4px; background: #fff; }
  
  .signature-block { margin-top: 30px; display: flex; gap: 40px; }
  .sig-line { flex: 1; }
  .sig-label { font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-top: 5px; }
  .sig-field { border-bottom: 1.5px solid #0f172a; height: 40px; }
  
  .footer { margin-top: 30px; text-align: center; color: #94a3b8; font-size: 10px; border-top: 1px solid #e2e8f0; padding-top: 10px; }
  
  @media print {
    body { padding: 10px; }
    .section { page-break-inside: avoid; }
  }
</style>
</head>
<body>
  <div class="header">
    <div class="logos">
      <img class="logo-img" src="${logoArmy}" alt="Nigerian Army">
      <img class="logo-img" src="${logoBriech}" alt="Briech UAS">
      <div class="logo-img logo-eib" style="mask-image: url('${logoEIB}'); -webkit-mask-image: url('${logoEIB}');"></div>
    </div>
    <div class="title-block">
      <h1>Briech UAS Academy</h1>
      <h2>Training Critique & Feedback Form</h2>
      <div class="training-target">
        FLYING TRAINING FOR THE 16 PERSONNEL OF HEADQUARTERS 1 AND 8 DIVISION OF THE NIGERIAN ARMY
      </div>
    </div>
  </div>

  <div class="instruction">
    Your feedback is invaluable to us. Please take a few moments to evaluate your training experience. This information helps us improve our programs for future cohorts of the Nigerian Army.
  </div>

  <div class="section">
    <div class="section-title">Participant Information</div>
    <div class="form-group">
      <div style="flex: 2">
        <div class="label">Full Name & Rank</div>
        <div class="field"></div>
      </div>
      <div style="flex: 1">
        <div class="label">Service Number</div>
        <div class="field"></div>
      </div>
    </div>
    <div class="form-group">
      <div style="flex: 1">
        <div class="label">Division/Unit</div>
        <div class="field">HQ 1 / 8 DIV</div>
      </div>
      <div style="flex: 1">
        <div class="label">Date</div>
        <div class="field"></div>
      </div>
      <div style="flex: 1">
        <div class="label">Primary Instructor</div>
        <div class="field"></div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Program Evaluation</div>
    <p style="font-size: 11px; color: #64748b; margin-bottom: 8px;">Scale: 1 (Strongly Disagree) to 5 (Strongly Agree)</p>
    <table>
      <thead>
        <tr>
          <th style="width: 65%">Evaluation Criteria</th>
          <th style="text-align: center">1</th>
          <th style="text-align: center">2</th>
          <th style="text-align: center">3</th>
          <th style="text-align: center">4</th>
          <th style="text-align: center">5</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>The training objectives for the FPV KAMIKAZI DRONE were clearly defined.</td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
        </tr>
        <tr>
          <td>The FPV KAMIKAZI DRONE technical overview was comprehensive.</td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
        </tr>
        <tr>
          <td>Operational safety protocols and emergency procedures were well-explained.</td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
        </tr>
        <tr>
          <td>Practical flight maneuvers for FPV KAMIKAZI DRONE were effectively taught.</td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
        </tr>
        <tr>
          <td>The field training area was safe and suitable for Nigerian Army operations.</td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
        </tr>
        <tr>
          <td>Battery handling and field charging safety were clearly demonstrated.</td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
        </tr>
        <tr>
          <td>Hands-on training for the FPV KAMIKAZI DRONE GCS was sufficient.</td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
        </tr>
        <tr>
          <td>The balance between theory and practical field sessions was appropriate.</td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
        </tr>
        <tr>
          <td>The instructor demonstrated excellent technical knowledge and support.</td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
        </tr>
        <tr>
          <td>I feel confident in my ability to operate FPV KAMIKAZI DRONE platforms safely.</td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
          <td align="center"><span class="circle"></span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Qualitative Feedback</div>
    <div class="open-question">
      <div class="label">What was most valuable for your specific mission requirements?</div>
      <div class="textarea-box"></div>
    </div>
    <div class="open-question">
      <div class="label">Any suggestions for improving future training for the Nigerian Army?</div>
      <div class="textarea-box"></div>
    </div>
  </div>

  <div class="section">
    <div class="signature-block">
      <div class="sig-line">
        <div class="sig-field"></div>
        <div class="sig-label">Participant Signature</div>
      </div>
      <div class="sig-line">
        <div class="sig-field"></div>
        <div class="sig-label">Date signed</div>
      </div>
    </div>
  </div>

  <div class="footer">
    <p>&copy; 2026 Briech UAS Academy | Professional UAV Solutions for the Nigerian Army</p>
  </div>
</body>
</html>`;

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ 
    path: 'Training_Feedback_Form.pdf', 
    format: 'A4', 
    printBackground: true, 
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' } 
  });
  await browser.close();
  console.log('Feedback Form PDF Generated Successfully!');
})();
