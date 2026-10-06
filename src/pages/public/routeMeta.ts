import titles from "./route-titles.json";
import reviewOnlyRoutes from "./review-only-routes.json";
import { availability } from "@/components/brand/brandContent";
export const routeTitles: Record<string, string> = titles;
export const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";
export const isIndexableRoute = (path: string) => !!routeTitles[normalizePath(path)] && !reviewOnlyRoutes.includes(normalizePath(path));
export const defaultDescription = `We build websites, connect your CRM, and design AI-assisted workflows around how your team works. ${availability}`;
export const routeDescription=(path:string)=>path==='/contact'||path==='/resources/free-audit'?'Tell us about your website, your tools and the work your team needs help with. Online intake availability is shown before submission.':path.startsWith('/legal')?`${routeTitles[path]} for the MerkadAgency website.`:path.includes('case-studies')||path==='/results'||path==='/portfolio'?'Project evidence and client permissions are under review. No outcome figures are presented as verified results.':defaultDescription;

export function fragmentTarget(hash: string) {
  try { return decodeURIComponent(hash.slice(1)); }
  catch { return hash.slice(1); }
}
