import { getCurrentUser } from '@/lib/auth';
import { AppError, toErrorResponse } from '@/lib/http';
import { updateTaskSchema } from '@/lib/validations/task';
import { deleteTask, getTask, updateTask } from '@/services/task.service';

export async function GET(_request: Request, context: RouteContext<'/api/tasks/[id]'>) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = await context.params;
    const task = await getTask(user.id, id);

    return Response.json({ task });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(request: Request, context: RouteContext<'/api/tasks/[id]'>) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = await context.params;
    const body = await request.json();
    const input = updateTaskSchema.parse(body);
    const task = await updateTask(user.id, id, input);

    return Response.json({ task });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext<'/api/tasks/[id]'>) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = await context.params;
    await deleteTask(user.id, id);

    return new Response(null, { status: 204 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
