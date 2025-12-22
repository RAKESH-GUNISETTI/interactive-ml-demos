import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProjectPageLayout } from '@/components/shared/ProjectPageLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { getGDPData, GDPResponse } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

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

  return (
    <Layout>
      <ProjectPageLayout
        title="World GDP Analysis"
        description="Explore global GDP trends with interactive visualizations. This is an Exploratory Data Analysis (EDA) project - no ML predictions, just data insights."
        category="eda"
        categoryLabel="Exploratory Data Analysis"
        icon={Globe}
      >
        <div className="space-y-8">
          {/* Controls */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-display text-xl">Select Country</CardTitle>
              <CardDescription>
                Choose a country to view its GDP trends and statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label>Country</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
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
                <Button onClick={fetchData} disabled={isLoading}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Refresh Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {isLoading && (
            <Card className="bg-card border-border">
              <CardContent className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-muted-foreground">Loading data...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {data && !isLoading && (
            <>
              {/* Stats Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Average GDP</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {formatGDP(data.stats.average)}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Minimum GDP</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {formatGDP(data.stats.min)}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Maximum GDP</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {formatGDP(data.stats.max)}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="pt-6 flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Overall Growth</p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {data.stats.growth.toFixed(1)}%
                      </p>
                    </div>
                    {getGrowthIcon(data.stats.growth)}
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Line Chart */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">GDP Over Time</CardTitle>
                    <CardDescription>
                      Historical GDP trend for {data.country}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.data}>
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
                          <Line
                            type="monotone"
                            dataKey="gdp"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Bar Chart */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">GDP by Year</CardTitle>
                    <CardDescription>
                      Annual GDP comparison for {data.country}
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
              </div>
            </>
          )}
        </div>
      </ProjectPageLayout>
    </Layout>
  );
}