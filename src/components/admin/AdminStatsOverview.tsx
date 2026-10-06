import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export const AdminStatsOverview: React.FC = () => {
  const { t } = useTranslation('admin');
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
    { label: t('stats.totalStudents'), value: stats.users.students },
    { label: t('stats.totalCourses'), value: stats.courses.total },
    { label: t('stats.totalInstructors'), value: stats.teachers.total },
    { label: t('stats.totalEnrollments'), value: stats.enrollments.total },
    { label: t('stats.estimatedRevenue'), value: `$${stats.financials.estimatedRevenue}` },
    { label: t('stats.missingTranslations'), value: stats.missingLanguagesCount },
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
