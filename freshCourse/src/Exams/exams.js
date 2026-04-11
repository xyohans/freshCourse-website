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
  { name: "Maths for Social Science",  path_mid: "/maths-social-mid",  path_final: "/maths-social-final",    key: "MathsSocial", component: MathSocial ,stream: "social"},
  { name: "Maths for Natural Science", path_mid: "/maths-natural-mid", path_final: "/maths-natural-final",   key: "MathsNatural", component: MathNatural ,stream: "natural"},
  { name: "Physics",                   path_mid: "/physics-mid",       path_final: "/physics-final",         key: "Physics", component: Physics ,stream: "natural" },
  { name: "Anthropology",              path_mid: "/anthropology-mid",  path_final: "/anthropology-final",    key: "Anthropology", component: Antro ,stream:"both" },
  { name: "Geography",                 path_mid: "/geography-mid",     path_final: "/geography-final",       key: "Geography", component: Geography ,stream:"both" },
  { name: "History",                   path_mid: "/history-mid",       path_final: "/history-final",         key: "History", component: History, stream:"both" },
  { name: "Communication English I",   path_mid: "/english1-mid",      path_final: "/english1-final",        key: "English1", component: Eng1 ,stream:"both"},
  { name: "Communication English II",  path_mid: "/english2-mid",      path_final: "/english2-final",        key: "English2", component: Eng2 ,stream:"both"},
  { name: "Civic and Moral Education", path_mid: "/civics-mid",        path_final: "/civics-final",          key: "CivicMoralEducation", component: Civics ,stream:"both" },
  { name: "Global Trend",              path_mid: "/global-trend-mid",  path_final: "/global-trend-final",    key: "GlobalTrend", component: Global ,stream:"both" },
  { name: "Inclusive",                 path_mid: "/inclusive-mid",     path_final: "/inclusive-final",       key: "Inclusive", component: Inclusive ,stream:"both" },
  { name: "General Psychology",        path_mid: "/psychology-mid",    path_final: "/psychology-final",      key: "GeneralPsychology", component: Psycho ,stream:"both" },
  { name: "Emerging Technologies",     path_mid: "/emerging-mid",      path_final: "/emerging-final",         key: "EmergingTechnologies", component: Emerging ,stream:"both" },
  { name: "Logic and Critical Thinking",  path_mid: "/logic-mid",      path_final: "/logic-final",        key: "LogicCriticalThinking", component: Logic, stream:"both" },
  { name: "Entrepreneurship",          path_mid: "/entrepreneurship-mid", path_final: "/entrepreneurship-final",key: "Entrepreneurship", component: Entren ,stream:"both" },
];

export default courses;