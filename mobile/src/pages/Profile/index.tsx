import React, { useRef, useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  BackButton,
  Title,
  UserAvatarButton,
  UserAvatar
} from './styles';
import { useAuth } from '../../hooks/auth';

interface UpdateProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { goBack } = useNavigation();

  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordConfirmationInputRef = useRef<TextInput>(null);

  const handleUpdateProfile = useCallback(
    async (data: UpdateProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: value => !!value.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string()
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: value => !!value.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string()
            })
            .oneOf([Yup.ref('password')], 'Confirmação de senha incorreta.')
        });

        await schema.validate(data, {
          abortEarly: false
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation
              }
            : {})
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        Alert.alert('Perfil atualizado com sucesso!');

        goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu um erro ao atualizar seu perfil, tente novamente.'
        );
      }
    },
    [goBack, updateUser]
  );

  const handleGoBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleChangeAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Selecione um avatar',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Usar Câmera',
        chooseFromLibraryButtonTitle: 'Escolha da galeria'
      },
      response => {
        if (response.didCancel) {
          return;
        }

        if (response.error) {
          Alert.alert('Erro ao atualizar seu avatar.');
          return;
        }

        const data = new FormData();

        data.append('avatar', {
          type: 'image/jpg',
          name: `${user.id}.jpg`,
          uri: response.uri
        });

        api.patch('users/avatar', data).then(apiResponse => {
          updateUser(apiResponse.data);
        });
      }
    );
  }, [user.id, updateUser]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <Container>
        <BackButton onPress={handleGoBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <UserAvatarButton onPress={handleChangeAvatar}>
          <UserAvatar source={{ uri: user.avatar_url }} />
        </UserAvatarButton>

        <View>
          <Title>Meu perfil</Title>
        </View>

        <Form
          ref={formRef}
          initialData={user}
          onSubmit={handleUpdateProfile}
          style={{ marginBottom: 24 }}
        >
          <Input
            autoCapitalize="words"
            name="name"
            icon="user"
            placeholder="Nome"
            returnKeyType="next"
            onSubmitEditing={() => emailInputRef.current?.focus()}
          />
          <Input
            ref={emailInputRef}
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            name="email"
            icon="mail"
            placeholder="E-mail"
            returnKeyType="next"
            onSubmitEditing={() => oldPasswordInputRef.current?.focus()}
          />
          <Input
            ref={oldPasswordInputRef}
            secureTextEntry
            name="old_password"
            icon="lock"
            placeholder="Senha atual"
            textContentType="newPassword"
            returnKeyType="next"
            containerStyle={{ marginTop: 16 }}
            onSubmitEditing={() => passwordInputRef.current?.focus()}
          />
          <Input
            ref={passwordInputRef}
            secureTextEntry
            name="password"
            icon="lock"
            placeholder="Nova senha"
            textContentType="newPassword"
            returnKeyType="next"
            onSubmitEditing={() => {
              passwordConfirmationInputRef.current?.focus();
            }}
          />
          <Input
            ref={passwordConfirmationInputRef}
            secureTextEntry
            name="password_confirmation"
            icon="lock"
            placeholder="Confirmar senha"
            textContentType="newPassword"
            returnKeyType="send"
            onSubmitEditing={() => formRef.current?.submitForm()}
          />

          <Button onPress={() => formRef.current?.submitForm()}>
            Confirmar mudanças
          </Button>
        </Form>
      </Container>
    </KeyboardAvoidingView>
  );
};

export default Profile;