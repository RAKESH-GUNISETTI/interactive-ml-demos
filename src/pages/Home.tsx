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
  Zap,
  Eye,
  TrendingUp,
  Cpu,
  Globe,
  Shield,
} from 'lucide-react';

const techStack = [
  { name: 'React', icon: Code2, color: 'text-accent' },
  { name: 'TypeScript', icon: Code2, color: 'text-primary' },
  { name: 'Transformers.js', icon: Brain, color: 'text-nlp' },
  { name: 'TailwindCSS', icon: Sparkles, color: 'text-accent' },
  { name: 'Framer Motion', icon: Zap, color: 'text-warning' },
  { name: 'Vite', icon: Zap, color: 'text-success' },
];

const features = [
  { text: 'Real AI model predictions in browser', icon: Brain },
  { text: 'Interactive form-based inputs', icon: Eye },
  { text: 'Multiple ML domains covered', icon: Globe },
  { text: 'Beautiful result visualization', icon: TrendingUp },
  { text: 'Privacy-first architecture', icon: Shield },
  { text: '100% client-side processing', icon: Cpu },
];

const stats = [
  { value: '7', label: 'Projects' },
  { value: '4', label: 'ML Domains' },
  { value: '100%', label: 'Browser-based' },
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
        {/* Mesh gradient background */}
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        {/* Animated orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 rounded-full bg-accent/20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 30, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-nlp/20 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-sm font-medium mb-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="h-4 w-4 text-warning" />
              </motion.div>
              <span className="text-white/90">Interactive ML Demo Platform</span>
              <span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-xs font-semibold">
                Live AI
              </span>
            </motion.div>

            {/* Main Heading with Typewriter */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-tight"
            >
              <span className="text-white">Experience </span>
              <span className="relative inline-block">
                <TypewriterEffect
                  words={['Machine Learning', 'Deep Learning', 'AI Predictions', 'Neural Networks']}
                  className="text-gradient-accent"
                />
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-accent/50"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </span>
              <br />
              <span className="text-white">In Your Browser</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="mt-8 text-lg md:text-xl text-white/70 max-w-2xl mx-auto text-balance leading-relaxed"
            >
              <span className="font-semibold text-white">Not a traditional portfolio.</span>{' '}
              Interactive demonstrations of real ML models running entirely in your browser. 
              No server, no data sent — just pure AI magic.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 shadow-2xl shadow-white/20 px-8 h-14 text-base font-semibold"
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
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm h-14 px-8 text-base"
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
                  whileHover={{ scale: 1.1 }}
                  className="text-center group cursor-default"
                >
                  <motion.div 
                    className="text-5xl md:text-6xl font-bold text-white"
                    style={{ textShadow: '0 0 40px rgba(255,255,255,0.3)' }}
                  >
                    <AnimatedCounter value={stat.value} duration={2} />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + idx * 0.2 }}
                    className="text-sm text-white/50 mt-2 group-hover:text-white/80 transition-colors"
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
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-white/60"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-background relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="container relative">
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
              <motion.span 
                className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Why This Matters
              </motion.span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground leading-tight">
                What Makes This{' '}
                <span className="text-gradient">Different?</span>
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Unlike traditional portfolios that just describe projects, this platform 
                lets you interact with real AI models. Every prediction runs entirely in 
                your browser using WebAssembly and transformer models.
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
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-success/20 to-success/5 group-hover:from-success/30 group-hover:to-success/10 transition-colors">
                      <feature.icon className="h-4 w-4 text-success" />
                    </div>
                    <span className="text-foreground group-hover:text-primary transition-colors">{feature.text}</span>
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
              <motion.div 
                className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-nlp/20 rounded-3xl blur-2xl"
                animate={{ 
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              <div className="relative bg-card rounded-2xl p-8 border border-border shadow-2xl">
                <h3 className="font-display text-xl font-semibold text-card-foreground mb-6 flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  Built With Modern Tech
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {techStack.map((tech, idx) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted border border-transparent hover:border-primary/20 transition-all cursor-default"
                    >
                      <tech.icon className={`h-5 w-5 ${tech.color}`} />
                      <span className="font-medium text-foreground text-sm">{tech.name}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Privacy badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 p-4 rounded-xl bg-success/10 border border-success/20"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-success" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Privacy First</p>
                      <p className="text-xs text-muted-foreground">All AI runs locally in your browser</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 gradient-mesh opacity-50" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container text-center relative"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-white/10"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/5"
          />

          <motion.span 
            className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Explore?
          </motion.span>
          
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white relative">
            Try Real AI in Your Browser
          </h2>
          <p className="mt-6 text-lg text-white/70 max-w-xl mx-auto">
            Dive into 7 interactive ML projects spanning NLP, classification, 
            regression, and clustering. No signup required.
          </p>
          <motion.div
            className="mt-10"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 shadow-2xl shadow-white/20 px-10 h-14 text-base font-semibold"
            >
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