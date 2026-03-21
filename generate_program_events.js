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
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #0f172a; margin: 0; padding: 60px; line-height: 1.6; font-size: 16px; background: #fff; }
  .page { border: 20px solid #f1f5f9; padding: 40px; min-height: 900px; position: relative; }
  .header { border-bottom: 3px double #2563eb; padding-bottom: 25px; margin-bottom: 40px; }
  .logos { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
  .logo-img { height: 80px; max-width: 250px; object-fit: contain; }
  .logo-eib { 
    background-color: #e01d7b; 
    mask-repeat: no-repeat; 
    -webkit-mask-repeat: no-repeat;
    mask-size: contain; 
    -webkit-mask-size: contain;
    width: 150px;
    display: inline-block;
  }
  
  .title-block { text-align: center; margin-bottom: 40px; }
  .title-block h1 { margin: 0; color: #1e3a8a; font-size: 32px; letter-spacing: -1px; text-transform: uppercase; font-weight: 800; }
  .title-block .academy-name { margin-bottom: 10px; color: #1e293b; font-size: 20px; font-weight: 600; }
  
  .event-program { margin-top: 50px; }
  .event-item { display: flex; align-items: flex-start; margin-bottom: 25px; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 5px solid #1e3a8a; }
  .event-number { font-size: 20px; font-weight: 800; color: #1e3a8a; min-width: 40px; }
  .event-detail { flex: 1; }
  .event-title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
  .event-assignee { font-size: 14px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px; }
  
  .target-title { 
    margin: 40px auto; 
    font-size: 18px; 
    font-weight: 700; 
    color: #1e40af; 
    text-align: center; 
    max-width: 600px;
    background: #eff6ff;
    padding: 20px;
    border: 2px solid #bfdbfe;
    border-radius: 12px;
    line-height: 1.4;
    text-transform: uppercase;
  }
  
  .footer { 
    position: absolute; 
    bottom: 40px; 
    left: 40px; 
    right: 40px; 
    text-align: center; 
    color: #64748b; 
    font-size: 12px; 
    border-top: 1px solid #e2e8f0; 
    padding-top: 20px; 
  }
  
  .stamp-area {
    margin-top: 60px;
    display: flex;
    justify-content: flex-end;
    padding-right: 40px;
  }
  .stamp-box {
    border: 2px dashed #94a3b8;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    font-size: 11px;
    text-transform: uppercase;
    text-align: center;
    font-weight: 700;
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
        <div class="academy-name">Briech UAS Academy</div>
        <h1>Program of Events</h1>
      </div>
    </div>

    <div class="target-title">
      PASSING OUT CEREMONY OF THE FLYING TRAINING FOR THE 16 PERSONNEL OF HEADQUARTERS 1 AND 8 DIVISION OF THE NIGERIAN ARMY
    </div>

    <div class="event-program">
      <div class="event-item">
        <div class="event-number">01.</div>
        <div class="event-detail">
          <div class="event-title">Opening Remark</div>
          <div class="event-assignee">By The Training Manager</div>
        </div>
      </div>

      <div class="event-item">
        <div class="event-number">02.</div>
        <div class="event-detail">
          <div class="event-title">Introduction of Managers and Staffs Present at the Ceremony</div>
          <div class="event-assignee">By The Training Manager</div>
        </div>
      </div>

      <div class="event-item">
        <div class="event-number">03.</div>
        <div class="event-detail">
          <div class="event-title">Officers Individual Remarks</div>
          <div class="event-assignee">Nigerian Army Representatives</div>
        </div>
      </div>

      <div class="event-item">
        <div class="event-number">04.</div>
        <div class="event-detail">
          <div class="event-title">Presentation of Certificates</div>
          <div class="event-assignee">Briech UAS Academy Leadership</div>
        </div>
      </div>

      <div class="event-item">
        <div class="event-number">05.</div>
        <div class="event-detail">
          <div class="event-title">Vote of Thanks</div>
          <div class="event-assignee">By Individual Officers</div>
        </div>
      </div>
    </div>

    <div class="stamp-area">
      <div class="stamp-box">Official Academy Seal</div>
    </div>

    <div class="footer">
      <p>&copy; 2026 Briech UAS Academy | Excellence in Unmanned Aerial Systems Operational Training</p>
      <p>Providing cutting-edge UAS solutions for the Federal Republic of Nigeria</p>
    </div>
  </div>

  <script>
    // Just for visual effect if viewed in browser
  </script>
</body>
</html>`;

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ 
    path: 'Program_of_Events.pdf', 
    format: 'A4', 
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' }
  });
  await browser.close();
  console.log('Program of Events PDF Generated Successfully!');
})();
