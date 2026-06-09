import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly fieldErrors?: Record<string, string[] | undefined>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function createValidationError(error: ZodError) {
  return new AppError('Validation failed', 400, error.flatten().fieldErrors);
}

export function toErrorResponse(error: unknown) {
  if (error instanceof AppError) {
    return Response.json(
      {
        message: error.message,
        fieldErrors: error.fieldErrors,
      },
      { status: error.status }
    );
  }

  if (error instanceof ZodError) {
    const validationError = createValidationError(error);
    return Response.json(
      {
        message: validationError.message,
        fieldErrors: validationError.fieldErrors,
      },
      { status: validationError.status }
    );
  }

  console.error(error);

  return Response.json(
    {
      message: 'Something went wrong. Please try again.',
    },
    { status: 500 }
  );
}
