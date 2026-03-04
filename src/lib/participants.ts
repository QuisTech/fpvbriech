export const PARTICIPANTS = [
  { sn: 1, rank: "Capt", name: "Prince Chinedu Anyanwu", serviceNumber: "N/17073" },
  { sn: 2, rank: "Lt", name: "Chukwudi Emmanuel Nwafor", serviceNumber: "N/19834" },
  { sn: 3, rank: "Lt", name: "Usman Aliyu Bello", serviceNumber: "N/21690" },
  { sn: 4, rank: "Lt", name: "Bamaiyi Ladini Bongo", serviceNumber: "N/19615" },
  { sn: 5, rank: "2Lt", name: "Emmanuel Boluwatife Davies", serviceNumber: "N/21346" },
  { sn: 6, rank: "2Lt", name: "Ibrahim Abdul", serviceNumber: "N/21404" },
  { sn: 7, rank: "2Lt", name: "Esther Adawn", serviceNumber: "N/21450F" },
  { sn: 8, rank: "2Lt", name: "Solihu Opeyemi Odegbemile", serviceNumber: "N/21460" },
  { sn: 9, rank: "Lcpl", name: "Attahiru Ismail", serviceNumber: "18NA/77/2936" },
  { sn: 10, rank: "Pte", name: "Ukondo Solomon", serviceNumber: "23NA/84/3683" },
  { sn: 11, rank: "Pte", name: "Ibrahim Muhammad", serviceNumber: "24NA/86/2506" },
  { sn: 12, rank: "Pte", name: "Bello Ismaila", serviceNumber: "23NA/84/0678" },
  { sn: 13, rank: "Pte", name: "Abubakar Mustapha", serviceNumber: "22NA/83/9144" },
  { sn: 14, rank: "Pte", name: "Markus Philip", serviceNumber: "21NA/80/2253" },
  { sn: 15, rank: "Pte", name: "Olaniyan A", serviceNumber: "25NA/89/9177" },
  { sn: 16, rank: "Seaman", name: "Isah Usman", serviceNumber: "x17655" }
];

export const formatServiceNumberToEmail = (serviceNumber: string) => {
  // Replace slashes with underscores and append domain
  const sanitized = serviceNumber.replace(/\//g, '_').toLowerCase();
  return `${sanitized}@briech.academy`;
};

export const DEFAULT_PARTICIPANT_PASSWORD = "password123"; // Simple default for initial access
