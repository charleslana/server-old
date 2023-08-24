import { celebrate, Joi, Segments } from 'celebrate';

export const validateId = () => {
  return celebrate(
    {
      [Segments.PARAMS]: {
        id: Joi.number().positive().required().messages({
          'number.base': 'O id deve ser um número válido',
          'number.positive': 'O id deve ser um número positivo',
          'any.required': 'O id é obrigatório',
        }),
      },
    },
    { abortEarly: false }
  );
};
