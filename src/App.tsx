import { useState, useEffect, useRef } from "react";
import {
  Play,
  SkipForward,
  ArrowRight,
  Pause,
  RotateCcw,
  RefreshCw,
  X,
  Volume2,
  VolumeX,
  Mic,
  Lightbulb,
  Check,
  CameraOff,
} from "lucide-react";
 
const CATEGORIES = [
  "Introduction",
  "Why the UK?",
  "Which University & Why?",
  "Reasons for Choosing this Course",
  "Accommodation",
  "Working restrictions",
  "Financial Support",
  "Career Plan",
  "Extra Questions",
] as const;

type Category = (typeof CATEGORIES)[number];

type Question = { text: string; category: Category };

type Result = {
  text: string;
  category: Category;
  seconds: number;
  skipped: boolean;
};

const QUESTION_GROUPS: Record<Category, string[]> = {
  "Introduction": [
    "Describe yourself in three (3) words.",
    "How would you like to introduce yourself?",
  ],
  "Why the UK?": [
    "What do you think will be the three biggest benefits of studying and living in the UK?",
    "What factors influenced your decision to choose the UK as your study destination?",
    "How do you believe the UK education system will benefit your academic and professional goals?",
    "Why did you choose the UK for Further Education?",
    "What inspired you to study in the UK? Please give at least three reasons.",
    "How did you weigh the costs of studying in the UK against the potential benefits when making your decision?",
    "How will your studies in the UK benefit your career or further education?",
    "Do UK graduates have more advantages getting a job in your country? If yes, why?",
    "What aspects of British life and culture are you looking forward to experiencing as a student?",
    "How did the cost to study in the UK compare to other countries you considered?",
    "How did the reputation of UK universities influence your choice to study there?",
    "In what ways do you think studying in the UK will broaden your worldview?",
    "How popular is it to study in the UK in your country?",
    "Why is the cultural diversity in the UK important to your decision to study there?",
    "How did you evaluate the quality of education in the UK against other countries?",
    "What kind of student support services and facilities do you expect to find in the UK?",
    "Are there unique opportunities or resources in the UK that you think will help you develop and learn? What are your expectations for student life in the UK, and how do you think it differs from your home country?",
    "How did the reputation of UK universities influence your choice to study there? In what ways do you think studying in the UK will broaden your worldview?",
    "What are the top three challenges you anticipate facing while living in the UK? What are the top three benefits you see in studying and living in the UK?",
    "What factors could impact your decision to NOT pursue your education in the UK? What recent news about the UK have you heard?",
    "What was the most important factor from UK universities that influenced your decision to study there? How do you think studying in the UK will improve your personal development and cultural understanding? What events or experiences made you prefer the UK as a place to study?",
    "How do you believe the UK's education system will help your educational and career goals? What features of the UK's higher education system interest you the most?",
    "Can you give at least three reasons for choosing to study in the UK?",
    "List 3 advantages and disadvantages of studying in the UK and in your home country. Did anyone influence your decision to choose the UK?",
    "How do you think studying in the UK will affect your views on global issues or your home country? What parts of British culture or history are you especially keen to learn more about?",
    "What differences do you see between universities in the UK and those in your country? How do you believe studying in the UK will deepen your understanding of British culture?",
    "What aspects of British life and culture are you looking forward to experiencing as a student? How did the cost to study in the UK compare to other countries you considered?",
    "How have you prepared to adapt to the different culture and education system in the UK? What are the first three things you plan to do upon arriving in the UK?",
    "How did your previous school experiences influence your decision to study in the UK?",
  ],
  "Which University & Why?": [
    "What is the name of the university you have applied for and why have you chosen it?",
    "What is the full name of your university which you have chosen?",
    "What are some unique features or strengths of this university that attract you?",
    "How does this university's reputation and ranking influence your decision to study here?",
    "What factors led you to choose this specific university for your studies?",
    "What made you choose this university over others in the UK?",
    "What aspects of the university's campus and facilities do you find most appealing?",
    "How do you think studying at this university will help you achieve your long-term goals and aspirations?",
    "How did the university's location or campus environment affect your choice?",
    "How do you think the university's location and surrounding area will contribute to your overall study experience?",
    "Can you discuss the main reasons you prioritized this university over others?",
    "How do you plan to contribute your unique academic background and experiences to your chosen course and the university community?",
    "What specific skills or knowledge do you hope to gain from your studies at our university that will benefit your future career?",
    "What unique features or strengths of other universities caught your attention?",
    "Did the experiences of current or former students influence your decision to study at this university?",
    "What aspects of the universities you considered were appealing to you?",
    "How did you collect feedback from current students or alumni of other universities?",
    "What special resources, facilities, or services influenced your decision to apply to this university?",
    "How do the teaching style, faculty, and courses at this university align with your learning objectives?",
    "How does this university's teaching and learning approach match your academic preference?",
    "How did the reputation and ranking of other universities influence your decision?",
    "How did your friends, family, or academic advisors influence your decision to attend this university?",
    "How did the locations and campus environments of other universities influence your decision?",
    "Why did you choose this particular university for your studies?",
    "What networking, internship, or career opportunities does this university offer that appeal to you?",
    "How do you think your chosen university stands out from others offering similar courses?",
    "How did you research and compare universities before choosing this one?",
    "What about the university's history or reputation made you want to study there?",
    "How did the reputation and ranking of this university affect your choice to study here?",
    "How did you research and compare the universities you considered?",
    "What are the main reasons you prioritised this university over others?",
    "How did the location or campus environment of the university influence your choice?",
    "How did you consider the benefits and drawbacks of each university before making your final choice?",
    "Why did you choose this university over others in the UK?",
    "Which other universities did you consider before making your final decision, and why?",
    "Which parts of the university's campus and facilities appeal to you most?",
  ],
  "Reasons for Choosing this Course": [
    "Why do you want to study the course?",
    "What is your main objective in studying the course?",
    "Why did you choose this course over other programs related to your field?",
    "What do you hope to achieve academically and personally by the end of your chosen course?",
    "What aspects of your academic background are most relevant to your chosen course in the UK?",
    "What are the key topics you will learn in your course?",
    "What are some key skills you expect to develop throughout your course of study?",
    "How significant is collaboration with others in your course?",
    "What aspects of the curriculum and structure of your course appeal to you the most?",
    "How will you manage your time for classes, homework, and other responsibilities?",
    "How does your chosen course compare to similar courses at other institutions?",
    "What unique aspects of the course in the UK attracted you to study there?",
    "What are you most looking forward to learning in your course?",
    "Do you intend to join any extracurricular clubs or groups related to your studies?",
    "How have your past studies prepared you for your course at the university?",
    "What is the main focus of your course and what do you aim to achieve by studying it? How does your chosen course align with your previous studies and interests?",
    "How do you think your course will help you achieve your career goals?",
    "What are you most looking forward to learning in your course? What key skills do you expect to gain from your studies?",
    "What aspects of the curriculum and structure of your course appeal to you the most? How will you manage your time for classes, homework, and other responsibilities?",
  ],
  "Accommodation": [
    "Where will you stay? Describe your accommodation, rent, distance to the university, travel details, etc.",
    "What type of accommodation are you planning to live in while studying at the university?",
    "What steps have you taken to ensure your chosen accommodation is within your budget and can be financially managed during your studies?",
    "How do you plan to commute between your accommodation and the university campus or other important locations?",
    "Describe the accommodation you've chosen for your stay in the UK and explain why it suits your academic and personal needs.",
    "How did you research and compare different accommodation options before making your decision?",
    "What factors influenced your choice of accommodation, such as cost, location or amenities?",
    "How do you think your chosen accommodation will enhance your study experience and well-being?",
    "What are your plans for engaging with housemates or neighbours to create a supportive living environment in the UK?",
    "Did you consider living with roommates, and why did you choose or reject this option?",
    "How do you intend to create a comfortable living and study space in your accommodation?",
    "How do you plan to engage with fellow residents and build a community in your accommodation?",
    "Do you plan to live on-campus or off-campus and why?",
    "How will the location of your accommodation contribute to your academic success and well-being?",
    "What resources or advice did you seek when searching for accommodation?",
    "What safety features or measures did you consider when choosing your accommodation, and how do they meet your priorities as an international student?",
    "How did the availability of university-managed accommodation influence your decision?",
    "How will you balance your academic commitments with your responsibilities as a tenant?",
    "Did you consider alternatives like homestays or short-term rentals? What are your thoughts on these options?",
    "What safety and security measures were important to you in choosing your accommodation?",
    "What amenities or features, like private or shared facilities, were you looking for in your accommodation?",
    "What steps have you taken to make sure your chosen accommodation fits your budget during your studies?",
    "Describe the accommodation you've chosen for your stay in the UK and explain why it suits your needs.",
    "How did you research and compare various accommodation options?",
    "What advice would you offer to future students looking for accommodation at the university?",
    "How do you plan to adapt to living independently or with new roommates while at university?",
    "How do you plan to travel between your accommodation and the university or other key locations?",
    "What is your approach to finding accommodation and what challenges do you anticipate or have already faced?",
  ],
  "Working restrictions": [
    "Are you aware of the restrictions on working while studying in the UK on a student visa?",
    "Do you know how many hours you are allowed to work as a student in the UK?",
    "Can you explain the restrictions on working hours for international students in the UK under your visa type?",
    "How familiar are you with the rules and regulations related to working on a student visa in the UK?",
    "Are you familiar with the work rules for international students in the UK?",
  ],
  "Financial Support": [
    "Can you explain how you have saved or prepared financially for your studies in the UK, including any savings or family contributions?",
    "Have you researched the UKVI financial requirements for international students? If so, how have you ensured you meet these requirements?",
    "Have you researched the living costs near your university and how has this affected your budget?",
    "Discuss the primary sources of funding you will use to support your studies and living expenses.",
    "How do you plan to cover any unexpected expenses that may arise during your time at the university?",
    "How have you budgeted for your living expenses, including accommodation, transportation, food, and other day-to-day costs?",
    "How important was the overall cost of studying (tuition fees and living expenses) in your decision to pursue your chosen course and university?",
    "What financial advice would you offer to others who want to study at your university?",
    "How have you prepared financially for your studies in the UK, such as saving money or receiving family support?",
    "How do you plan to pay for your tuition and living costs in the UK?",
    "What's your course fee and who will support the payments?",
    "How will you save money and cut costs while studying?",
    "How will you manage your money and studies at the same time?",
    "What financial challenges do you expect and how will you address them?",
    "How have you planned your budget for housing, travel, food, and daily expenses?",
    "How will you deal with changes in currency exchange rates and living costs during your studies?",
    "How will you handle currency exchange rates and their effect on your budget while you study in the UK?",
    "How did you find and choose your funding options?",
    "Have you thought about the costs of travelling home during breaks, and how have you included these in your budget?",
    "How will you manage and spend your money wisely while studying?",
    "How has your family or others supported you financially for university?",
    "Do you have plans for unexpected financial emergencies in the UK?",
  ],
  "Career Plan": [
    "What are the 3 main jobs you can be offered in your country when completing this course?",
    "What are the good things about having a degree that's known all over the world, and how will this help your career?",
    "Are you planning to return to your home country, stay in the UK, or explore opportunities in other countries after graduating?",
    "Can you describe your short-term and long-term goals after completing your degree at our university?",
    "How do you think the knowledge gained from this course will contribute to your future career goals?",
    "What are your plans after completing your studies in the UK?",
    "How do you think your studies in the UK will contribute to your professional development and future career prospects?",
    "How could working in the UK provide you with skills useful for your future career?",
    "What is your dream job or ideal workplace after graduation?",
    "How important is getting work experience in the UK for your career goals?",
    "How will the knowledge from your course be applicable in your future job?",
    "How do you believe your course and university will contribute to your long-term job stability and financial security?",
    "What career do you aspire to, and how will your course help you achieve this?",
    "How will you transition from being a student to starting your career?",
    "How do you plan to use your university's career services to achieve your job objectives?",
    "How do you think studying abroad will distinguish you in the job market?",
    "What are the benefits of having an internationally recognised degree, and how will it help your career?",
    "Have you considered starting your own business? Why or why not?",
    "How will you stay updated with developments in your field after graduation?",
    "How do you plan to stay connected with your university friends after graduation?",
    "What are the industries or sectors you are interested in pursuing a career in after completing your studies?",
    "What are your expectations regarding the job market and employment opportunities in your chosen field after graduation?",
    "Are there any specific companies or locations where you would like to work after graduating?",
    "What types of jobs or industries interest you after graduation?",
    "What are the biggest challenges to achieving your career goals, and how will you overcome them?",
  ],
  "Extra Questions": [
    "What three items would you take to a desert island, and why?",
    "If you could be someone else for a day, who would it be and why?",
    "Do you have a plan for unexpected financial emergencies in the UK?",
    "When was your last education qualification completed and what have you been doing professionally since?",
    "Have you ever received a visa refusal? If so, please explain why?",
    "Do you have any known health conditions that may affect your ability to study with us?",
    "How do you believe your UK study experience will differ from studying in your home country?",
    "How have you used your teachers' advice to improve in school?",
    "Who is the teacher that has inspired you the most, and why?",
    "What are your expectations of the cultural differences between your home country and the UK?",
    "If you had the opportunity to create a new course or club at our university, what would it be and why?",
    "Are there any foods you are looking forward to trying in the UK? Why?",
    "How do you plan to stay connected with your family and friends back home while studying in the UK?",
    "What do you enjoy doing in your spare time?",
    "How do you typically handle homesickness, and what strategies do you plan to use to cope with it?",
    "What is the first career you dreamed of having as a kid?",
    "What can you tell me about the British weather?",
    "How have you maintained or improved your English language skills in preparation?",
    "What was your favourite subject in school and why?",
    "If you could only bring one item from your home country to share with your fellow students, what would it be and why?",
    "How do you plan to balance your studies and a part-time job?",
    "What are your strengths and weaknesses?",
    "Tell me about your birthplace.",
    "What are your suggestions to tourists who want to visit your country?",
    "Which are the places and foods tourists shouldn't miss if they visit your country?",
    "What's your main aim in life?",
    "Tell me about your family background.",
    "Describe your favourite food.",
    "Describe your favourite place.",
    "How is your country's weather?",
    "Can you name three famous tourist attractions in the UK?",
    "Which city in the UK are you most excited to visit and why?",
    "What three things do you think the UK is most famous for?",
    "How have your past academic achievements prepared you for studying at a UK university?",
    "What hobbies or interests do you have outside of your academic pursuits?",
    "Are you planning to bring any family members with you to the UK? If yes, please describe what they will be doing while you study.",
    "What is your favourite type of exercise and why do you prefer it?",
    "What is your favourite season and what do you like about it?",
    "What study methods have you found effective in school?",
    "Can you share a memorable travel experience or an interesting place you've visited and what you learned from it?",
    "Can you tell us about a time when you managed multiple responsibilities and still succeeded in school?",
    "What advice would you give to your 15-year-old self?",
    "If you could become an expert in any field instantly, what would it be?",
    "How do you plan to expand on what you've already learned in your new course?",
    "How do you think meeting students from various backgrounds will benefit you in the future?",
    "Can you share your experiences with group projects in your studies?",
    "What challenges have you faced in school and how did you handle them?",
    "Can you share a book, movie, or event that significantly influenced your perspective or worldview?",
    "How do you plan to use advice from teachers and classmates to improve in your studies?",
    "Have you ever changed your opinion about something you initially disliked?",
    "If you could have any exotic animal as a pet, what would you choose?",
    "If you could win an Olympic medal in any sport, real or imagined, which would it be and why?",
    "What personal and professional challenges do you anticipate facing after graduation?",
    "What challenges did you face in your past studies, and how did you overcome them?",
    "Are you planning to bring any family members with you to the UK, such as your spouse, partner, or child? If yes, please describe what they will be doing while you study.",
    "What soft skills do you think are crucial for success in your career?",
    "How will you manage your money in the UK, including opening a bank account and making a budget?",
    "If you didn't need to sleep, how would you use the extra time? What is a dream of yours that you haven't yet fulfilled?",
    "What advice would you give to future students who are considering multiple universities based on your experience?",
    "Why did you choose this course over others in the same subject?",
    "What is your favourite book and why do you like it?",
    "Do you have any relatives in the UK?",
    "How do you plan to use advice from teachers and classmates to improve in your studies? What do you hope to learn by the end of your course?",
    "If you had to eat the same meal every day, what would it be and why?",
    "What have you excelled at in school so far?",
    "How do you plan to continue learning and growing professionally after university?",
    "How do you stay updated on current events, and how do you think studying in the UK will broaden your understanding?",
    "How did the cost of studying, including tuition and living expenses, affect your decision to choose your university?",
    "How do you think working part-time could help you learn about UK culture?",
    "What are your major goals, and how will studying in the UK help you achieve them?",
    "Which aspects of your school history will be most useful for your course in the UK?",
    "What skills do you possess that would help you secure a part-time job in the UK?",
    "What is the best book you have read, and why did it stand out to you? What is the best film or TV series you've seen, and why is it your favourite? What is your favourite animal and why?",
    "What have you done to reduce your living costs in the UK, like finding affordable housing and transport or budgeting for groceries?",
    "How have you improved your English for studying in the UK?",
    "What advice would you give to other international students planning to work while studying in the UK?",
    "How do you plan to use your university contacts to support your career after graduation?",
    "Are you planning to work in the UK, and if so, what job?",
    "How do you plan to manage your time and stay organised to succeed in both your studies and job in the UK?",
    "Describe any group projects you have worked on and how they will help you in your studies in the UK.",
    "What is the best advice you have ever received?",
    "What challenges did you face when narrowing down your options and making your final decision?",
    "What are the advantages and disadvantages of taking a gap year after university before starting work?",
    "What are the 3 main jobs you can be offered in your country when completing this course? How do you plan to stay engaged and focused throughout your course?",
    "Describe any group projects you have worked on and how they will help you in your studies in the UK.",
    "How have your teachers or lecturers influenced your academic and career plans?",
    "What challenges do you anticipate from working and studying at the same time in the UK?",
    "What are three things you think the UK is famous for? What are three famous tourist attractions in the UK? What UK foods are you excited to try and why?",
    "How will you change your current study habits to succeed in your course at university?",
    "Do you have friends who are like family to you?",
    "Can you summarise your educational background and the subjects you studied, including how well you did?",
    "What have you researched about part-time jobs and related rules in the UK?",
    "How will you stay informed about changes in your industry's job market?",
    "What advice would you give to your 15-year-old self based on what you know now? If you could become an expert in any field instantly, what would it be?",
    "How do you plan to use your time in the UK for both academic and personal growth? What types of food do you like, and are there any British dishes you are eager to try? What places in the UK do you plan to visit during breaks, and why do they interest you?",
    "Are you looking to get a part-time job while studying in the UK?",
    "How did the costs of tuition and living influence your choice of course and university?",
    "Are there any role models who have inspired your career choices?",
    "There might be only 2 days in a week to attend your classes; how do you plan to spend the rest of the days when you are free?",
    "If you could be someone famous for a day, who would it be and why? How do you like to spend a day off?",
    "What song makes you want to dance every time you hear it? How would you like to celebrate your birthday?",
    "What strategies do you have for finding a job and networking in your field after graduation?",
    "How did your friends, family, or academic advisors influence your decision when considering different universities?",
    "What qualities do you look for in people you spend time with? Describe your ideal day.",
  ],
};

