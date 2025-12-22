import { Layout } from '@/components/layout/Layout';
import { ProjectCard, ProjectCategory } from '@/components/shared/ProjectCard';
import {
  MessageSquare,
  Film,
  Landmark,
  Bug,
  Star,
  Fish,
  Globe,
} from 'lucide-react';

interface Project {
  title: string;
  description: string;
  category: ProjectCategory;
  categoryLabel: string;
  icon: typeof MessageSquare;
  href: string;
}

const projects: Project[] = [
  {
    title: 'Spam Message Classification',
    description: 'Classify messages as spam or legitimate using NLP techniques and text vectorization.',
    category: 'nlp',
    categoryLabel: 'NLP',
    icon: MessageSquare,
    href: '/projects/spam-classification',
  },
  {
    title: 'IMDB Sentiment Analysis',
    description: 'Analyze movie reviews to determine positive or negative sentiment using NLP.',
    category: 'nlp',
    categoryLabel: 'NLP',
    icon: Film,
    href: '/projects/sentiment-analysis',
  },
  {
    title: 'Loan Approval Prediction',
    description: 'Predict loan approval status based on applicant information and credit history.',
    category: 'classification',
    categoryLabel: 'Classification',
    icon: Landmark,
    href: '/projects/loan-approval',
  },
  {
    title: 'Butterfly Image Classification',
    description: 'Identify butterfly species from images using Convolutional Neural Networks.',
    category: 'cnn',
    categoryLabel: 'CNN',
    icon: Bug,
    href: '/projects/butterfly-classification',
  },
  {
    title: 'Galaxy Star Regression',
    description: 'Predict continuous values for galaxy features using regression models.',
    category: 'regression',
    categoryLabel: 'Regression',
    icon: Star,
    href: '/projects/galaxy-regression',
  },
  {
    title: 'Fish Clustering',
    description: 'Assign fish samples to clusters based on physical measurements.',
    category: 'clustering',
    categoryLabel: 'Clustering',
    icon: Fish,
    href: '/projects/fish-clustering',
  },
  {
    title: 'World GDP Analysis',
    description: 'Explore global GDP trends with interactive visualizations and statistics.',
    category: 'eda',
    categoryLabel: 'EDA',
    icon: Globe,
    href: '/projects/gdp-analysis',
  },
];

export default function Projects() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-center">
            Project Showcase
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80 text-center max-w-2xl mx-auto">
            Explore 7 interactive ML projects. Each project allows you to input data 
            and receive real-time predictions from trained models.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.href} {...project} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}