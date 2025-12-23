import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DisclaimerBanner } from './DisclaimerBanner';
import { LucideIcon } from 'lucide-react';
import { ProjectCategory } from './ProjectCard';

interface ProjectPageLayoutProps {
  title: string;
  description: string;
  category: ProjectCategory;
  categoryLabel: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

const categoryColors: Record<ProjectCategory, string> = {
  nlp: 'text-nlp',
  classification: 'text-classification',
  regression: 'text-regression',
  clustering: 'text-clustering',
  cnn: 'text-cnn',
  eda: 'text-eda',
};

export function ProjectPageLayout({
  title,
  description,
  category,
  categoryLabel,
  icon: Icon,
  children,
}: ProjectPageLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero text-primary-foreground py-16">
        {/* Background patterns */}
        <div className="absolute inset-0 grid-pattern opacity-50" />
        
        {/* Decorative glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-accent/20 blur-3xl pointer-events-none"
        />

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Button
              asChild
              variant="ghost"
              className="mb-6 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-start gap-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, delay: 0.2 }}
              className={`p-4 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/10`}
            >
              <Icon className={`h-10 w-10 ${categoryColors[category]}`} />
            </motion.div>
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`text-sm font-medium uppercase tracking-wider ${categoryColors[category]}`}
              >
                {categoryLabel}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-display text-3xl md:text-5xl font-bold mt-2"
              >
                {title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-primary-foreground/80 mt-3 max-w-2xl"
              >
                {description}
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="py-10"
      >
        <div className="container space-y-8">
          <DisclaimerBanner />
          {children}
        </div>
      </motion.section>
    </div>
  );
}
