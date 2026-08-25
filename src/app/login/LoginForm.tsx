'use client';

import { Button, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useEffect } from 'react';

interface LoginFormValues {
  username: string;
  password: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function LoginForm() {
  const router = useRouter();
  const [form] = Form.useForm<LoginFormValues>();
  const [messageApi, contextHolder] = message.useMessage();

  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      router.replace('/sample-page');
    }
  }, [user, isLoading, router]);

  const redirectAfterLogin = () => {
    router.push('/sample-page');
  };

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      messageApi.success('Đăng nhập thành công');
      redirectAfterLogin();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Something went wrong';

      messageApi.error(errorMessage);
    }
  };

  return (
    <>
      {contextHolder}

      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        requiredMark={false}
        size='large'
      >
        <Form.Item
          label='Username'
          name='username'
          rules={[
            {
              required: true,
              message: 'Please enter your username',
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder='Enter your username' />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[
            {
              required: true,
              message: 'Please enter your password',
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder='Enter your password'
          />
        </Form.Item>

        <div className='mb-6 flex justify-end'>
          <a
            href='/forgot-password'
            className='text-sm text-blue-600 hover:text-blue-500'
          >
            Forgot password?
          </a>
        </div>

        <Form.Item className='mb-0!'>
          <Button type='primary' htmlType='submit' block>
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
