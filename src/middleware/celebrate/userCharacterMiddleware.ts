import { AttributeEnum } from '../../enum/AttributeEnum';
import { celebrate, Joi, Segments } from 'celebrate';
import { customValidateMessages } from '../../utils/utils';

export function validateCreateUserCharacter() {
  return celebrate(
    {
      [Segments.BODY]: {
        characterId: Joi.number().positive().required().messages({
          'number.base': 'O id do personagem deve ser um número válido',
          'number.positive': 'O id do personagem deve ser um número positivo',
          'any.required': 'O id do personagem é obrigatório',
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

export const validateUpdateAttribute = () => {
  return celebrate(
    {
      [Segments.BODY]: {
        attribute: Joi.string()
          .valid(...Object.values(AttributeEnum))
          .required()
          .messages({
            'string.empty': 'O campo atributo é obrigatório',
            'any.only':
              'O valor do campo atributo deve ser um dos valores válidos: {{#valids}}',
          }),
        point: Joi.number().positive().required().messages({
          'number.base': 'O ponto deve ser um número',
          'number.positive': 'O ponto deve ser um número positivo',
          'any.required': 'O ponto é obrigatório',
        }),
      },
    },
    { abortEarly: false, messages: customValidateMessages }
  );
};
