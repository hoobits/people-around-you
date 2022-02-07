import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { red } from '@mui/material/colors';
import authProvider from '../../providers/authProvider';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

/**
 * Primary UI component for user interaction
 */
export const LoginModal = ({ setAuth, ...props }) => {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = React.useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (event) => {
    authProvider.login(values).then(() => {
      setAuth(authProvider.checkAuth());
    });
  };

  const handleCheck = (event) => {
    console.log(authProvider.checkAuth());
  };

  const handleRefresh = (event) => {
    console.log('handleRefresh');
    console.log(authProvider.refresh());
  };

  return (
    <>
      <Button color="inherit" onClick={handleOpen}>Login</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <div>
              <FormControl sx={{ mb: 1}} fullWidth variant="outlined">
                <InputLabel error={errors.password.length !== 0}>Email</InputLabel>
                <OutlinedInput
                  error={errors.password.length !== 0}
                  value={values.email}
                  onChange={handleChange('email')}
                  label="Amount"
                />
                <FormHelperText sx={{color: red[500]}}>{errors.email}</FormHelperText>
              </FormControl>
              <FormControl sx={{ mb: 1}}fullWidth variant="outlined">
                <InputLabel error={errors.password.length !== 0}>Password</InputLabel>
                <OutlinedInput
                  error={errors.password.length !== 0}
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  onChange={handleChange('password')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                <FormHelperText sx={{color: red[500]}}>{errors.password}</FormHelperText>
              </FormControl>
              <Button variant="contained" onClick={handleLogin}>Login</Button>
              <Button variant="contained" onClick={handleCheck}>Check</Button>
              <Button variant="contained" onClick={handleRefresh}>Refresh</Button>
            </div>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

LoginModal.propTypes = {
};

LoginModal.defaultProps = {
}
