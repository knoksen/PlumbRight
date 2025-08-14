import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Wrench, Calculator, Library, ArrowRight } from 'lucide-react';

const features = [
  {
    title: 'AI Part Validation',
    description: 'Upload a part photo and description to get instant identification of type, material, and connection.',
    href: '/validate',
    icon: <Wrench className="size-8 text-primary" />,
  },
  {
    title: 'Smart Quote Generator',
    description: 'Build detailed quotes with parts, labor, markups, and custom line items for accurate job costing.',
    href: '/quote',
    icon: <Calculator className="size-8 text-primary" />,
  },
  {
    title: 'Parts Library',
    description: 'Browse our extensive catalog of plumbing parts to find exactly what you need for your next project.',
    href: '/parts',
    icon: <Library className="size-8 text-primary" />,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to PlumbRight</h1>
        <p className="text-muted-foreground">Your all-in-one platform for plumbing project management.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
              <div className="rounded-lg bg-primary/10 p-3">{feature.icon}</div>
              <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-4">
              <p className="text-muted-foreground">{feature.description}</p>
              <Button asChild className="mt-auto w-full">
                <Link href={feature.href}>
                  Go to {feature.title}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
