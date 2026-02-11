import {redirect} from 'next/navigation';
 
// This page only renders when the app is used without a locale,
// so it simply redirects to the default locale.
export default function RootPage() {
  redirect('/en');
}