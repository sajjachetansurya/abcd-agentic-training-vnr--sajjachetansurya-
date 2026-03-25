
import { College } from './types';

export const TELANGANA_COLLEGES: College[] = [
  { 
    id: 'cbit', 
    name: 'CBIT (Chaitanya Bharathi Institute of Technology)',
    logo: 'https://ui-avatars.com/api/?name=CBIT&background=ef4444&color=fff&size=128',
    ranking: 'Top 10 State Private College',
    placements: {
      averagePackage: '₹7.5 LPA',
      topRecruiters: ['Amazon', 'Microsoft', 'J.P. Morgan', 'Oracle'],
      placementRate: '95%',
    },
    syllabus: ['Data Structures & Algorithms', 'AI & Machine Learning', 'Cloud Computing', 'VLSI Design', 'Power Systems'],
    campusLife: 'CBIT offers a vibrant campus life with numerous technical and cultural clubs. The annual cultural fest, "Shruthi," and the technical symposium, "Sudhee," are major highlights.',
    admissionProcess: "Admissions are primarily through the TS EAMCET entrance exam for Category-A seats (70%). Category-B seats (30%) are filled by the management based on JEE Main or TS EAMCET ranks. Lateral entry for diploma holders is through TS ECET.",
    cutoffs: "For top branches like CSE and IT, the TS EAMCET closing rank is typically under 2,000 for the general category. Ranks vary each year based on competition."
  },
  { 
    id: 'griet', 
    name: 'GRIET (Gokaraju Rangaraju Institute of Engineering and Technology)',
    logo: 'https://ui-avatars.com/api/?name=GRIET&background=f97316&color=fff&size=128',
    ranking: 'Top 20 State Private College',
    placements: {
      averagePackage: '₹6.8 LPA',
      topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Capgemini'],
      placementRate: '92%',
    },
    syllabus: ['Web Technologies', 'Database Management Systems', 'Embedded Systems', 'Network Security', 'Robotics'],
    campusLife: 'GRIET is known for its green campus and strong focus on student-run clubs. Events like "Pragnya" provide a platform for students to showcase their talents.',
    admissionProcess: "Admission is based on the rank secured in the TS EAMCET exam for Category-A seats. Category-B seats are filled through management quota, considering JEE Main and TS EAMCET scores.",
    cutoffs: "TS EAMCET closing ranks for CSE are usually in the range of 3,000-6,000. Cutoffs for other branches are comparatively higher."
  },
  { 
    id: 'jntuh', 
    name: 'JNTUH College of Engineering, Hyderabad',
    logo: 'https://ui-avatars.com/api/?name=JNTUH&background=f59e0b&color=fff&size=128',
    ranking: 'Top 5 State University',
    placements: {
      averagePackage: '₹8.0 LPA',
      topRecruiters: ['Google', 'Salesforce', 'Accenture', 'Deloitte'],
      placementRate: '98%',
    },
    syllabus: ['Advanced Algorithms', 'Compiler Design', 'Image Processing', 'Digital Signal Processing', 'Structural Engineering'],
    campusLife: 'As a premier government institution, JNTUH has a rich history of academic excellence and hosts various national-level technical competitions and seminars.',
    admissionProcess: "Admission is strictly based on merit in the TS EAMCET entrance examination, conducted by JNTUH itself. Counselling is done by the convenor of TS EAMCET.",
    cutoffs: "Being a top government college, cutoffs are very competitive. For CSE, the closing rank is often below 1,000 for the general category."
  },
   { 
    id: 'ou', 
    name: 'Osmania University College of Engineering',
    logo: 'https://ui-avatars.com/api/?name=OU&background=84cc16&color=fff&size=128',
    ranking: 'Top 5 State University',
    placements: {
        averagePackage: '₹8.2 LPA',
        topRecruiters: ['MathWorks', 'Oracle', 'Infosys', 'TCS'],
        placementRate: '96%',
    },
    syllabus: ['Operating Systems', 'Computer Networks', 'Control Systems', 'Thermodynamics', 'Transportation Engineering'],
    campusLife: 'The historic campus of Osmania University provides a unique academic atmosphere. It has a strong alumni network and numerous student chapters of professional bodies like IEEE and ACM.',
    admissionProcess: "Admissions are made through the centralised counselling of TS EAMCET. A separate entrance test, OU PGCET, is conducted for postgraduate admissions.",
    cutoffs: "Highly competitive, similar to JNTUH. Closing ranks for sought-after branches are typically under 1,200 in the TS EAMCET exam."
  },
  { 
    id: 'vnr', 
    name: 'VNR Vignana Jyothi Institute of Engineering and Technology',
    logo: 'https://ui-avatars.com/api/?name=VNR&background=10b981&color=fff&size=128',
    ranking: 'Top 15 State Private College',
    placements: {
        averagePackage: '₹7.0 LPA',
        topRecruiters: ['Amazon', 'ServiceNow', 'J.P. Morgan', 'Tata Projects'],
        placementRate: '94%',
    },
    syllabus: ['Full Stack Development', 'IoT', 'Cyber Security', 'Automobile Engineering', 'Renewable Energy'],
    campusLife: 'VNRVJIET has a dynamic campus with a focus on innovation and entrepreneurship. The annual fest "Sintillashunz" is a major event attracting participation from colleges across the state.',
    admissionProcess: "The primary mode of admission is through the TS EAMCET exam. 30% of seats are under the management quota (Category-B), which considers JEE Main/TS EAMCET performance.",
    cutoffs: "For CSE, the TS EAMCET cutoff rank is generally around 2,500-3,500. It is one of the top choices for students after CBIT."
  },
  { 
    id: 'vasavi', 
    name: 'Vasavi College of Engineering',
    logo: 'https://ui-avatars.com/api/?name=Vasavi&background=06b6d4&color=fff&size=128',
    ranking: 'Top 15 State Private College',
    placements: {
        averagePackage: '₹7.2 LPA',
        topRecruiters: ['Adobe', 'Infosys', 'Cognizant', 'Accenture'],
        placementRate: '93%',
    },
    syllabus: ['Software Engineering', 'Mobile App Development', 'VLSI & Embedded Systems', 'Machine Design', 'Geotechnical Engineering'],
    campusLife: 'Vasavi provides a balanced environment for academics and extracurriculars. The "Acumen" technical fest and "Euphoria" cultural fest are key events in their calendar.',
    admissionProcess: "70% of admissions are based on TS EAMCET ranks (Category-A). The remaining 30% are Category-B seats filled by management, considering JEE Main and TS EAMCET ranks.",
    cutoffs: "Cutoff ranks for IT and CSE are competitive, usually falling in the 3,000-5,000 range in the TS EAMCET for the general category."
  },
  { 
    id: 'mgit', 
    name: 'MGIT (Mahatma Gandhi Institute of Technology)',
    logo: 'https://ui-avatars.com/api/?name=MGIT&background=0ea5e9&color=fff&size=128',
    ranking: 'Top 30 State Private College',
    placements: {
        averagePackage: '₹6.5 LPA',
        topRecruiters: ['Wipro', 'TCS', 'Capgemini', 'Hexaware'],
        placementRate: '90%',
    },
    syllabus: ['Python Programming', 'Data Analytics', 'Communication Systems', 'Power Electronics', 'Fluid Mechanics'],
    campusLife: 'MGIT encourages students to participate in a wide range of activities, from sports to coding clubs. The annual "Nirvana" fest is a popular event.',
    admissionProcess: "Admissions are governed by the rules of the Telangana State Council of Higher Education (TSCHE), primarily through TS EAMCET counselling.",
    cutoffs: "TS EAMCET closing ranks for core branches like ECE and CSE typically range from 8,000 to 15,000."
  },
  { 
    id: 'vardhaman', 
    name: 'Vardhaman College of Engineering',
    logo: 'https://ui-avatars.com/api/?name=Vardhaman&background=3b82f6&color=fff&size=128',
    ranking: 'Top 25 State Private College',
    placements: {
        averagePackage: '₹6.9 LPA',
        topRecruiters: ['Virtusa', 'TCS', 'Infosys', 'Amazon'],
        placementRate: '91%',
    },
    syllabus: ['Cloud Native Technologies', 'Big Data', 'Microcontrollers', 'Automation', 'Structural Analysis'],
    campusLife: 'Vardhaman has a modern campus with excellent infrastructure. It hosts several workshops and hackathons throughout the year to promote a culture of learning.',
    admissionProcess: "Admission to the B.Tech program is through the TS EAMCET exam. Management quota seats are also available based on merit.",
    cutoffs: "The closing ranks for CSE and specialized AI/ML courses are generally in the 5,000-9,000 range in TS EAMCET."
  },
  { 
    id: 'sreenidhi', 
    name: 'Sreenidhi Institute of Science and Technology',
    logo: 'https://ui-avatars.com/api/?name=SNIST&background=6366f1&color=fff&size=128',
    ranking: 'Top 30 State Private College',
    placements: {
        averagePackage: '₹6.7 LPA',
        topRecruiters: ['IBM', 'HCL', 'Tech Mahindra', 'Cognizant'],
        placementRate: '89%',
    },
    syllabus: ['Artificial Intelligence', 'Data Science', 'Embedded Systems', 'Robotics', 'Environmental Engineering'],
    campusLife: 'SNIST is known for its strong emphasis on research and project-based learning. It has active clubs for robotics, coding, and entrepreneurship.',
    admissionProcess: "Students are admitted through TS EAMCET counselling for Category-A seats. Category-B seats are filled by the management based on specified criteria.",
    cutoffs: "Cutoffs for branches like CSE and ECE are typically in the 7,000-12,000 rank range in the TS EAMCET exam."
  },
  { 
    id: 'mvsr', 
    name: 'MVSR Engineering College',
    logo: 'https://ui-avatars.com/api/?name=MVSR&background=8b5cf6&color=fff&size=128',
    ranking: 'Top 35 State Private College',
    placements: {
        averagePackage: '₹6.3 LPA',
        topRecruiters: ['Infosys', 'Wipro', 'Deloitte', 'Hyundai'],
        placementRate: '88%',
    },
    syllabus: ['Java Programming', 'Computer Organization', 'Analog Communications', 'Heat Transfer', 'Surveying'],
    campusLife: 'MVSR has a long-standing reputation and a strong alumni base. The campus life is a blend of traditional values and modern educational practices.',
    admissionProcess: "Admission is conducted through the convenor of TS EAMCET for Category-A seats. Management quota is available for Category-B seats.",
    cutoffs: "The TS EAMCET closing ranks for core engineering branches usually fall between 10,000 and 20,000."
  },
  { 
    id: 'kmit', 
    name: 'KMIT (Keshav Memorial Institute of Technology)',
    logo: 'https://ui-avatars.com/api/?name=KMIT&background=a855f7&color=fff&size=128',
    ranking: 'Top 20 State Private College',
    placements: {
        averagePackage: '₹7.8 LPA',
        topRecruiters: ['Salesforce', 'ServiceNow', 'Amazon', 'Pega Systems'],
        placementRate: '95%',
    },
    syllabus: ['Design Patterns', 'DevOps', 'Blockchain', 'Natural Language Processing', 'Network Theory'],
    campusLife: 'KMIT focuses on creating industry-ready engineers. The college has strong ties with tech companies and frequently organizes guest lectures and coding bootcamps.',
    admissionProcess: "Admissions are made via the TS EAMCET exam counselling. A significant portion of seats fall under the management quota, for which JEE Main ranks are also considered.",
    cutoffs: "KMIT is highly sought after for its software-focused curriculum. CSE cutoffs are very competitive, often closing below 4,000 in TS EAMCET."
  },
  { 
    id: 'cvr', 
    name: 'CVR College of Engineering',
    logo: 'https://ui-avatars.com/api/?name=CVR&background=d946ef&color=fff&size=128',
    ranking: 'Top 25 State Private College',
    placements: {
        averagePackage: '₹7.1 LPA',
        topRecruiters: ['Oracle', 'TCS', 'Accenture', 'Capgemini'],
        placementRate: '92%',
    },
    syllabus: ['Object Oriented Programming', 'Operating Systems', 'Digital Logic Design', 'Manufacturing Processes', 'Hydraulics'],
    campusLife: 'CVR offers a disciplined academic environment with a focus on results. It has well-equipped labs and a vast library to support student learning.',
    admissionProcess: "Admissions for 70% of seats are based on TS EAMCET ranks. The remaining 30% are management seats, filled based on merit in JEE Main or TS EAMCET.",
    cutoffs: "TS EAMCET closing ranks for CSE and ECE are typically in the 4,000-8,000 range, making it a competitive choice."
  },
  { 
    id: 'bvit', 
    name: 'B. V. Raju Institute of Technology',
    logo: 'https://ui-avatars.com/api/?name=BVRIT&background=ec4899&color=fff&size=128',
    ranking: 'Top 30 State Private College',
    placements: {
        averagePackage: '₹6.6 LPA',
        topRecruiters: ['Amazon', 'Infosys', 'Wipro', 'Mindtree'],
        placementRate: '90%',
    },
    syllabus: ['Machine Learning', 'Cyber Security', 'Wireless Communication', 'CAD/CAM', 'Water Resource Engineering'],
    campusLife: 'BVRIT has a sprawling campus with a focus on holistic development. The "Promethean" tech fest is a major annual event with wide participation.',
    admissionProcess: "The primary admission channel is the TS EAMCET exam. Management quota seats are also available as per state government norms.",
    cutoffs: "Closing ranks for computer science and related branches generally fall between 6,000 and 12,000 in the TS EAMCET exam."
  },
  { 
    id: 'gec', 
    name: 'Govt. Engineering College, Jagtial',
    logo: 'https://ui-avatars.com/api/?name=GEC&background=f43f5e&color=fff&size=128',
    ranking: 'State Government College',
    placements: {
        averagePackage: '₹4.5 LPA',
        topRecruiters: ['State Govt. Depts', 'TCS', 'Local IT Firms'],
        placementRate: '75%',
    },
    syllabus: ['C Programming', 'Basic Electrical Engineering', 'Engineering Mechanics', 'Database Systems', 'Power Generation'],
    campusLife: 'As a government college, it offers affordable education with a focus on core engineering principles. Campus life is simple and academically oriented.',
    admissionProcess: "Admissions are exclusively through the TS EAMCET counselling process, based on merit and reservation policies.",
    cutoffs: "Cutoffs are generally higher compared to top private colleges, with ranks extending up to 30,000-50,000 for various branches."
  },
  { 
    id: 'iiit_h', 
    name: 'IIIT Hyderabad',
    logo: 'https://ui-avatars.com/api/?name=IIIT-H&background=2563eb&color=fff&size=128',
    ranking: 'Top 5 All India',
    placements: {
      averagePackage: '₹32.0 LPA',
      topRecruiters: ['Google', 'Apple', 'Meta', 'Microsoft', 'Amazon'],
      placementRate: '100%',
    },
    syllabus: ['Computational Linguistics', 'Robotics & Computer Vision', 'Cryptography', 'Quantum Computing', 'Bioinformatics'],
    campusLife: 'IIIT-H is a research-focused institute with a highly competitive and innovative environment. The campus is active 24/7 with numerous research labs and coding groups.',
    admissionProcess: "Admission is through multiple modes: JEE Main scores, their own Undergraduate Engineering Entrance Examination (UGEE), and Olympiads (KVPY). The process is highly selective.",
    cutoffs: "For the JEE Main mode, the closing rank for CSE is extremely competitive, often under 1,000 All India Rank."
  },
  { 
    id: 'nit_w', 
    name: 'NIT Warangal',
    logo: 'https://ui-avatars.com/api/?name=NITW&background=059669&color=fff&size=128',
    ranking: 'Top 10 All India (NITs)',
    placements: {
      averagePackage: '₹17.29 LPA',
      topRecruiters: ['Adobe', 'Uber', 'Nvidia', 'Qualcomm'],
      placementRate: '99%',
    },
    syllabus: ['Parallel Computing', 'Advanced Data Structures', 'VLSI Technology', 'Advanced Control Systems', 'Metallurgy'],
    campusLife: 'NIT Warangal, an Institute of National Importance, has a diverse student body from across the country. It boasts a massive campus with world-class facilities and hosts two major fests: "Technozion" (technical) and "SpringSpree" (cultural).',
    admissionProcess: "Admissions are based on All India Rank in JEE Main through the JoSAA/CSAB centralized counselling process. 50% of seats are reserved for Telangana and Andhra Pradesh students.",
    cutoffs: "Closing ranks are very high. For CSE, the home state rank is typically under 2,000, while the other state rank is under 1,500."
  },
  { 
    id: 'iit_h', 
    name: 'IIT Hyderabad',
    logo: 'https://ui-avatars.com/api/?name=IITH&background=db2777&color=fff&size=128',
    ranking: 'Top 10 All India (IITs)',
    placements: {
      averagePackage: '₹20.0 LPA',
      topRecruiters: ['Goldman Sachs', 'Rakuten', 'Indeed', 'Flipkart'],
      placementRate: '97%',
    },
    syllabus: ['Fractal Geometry', 'AI for Climate Science', 'Biomedical Engineering', '3D Printing', 'Sustainable Engineering'],
    campusLife: 'IITH is known for its unique fractal-based academic curriculum and cutting-edge research. The campus life is intellectually stimulating with a strong maker culture. "Elan & nVision" is their annual techno-cultural fest.',
    admissionProcess: "Admission is exclusively through the JEE Advanced exam after qualifying in JEE Main. Seats are allocated via the JoSAA counselling process.",
    cutoffs: "As a top IIT, requires a very high rank in JEE Advanced. For CSE, the closing rank is typically within the top 600-700."
  },
  { 
    id: 'bits_h', 
    name: 'BITS Pilani, Hyderabad Campus',
    logo: 'https://ui-avatars.com/api/?name=BITS&background=ca8a04&color=fff&size=128',
    ranking: 'Top 15 All India',
    placements: {
      averagePackage: '₹18.5 LPA',
      topRecruiters: ['Microsoft', 'Google', 'DE Shaw', 'Texas Instruments'],
      placementRate: '98%',
    },
    syllabus: ['Analog & Digital Electronics', 'Microprocessors', 'Object Oriented Programming', 'Discrete Mathematics', 'Mechatronics'],
    campusLife: 'BITS Hyderabad offers a flexible curriculum and a "zero attendance" policy, promoting self-learning. The campus is vibrant with numerous clubs and their annual techno-cultural fest "Pearl" is one of the largest in the country.',
    admissionProcess: "Admissions are solely based on the merit in the BITS Admission Test (BITSAT), a computer-based online test. There is no provision for management quota or admission through other entrance exams like JEE.",
    cutoffs: "BITSAT scores are highly competitive. A score of over 300 (out of 390) is generally required for admission into computer science, with scores for other branches being slightly lower."
  },
];
