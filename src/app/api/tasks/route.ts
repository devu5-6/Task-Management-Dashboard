import { getCurrentUser } from '@/lib/auth';
import { AppError, toErrorResponse } from '@/lib/http';
import { createTaskSchema, taskQuerySchema } from '@/lib/validations/task';
import { createTask, listTasks } from '@/services/task.service';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AppError('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const filters = taskQuerySchema.parse({
      search: searchParams.get('search') ?? undefined,
      status: searchParams.get('status') ?? undefined,
    });

    const tasks = await listTasks(user.id, filters);

    return Response.json({ tasks });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AppError('Unauthorized', 401);
    }

    const body = await request.json();
    const input = createTaskSchema.parse(body);
    const task = await createTask(user.id, input);

    return Response.json({ task }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
