import React from 'react';
import { Image } from 'react-native';

import LogoImg from '../../assets/logo.png';

import { Container, Title } from './styles';

const SignIn: React.FC = () => {
  return (
    <Container>
      <Image source={LogoImg} />

      <Title>Faça seu logon</Title>
    </Container>
  );
};

export default SignIn;
