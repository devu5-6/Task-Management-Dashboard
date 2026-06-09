import { toErrorResponse } from '@/lib/http';
import { logoutUser } from '@/services/auth.service';

export async function POST() {
  try {
    await logoutUser();

    return new Response(null, { status: 204 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
