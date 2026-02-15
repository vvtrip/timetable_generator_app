export interface Course {
  id: string
  department: string
  code: string
  name: string
  acronym: string
  instructor: string
  ugPg: string
  credits: number
  hasLab: boolean
  isSeminar: boolean
  isEvening: boolean
  labVenue?: string
}

export interface Venue {
  id: string
  room: string
  building: string
  floor: string
  isLab: boolean
}

export interface TimeSlot {
  id: string
  label: string
  start: string
  end: string
  isEvening: boolean
}

export interface ScheduledEntry {
  courseId: string
  venueId: string
  day: string
  timeSlotId: string
  type: "lecture" | "lab" | "tutorial" | "seminar"
}

export interface GeneratedTimetable {
  entries: ScheduledEntry[]
  unscheduled: string[]
}

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const
export type Day = (typeof DAYS)[number]

export const TIME_SLOTS: TimeSlot[] = [
  { id: "slot1", label: "9:30 - 11:00", start: "09:30", end: "11:00", isEvening: false },
  { id: "slot2", label: "11:00 - 12:30", start: "11:00", end: "12:30", isEvening: false },
  { id: "slot3", label: "3:00 - 4:30", start: "15:00", end: "16:30", isEvening: false },
  { id: "slot4", label: "4:30 - 6:00", start: "16:30", end: "18:00", isEvening: false },
  { id: "slot5", label: "6:00 - 7:30", start: "18:00", end: "19:30", isEvening: true },
]

export const DEPARTMENTS = ["CSE", "ECE", "MATHS", "SSH", "HCD", "CB"] as const

export const DEPT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  CSE: { bg: "#0d5c63", text: "#ffffff", border: "#0a4a50" },
  ECE: { bg: "#c17817", text: "#ffffff", border: "#a56614" },
  MATHS: { bg: "#1e4d8c", text: "#ffffff", border: "#183d70" },
  SSH: { bg: "#2d6a2e", text: "#ffffff", border: "#245524" },
  HCD: { bg: "#7b2d8e", text: "#ffffff", border: "#632474" },
  CB: { bg: "#b8860b", text: "#ffffff", border: "#966e09" },
}

