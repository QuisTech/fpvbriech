import fs from 'fs';
async function fetchUsers() {
  const url = `https://firestore.googleapis.com/v1/projects/briech-uas-academy/databases/(default)/documents/users`;
  const res = await fetch(url);
  const data = await res.json();
  const docs = data.documents || [];
  const users = docs.map(d => {
    const fields = d.fields || {};
    const extract = (f) => {
      if (!f) return null;
      if (f.stringValue !== undefined) return f.stringValue;
      if (f.integerValue !== undefined) return parseInt(f.integerValue);
      if (f.doubleValue !== undefined) return parseFloat(f.doubleValue);
      if (f.booleanValue !== undefined) return f.booleanValue;
      return JSON.stringify(f);
    };
    const user = { id: d.name.split('/').pop() };
    for (let k in fields) {
      user[k] = extract(fields[k]);
    }
    return user;
  });
  
  const scored = users.filter(u => u.cbt1Score !== undefined || u.cbt2Score !== undefined);
  fs.writeFileSync('result.json', JSON.stringify(scored, null, 2));
  console.log('Saved', scored.length, 'users to result.json');
}
fetchUsers().catch(console.error);
