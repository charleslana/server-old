import { celebrate, Joi, Segments } from 'celebrate';

export const validateGroupInvitation = () => {
  return celebrate(
    {
      [Segments.PARAMS]: {
        groupId: Joi.number().positive().required().messages({
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

export const validateHandlerGroupInvitation = () => {
  return celebrate(
    {
      [Segments.QUERY]: {
        accept: Joi.boolean().required().messages({
          'boolean.base':
            'A query string {{#label}} deve ser um valor booleano',
          'any.required': 'A query string {{#label}} é obrigatório',
        }),
      },
    },
    { abortEarly: false }
  );
};
