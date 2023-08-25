import { celebrate, Joi, Segments } from 'celebrate';
import { customValidateMessages } from '../../utils/utils';

export function validateCreateUser() {
  return celebrate(
    {
      [Segments.BODY]: {
        email: Joi.string().email().trim().max(50).required().messages({
          'string.base': 'O campo {{#label}} deve ser uma string válida',
          'string.email': 'O campo {{#label}} não é válido',
          'string.max':
            'O campo {{#label}} não deve ter mais de {#limit} caracteres',
          'any.required': 'O campo {{#label}} é obrigatório',
          'string.empty': 'O campo {{#label}} não pode estar vazio',
        }),
        name: Joi.string()
          .pattern(/^[a-zA-ZÀ-ú ]*$/)
          .trim()
          .min(3)
          .max(30)
          .required()
          .messages({
            'string.base': 'O campo {{#label}} deve ser uma string válida',
            'string.pattern.base':
              'O campo {{#label}} não atende ao padrão exigido',
            'string.min':
              'O campo {{#label}} deve ter pelo menos {#limit} caracteres',
            'string.max':
              'O campo {{#label}} não deve ter mais de {#limit} caracteres',
            'any.required': 'O campo {{#label}} é obrigatório',
            'string.empty': 'O campo {{#label}} não pode estar vazio',
          }),
        password: Joi.string().required().min(6).max(50).messages({
          'string.base': 'O campo {{#label}} deve ser uma string válida',
          'string.min':
            'O campo {{#label}} deve ter pelo menos {#limit} caracteres',
          'string.max':
            'O campo {{#label}} não deve ter mais de {#limit} caracteres',
          'any.required': 'O campo {{#label}} é obrigatório',
        }),
        passwordConfirmation: Joi.string()
          .valid(Joi.ref('password'))
          .when('password', {
            is: Joi.exist(),
            then: Joi.required(),
          })
          .messages({
            'any.only': 'O campo {{#label}} deve ser igual à senha',
            'any.required':
              'O campo {{#label}} é obrigatória quando a senha é fornecida',
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
          'number.base': 'O campo {{#label}} deve ser um número válido',
          'number.positive': 'O campo {{#label}} deve ser um número positivo',
          'any.required': 'O campo {{#label}} é obrigatório',
        }),
        name: Joi.string()
          .pattern(/^[a-zA-ZÀ-ú0-9_ ]*$/)
          .trim()
          .min(3)
          .max(30)
          .required()
          .messages({
            'string.base': 'O campo {{#label}} deve ser uma string válida',
            'string.pattern.base':
              'O campo {{#label}} não atende ao padrão exigido',
            'string.min':
              'O campo {{#label}} deve ter pelo menos {#limit} caracteres',
            'string.max':
              'O campo {{#label}} não deve ter mais de {#limit} caracteres',
            'any.required': 'O campo {{#label}} é obrigatório',
            'string.empty': 'O campo {{#label}} não pode estar vazio',
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
          'string.base': 'O campo {{#label}} deve ser uma string válida',
          'string.email': 'O campo {{#label}} não é válido',
          'string.max':
            'O campo {{#label}} não deve ter mais de {#limit} caracteres',
          'any.required': 'O campo {{#label}} é obrigatório',
          'string.empty': 'O campo {{#label}} não pode estar vazio',
        }),
        password: Joi.string().required().messages({
          'string.base': 'O campo {{#label}} deve ser uma string válida',
          'any.required': 'O campo {{#label}} é obrigatório',
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
          'string.empty': 'O campo {{#label}} é obrigatório',
        }),
        newPassword: Joi.string().min(6).max(50).required().messages({
          'string.empty': 'O campo {{#label}} é obrigatório',
          'string.min':
            'O campo {{#label}} deve ter pelo menos {{#limit}} caracteres',
          'string.max':
            'O campo {{#label}} não pode ter mais que {{#limit}} caracteres',
        }),
        passwordConfirmation: Joi.string()
          .valid(Joi.ref('newPassword'))
          .when('newPassword', {
            is: Joi.exist(),
            then: Joi.required(),
          })
          .messages({
            'string.empty': 'O campo {{#label}} é obrigatório',
            'any.only': 'O campo {{#label}} deve coincidir com a nova senha',
          }),
      },
    },
    { abortEarly: false }
  );
};
