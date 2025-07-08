import React from 'react';

interface BaseContentLayoutProps {
  title: string;
  subtitle?: string;
  essentialItems: React.ReactNode;
  premiumItems: React.ReactNode;
  tips: React.ReactNode;
  precautions: React.ReactNode;
  filterSection?: React.ReactNode;
}

export const BaseContentLayout: React.FC<BaseContentLayoutProps> = ({
  title,
  subtitle,
  essentialItems,
  premiumItems,
  tips,
  precautions,
  filterSection,
}) => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-4">{title}</h1>
    {subtitle && <p className="text-lg text-gray-600 mb-12">{subtitle}</p>}
    {filterSection}
    <h2 className="text-3xl font-bold mb-6">Essential Experiences</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">{essentialItems}</div>
    <h2 className="text-3xl font-bold mb-6">Premium & Exclusive</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">{premiumItems}</div>
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Tips for Your Visit</h2>
      <ul className="space-y-4">{tips}</ul>
    </section>
    <section>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Important Precautions</h2>
      <ul className="space-y-4">{precautions}</ul>
    </section>
  </div>
); 