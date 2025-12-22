import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export type ProjectCategory = 'nlp' | 'classification' | 'regression' | 'clustering' | 'cnn' | 'eda';

interface ProjectCardProps {
  title: string;
  description: string;
  category: ProjectCategory;
  categoryLabel: string;
  icon: LucideIcon;
  href: string;
}

export function ProjectCard({
  title,
  description,
  category,
  categoryLabel,
  icon: Icon,
  href,
}: ProjectCardProps) {
  return (
    <Card className="card-hover group bg-card border-border overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className={`p-3 rounded-lg badge-${category}`}>
            <Icon className="h-6 w-6" />
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full badge-${category}`}>
            {categoryLabel}
          </span>
        </div>
        <CardTitle className="font-display text-xl mt-4 text-card-foreground group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button asChild variant="ghost" className="p-0 h-auto font-medium text-primary hover:text-primary/80">
          <Link to={href} className="flex items-center gap-2">
            Try Demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}