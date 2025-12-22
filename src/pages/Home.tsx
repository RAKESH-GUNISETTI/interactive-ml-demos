import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import {
  Brain,
  ArrowRight,
  Code2,
  Database,
  LineChart,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

const techStack = [
  { name: 'React', icon: Code2 },
  { name: 'Python', icon: Code2 },
  { name: 'FastAPI', icon: Sparkles },
  { name: 'Scikit-learn', icon: Brain },
  { name: 'TensorFlow', icon: LineChart },
  { name: 'PostgreSQL', icon: Database },
];

const features = [
  'Real-time ML model predictions',
  'Interactive form-based inputs',
  'Multiple ML domains covered',
  'Clean visualization of results',
  'Production-ready architecture',
  'Educational demonstrations',
];

const stats = [
  { value: '7', label: 'Projects' },
  { value: '4', label: 'ML Domains' },
  { value: '100%', label: 'Interactive' },
];

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-20 md:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary-foreground)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary-foreground)/0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground/90 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Interactive ML Demo Platform
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-balance">
              Data Science & Machine Learning Showcase
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto text-balance">
              This is not a traditional portfolio. Explore interactive demonstrations 
              of my Data Science internship projects with real-time predictions and results.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <Link to="/projects">
                  Explore Projects
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <a href="#about">Learn More</a>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/60 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                What Makes This Different?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Unlike traditional portfolios that just describe projects, this platform 
                lets you interact with trained machine learning models in real-time. 
                Each project demonstrates end-to-end ML understanding from data 
                preprocessing to model deployment.
              </p>
              <ul className="mt-8 space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-2xl p-8 border border-border shadow-lg">
              <h3 className="font-display text-xl font-semibold text-card-foreground mb-6">
                Tech Stack
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {techStack.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted"
                  >
                    <tech.icon className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted">
        <div className="container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Ready to Explore?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Dive into 7 interactive ML projects spanning NLP, classification, 
            regression, clustering, and computer vision.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/projects">
              View All Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}