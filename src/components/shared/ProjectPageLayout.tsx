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
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container">
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
          
          <div className="flex items-start gap-4">
            <div className={`p-4 rounded-xl badge-${category} bg-primary-foreground/10`}>
              <Icon className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <span className="text-sm font-medium text-primary-foreground/70 uppercase tracking-wide">
                {categoryLabel}
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">
                {title}
              </h1>
              <p className="text-lg text-primary-foreground/80 mt-2 max-w-2xl">
                {description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8">
        <div className="container space-y-6">
          <DisclaimerBanner />
          {children}
        </div>
      </section>
    </div>
  );
}