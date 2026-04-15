'use client';
import { useAdminAuth } from '../context/auth';

import { redirect } from 'next/navigation';
export default function Home() {
  const { isLoggedIn, isLoading } = useAdminAuth(); redirect('/dashboard'); }
