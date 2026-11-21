import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  PageTransition,
  ScrollScene,
  SectionSeparator,
} from '../components/animations/MotionPrimitives';
import { HeroSection } from '../components/hero/HeroSection';
import { MemorialTickerBar } from '../components/home/MemorialTickerBar';
import { ForgottenWorldSection } from '../components/home/ForgottenWorldSection';
import { GraveyardExplorerSection } from '../components/home/GraveyardExplorerSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { ResurrectionWallSection } from '../components/home/ResurrectionWallSection';
import { FinalCtaSection } from '../components/home/FinalCtaSection';

export default function HomePage() {
  const [selectedReason, setSelectedReason] = useState('All');
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return undefined;
    const targetId = location.hash.replace('#', '');
    let attempts = 0;
    const tryScroll = () => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      attempts += 1;
      if (attempts < 20) {
        timer = setTimeout(tryScroll, 50);
      }
    };
    let timer = setTimeout(tryScroll, 60);
    return () => clearTimeout(timer);
  }, [location.hash]);

  const scrollToExplorer = () => {
    document.getElementById('graveyard-explorer')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectReason = (reasonId) => {
    setSelectedReason(reasonId);
    scrollToExplorer();
  };

  return (
    <PageTransition>
      <HeroSection onExploreClick={scrollToExplorer} />
      <MemorialTickerBar />

      <SectionSeparator label="SCENE I · CAUSES OF BURIAL" />
      <ScrollScene>
        <ForgottenWorldSection onSelectReason={handleSelectReason} />
      </ScrollScene>

      <SectionSeparator label="SCENE II · THE ARCHIVE CATALOG" />
      <ScrollScene>
        <GraveyardExplorerSection initialReason={selectedReason} />
      </ScrollScene>

      <SectionSeparator label="SCENE III · RESURRECTION PROTOCOL" />
      <ScrollScene>
        <HowItWorksSection />
      </ScrollScene>

      <SectionSeparator label="SCENE IV · LIVING FOLIOS" />
      <ScrollScene>
        <ResurrectionWallSection />
      </ScrollScene>

      <SectionSeparator label="EPILOGUE · SECOND HORIZON" />
      <ScrollScene>
        <FinalCtaSection />
      </ScrollScene>
    </PageTransition>
  );
}
