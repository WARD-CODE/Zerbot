'use client';

import { FiMessageSquare, FiGrid, FiFolder, FiLayers, FiSettings, FiClock, FiTrendingUp, FiCreditCard } from 'react-icons/fi';
import { IRoute } from '@/types/navigation';

const routes: IRoute[] = [
  {
    name: 'Chat UI',
    path: '/',
    icon: <FiMessageSquare />,
    layout: '/',
  },
  {
    name: 'All Templates',
    path: '/templates',
    icon: <FiGrid />,
    layout: '/',
    collapse: true,
    items: [
      { name: 'Essay Generator', path: '/templates/essay' },
      { name: 'Content Simplifier', path: '/templates/simplifier' },
      { name: 'Product Description', path: '/templates/description' },
      { name: 'Email Enhancer', path: '/templates/email' },
      { name: 'LinkedIn Message', path: '/templates/linkedin' },
      { name: 'Instagram Caption', path: '/templates/instagram' },
      { name: 'FAQs Content', path: '/templates/faqs' },
      { name: 'Product Name Generator', path: '/templates/product-name' },
      { name: 'SEO Keywords', path: '/templates/seo' },
      { name: 'Review Responder', path: '/templates/review' },
      { name: 'Business Idea Generator', path: '/templates/business-idea' },
      { name: 'Article Generator', path: '/templates/article' },
    ],
  },
  {
    name: 'My Projects',
    path: '/projects',
    icon: <FiFolder />,
    layout: '/',
  },
  {
    name: 'Other Pages',
    path: '/other-pages',
    icon: <FiLayers />,
    layout: '/',
  },
  {
    name: 'Admin Pages',
    path: '/admin-pages',
    icon: <FiLayers />,
    layout: '/',
  },
  {
    name: 'Profile Settings',
    path: '/profile',
    icon: <FiSettings />,
    layout: '/',
  },
  {
    name: 'History',
    path: '/history',
    icon: <FiClock />,
    layout: '/',
  },
  {
    name: 'Usage',
    path: '/usage',
    icon: <FiTrendingUp />,
    layout: '/',
  },
  {
    name: 'My Plan',
    path: '/my-plan',
    icon: <FiCreditCard />,
    layout: '/',
  },
];

export default routes;