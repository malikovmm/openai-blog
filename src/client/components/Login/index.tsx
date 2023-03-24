import React from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import UseAuth from '../../hooks/useAuth';
import { LoginDto } from '../../../server/auth/dto/login.dto';

function AdminLoginPage() {
  const { login } = UseAuth();
  const formik = useFormik<LoginDto>({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: (values, { setSubmitting }) => {
      login({ ...values }).finally(() => {
        setSubmitting(false);
      });
    },
  });

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Admin Login
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            type="username"
            id="username"
            name="username"
            autoComplete="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            id="password"
            name="password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={formik.isSubmitting}
          >
            Sign In
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default AdminLoginPage;
