import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export const AdminStatsOverview: React.FC = () => {
  const stats = useQuery(api.analytics.queries.getDashboardStats);

  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-surface-container rounded-2xl" />
        ))}
      </div>
    );
  }

  const kpis = [
    { label: 'Total de estudiantes', value: stats.users.students },
    { label: 'Total de cursos', value: stats.courses.total },
    { label: 'Total de profesores', value: stats.teachers.total },
    { label: 'Total de inscripciones', value: stats.enrollments.total },
    {
      label: 'Ingresos estimados',
      value: new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
        .format(stats.financials.estimatedRevenueMinor / 100),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {kpis.map((kpi, idx) => (
        <Card key={idx} className="bg-surface-container/60 border border-outline-variant p-6 rounded-2xl">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-sm font-medium text-on-surface-variant">
              {kpi.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-3xl font-extrabold text-primary">
              {kpi.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
