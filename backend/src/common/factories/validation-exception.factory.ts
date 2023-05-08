import { ValidationError } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export const validationExceptionFactory = (errors: ValidationError[]) => {
  const errorMsg: string[] = [];
  errors.forEach(e => {
    errorMsg.push(Object.values(e.constraints).join());
  });
  return new BadRequestException('Validation error: ' + errorMsg.join(', '), 'validation_error');
};
