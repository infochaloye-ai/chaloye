import ProtectedRoute from '../components/ProtectedRoute';
import Account from '../components/Account';

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <Account />
    </ProtectedRoute>
  );
} 