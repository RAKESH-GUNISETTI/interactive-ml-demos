import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  index?: number;
}

const categoryGradients: Record<ProjectCategory, string> = {
  nlp: 'from-nlp/20 to-nlp/5',
  classification: 'from-classification/20 to-classification/5',
  regression: 'from-regression/20 to-regression/5',
  clustering: 'from-clustering/20 to-clustering/5',
  cnn: 'from-cnn/20 to-cnn/5',
  eda: 'from-eda/20 to-eda/5',
};

const categoryColors: Record<ProjectCategory, string> = {
  nlp: 'bg-nlp',
  classification: 'bg-classification',
  regression: 'bg-regression',
  clustering: 'bg-clustering',
  cnn: 'bg-cnn',
  eda: 'bg-eda',
};

export function ProjectCard({
  title,
  description,
  category,
  categoryLabel,
  icon: Icon,
  href,
  index = 0,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Card className="relative h-full bg-card border-border overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
        {/* Top gradient bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${categoryColors[category]}`} />
        
        {/* Hover gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradients[category]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        
        <CardHeader className="relative pb-4">
          <div className="flex items-start justify-between gap-4">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className={`p-3 rounded-xl badge-${category} shadow-lg`}
            >
              <Icon className="h-6 w-6" />
            </motion.div>
            <span className={`text-xs font-medium px-3 py-1.5 rounded-full badge-${category}`}>
              {categoryLabel}
            </span>
          </div>
          <CardTitle className="font-display text-xl mt-4 text-card-foreground group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-muted-foreground line-clamp-2">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative pt-0">
          <motion.div
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Button asChild variant="ghost" className="p-0 h-auto font-medium text-primary hover:text-primary/80 group/btn">
              <Link to={href} className="flex items-center gap-2">
                Try Demo
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </CardContent>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </Card>
    </motion.div>
  );
}
