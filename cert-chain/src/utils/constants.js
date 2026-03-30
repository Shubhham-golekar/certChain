export const CERT_TYPES = [
  "Blockchain Development",
  "Web Development",
  "Data Science",
  "Machine Learning",
  "Cybersecurity",
  "Cloud Computing",
  "UI/UX Design",
  "Other",
];

export const MOCK_CERTS = [
  {
    id: "cert_001",
    studentName: "Priya Sharma",
    course: "Blockchain Development",
    issuer: "MIT OpenCourseWare",
    date: "2024-11-15",
    txHash: "GXYZ9...K3M2",
    studentEmail: "priya@example.com",
  },
  {
    id: "cert_002",
    studentName: "Rahul Verma",
    course: "Machine Learning",
    issuer: "IIT Bombay",
    date: "2024-12-01",
    txHash: "GABC1...R7N8",
    studentEmail: "rahul@example.com",
  },
];

export function generateTxHash() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 56 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export const DEFAULT_FORM = {
  studentName: "",
  studentEmail: "",
  course: "",
  issuer: "",
  date: new Date().toISOString().split("T")[0],
  grade: "",
};

export const CONTRACT_ID = "CCM2BQ54L4RVOH73DC73JXTYMYVO5V7IHTZGWBWJ4NINQJ22TBFQWNVL";
