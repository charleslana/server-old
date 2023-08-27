import { celebrate, Joi, Segments } from 'celebrate';
import { customValidateMessages } from '../../utils/utils';

export function validateCreateGroup() {
  return celebrate(
    {
      [Segments.BODY]: {
        name: Joi.string()
          .pattern(/^[a-zA-ZÀ-ú0-9_ ]*$/)
          .trim()
          .min(3)
          .max(20)
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
        description: Joi.string().trim().min(3).max(255).optional().messages({
          'string.base': 'O campo {{#label}} deve ser uma string válida',
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

export function validateUpdateGroupName() {
  return celebrate(
    {
      [Segments.BODY]: {
        name: Joi.string()
          .pattern(/^[a-zA-ZÀ-ú0-9_ ]*$/)
          .trim()
          .min(3)
          .max(20)
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
