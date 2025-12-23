import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { TypewriterEffect } from '@/components/ui/typewriter-effect';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import {
  Brain,
  ArrowRight,
  Code2,
  Database,
  LineChart,
  Sparkles,
  CheckCircle,
  Zap,
  Eye,
  TrendingUp,
} from 'lucide-react';

const techStack = [
  { name: 'React', icon: Code2, color: 'text-accent' },
  { name: 'Python', icon: Code2, color: 'text-warning' },
  { name: 'FastAPI', icon: Zap, color: 'text-success' },
  { name: 'Scikit-learn', icon: Brain, color: 'text-nlp' },
  { name: 'TensorFlow', icon: LineChart, color: 'text-cnn' },
  { name: 'PostgreSQL', icon: Database, color: 'text-eda' },
];

const features = [
  { text: 'Real-time ML model predictions', icon: Zap },
  { text: 'Interactive form-based inputs', icon: Eye },
  { text: 'Multiple ML domains covered', icon: Brain },
  { text: 'Clean visualization of results', icon: TrendingUp },
  { text: 'Production-ready architecture', icon: Code2 },
  { text: 'Educational demonstrations', icon: Sparkles },
];

const stats = [
  { value: '7', label: 'Projects' },
  { value: '4', label: 'ML Domains' },
  { value: '100%', label: 'Interactive' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero text-primary-foreground py-24 md:py-36">
        {/* Animated background patterns */}
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute inset-0 dot-pattern opacity-50" />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 rounded-full bg-accent/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-nlp/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="container relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-primary-foreground/90 text-sm font-medium mb-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="h-4 w-4 text-warning" />
              </motion.div>
              Interactive ML Demo Platform
            </motion.div>

            {/* Main Heading with Typewriter */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance"
            >
              Data Science &{' '}
              <span className="relative">
                <TypewriterEffect
                  words={['Machine Learning', 'Deep Learning', 'AI Predictions', 'Data Analysis']}
                  className="text-accent"
                />
              </span>
              <br />
              Showcase
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="mt-8 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto text-balance"
            >
              <span className="font-semibold text-primary-foreground">Not a traditional portfolio.</span>{' '}
              Explore interactive demonstrations of my Data Science internship projects 
              with real-time predictions and results.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl shadow-primary-foreground/20 px-8"
                >
                  <Link to="/projects">
                    Explore Projects
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </motion.div>
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm"
                >
                  <a href="#about">Learn More</a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              variants={containerVariants}
              className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16"
            >
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold text-primary-foreground">
                    <AnimatedCounter value={stat.value} duration={2} />
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + idx * 0.2 }}
                    className="text-sm text-primary-foreground/60 mt-1"
                  >
                    {stat.label}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-primary-foreground/60"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                What Makes This{' '}
                <span className="text-gradient">Different?</span>
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Unlike traditional portfolios that just describe projects, this platform 
                lets you interact with trained machine learning models in real-time. 
                Each project demonstrates end-to-end ML understanding from data 
                preprocessing to model deployment.
              </p>
              <motion.ul
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-8 space-y-4"
              >
                {features.map((feature, idx) => (
                  <motion.li
                    key={feature.text}
                    variants={itemVariants}
                    className="flex items-center gap-4"
                  >
                    <div className="p-2 rounded-lg bg-success/10">
                      <feature.icon className="h-4 w-4 text-success" />
                    </div>
                    <span className="text-foreground">{feature.text}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-nlp/20 rounded-3xl blur-2xl" />
              
              <div className="relative bg-card rounded-2xl p-8 border border-border shadow-2xl">
                <h3 className="font-display text-xl font-semibold text-card-foreground mb-6 flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  Tech Stack
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {techStack.map((tech, idx) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-default"
                    >
                      <tech.icon className={`h-5 w-5 ${tech.color}`} />
                      <span className="font-medium text-foreground">{tech.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-nlp/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container text-center relative"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Ready to <span className="text-gradient">Explore?</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Dive into 7 interactive ML projects spanning NLP, classification, 
            regression, clustering, and computer vision.
          </p>
          <motion.div
            className="mt-10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild size="lg" className="shadow-lg shadow-primary/20 px-8">
              <Link to="/projects">
                View All Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </Layout>
  );
}
