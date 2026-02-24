import Antro from "./Antro";
import Civics from "./Civics";
import Emerging from "./Emerging";
import Eng1 from "./Eng1";
import Eng2 from "./Eng2";
import Entren from "./Entren";
import Geography from "./Geography";
import Global from "./Global";
import History from "./History";
import Inclusive from "./Inclusive";
import Logic from "./Logic";
import MathNatural from "./Math-natural";
import MathSocial from "./Math-social";
import Physics from "./Physics";
import Psycho from "./Psycho";

const courses = [
  { name: "Maths for Social Science",  path: "/maths-social",    key: "MathsSocial", component: MathSocial ,stream: "social"},
  { name: "Maths for Natural Science", path: "/maths-natural",   key: "MathsNatural", component: MathNatural ,stream: "natural"},
  { name: "Physics",                   path: "/physics",         key: "Physics", component: Physics ,stream: "natural" },
  { name: "Anthropology",              path: "/anthropology",    key: "Anthropology", component: Antro ,stream:"both" },
  { name: "Geography",                 path: "/geography",       key: "Geography", component: Geography ,stream:"both" },
  { name: "History",                   path: "/history",         key: "History", component: History, stream:"both" },
  { name: "Communication English I",   path: "/english1",        key: "English1", component: Eng1 ,stream:"both"},
  { name: "Communication English II",  path: "/english2",        key: "English2", component: Eng2 ,stream:"both"},
  { name: "Civic and Moral Education", path: "/civics",          key: "CivicMoralEducation", component: Civics ,stream:"both" },
  { name: "Global Trend",              path: "/global-trend",    key: "GlobalTrend", component: Global ,stream:"both" },
  { name: "Inclusive",                 path: "/inclusive",       key: "Inclusive", component: Inclusive ,stream:"both" },
  { name: "General Psychology",        path: "/psychology",      key: "GeneralPsychology", component: Psycho ,stream:"both" },
  { name: "Emerging Technologies",     path: "/emerging-technologies",         key: "EmergingTechnologies", component: Emerging ,stream:"both" },
  { name: "Logic and Critical Thinking",                path: "/logic",        key: "LogicCriticalThinking", component: Logic, stream:"both" },
  { name: "Entrepreneurship",          path: "/entrepreneurship",key: "Entrepreneurship", component: Entren ,stream:"both" },
];

export default courses;