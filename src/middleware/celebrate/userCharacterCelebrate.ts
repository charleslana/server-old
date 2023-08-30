import { AttributeEnum } from '../../enum/AttributeEnum';
import { celebrate, Joi, Segments } from 'celebrate';
import { customValidateMessages } from '../../utils/utils';

export function validateCreateUserCharacter() {
  return celebrate(
    {
      [Segments.BODY]: {
        characterId: Joi.number().positive().required().messages({
          'number.base': 'O campo {{#label}} deve ser um número válido',
          'number.positive': 'O campo {{#label}} deve ser um número positivo',
          'any.required': 'O campo {{#label}} é obrigatório',
        }),
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

export const validateUpdateAttribute = () => {
  return celebrate(
    {
      [Segments.BODY]: {
        attribute: Joi.string()
          .valid(...Object.values(AttributeEnum))
          .required()
          .messages({
            'string.empty': 'O campo {{#label}} é obrigatório',
            'any.only':
              'O valor do campo {{#label}} deve ser um dos valores válidos: {{#valids}}',
          }),
        point: Joi.number().positive().max(999).required().messages({
          'number.base': 'O campo {{#label}} deve ser um número',
          'number.positive': 'O campo {{#label}} deve ser um número positivo',
          'number.max': 'O campo {{#label}} não pode ser maior que {{#limit}}',
          'any.required': 'O campo {{#label}} é obrigatório',
        }),
      },
    },
    { abortEarly: false, messages: customValidateMessages }
  );
};
