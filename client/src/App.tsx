import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import ProductsPage from "@/pages/products";
import ProductDetailPage from "@/pages/product-detail";
import AITechnologyPage from "@/pages/ai-technology";
import AnalyticsPage from "@/pages/analytics";
import OurStoryPage from "@/pages/our-story";
import RoboticsPage from "@/pages/robotics";
import NotFound from "@/pages/not-found";
import GetIdeasPage from "@/pages/get-ideas";
import PersonalisedMerchPage from "@/pages/personalised-merch";
import ExperientialMarketingPage from "@/pages/experiential-marketing";
import ContactUsPage from "@/pages/contact-us";
import GamificationsPage from "@/pages/gamifications";
import TailoredSoftwareSolutionsPage from "@/pages/tailored-software-solutions";
import AdminLoginPage from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin";
import AdminLeadsPage from "@/pages/admin/leads";
import AdminSeoPage from "@/pages/admin/seo";
import AdminArticlesPage from "@/pages/admin/articles";
import AdminArticleEditPage from "@/pages/admin/article-edit";
import AdminSettingsPage from "@/pages/admin/settings";
import AdminMediaPage from "@/pages/admin/media";
import AdminPagesList from "@/pages/admin/pages";
import AdminPageEdit from "@/pages/admin/page-edit";
import TermsPage from "@/pages/terms";
import PrivacyPage from "@/pages/privacy";
import AiEffectsGallery from "@/pages/ai-effects";
import CreativeResultsPage from "@/pages/creative-results";
import VideoHubPage from "@/pages/video-hub";
import GalleryPage from "@/pages/gallery";
import InsightsPage from "@/pages/insights";
import InsightArticlePage from "@/pages/insights-article";
import CareersPage from "@/pages/careers";
import AssistantPage from "@/pages/assistant";
import ScrollToTop from "@/components/scroll-to-top";
import PageTransition from "@/components/page-transition";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from 'react';
import { captureUtmFromUrl } from "@/lib/utm";
import { loadGA, trackPageView } from "@/lib/ga";
import { publicApi } from "@/lib/publicApi";
import { initGTM, gtmEvent } from "@/lib/gtm";