const QUESTIONS: Question[] = CATEGORIES.flatMap((category) =>
  QUESTION_GROUPS[category].map((text) => ({ text, category }))
);
 
const THINK_OPTIONS = [10, 15, 20, 30];
 
const TIPS = [
  "Take a breath. Outline 2–3 key points before you start.",
  "Answer the question directly first, then add a personal reason.",
  "Use a real example or number where you can — it sounds credible.",
  "Keep it natural and conversational, not memorised.",
];
 
function formatTime(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Module-scope helpers keep impure randomness out of the component render path
// (required by the React Compiler purity rules).
function shuffled<T>(arr: T[]): T[] {
  const list = [...arr];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function randomTip() {
  return TIPS[Math.floor(Math.random() * TIPS.length)];
}
 
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
 
.cas-root * { box-sizing: border-box; }
.cas-root {
  --paper:#FAF6EF; --paper-2:#F1E9DC; --card:#FFFDF9;
  --ink:#221C15; --ink-soft:#5B5247; --ink-faint:#8C8275; --line:#E7DDCD;
  --accent:#15635B; --accent-deep:#0E4A43; --accent-soft:#DCEAE6;
  --warn:#BC4E2C; --warn-soft:#F4E1D7;
  font-family:'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif;
  color:var(--ink);
  min-height:100%; width:100%;
  display:flex; align-items:center; justify-content:center;
  padding:28px 16px; position:relative; -webkit-font-smoothing:antialiased;
  background:
    radial-gradient(60% 55% at 12% -5%, rgba(21,99,91,0.08), transparent 65%),
    radial-gradient(55% 55% at 105% 105%, rgba(188,78,44,0.07), transparent 65%),
    var(--paper);
}
.cas-root::before{
  content:""; position:absolute; inset:0; pointer-events:none; opacity:0.45; mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
}
.cas-card{
  position:relative; z-index:1; width:100%; max-width:680px;
  background:var(--card); border:1px solid var(--line); border-radius:22px; padding:30px;
  box-shadow:0 1px 0 rgba(255,255,255,0.8) inset, 0 22px 48px -28px rgba(34,28,21,0.4), 0 5px 14px -10px rgba(34,28,21,0.22);
}
@media (min-width:640px){ .cas-card{ padding:42px; } }
 
.eyebrow{ font-size:11.5px; letter-spacing:0.2em; text-transform:uppercase; color:var(--accent-deep); font-weight:700; }
.display{ font-family:'Fraunces', Georgia, serif; font-weight:600; line-height:1.07; letter-spacing:-0.015em; }
.qtext{ font-family:'Fraunces', Georgia, serif; font-weight:500; line-height:1.2; letter-spacing:-0.01em; }
.mono{ font-family:'JetBrains Mono', ui-monospace, monospace; font-variant-numeric:tabular-nums; }
.muted{ color:var(--ink-soft); }
.faint{ color:var(--ink-faint); }
 
.btn{ font-family:inherit; font-weight:600; font-size:15px; border:none; cursor:pointer; border-radius:999px;
  padding:13px 24px; display:inline-flex; align-items:center; justify-content:center; gap:8px;
  transition:transform .12s ease, background .18s ease, box-shadow .18s ease, color .18s ease; }
.btn:active{ transform:translateY(1px) scale(0.992); }
.btn-primary{ background:var(--accent); color:#FBFCF9; box-shadow:0 9px 20px -11px rgba(21,99,91,0.85); }
.btn-primary:hover{ background:var(--accent-deep); }
.btn-ghost{ background:transparent; color:var(--ink-soft); box-shadow:inset 0 0 0 1.5px var(--line); }
.btn-ghost:hover{ color:var(--ink); box-shadow:inset 0 0 0 1.5px var(--ink-faint); background:rgba(0,0,0,0.018); }
.btn-lg{ padding:16px 30px; font-size:16px; }
.btn-block{ width:100%; }
 
.icon-btn{ width:40px; height:40px; border-radius:999px; display:inline-flex; align-items:center; justify-content:center;
  background:transparent; border:none; cursor:pointer; color:var(--ink-soft); transition:background .15s ease, color .15s ease; }
.icon-btn:hover{ background:rgba(0,0,0,0.05); color:var(--ink); }
 
.seg{ display:inline-flex; background:var(--paper-2); border:1px solid var(--line); border-radius:999px; padding:4px; gap:2px; flex-wrap:wrap; }
.seg-item{ font-family:inherit; font-size:14px; font-weight:600; border:none; background:transparent; color:var(--ink-soft);
  padding:9px 15px; border-radius:999px; cursor:pointer; transition:all .15s ease; white-space:nowrap; }
.seg-item:hover{ color:var(--ink); }
.seg-item.active{ background:var(--card); color:var(--ink); box-shadow:0 1px 3px rgba(34,28,21,0.14); }
.seg-count{ font-weight:500; opacity:.6; }
 
.badge{ display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:700; letter-spacing:0.09em;
  text-transform:uppercase; padding:5px 11px; border-radius:999px; }
.badge-high{ background:var(--warn-soft); color:var(--warn); }
.badge-normal{ background:var(--accent-soft); color:var(--accent-deep); }
.dot{ width:7px; height:7px; border-radius:999px; display:inline-block; }
 
.track{ height:5px; border-radius:999px; background:var(--paper-2); overflow:hidden; }
.track-fill{ height:100%; background:var(--accent); border-radius:999px; transition:width .45s ease; }
 
.stat{ background:var(--paper-2); border:1px solid var(--line); border-radius:15px; padding:16px 12px; text-align:center; }
.stat-num{ font-family:'Fraunces', serif; font-weight:600; font-size:26px; line-height:1; }
.stat-label{ font-size:12px; color:var(--ink-faint); margin-top:7px; }
 
.rev-row{ display:flex; align-items:center; gap:12px; padding:12px 2px; border-bottom:1px solid var(--line); }
.rev-row:last-child{ border-bottom:none; }
 
.pill{ display:inline-flex; align-items:center; gap:6px; font-size:12.5px; font-weight:600; color:var(--warn);
  background:var(--warn-soft); padding:6px 12px; border-radius:999px; }
 
@keyframes riseIn{ from{ opacity:0; transform:translateY(12px);} to{ opacity:1; transform:none; } }
.rise{ animation:riseIn .5s cubic-bezier(.2,.75,.2,1) both; }
@keyframes pulseDot{ 0%,100%{ transform:scale(1); opacity:1;} 50%{ transform:scale(1.55); opacity:.4;} }
.rec-dot{ width:10px; height:10px; border-radius:999px; background:var(--warn); animation:pulseDot 1.4s ease-in-out infinite; }

.cam-wrap{ position:relative; width:100%; aspect-ratio:16/9; border-radius:16px; overflow:hidden;
  background:#15120d; border:1px solid var(--line); box-shadow:0 12px 30px -20px rgba(34,28,21,0.55); }
.cam-video{ width:100%; height:100%; object-fit:cover; transform:scaleX(-1); display:block; background:#15120d; }
.cam-fallback{ position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center;
  gap:9px; color:#C9BFB0; font-size:13.5px; text-align:center; padding:0 26px; line-height:1.4; }
.cam-rec{ position:absolute; top:11px; left:11px; display:inline-flex; align-items:center; gap:7px;
  background:rgba(0,0,0,0.5); color:#fff; font-size:11px; font-weight:700; letter-spacing:0.13em;
  padding:5px 11px; border-radius:999px; -webkit-backdrop-filter:blur(4px); backdrop-filter:blur(4px); }
.cam-self{ position:absolute; bottom:11px; left:11px; background:rgba(0,0,0,0.46); color:#fff;
  font-size:11px; font-weight:600; padding:4px 10px; border-radius:8px;
  -webkit-backdrop-filter:blur(4px); backdrop-filter:blur(4px); }
`;

function App() {
  const [screen, setScreen] = useState<"setup" | "interview" | "done">("setup");
  const [setFilter, setSetFilter] = useState<"all" | Category>("all");
  const [shuffle, setShuffle] = useState(false);
  const [thinkSeconds, setThinkSeconds] = useState(15);
  const [soundOn, setSoundOn] = useState(true);

  const [queue, setQueue] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"thinking" | "answering">("thinking");
  const [thinkLeft, setThinkLeft] = useState(15);
  const [answerElapsed, setAnswerElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [tip, setTip] = useState(TIPS[0]);

  const audioRef = useRef<AudioContext | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);

  function initAudio() {
    try {
      if (!audioRef.current) {
        const Ctx =
          window.AudioContext ||
          (window as typeof window & { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (Ctx) audioRef.current = new Ctx();
      }
      if (audioRef.current && audioRef.current.state === "suspended") {
        audioRef.current.resume();
      }
    } catch {
      /* audio optional */
    }
  }

  function beep(freq: number, duration: number, volume: number) {
    if (!soundOn) return;
    try {
      const ctx = audioRef.current;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration / 1000);
      osc.start(now);
      osc.stop(now + duration / 1000 + 0.02);
    } catch {
      /* ignore */
    }
  }

  // Run the webcam only while the interview is on screen, and tear it down on
  // setup/done so the camera light goes off when practice ends. The async work
  // lives in an inner IIFE so the setState calls happen after `await` (off the
  // synchronous effect path) rather than triggering cascading renders.
  useEffect(() => {
    function teardown() {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    }
    if (screen !== "interview") {
      teardown();
      return;
    }
    let cancelled = false;
    (async () => {
      if (streamRef.current) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        setCameraError(false);
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        if (!cancelled) setCameraError(true);
      }
    })();
    return () => {
      cancelled = true;
      teardown();
    };
  }, [screen]);

  // Re-attach the live stream whenever the <video> remounts (e.g. on "Practice again").
  useEffect(() => {
    if (screen === "interview" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [screen, cameraError]);

  function buildQueue() {
    const list = QUESTIONS.filter((q) =>
      setFilter === "all" ? true : q.category === setFilter
    );
    return shuffle ? shuffled(list) : list;
  }
 
  function startInterview() {
    const list = buildQueue();
    if (list.length === 0) return;
    initAudio();
    setQueue(list);
    setIndex(0);
    setPhase("thinking");
    setThinkLeft(thinkSeconds);
    setAnswerElapsed(0);
    setPaused(false);
    setResults([]);
    setTip(randomTip());
    setScreen("interview");
  }
 
  function startAnswering() {
    setPhase("answering");
    setThinkLeft(0);
    beep(760, 230, 0.08);
  }
 
  function goNext() {
    setResults((r) => [
      ...r,
      {
        text: queue[index].text,
        category: queue[index].category,
        seconds: phase === "answering" ? answerElapsed : 0,
        skipped: phase === "thinking",
      },
    ]);
    if (index + 1 >= queue.length) {
      setScreen("done");
    } else {
      setIndex((i) => i + 1);
      setPhase("thinking");
      setThinkLeft(thinkSeconds);
      setAnswerElapsed(0);
      setPaused(false);
      setTip(randomTip());
    }
  }
 
  function endSession() {
    setScreen("done");
  }
 
  // main tick — counts the thinking countdown down and the answer timer up, and
  // transitions thinking -> answering the moment the countdown runs out. The state
  // updates live in the timeout callback (not the effect body), so they don't trigger
  // cascading renders.
  useEffect(() => {
    if (screen !== "interview" || paused) return;
    if (phase === "thinking") {
      const id = setTimeout(() => {
        if (thinkLeft <= 1) {
          setThinkLeft(0);
          setPhase("answering");
          beep(760, 230, 0.08);
        } else {
          setThinkLeft(thinkLeft - 1);
        }
      }, 1000);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setAnswerElapsed(answerElapsed + 1), 1000);
    return () => clearTimeout(id);
  }, [screen, paused, phase, thinkLeft, answerElapsed]); // eslint-disable-line react-hooks/exhaustive-deps
 
  // soft countdown ticks in the last 3 seconds
  useEffect(() => {
    if (
      screen === "interview" &&
      phase === "thinking" &&
      !paused &&
      thinkLeft > 0 &&
      thinkLeft <= 3
    ) {
      beep(430, 95, 0.05);
    }
  }, [thinkLeft, phase, screen, paused]); // eslint-disable-line
 
  /* ---------------- SETUP ---------------- */
  function renderSetup() {
    // Count only — avoid calling buildQueue() here, since shuffling during render
    // would re-randomise on every keystroke (and violates render purity).
    const total = QUESTIONS.filter((q) =>
      setFilter === "all" ? true : q.category === setFilter
    ).length;
    return (
      <div className="cas-card rise">
        <div className="eyebrow">Pre-CAS · UK Student Visa</div>
        <h1 className="display" style={{ fontSize: 36, marginTop: 10 }}>
          Credibility Interview Practice
        </h1>
        <p className="muted" style={{ marginTop: 12, fontSize: 16, lineHeight: 1.5, maxWidth: 520 }}>
          You get a few seconds to plan, then answer out loud as if you're in the real
          interview. End any question whenever you're done and move to the next.
        </p>
 
        <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 22 }}>
          <div>
            <div className="faint" style={{ fontSize: 13, fontWeight: 600, marginBottom: 9 }}>
              Which questions?
            </div>
            <div className="seg">
              <button className={`seg-item ${setFilter === "all" ? "active" : ""}`} onClick={() => setSetFilter("all")}>
                All <span className="seg-count">{QUESTIONS.length}</span>
              </button>
              {CATEGORIES.map((c) => (
                <button key={c} className={`seg-item ${setFilter === c ? "active" : ""}`} onClick={() => setSetFilter(c)}>
                  {c} <span className="seg-count">{QUESTION_GROUPS[c].length}</span>
                </button>
              ))}
            </div>
          </div>
 
          <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
            <div>
              <div className="faint" style={{ fontSize: 13, fontWeight: 600, marginBottom: 9 }}>
                Thinking time
              </div>
              <div className="seg">
                {THINK_OPTIONS.map((s) => (
                  <button key={s} className={`seg-item ${thinkSeconds === s ? "active" : ""}`} onClick={() => setThinkSeconds(s)}>
                    {s}s
                  </button>
                ))}
              </div>
            </div>
 
            <div>
              <div className="faint" style={{ fontSize: 13, fontWeight: 600, marginBottom: 9 }}>
                Order
              </div>
              <div className="seg">
                <button className={`seg-item ${!shuffle ? "active" : ""}`} onClick={() => setShuffle(false)}>
                  As listed
                </button>
                <button className={`seg-item ${shuffle ? "active" : ""}`} onClick={() => setShuffle(true)}>
                  Shuffle
                </button>
              </div>
            </div>
          </div>
 
          <button className="icon-btn" onClick={() => setSoundOn((v) => !v)} style={{ width: "auto", padding: "8px 12px", gap: 8, alignSelf: "flex-start", fontSize: 14, fontWeight: 600, color: "var(--ink-soft)" }}>
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            Sound cues {soundOn ? "on" : "off"}
          </button>
        </div>
 
        <button className="btn btn-primary btn-lg btn-block" style={{ marginTop: 30 }} onClick={startInterview}>
          <Play size={19} fill="currentColor" /> Begin practice · {total} question{total === 1 ? "" : "s"}
        </button>
      </div>
    );
  }
 
  /* ---------------- INTERVIEW ---------------- */
  function renderInterview() {
    const q = queue[index];
    const progress = ((index) / queue.length) * 100;
 
    const R = 56;
    const CIRC = 2 * Math.PI * R;
    const frac = thinkSeconds > 0 ? thinkLeft / thinkSeconds : 0;
    const dashoffset = CIRC * (1 - frac);
    const ringColor = thinkLeft <= 3 ? "var(--warn)" : "var(--accent)";
    const ringTransition = thinkLeft >= thinkSeconds ? "none" : "stroke-dashoffset 1s linear, stroke .3s ease";
 
    return (
      <div className="cas-card">
        {/* top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="mono faint" style={{ fontSize: 13, fontWeight: 700 }}>
              {String(index + 1).padStart(2, "0")} / {String(queue.length).padStart(2, "0")}
            </span>
            <span className="badge badge-normal">
              <span className="dot" style={{ background: "var(--accent)" }} />
              {q.category}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <button className="icon-btn" title={soundOn ? "Mute" : "Unmute"} onClick={() => setSoundOn((v) => !v)}>
              {soundOn ? <Volume2 size={19} /> : <VolumeX size={19} />}
            </button>
            <button className="icon-btn" title={paused ? "Resume" : "Pause"} onClick={() => setPaused((p) => !p)}>
              {paused ? <Play size={19} /> : <Pause size={19} />}
            </button>
            <button className="icon-btn" title="End session" onClick={endSession}>
              <X size={20} />
            </button>
          </div>
        </div>
 
        <div className="track" style={{ marginTop: 16 }}>
          <div className="track-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* camera self-view */}
        <div className="cam-wrap" style={{ marginTop: 18 }}>
          <video
            ref={videoRef}
            className="cam-video"
            autoPlay
            muted
            playsInline
            style={{ visibility: cameraError ? "hidden" : "visible" }}
          />
          {cameraError && (
            <div className="cam-fallback">
              <CameraOff size={22} />
              Camera unavailable — allow camera access to see yourself, as you would in the real interview.
            </div>
          )}
          {!cameraError && phase === "answering" && !paused && (
            <div className="cam-rec">
              <span className="rec-dot" /> REC
            </div>
          )}
          {!cameraError && <div className="cam-self">You</div>}
        </div>

        {/* question */}
        <div key={index} className="rise" style={{ marginTop: 30, minHeight: 96 }}>
          <h2 className="qtext" style={{ fontSize: 27 }}>{q.text}</h2>
        </div>
 
        {/* timer zone */}
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          {phase === "thinking" ? (
            <>
              <div style={{ position: "relative", width: 148, height: 148 }}>
                <svg width="148" height="148" viewBox="0 0 148 148">
                  <circle cx="74" cy="74" r={R} fill="none" stroke="var(--paper-2)" strokeWidth="9" />
                  <circle
                    cx="74" cy="74" r={R} fill="none" stroke={ringColor} strokeWidth="9" strokeLinecap="round"
                    strokeDasharray={CIRC} strokeDashoffset={dashoffset}
                    transform="rotate(-90 74 74)" style={{ transition: ringTransition }}
                  />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span className="mono" style={{ fontSize: 44, fontWeight: 700, color: thinkLeft <= 3 ? "var(--warn)" : "var(--ink)", lineHeight: 1 }}>
                    {thinkLeft}
                  </span>
                  <span className="faint" style={{ fontSize: 12, marginTop: 2 }}>seconds</span>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{paused ? "Paused" : "Thinking time"}</div>
                <div className="muted" style={{ fontSize: 14, marginTop: 6, display: "inline-flex", alignItems: "center", gap: 7, maxWidth: 440 }}>
                  <Lightbulb size={15} style={{ color: "var(--accent)", flexShrink: 0 }} /> {tip}
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {!paused && <span className="rec-dot" />}
                <span className="mono" style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-0.02em" }}>
                  {formatTime(answerElapsed)}
                </span>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 15, display: "inline-flex", alignItems: "center", gap: 7 }}>
                  <Mic size={16} style={{ color: "var(--warn)" }} /> {paused ? "Paused" : "Answering — speak aloud"}
                </div>
                <div className="muted" style={{ fontSize: 14, marginTop: 6 }}>
                  Press <strong>Next question</strong> when you've finished your answer.
                </div>
              </div>
            </>
          )}
        </div>
 
        {/* controls */}
        <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
          {phase === "thinking" ? (
            <>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={startAnswering}>
                <Mic size={18} /> Start answering
              </button>
              <button className="btn btn-ghost" onClick={goNext}>
                <SkipForward size={17} /> Skip
              </button>
            </>
          ) : (
            <button className="btn btn-primary btn-block" onClick={goNext}>
              {index + 1 >= queue.length ? <Check size={18} /> : <ArrowRight size={18} />}
              {index + 1 >= queue.length ? "Finish session" : "Next question"}
            </button>
          )}
        </div>
      </div>
    );
  }
 
  /* ---------------- DONE ---------------- */
  function renderDone() {
    const answered = results.filter((r) => !r.skipped);
    const totalSeconds = answered.reduce((acc, r) => acc + r.seconds, 0);
    const avg = answered.length ? Math.round(totalSeconds / answered.length) : 0;
 
    return (
      <div className="cas-card rise">
        <div className="eyebrow">Session complete</div>
        <h1 className="display" style={{ fontSize: 32, marginTop: 10 }}>Nicely done.</h1>
        <p className="muted" style={{ marginTop: 10, fontSize: 15.5 }}>
          Here's how this round went. The more you rehearse aloud, the more natural these answers become.
        </p>
 
        <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <div className="stat">
            <div className="stat-num">{answered.length}</div>
            <div className="stat-label">Answered</div>
          </div>
          <div className="stat">
            <div className="stat-num mono">{formatTime(totalSeconds)}</div>
            <div className="stat-label">Total speaking</div>
          </div>
          <div className="stat">
            <div className="stat-num mono">{formatTime(avg)}</div>
            <div className="stat-label">Avg / answer</div>
          </div>
        </div>
 
        {results.length > 0 && (
          <div style={{ marginTop: 26 }}>
            <div className="faint" style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Review</div>
            <div style={{ maxHeight: 260, overflowY: "auto", marginRight: -6, paddingRight: 6 }}>
              {results.map((r, i) => (
                <div className="rev-row" key={i}>
                  <span className="dot" style={{ flexShrink: 0, background: "var(--accent)" }} />
                  <span style={{ flex: 1, fontSize: 14.5, lineHeight: 1.35 }}>{r.text}</span>
                  <span className="mono faint" style={{ fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                    {r.skipped ? "skipped" : formatTime(r.seconds)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
 
        <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn btn-primary" style={{ flex: 1, minWidth: 200 }} onClick={startInterview}>
            <RefreshCw size={18} /> Practice this set again
          </button>
          <button className="btn btn-ghost" onClick={() => setScreen("setup")}>
            <RotateCcw size={17} /> Change settings
          </button>
        </div>
      </div>
    );
  }
 
  return (
    <div className="cas-root">
      <style>{STYLES}</style>
      {screen === "setup" && renderSetup()}
      {screen === "interview" && renderInterview()}
      {screen === "done" && renderDone()}
    </div>
  );
}

export default App
