export function toPublicErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Something went wrong.";
}

export function jsonError(
  message: string,
  status = 400,
  headers?: Record<string, string>
) {
  return Response.json(
    { error: { message } },
    {
      status,
      headers,
    }
  );
}
