import { redirect } from 'next/navigation';

/**
 * Root page - redirect to login using Next.js redirect
 * This is more efficient than client-side redirect
 */
export default function Home() {
  redirect('/login');
}
