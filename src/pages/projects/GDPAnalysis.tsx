import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { ProjectPageLayout } from '@/components/shared/ProjectPageLayout';
import { HowItWorks } from '@/components/shared/HowItWorks';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, TrendingUp, TrendingDown, Minus, BarChart3, RefreshCw } from 'lucide-react';
import { getGDPData, GDPResponse } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Area, AreaChart } from 'recharts';
import { AnimatedCounter } from '@/components/ui/animated-counter';

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
        <div className="space-y-8">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="font-display text-xl">Select Country</CardTitle>
                <CardDescription>
                  Choose a country to explore its GDP trends and economic statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label>Country</Label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="w-full">
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
                  <Button onClick={fetchData} disabled={isLoading} variant="outline" className="gap-2">
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {isLoading && (
            <Card className="bg-card border-border">
              <CardContent className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="h-12 w-12 border-4 border-primary/20 rounded-full" />
                    <div className="absolute inset-0 h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-muted-foreground">Loading economic data...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {data && !isLoading && (
            <>
              {/* Stats Cards */}
              <motion.div 
                className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {[
                  { label: 'Average GDP', value: data.stats.average, prefix: '' },
                  { label: 'Minimum GDP', value: data.stats.min, prefix: '' },
                  { label: 'Maximum GDP', value: data.stats.max, prefix: '' },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="bg-card border-border hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">
                          <AnimatedCounter value={stat.value} formatter={formatGDP} />
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="bg-card border-border hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6 flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Overall Growth</p>
                        <p className={`text-2xl font-bold mt-1 ${getGrowthColor(data.stats.growth)}`}>
                          <AnimatedCounter value={data.stats.growth} decimals={1} suffix="%" />
                        </p>
                      </div>
                      {getGrowthIcon(data.stats.growth)}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Charts */}
              <motion.div 
                className="grid lg:grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Area Chart */}
                <Card className="bg-card border-border shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      GDP Over Time
                    </CardTitle>
                    <CardDescription>
                      Historical GDP trend for {data.country}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.data}>
                          <defs>
                            <linearGradient id="gdpGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis
                            dataKey="year"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                          />
                          <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}T`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                            }}
                            formatter={(value: number) => [formatGDP(value), 'GDP']}
                          />
                          <Area
                            type="monotone"
                            dataKey="gdp"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            fill="url(#gdpGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Bar Chart */}
                <Card className="bg-card border-border shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-accent" />
                      Recent GDP by Year
                    </CardTitle>
                    <CardDescription>
                      Last 10 years comparison for {data.country}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.data.slice(-10)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis
                            dataKey="year"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                          />
                          <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}T`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                            }}
                            formatter={(value: number) => [formatGDP(value), 'GDP']}
                          />
                          <Bar
                            dataKey="gdp"
                            fill="hsl(var(--accent))"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* How It Works */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
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
        </div>
      </ProjectPageLayout>
    </Layout>
  );
}
