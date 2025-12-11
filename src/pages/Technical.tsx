import { motion } from 'motion/react';
import MinimalNavigation from '@/components/MinimalNavigation';
import MinimalHero from '@/components/MinimalHero';
import MinimalProjects from '@/components/MinimalProjects';
import MinimalAbout from '@/components/MinimalAbout';
import MinimalContact from '@/components/MinimalContact';

const Technical = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <MinimalNavigation />
      
      {/* Main Content */}
      <main>
        <MinimalHero />
        <MinimalProjects />
        <MinimalAbout />
        <MinimalContact />
      </main>
      
      {/* Footer */}
      <footer className="py-12 border-t border-border/50 bg-muted/10">
        <div className="max-w-content mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.div 
              className="text-lg font-heading font-medium text-foreground" 
              whileHover={{
                scale: 1.02
              }}
            >
              Ankur Bag
            </motion.div>
            
            <div className="flex items-center gap-8 text-xs font-mono text-muted-foreground">
              <div>© 2025 All rights reserved</div>
              <div>Making projects with precision & passion</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Technical;
