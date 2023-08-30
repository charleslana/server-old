import { celebrate, Joi, Segments } from 'celebrate';

export const validateId = () => {
  return celebrate(
    {
      [Segments.PARAMS]: {
        id: Joi.number().positive().required().messages({
          'number.base': 'O parâmetro {{#label}} deve ser um número válido',
          'number.positive':
            'O parâmetro {{#label}} deve ser um número positivo',
          'any.required': 'O parâmetro {{#label}} é obrigatório',
        }),
      },
    },
    { abortEarly: false }
  );
};

export const validateString = () => {
  return celebrate(
    {
      [Segments.PARAMS]: {
        fileName: Joi.string().required().messages({
          'string.base': 'O campo {{#label}} deve ser uma string válida',
          'any.required': 'O parâmetro {{#label}} é obrigatório',
          'string.empty': 'O campo {{#label}} não pode estar vazio',
        }),
      },
    },
    { abortEarly: false }
  );
};
