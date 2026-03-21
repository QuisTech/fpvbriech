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
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #0f172a; margin: 0; padding: 60px; line-height: 1.8; font-size: 16px; background: #fff; }
  .page { border: 1px solid #e2e8f0; padding: 60px; min-height: 900px; position: relative; max-width: 800px; margin: auto; }
  .header { border-bottom: 2px solid #1e3a8a; padding-bottom: 20px; margin-bottom: 40px; }
  .logos { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .logo-img { height: 60px; max-width: 180px; object-fit: contain; }
  .logo-eib { 
    background-color: #e01d7b; 
    mask-repeat: no-repeat; 
    -webkit-mask-repeat: no-repeat;
    mask-size: contain; 
    -webkit-mask-size: contain;
    width: 120px;
    display: inline-block;
  }
  
  .title-block { text-align: center; margin-bottom: 40px; }
  .title-block h1 { margin: 0; color: #1e3a8a; font-size: 24px; text-transform: uppercase; font-weight: 800; border-bottom: 1px solid #e2e8f0; display: inline-block; padding-bottom: 5px; }
  .speech-meta { margin-top: 15px; font-size: 14px; font-weight: 600; color: #64748b; text-transform: uppercase; }
  
  .speech-content { text-align: justify; color: #1e293b; }
  .protocol { font-weight: 700; margin-bottom: 25px; color: #0f172a; }
  .protocol ul { list-style: none; padding: 0; margin: 0; }
  .protocol li { margin-bottom: 5px; }
  
  .paragraph { margin-bottom: 25px; text-indent: 40px; }
  .highlight { color: #1e40af; font-weight: 700; }
  
  .sign-off { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
  .signature-line { width: 250px; border-bottom: 1px solid #0f172a; margin-bottom: 10px; height: 40px; }
  .signature-name { font-weight: 800; text-transform: uppercase; color: #1e3a8a; }
  .signature-title { font-size: 14px; color: #64748b; font-weight: 600; }
  
  .footer { 
    position: absolute; 
    bottom: 40px; 
    left: 60px; 
    right: 60px; 
    text-align: center; 
    color: #94a3b8; 
    font-size: 11px; 
    border-top: 1px dashed #e2e8f0; 
    padding-top: 15px; 
  }

  @media print {
    body { padding: 0; }
    .page { border: none; }
  }
</style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="logos">
        <img class="logo-img" src="${logoArmy}" alt="Nigerian Army">
        <img class="logo-img" src="${logoBriech}" alt="Briech UAS">
        <div class="logo-img logo-eib" style="mask-image: url('${logoEIB}'); -webkit-mask-image: url('${logoEIB}');"></div>
      </div>
      <div class="title-block">
        <h1>Opening Remarks</h1>
        <div class="speech-meta">Passing Out Ceremony | HQ 1 & 8 DIV Nigerian Army</div>
      </div>
    </div>

    <div class="speech-content">
      <div class="protocol">
        <ul>
          <li>Representative of the Chief of Army Staff,</li>
          <li>General Officer Commanding (GOC), 1 and 8 Division,</li>
          <li>Distinguished Officers and Personnel of the Nigerian Army,</li>
          <li>Members of the EIB Group and Briech UAS Academy Staff,</li>
          <li>Our 16 Graduating Trainees,</li>
          <li>Ladies and Gentlemen.</li>
        </ul>
      </div>

      <div class="paragraph">
        It is a profound honor to stand before you today at this Passing Out Ceremony for the 16 dedicated personnel of Headquarters 1 and 8 Division of the Nigerian Army. Over the past weeks, we have witnessed more than just a training session; we have seen a transformation. You came to Briech UAS Academy as skilled soldiers, and you are leaving as specialized operators of some of the most advanced tactical technology in modern warfare: the <span class="highlight">FPV KAMIKAZI DRONE</span>.
      </div>

      <div class="paragraph">
        In the current security landscape, the ability to project precision power while minimizing risk to our troops is not just an advantage—it is a necessity. This training has equipped you with the critical skills needed for pre-flight inspections, battery safety, Ground Control Station mastery, and the precision maneuvers required for effective field operations.
      </div>

      <div class="paragraph">
        I want to personally commend each of the 16 personnel for your discipline and technical aptitude. You have shown that the Nigerian Army remains a forward-thinking force, ready to embrace the future of unmanned systems. At Briech UAS Academy, in collaboration with the EIB Group, our mission is to provide you with "Professional UAV Solutions" that work in the real world. As you return to your divisions, carry this knowledge with pride. You are now the vanguard of a technology that will redefine how we protect our nation.
      </div>

      <div class="paragraph">
        To the graduating officers: Your journey with this platform begins today. Fly safely, fly with precision, and always maintain the high standards of excellence we practiced here. I formally declare this ceremony open.
      </div>

      <div class="paragraph">
        Thank you, and God bless the Federal Republic of Nigeria.
      </div>

      <div class="sign-off">
        <div class="signature-line"></div>
        <div class="signature-name">[Your Name]</div>
        <div class="signature-title">Group Training Manager | Briech UAS Academy</div>
      </div>
    </div>

    <div class="footer">
      <p>&copy; 2026 Briech UAS Academy | Professional UAV Solutions for the Nigerian Army</p>
    </div>
  </div>
</body>
</html>`;

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ 
    path: 'Opening_Remark.pdf', 
    format: 'A4', 
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' }
  });
  await browser.close();
  console.log('Opening Remark PDF Generated Successfully!');
})();
