import { toErrorResponse } from '@/lib/http';
import { loginSchema } from '@/lib/validations/auth';
import { loginUser } from '@/services/auth.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = loginSchema.parse(body);
    const user = await loginUser(input);

    return Response.json({ user });
  } catch (error) {
    return toErrorResponse(error);
  }
}
