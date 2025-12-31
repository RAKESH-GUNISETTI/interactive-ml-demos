import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { ProjectPageLayout } from '@/components/shared/ProjectPageLayout';
import { HowItWorks } from '@/components/shared/HowItWorks';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, TrendingUp, TrendingDown, Minus, BarChart3, RefreshCw, DollarSign, Activity } from 'lucide-react';
import { getGDPData, GDPResponse } from '@/lib/api';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Area, AreaChart } from 'recharts';
import { AnimatedCounter } from '@/components/ui/animated-counter';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const countries = [
  'United States',
  'China',
  'India',
  'Germany',
  'Japan',
  'United Kingdom',
  'France',
  'Brazil',
  'Canada',
  'Australia',
];

export default function GDPAnalysis() {
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [data, setData] = useState<GDPResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const response = await getGDPData(selectedCountry);
    if (response.success && response.data) {
      setData(response.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedCountry]);

  const formatGDP = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}T`;
    }
    return `$${value.toFixed(0)}B`;
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 5) return <TrendingUp className="h-5 w-5 text-success" />;
    if (growth < -5) return <TrendingDown className="h-5 w-5 text-destructive" />;
    return <Minus className="h-5 w-5 text-warning" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 5) return 'text-success';
    if (growth < -5) return 'text-destructive';
    return 'text-warning';
  };

  return (
    <Layout>
      <ProjectPageLayout
        title="World GDP Analysis"
        description="Explore global GDP trends with interactive visualizations. This is an Exploratory Data Analysis (EDA) project showcasing data visualization techniques."
        category="eda"
        categoryLabel="Exploratory Data Analysis"
        icon={Globe}
      >
        <motion.div 
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Controls */}
          <motion.div variants={itemVariants}>
            <Card className="group relative overflow-hidden bg-gradient-to-br from-card via-card to-muted/30 border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative">
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  Select Country
                </CardTitle>
                <CardDescription>
                  Choose a country to explore its GDP trends and economic statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="relative flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label>Country</Label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="w-full rounded-xl bg-muted/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={fetchData} 
                    disabled={isLoading} 
                    variant="outline" 
                    className="gap-2 rounded-xl border-border/50 hover:bg-primary/10 hover:border-primary/50 transition-all"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {isLoading && (
            <Card className="bg-gradient-to-br from-card via-card to-muted/30 border-border/50">
              <CardContent className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="h-16 w-16 border-4 border-primary/20 rounded-full" />
                    <div className="absolute inset-0 h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <div className="absolute inset-2 h-12 w-12 border-4 border-accent/30 border-b-transparent rounded-full animate-spin-slow" />
                  </div>
                  <p className="text-muted-foreground font-medium">Loading economic data...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {data && !isLoading && (
            <>
              {/* Stats Cards */}
              <motion.div 
                className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
                variants={itemVariants}
              >
                {[
                  { label: 'Average GDP', value: data.stats.average, icon: DollarSign, color: 'from-blue-500 to-cyan-500' },
                  { label: 'Minimum GDP', value: data.stats.min, icon: TrendingDown, color: 'from-rose-500 to-pink-500' },
                  { label: 'Maximum GDP', value: data.stats.max, icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="group relative overflow-hidden bg-gradient-to-br from-card to-muted/20 border-border/50 hover:shadow-xl transition-all duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <CardContent className="relative pt-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-bold text-foreground mt-1">
                              <AnimatedCounter value={stat.value} formatter={formatGDP} />
                            </p>
                          </div>
                          <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                            <stat.icon className="h-4 w-4" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="group relative overflow-hidden bg-gradient-to-br from-card to-muted/20 border-border/50 hover:shadow-xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardContent className="relative pt-6 flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Overall Growth</p>
                        <p className={`text-2xl font-bold mt-1 ${getGrowthColor(data.stats.growth)}`}>
                          <AnimatedCounter value={data.stats.growth} decimals={1} suffix="%" />
                        </p>
                      </div>
                      <div className="p-2 rounded-xl bg-muted">
                        {getGrowthIcon(data.stats.growth)}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Charts */}
              <motion.div 
                className="grid lg:grid-cols-2 gap-6"
                variants={itemVariants}
              >
                {/* Area Chart */}
                <Card className="group relative overflow-hidden bg-gradient-to-br from-card via-card to-muted/30 border-border/50 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="relative">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      GDP Over Time
                    </CardTitle>
                    <CardDescription>
                      Historical GDP trend for {data.country}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.data}>
                          <defs>
                            <linearGradient id="gdpGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                          <XAxis
                            dataKey="year"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}T`}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '12px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            }}
                            formatter={(value: number) => [formatGDP(value), 'GDP']}
                          />
                          <Area
                            type="monotone"
                            dataKey="gdp"
                            stroke="hsl(var(--primary))"
                            strokeWidth={3}
                            fill="url(#gdpGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Bar Chart */}
                <Card className="group relative overflow-hidden bg-gradient-to-br from-card via-card to-muted/30 border-border/50 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="relative">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <BarChart3 className="h-4 w-4 text-accent" />
                      </div>
                      Recent GDP by Year
                    </CardTitle>
                    <CardDescription>
                      Last 10 years comparison for {data.country}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.data.slice(-10)}>
                          <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={1}/>
                              <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.6}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                          <XAxis
                            dataKey="year"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}T`}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '12px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            }}
                            formatter={(value: number) => [formatGDP(value), 'GDP']}
                          />
                          <Bar
                            dataKey="gdp"
                            fill="url(#barGradient)"
                            radius={[8, 8, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* How It Works */}
              <motion.div variants={itemVariants}>
                <HowItWorks
                  modelName="Exploratory Data Analysis (EDA)"
                  description="This project demonstrates data visualization and analysis techniques. Unlike ML models, EDA focuses on understanding patterns, trends, and insights from raw data through visual exploration."
                  keyFactors={[
                    'Time series visualization',
                    'Statistical summaries',
                    'Trend analysis',
                    'Comparative metrics',
                    'Growth rate calculations',
                    'Interactive filtering',
                  ]}
                  technicalDetails="Data Source: World Bank API | Visualization: Recharts | Analysis: Statistical aggregations"
                />
              </motion.div>
            </>
          )}
        </motion.div>
      </ProjectPageLayout>
    </Layout>
  );
}
