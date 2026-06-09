import { registerSchema } from '@/lib/validations/auth';
import { toErrorResponse } from '@/lib/http';
import { registerUser } from '@/services/auth.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = registerSchema.parse(body);
    const user = await registerUser(input);

    return Response.json({ user }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