export const DEFAULT_VENUES: Venue[] = [
  // Old Academic Building - Ground Floor
  { id: "C01", room: "C01", building: "Old Academic Building", floor: "Ground Floor", isLab: false },
  { id: "C02", room: "C02", building: "Old Academic Building", floor: "Ground Floor", isLab: false },
  { id: "C03", room: "C03", building: "Old Academic Building", floor: "Ground Floor", isLab: false },
  // Old Academic Building - 1st Floor
  { id: "C11", room: "C11", building: "Old Academic Building", floor: "1st Floor", isLab: false },
  { id: "C12", room: "C12", building: "Old Academic Building", floor: "1st Floor", isLab: false },
  { id: "C13", room: "C13", building: "Old Academic Building", floor: "1st Floor", isLab: false },
  // Old Academic Building - 2nd Floor
  { id: "C21", room: "C21", building: "Old Academic Building", floor: "2nd Floor", isLab: false },
  { id: "C22", room: "C22", building: "Old Academic Building", floor: "2nd Floor", isLab: false },
  { id: "C23", room: "C23", building: "Old Academic Building", floor: "2nd Floor", isLab: false },
  { id: "C24", room: "C24", building: "Old Academic Building", floor: "2nd Floor", isLab: false },
  // R&D Building - Ground Floor
  { id: "A006", room: "A006", building: "R&D Building", floor: "Ground Floor", isLab: false },
  { id: "A007", room: "A007", building: "R&D Building", floor: "Ground Floor", isLab: false },
  { id: "B001", room: "B001", building: "R&D Building", floor: "Ground Floor", isLab: false },
  { id: "B002", room: "B002", building: "R&D Building", floor: "Ground Floor", isLab: false },
  { id: "B003", room: "B003", building: "R&D Building", floor: "Ground Floor", isLab: false },
  // R&D Building - 1st Floor
  { id: "A102", room: "A102", building: "R&D Building", floor: "1st Floor", isLab: false },
  { id: "A106", room: "A106", building: "R&D Building", floor: "1st Floor", isLab: false },
  { id: "B105", room: "B105", building: "R&D Building", floor: "1st Floor", isLab: false },
  // Lecture Hall Complex - 1st Floor
  { id: "C101", room: "C101", building: "Lecture Hall Complex", floor: "1st Floor", isLab: false },
  { id: "C102", room: "C102", building: "Lecture Hall Complex", floor: "1st Floor", isLab: false },
  // Lecture Hall Complex - 2nd Floor
  { id: "C201", room: "C201", building: "Lecture Hall Complex", floor: "2nd Floor", isLab: false },
  { id: "C208", room: "C208", building: "Lecture Hall Complex", floor: "2nd Floor", isLab: false },
  { id: "C209", room: "C209", building: "Lecture Hall Complex", floor: "2nd Floor", isLab: false },
  { id: "C210", room: "C210", building: "Lecture Hall Complex", floor: "2nd Floor", isLab: false },
  { id: "C211", room: "C211", building: "Lecture Hall Complex", floor: "2nd Floor", isLab: false },
  { id: "C212", room: "C212", building: "Lecture Hall Complex", floor: "2nd Floor", isLab: false },
  { id: "C213", room: "C213", building: "Lecture Hall Complex", floor: "2nd Floor", isLab: false },
  { id: "C214", room: "C214", building: "Lecture Hall Complex", floor: "2nd Floor", isLab: false },
  { id: "C215", room: "C215", building: "Lecture Hall Complex", floor: "2nd Floor", isLab: false },
  { id: "C216", room: "C216", building: "Lecture Hall Complex", floor: "2nd Floor", isLab: false },
  // Library Building
  { id: "L1", room: "L1", building: "Library Building", floor: "1st Floor", isLab: false },
  { id: "L2", room: "L2", building: "Library Building", floor: "2nd Floor", isLab: false },
  { id: "L3", room: "L3", building: "Library Building", floor: "3rd Floor", isLab: false },
  // Labs - Lecture Hall Complex 3rd Floor
  { id: "Lab301", room: "301", building: "Lecture Hall Complex", floor: "3rd Floor", isLab: true },
  { id: "Lab302", room: "302", building: "Lecture Hall Complex", floor: "3rd Floor", isLab: true },
  { id: "Lab303", room: "303", building: "Lecture Hall Complex", floor: "3rd Floor", isLab: true },
  { id: "Lab304", room: "304", building: "Lecture Hall Complex", floor: "3rd Floor", isLab: true },
  { id: "Lab305", room: "305", building: "Lecture Hall Complex", floor: "3rd Floor", isLab: true },
  { id: "Lab306", room: "306", building: "Lecture Hall Complex", floor: "3rd Floor", isLab: true },
  { id: "Lab315", room: "315", building: "Lecture Hall Complex", floor: "3rd Floor", isLab: true },
  { id: "Lab316", room: "316", building: "Lecture Hall Complex", floor: "3rd Floor", isLab: true },
  { id: "Lab320", room: "320", building: "Lecture Hall Complex", floor: "3rd Floor", isLab: true },
  { id: "Lab321", room: "321", building: "Lecture Hall Complex", floor: "3rd Floor", isLab: true },
  // Lab - Old Academic Building
  { id: "Lab407", room: "407", building: "Old Academic Building", floor: "4th Floor", isLab: true },
  // Lab - R&D Building
  { id: "LabA219", room: "A-219", building: "R&D Building", floor: "2nd Floor", isLab: true },
]

let _idCounter = 1
function genId(): string {
  return `course_${_idCounter++}`
}

