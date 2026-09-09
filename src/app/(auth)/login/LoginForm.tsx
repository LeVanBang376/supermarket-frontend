'use client';

import { useEffect } from 'react';
import { Button, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import { login, getMe } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/auth-store';
import { ApiError } from '@/lib/api/client';

interface LoginFormValues {
  username: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [form] = Form.useForm<LoginFormValues>();
  const [messageApi, contextHolder] = message.useMessage();

  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setUser = useAuthStore((state) => state.setUser);

  const loginMutation = useMutation({
    mutationFn: login,

    onSuccess: async () => {
      try {
        const res = await getMe();

        setUser(res.data);

        messageApi.success('Đăng nhập thành công');

        router.replace('/services');
      } catch (error) {
        messageApi.error('Không thể lấy thông tin người dùng');
      }
    },

    onError: (error) => {
      if (error instanceof ApiError) {
        console.log(error.code);
        console.log(error.status);
      }

      messageApi.error(error.message);
    },
  });

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      router.replace('/services');
    }
  }, [user, isLoading, router]);

  const handleSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
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
          <Button
            type='primary'
            htmlType='submit'
            block
            loading={loginMutation.isPending}
          >
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
