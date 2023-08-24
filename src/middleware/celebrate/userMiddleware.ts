import { celebrate, Joi, Segments } from 'celebrate';
import { customValidateMessages } from '../../utils/utils';

export function validateCreateUser() {
  return celebrate(
    {
      [Segments.BODY]: {
        email: Joi.string().email().trim().max(50).required().messages({
          'string.base': 'O campo de e-mail deve ser uma string válida',
          'string.email': 'O e-mail fornecido não é válido',
          'string.max':
            'O campo de e-mail não deve ter mais de {#limit} caracteres',
          'any.required': 'O campo de e-mail é obrigatório',
          'string.empty': 'O campo de e-mail não pode estar vazio',
        }),
        name: Joi.string()
          .pattern(/^[a-zA-ZÀ-ú0-9_ ]*$/)
          .trim()
          .min(3)
          .max(30)
          .required()
          .messages({
            'string.base': 'O campo de nome deve ser uma string válida',
            'string.pattern.base':
              'O nome fornecido não atende ao padrão exigido',
            'string.min':
              'O campo de nome deve ter pelo menos {#limit} caracteres',
            'string.max':
              'O campo de nome não deve ter mais de {#limit} caracteres',
            'any.required': 'O campo de nome é obrigatório',
            'string.empty': 'O campo de nome não pode estar vazio',
          }),
        password: Joi.string().required().min(6).max(50).messages({
          'string.base': 'O campo de senha deve ser uma string válida',
          'string.min': 'A senha deve ter pelo menos {#limit} caracteres',
          'string.max': 'A senha não deve ter mais de {#limit} caracteres',
          'any.required': 'O campo de senha é obrigatório',
        }),
        passwordConfirmation: Joi.string()
          .valid(Joi.ref('password'))
          .when('password', {
            is: Joi.exist(),
            then: Joi.required(),
          })
          .messages({
            'any.only': 'A confirmação de senha deve ser igual à senha',
            'any.required':
              'A confirmação de senha é obrigatória quando a senha é fornecida',
          })
          .strip(),
      },
    },
    { abortEarly: false, messages: customValidateMessages }
  );
}

export function validateUpdateUserName() {
  return celebrate(
    {
      [Segments.BODY]: {
        id: Joi.number().positive().required().messages({
          'number.base': 'O campo de id deve ser um número válido',
          'number.positive': 'O campo de id deve ser um número positivo',
          'any.required': 'O campo de id é obrigatório',
        }),
        name: Joi.string()
          .pattern(/^[a-zA-ZÀ-ú0-9_ ]*$/)
          .trim()
          .min(3)
          .max(30)
          .required()
          .messages({
            'string.base': 'O campo de nome deve ser uma string válida',
            'string.pattern.base':
              'O nome fornecido não atende ao padrão exigido',
            'string.min':
              'O campo de nome deve ter pelo menos {#limit} caracteres',
            'string.max':
              'O campo de nome não deve ter mais de {#limit} caracteres',
            'any.required': 'O campo de nome é obrigatório',
            'string.empty': 'O campo de nome não pode estar vazio',
          }),
      },
    },
    { abortEarly: false, messages: customValidateMessages }
  );
}

export function validateLogin() {
  return celebrate(
    {
      [Segments.BODY]: {
        email: Joi.string().email().trim().max(50).required().messages({
          'string.base': 'O campo de e-mail deve ser uma string válida',
          'string.email': 'O e-mail fornecido não é válido',
          'string.max':
            'O campo de e-mail não deve ter mais de {#limit} caracteres',
          'any.required': 'O campo de e-mail é obrigatório',
          'string.empty': 'O campo de e-mail não pode estar vazio',
        }),
        password: Joi.string().required().messages({
          'string.base': 'O campo de senha deve ser uma string válida',
          'any.required': 'O campo de senha é obrigatório',
        }),
      },
    },
    { abortEarly: false, messages: customValidateMessages }
  );
}

export const validatePassword = () => {
  return celebrate(
    {
      [Segments.BODY]: {
        currentPassword: Joi.string().required().messages({
          'string.empty': 'A senha atual é obrigatória',
        }),
        newPassword: Joi.string().min(6).max(50).required().messages({
          'string.empty': 'A nova senha é obrigatória',
          'string.min':
            'A nova senha deve ter pelo menos {{#limit}} caracteres',
          'string.max':
            'A nova senha não pode ter mais que {{#limit}} caracteres',
        }),
        passwordConfirmation: Joi.string()
          .valid(Joi.ref('newPassword'))
          .when('newPassword', {
            is: Joi.exist(),
            then: Joi.required(),
          })
          .messages({
            'string.empty': 'A confirmação de senha é obrigatória',
            'any.only':
              'A confirmação de senha deve coincidir com a nova senha',
          }),
      },
    },
    { abortEarly: false }
  );
};
