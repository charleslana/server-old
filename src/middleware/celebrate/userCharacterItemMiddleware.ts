import { celebrate, Joi, Segments } from 'celebrate';
import { customValidateMessages } from '../../utils/utils';

export const validateCreateUserCharacterItem = () => {
  return celebrate(
    {
      [Segments.BODY]: {
        userCharacterId: Joi.number().positive().required().messages({
          'number.base': 'O campo {{#label}} deve ser um número',
          'number.positive': 'O campo {{#label}} deve ser um número positivo',
          'any.required': 'O campo {{#label}} é obrigatório',
        }),
        itemId: Joi.number().positive().required().messages({
          'number.base': 'O campo {{#label}} deve ser um número',
          'number.positive': 'O campo {{#label}} deve ser um número positivo',
          'any.required': 'O campo {{#label}} é obrigatório',
        }),
      },
    },
    { abortEarly: false, messages: customValidateMessages }
  );
};
