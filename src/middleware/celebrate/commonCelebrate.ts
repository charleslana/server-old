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