function Router() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Switch>
        <Route path="/">
          <PageTransition key={location} type="scale-blur">
            <Home />
          </PageTransition>
        </Route>
        <Route path="/assistant">
          <PageTransition key={location} type="scale-blur">
            <AssistantPage />
          </PageTransition>
        </Route>
        <Route path="/careers">
          <PageTransition key={location} type="scale-blur">
            <CareersPage />
          </PageTransition>
        </Route>
        <Route path="/gamifications">
          <PageTransition key={location} type="scale-blur">
            <GamificationsPage />
          </PageTransition>
        </Route>
        <Route path="/experiential-marketing">
          <PageTransition key={location} type="scale-blur">
            <ExperientialMarketingPage />
          </PageTransition>
        </Route>
        <Route path="/products">
          <PageTransition key={location} type="scale-blur">
            <ProductsPage />
          </PageTransition>
        </Route>
        <Route path="/products/:id">
          <PageTransition key={location} type="scale-blur">
            <ProductDetailPage />
          </PageTransition>
        </Route>
        <Route path="/analytics">
          <PageTransition key={location} type="scale-blur">
            <AnalyticsPage />
          </PageTransition>
        </Route>
        <Route path="/ai-technology">
          <PageTransition key={location} type="scale-blur">
            <AITechnologyPage />
          </PageTransition>
        </Route>
        <Route path="/our-story">
          <PageTransition key={location} type="scale-blur">
            <OurStoryPage />
          </PageTransition>
        </Route>
        <Route path="/robotics">
          <PageTransition key={location} type="scale-blur">
            <RoboticsPage />
          </PageTransition>
        </Route>
        <Route path="/personalised-merch">
          <PageTransition key={location} type="scale-blur">
            <PersonalisedMerchPage />
          </PageTransition>
        </Route>
        <Route path="/ideas">
          <PageTransition key={location} type="scale-blur">
            <GetIdeasPage />
          </PageTransition>
        </Route>
        <Route path="/ai-effects">
          <PageTransition key={location} type="scale-blur">
            <AiEffectsGallery />
          </PageTransition>
        </Route>
        <Route path="/creative-results">
          <PageTransition key={location} type="scale-blur">
            <CreativeResultsPage />
          </PageTransition>
        </Route>
        <Route path="/video-hub">
          <PageTransition key={location} type="scale-blur">
            <VideoHubPage />
          </PageTransition>
        </Route>
        <Route path="/gallery">
          <PageTransition key={location} type="scale-blur">
            <GalleryPage />
          </PageTransition>
        </Route>
        <Route path="/blog">
          <PageTransition key={location} type="scale-blur">
            <InsightsPage />
          </PageTransition>
        </Route>
        <Route path="/blog/:slug">
          <PageTransition key={location} type="scale-blur">
            <InsightArticlePage />
          </PageTransition>
        </Route>
        <Route path="/tailored-software-solutions">
          <PageTransition key={location} type="scale-blur">
            <TailoredSoftwareSolutionsPage />
          </PageTransition>
        </Route>
        <Route path="/contact-us">
          <PageTransition key={location} type="scale-blur">
            <ContactUsPage />
          </PageTransition>
        </Route>
        <Route path="/terms">
          <PageTransition key={location} type="scale-blur">
            <TermsPage />
          </PageTransition>
        </Route>
        <Route path="/privacy">
          <PageTransition key={location} type="scale-blur">
            <PrivacyPage />
          </PageTransition>
        </Route>
        <Route path="/admin/login">
          <PageTransition key={location} type="scale-blur">
            <AdminLoginPage />
          </PageTransition>
        </Route>
        <Route path="/admin">
          <PageTransition key={location} type="scale-blur">
            <AdminDashboard />
          </PageTransition>
        </Route>
        <Route path="/admin/articles">
          <PageTransition key={location} type="scale-blur">
            <AdminArticlesPage />
          </PageTransition>
        </Route>
        <Route path="/admin/articles/:id">
          <PageTransition key={location} type="scale-blur">
            <AdminArticleEditPage />
          </PageTransition>
        </Route>
        <Route path="/admin/leads">
          <PageTransition key={location} type="scale-blur">
            <AdminLeadsPage />
          </PageTransition>
        </Route>
        <Route path="/admin/seo">
          <PageTransition key={location} type="scale-blur">
            <AdminSeoPage />
          </PageTransition>
        </Route>
        <Route path="/admin/settings">
          <PageTransition key={location} type="scale-blur">
            <AdminSettingsPage />
          </PageTransition>
        </Route>
        <Route path="/admin/media">
          <PageTransition key={location} type="scale-blur">
            <AdminMediaPage />
          </PageTransition>
        </Route>
        <Route path="/admin/pages">
          <PageTransition key={location} type="scale-blur">
            <AdminPagesList />
          </PageTransition>
        </Route>
        <Route path="/admin/pages/:id">
          <PageTransition key={location} type="scale-blur">
            <AdminPageEdit />
          </PageTransition>
        </Route>
        <Route>
          <PageTransition key={location} type="scale-blur">
            <NotFound />
          </PageTransition>
        </Route>
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  const [gaLoaded, setGaLoaded] = useState(false);
  const [location] = useLocation();
  useEffect(() => {
    // Capture UTM params on first load
    if (typeof window !== 'undefined') {
      captureUtmFromUrl(window.location.href);
    }
    // Fetch GA4 measurement id and initialize
    (async () => {
      try {
        const data = await publicApi<{ id: string | null }>('GET', '/api/settings/ga');
        if (data?.id) { loadGA(data.id); setGaLoaded(true); }
      } catch {}
      // Initialize GTM if configured
      try { initGTM(); } catch {}
      try {
        // Inject search console meta tags if configured (resilient)
        const cfg = await publicApi<Record<string,string>>('GET', '/api/settings/public');
        if (cfg) {
          const ensureMeta = (name: string, content?: string) => {
            if (!content) return;
            let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
            if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
            el.setAttribute('content', content);
          };
          ensureMeta('google-site-verification', cfg.google_site_verification);
          ensureMeta('msvalidate.01', cfg.bing_site_verification);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (!gaLoaded) return;
    trackPageView(location);
    // Emit GTM page_view
    try {
      gtmEvent('page_view', {
        page_location: typeof window !== 'undefined' ? window.location.href : undefined,
        page_path: typeof window !== 'undefined' ? (window.location.pathname + window.location.search) : undefined,
        page_title: typeof document !== 'undefined' ? document.title : undefined,
      });
    } catch {}
  }, [location, gaLoaded]);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ScrollToTop />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
