import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { routeTitles, routeDescription, normalizePath, isIndexableRoute, fragmentTarget } from '@/pages/public/routeMeta';

export function RouteMetadata() {
  const location = useLocation();
  const pathname = normalizePath(location.pathname);
  const hash = location.hash;
  useEffect(() => {
    if (!hash) { window.scrollTo({ top: 0, behavior: 'instant' }); return; }
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(fragmentTarget(hash));
      target?.scrollIntoView();
      if (target?.id === 'main-content') target.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  const title = routeTitles[pathname] ?? (pathname.startsWith('/review/') ? 'Design review' : pathname.startsWith('/admin') ? 'Admin' : pathname.startsWith('/sign/') ? 'Contract signing' : pathname.startsWith('/case-studies/') ? 'Case studies under review' : pathname.startsWith('/blog/') ? 'Article under review' : 'Page not found');
  const description = routeDescription(pathname);
  const privateRoute = /^\/(admin|sign|review)(\/|$)/.test(pathname);
  return <Helmet>
    <title>{title} | MerkadAgency</title>
    <meta name="description" content={description}/>
    <link rel="canonical" href={`https://merkadagency.com${pathname}`}/>
    <meta name="robots" content={privateRoute ? 'noindex, nofollow' : isIndexableRoute(pathname) ? 'index, follow' : 'noindex, follow'}/>
    <meta name="twitter:title" content={`${title} | MerkadAgency`}/>
    <meta name="twitter:description" content={description}/>
    <meta property="og:title" content={`${title} | MerkadAgency`}/>
    <meta property="og:description" content={description}/>
    <meta property="og:url" content={`https://merkadagency.com${pathname}`}/>
  </Helmet>;
}
