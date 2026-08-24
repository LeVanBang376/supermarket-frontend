import { Card } from 'antd';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <main className='flex min-h-screen items-center justify-center bg-gray-100 px-4'>
      <Card className='w-full max-w-md shadow-lg'>
        <div className='mb-8 text-center'>
          <h1 className='mb-2! text-2xl font-bold'>Welcome Back</h1>

          <p className='text-gray-500'>Sign in to your account to continue</p>
        </div>

        <LoginForm />

        <div className='mt-6 text-center'>
          <p className='text-gray-500'>
            Don{"\'"}t have an account?{' '}
            <a href='/register' className='text-blue-600 hover:text-blue-500'>
              Sign up
            </a>
          </p>
        </div>
      </Card>
    </main>
  );
}