export const DEFAULT_COURSES: Course[] = [
  // CSE
  { id: genId(), department: "CSE", code: "CSE556", name: "Natural Language Processing", acronym: "NLP", instructor: "Md. Shad Akhtar", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "CSE583", name: "Software Development using Open Source", acronym: "SDOS", instructor: "Pankaj Jalote", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "CSE622", name: "Introduction to Quantum Computing", acronym: "IQC", instructor: "Debajyoti Bera", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "CSE622A", name: "Introduction to Quantum Computing", acronym: "IQC", instructor: "Debajyoti Bera", ugPg: "UG/PG", credits: 2, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "CSE618", name: "Meta Learning", acronym: "MTL", instructor: "Gautam Shroff", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "CSE641/ECE553", name: "Deep Learning", acronym: "DL", instructor: "Vinayak Abrol", ugPg: "UG/PG", credits: 2, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "CSE587A", name: "Networks for AI/ML Systems", acronym: "NAI", instructor: "Rinku Shah", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "CSE638", name: "Graduate Systems", acronym: "GRS", instructor: "Rinku Shah", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "CSE343/ECE363", name: "Machine Learning", acronym: "ML", instructor: "Anubha Gupta", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "CSE631", name: "Advanced Operating Systems", acronym: "AOS", instructor: "Piyus Kedia", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "CSE345/CSE545", name: "Foundations to Computer Security", acronym: "FCS", instructor: "Arun Balaji Buduru", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "CSE350/550", name: "Network Security", acronym: "NSC", instructor: "B N Jain", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "CSE592/DES540", name: "Human AI Interaction", acronym: "HAI", instructor: "Pushpendra Singh", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "CSE621", name: "Computational Complexity Theory", acronym: "CCT", instructor: "Nikhil Gupta", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "CSE354/CSE554", name: "Networks and System Security II", acronym: "NSS-II", instructor: "Sambuddho Chakravarty", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "CSE593A", name: "Quantum Cryptography", acronym: "QC", instructor: "RaviAnanad", ugPg: "UG/PG", credits: 2, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "CSE595", name: "Multicore Parallel Programming and Runtime Systems", acronym: "MPPRS", instructor: "Vivek Kumar", ugPg: "UG/PG", credits: 4, hasLab: true, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "CSE342/ECE356/CSE542/ECE556", name: "Statistical Machine Learning", acronym: "SML", instructor: "A.V. Subramanyam", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "CSE546", name: "Applied Crypto", acronym: "AC", instructor: "Ravi Anand", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "CSE594A", name: "Agentic-Reasoning", acronym: "AR", instructor: "Bapi Chatterjee", ugPg: "UG/PG", credits: 2, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "CSE667", name: "Decision Making for Multi-Robot Systems", acronym: "DMMRS", instructor: "Tanmoy Kundu", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "DES538/CSE596", name: "Robot Perception and Manipulation", acronym: "RPM", instructor: "Jainendra Shukla", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "CSE640", name: "Collaborative Filtering", acronym: "CF", instructor: "Angshul Majumdar", ugPg: "PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "CSE655", name: "Network Science", acronym: "NS", instructor: "Ganesh Bagler", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CSE", code: "CSE344/CSE544", name: "Computer Vision", acronym: "CV", instructor: "Saket Anand", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },

  // ECE
  { id: genId(), department: "ECE", code: "CSE654/ECE654", name: "High-Dimensional Statistics and Optimization", acronym: "HDSO", instructor: "Pravesh Biyani", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "ECE", code: "ECE582", name: "Task Priority Control of Robots", acronym: "TPCR", instructor: "Sayan Basu Roy", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "ECE", code: "ECE614", name: "Emerging Memory Devices for Neuromorphic Computing", acronym: "EMDNC", instructor: "Anuj Kumar", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "ECE", code: "ECE567", name: "Nano and Metaelectronics", acronym: "NME", instructor: "Sukanta Nandi", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "ECE", code: "CSE538/ECE538", name: "Wireless Networks", acronym: "WN", instructor: "Shamik Sarkar", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "ECE", code: "ECE366/ECE566", name: "Neural Engineering and Implantable Devices", acronym: "NEID", instructor: "Pragya Kosta", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "ECE", code: "ECE432/ECE632", name: "Radar Systems", acronym: "RS", instructor: "Shobha Sundar Ram", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "ECE", code: "ECE537", name: "Wireless Communication: Evolution from 3G to 5G", acronym: "WCE", instructor: "Vivek Bohara", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "ECE", code: "ECE572", name: "Estimation Theory for Dynamic Systems", acronym: "ET", instructor: "Sanat Biswas", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "ECE", code: "ECE529", name: "Quantum Optics", acronym: "QO", instructor: "Sayak Bhattacharya", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "ECE", code: "ECE573", name: "Advanced Embedded Logic Design", acronym: "AELD", instructor: "Sumit J. Darak", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "ECE", code: "ECE522", name: "Integrated Circuit Fabrication", acronym: "ICF", instructor: "S S Jamuar", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "ECE", code: "ECE611", name: "Memory Design and Test", acronym: "MDT", instructor: "Anuj Grover", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "ECE", code: "ECE613", name: "Advanced Solid State Devices", acronym: "ASSD", instructor: "Sneh Saurabh", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "ECE", code: "ECE666/CSE517", name: "Applied Optimization Methods for Machine Learning", acronym: "AOMML", instructor: "Bapi Chatterjee", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "ECE", code: "ENG599s", name: "Research Methods", acronym: "RM", instructor: "Manuj Mukherjee", ugPg: "PG", credits: 2, hasLab: false, isSeminar: false, isEvening: false },

  // MATHS
  { id: genId(), department: "MATHS", code: "MTH550", name: "Reproducing Kernel Hilbert Spaces and Applications", acronym: "RKHSA", instructor: "Subhajit Ghosechowhdury", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "MATHS", code: "MTH310/MTH520", name: "Graph Theory", acronym: "GT", instructor: "Manu Mukherjee", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "MATHS", code: "MTH374/MTH574/CSE597", name: "Linear Optimization", acronym: "LO", instructor: "Rajiv Raman", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "MATHS", code: "MTH521A", name: "Probabilistic Number Theory", acronym: "PNT", instructor: "Sneha Chaubey", ugPg: "UG/PG", credits: 2, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "MATHS", code: "MTH514", name: "Coding Theory", acronym: "COT", instructor: "Anuradha Sharma", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "MATHS", code: "MTH515", name: "Linear Algebraic Group", acronym: "LAG", instructor: "Nabanita Ray", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "MATHS", code: "MTH546", name: "Analytic Foundations for Elliptic Curves", acronym: "AFCM", instructor: "Prahllad Deb", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "MATHS", code: "MTH552A", name: "Topics in Functional Analysis", acronym: "TFA", instructor: "Satish Kumar Pandey", ugPg: "UG/PG", credits: 2, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "MATHS", code: "MTH598", name: "Numerical Partial Differential Equations", acronym: "NPDE", instructor: "Subhashree Mohapatra + Kaushik Kalyanaraman", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "MATHS", code: "MTH599", name: "Variational Calculus and Applications", acronym: "VCA", instructor: "Sarthok Sircar", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "MATHS", code: "MTH566", name: "Algebraic Topology I", acronym: "AT", instructor: "Sachchidanand Prasad", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "MATHS", code: "MTH510", name: "Advanced Linear Algebra", acronym: "ALA", instructor: "Kaushik Kalyanaraman", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },

  // SSH
  { id: genId(), department: "SSH", code: "ECO332", name: "Valuation and Portfolio Management", acronym: "VPM", instructor: "Pankaj Vajpayee", ugPg: "UG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "SSH", code: "SSH240", name: "Politics in the Digital Era", acronym: "PDE", instructor: "Santosh Kumar", ugPg: "UG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "SSH", code: "ECO301", name: "Microeconomics", acronym: "ME", instructor: "Souvik Dutta", ugPg: "UG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "SSH", code: "ENT305", name: "Social Innovation, CSR, and Sustainable Development", acronym: "SICSRS", instructor: "Aheli Choudhary", ugPg: "UG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "SSH", code: "ENT413", name: "Entrepreneurial Finance", acronym: "EF", instructor: "Anupam Saronwala", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "SSH", code: "ESC207A", name: "Ecology, Evolution, and Environment", acronym: "EEE", instructor: "D. K Sharma", ugPg: "UG", credits: 2, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "SSH", code: "MTH377/MTH577", name: "Convex Optimization", acronym: "COO", instructor: "Ruhi Sonal", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "SSH", code: "PSY305/PSY505", name: "Attention and Perception", acronym: "ATP", instructor: "Sonia Baloni Ray", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "SSH", code: "ENT308", name: "Setting up GCCs in India", acronym: "SGI", instructor: "Shree Pandit", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "SSH", code: "SOC308/SOC514", name: "Gender and Media", acronym: "GM", instructor: "Smriti Singh", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "SSH", code: "SOC502", name: "Advanced Sociological Theory", acronym: "AST", instructor: "Gayatri Nair", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "SSH", code: "PSY301", name: "Cognitive Psychology", acronym: "CP", instructor: "Dr Ratan Suri", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "SSH", code: "SOC702", name: "On the Making of Anthropological Objects", acronym: "AO", instructor: "Deepak Prince", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "SSH", code: "SOC211", name: "Science, Technology and Society", acronym: "STS", instructor: "Deepak Prince", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "SSH", code: "PSY306/PSY506", name: "Learning and Memory", acronym: "LM", instructor: "Mrinmoy Chakrabarty", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "SSH", code: "SSH322/SSH522", name: "Philosophy of Technology", acronym: "PT", instructor: "Nishad Patnaik", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "SSH", code: "PSY302", name: "Social Psychology", acronym: "SP", instructor: "Ratandeep Suri", ugPg: "UG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "SSH", code: "SSH342/542", name: "Political Concepts in Contemporary India", acronym: "PCCI", instructor: "Neera Chandhoke", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "SSH", code: "ENT416/ENT516", name: "Creativity, Innovation, and Inventive Problem Solving", acronym: "CIIPS", instructor: "Anuj Grover", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "SSH", code: "BIO571/ENT421", name: "Healthcare Innovation and Entrepreneurship Essentials", acronym: "HIEE", instructor: "Alok Srivastav", ugPg: "UG/PG", credits: 2, hasLab: false, isSeminar: false, isEvening: false },

  // HCD
  { id: genId(), department: "HCD", code: "DES512", name: "Game Design and Development", acronym: "GDD", instructor: "Aman Samuel", ugPg: "UG/PG", credits: 4, hasLab: true, isSeminar: false, isEvening: false },
  { id: genId(), department: "HCD", code: "DES524", name: "Ergonomics/Human Factors for Design", acronym: "EFD", instructor: "Sonal Keshwani", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "HCD", code: "DES529", name: "Design for AI Driven Products", acronym: "DAIDP", instructor: "Vinish Kathuria", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "HCD", code: "DES591/CSE591", name: "Mobile and Ubiquitous Computing", acronym: "MUC", instructor: "Pragma Kar", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "HCD", code: "DES527", name: "User Experience Design of XR", acronym: "UDXR", instructor: "Anmol Srivastava", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "HCD", code: "DES521", name: "Fundamentals of Video for Engineers", acronym: "FVE", instructor: "Angshu Srivastava", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "HCD", code: "DES539", name: "Design Research Methodology", acronym: "DRM", instructor: "Anmol Srivastava", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },

  // CB
  { id: genId(), department: "CB", code: "BIO522", name: "Algorithms in Computational Biology", acronym: "ACB", instructor: "N Arul Murugan", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CB", code: "BIO531", name: "Introduction to Mathematical Biology", acronym: "IMB", instructor: "Sriram K.", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CB", code: "BIO541", name: "Data Sciences for Genomics", acronym: "DSG", instructor: "Vibhor Kumar", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CB", code: "BIO543", name: "Big Data Mining in Healthcare", acronym: "BDMH", instructor: "G P S Raghava", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CB", code: "BIO548", name: "Human Microbiome Data Science", acronym: "HMDS", instructor: "Tarini S Ghosh", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
  { id: genId(), department: "CB", code: "BIO516", name: "Cellular Biophysics", acronym: "CeB", instructor: "Anindita Das", ugPg: "UG/PG", credits: 4, hasLab: false, isSeminar: false, isEvening: false },
]
