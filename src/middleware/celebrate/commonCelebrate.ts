import { celebrate, Joi, Segments } from 'celebrate';

export const validateId = () => {
  return celebrate(
    {
      [Segments.PARAMS]: {
        id: Joi.number().positive().required(),
      },
    },
    { abortEarly: false }
  );
};
